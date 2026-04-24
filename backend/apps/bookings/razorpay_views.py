"""Razorpay Checkout: create order + verify payment and create booking."""
from datetime import date
from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.rooms.models import Room

from .models import Booking
from .razorpay_client import RazorpayAPIError, create_order, fetch_order, verify_payment_signature
from .serializers import BookingSerializer


def _razorpay_keys():
    key_id = (getattr(settings, 'RAZORPAY_KEY_ID', '') or '').strip()
    key_secret = (getattr(settings, 'RAZORPAY_KEY_SECRET', '') or '').strip()
    if not key_id or not key_secret:
        return None, None
    return key_id, key_secret


def _booking_amount_paise(room: Room, check_in: date, check_out: date) -> tuple[int, Decimal]:
    nights = max(1, (check_out - check_in).days)
    total = room.price_per_night * nights
    paise = int((total * Decimal('100')).quantize(Decimal('1')))
    return max(100, paise), total  # minimum ₹1


class RazorpayDraftSerializer(serializers.Serializer):
    """Same core fields as booking create (JSON), for order + confirm."""

    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.filter(is_active=True))
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    guests = serializers.IntegerField(min_value=1)
    special_requests = serializers.CharField(allow_blank=True, required=False, default='')
    guest_details = serializers.JSONField()

    def validate_guest_details(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError('Expected a list of guest objects.')
        for i, row in enumerate(value):
            if not isinstance(row, dict):
                raise serializers.ValidationError(f'Guest {i + 1}: invalid entry.')
            name = (row.get('full_name') or '').strip()
            if not name:
                raise serializers.ValidationError(f'Guest {i + 1}: full name is required.')
            row['full_name'] = name
            if row.get('phone'):
                row['phone'] = str(row['phone']).strip()
            if row.get('email'):
                row['email'] = str(row['email']).strip()
        return value

    def validate(self, attrs):
        check_in = attrs['check_in']
        check_out = attrs['check_out']
        if check_out <= check_in:
            raise serializers.ValidationError({'check_out': 'Must be after check-in.'})
        today = timezone.now().date()
        if check_in < today:
            raise serializers.ValidationError({'check_in': 'Cannot book in the past.'})
        room = attrs['room']
        guests = attrs['guests']
        guest_details = attrs['guest_details']
        if guests > room.max_guests:
            raise serializers.ValidationError({'guests': f'Maximum guests for this room is {room.max_guests}.'})
        if len(guest_details) != guests:
            raise serializers.ValidationError(
                {'guest_details': f'Provide exactly {guests} guest record(s); got {len(guest_details)}.'}
            )
        return attrs


class RazorpayCreateOrderView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        keys = _razorpay_keys()
        if not keys[0]:
            return Response(
                {'detail': 'Razorpay is not configured on the server (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        key_id, key_secret = keys
        ser = RazorpayDraftSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        room = ser.validated_data['room']
        check_in = ser.validated_data['check_in']
        check_out = ser.validated_data['check_out']
        amount_paise, _total_inr = _booking_amount_paise(room, check_in, check_out)
        receipt = f'ag{request.user.id}{int(timezone.now().timestamp())}'[:40]
        notes = {
            'user_id': str(request.user.id),
            'room_id': str(room.id),
            'check_in': str(check_in),
            'check_out': str(check_out),
        }
        try:
            order = create_order(
                key_id,
                key_secret,
                amount_paise=amount_paise,
                currency='INR',
                receipt=receipt,
                notes=notes,
            )
        except RazorpayAPIError as exc:
            return Response(
                {'detail': f'Could not create payment order: {exc!s}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response(
            {
                'order_id': order['id'],
                'amount': order['amount'],
                'currency': order['currency'],
                'key_id': key_id,
            },
            status=status.HTTP_201_CREATED,
        )


class RazorpayConfirmSerializer(RazorpayDraftSerializer):
    razorpay_order_id = serializers.CharField(max_length=64)
    razorpay_payment_id = serializers.CharField(max_length=64)
    razorpay_signature = serializers.CharField(max_length=256)


class RazorpayConfirmView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        keys = _razorpay_keys()
        if not keys[0]:
            return Response(
                {'detail': 'Razorpay is not configured on the server.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        key_id, key_secret = keys
        ser = RazorpayConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        room = ser.validated_data['room']
        check_in = ser.validated_data['check_in']
        check_out = ser.validated_data['check_out']
        guests = ser.validated_data['guests']
        special_requests = ser.validated_data.get('special_requests') or ''
        guest_details = ser.validated_data['guest_details']
        order_id = ser.validated_data['razorpay_order_id']
        payment_id = ser.validated_data['razorpay_payment_id']
        signature = ser.validated_data['razorpay_signature']

        expected_paise, total_inr = _booking_amount_paise(room, check_in, check_out)
        try:
            remote = fetch_order(key_id, key_secret, order_id)
        except RazorpayAPIError:
            return Response({'detail': 'Invalid or unknown Razorpay order.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if int(remote.get('amount', 0)) != expected_paise:
                return Response({'detail': 'Payment amount does not match booking total.'}, status=400)
        except (TypeError, ValueError):
            return Response({'detail': 'Could not validate order amount.'}, status=400)

        if not verify_payment_signature(order_id, payment_id, signature, key_secret):
            return Response({'detail': 'Invalid payment signature.'}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(
            user=request.user,
            room=room,
            check_in=check_in,
            check_out=check_out,
            guests=guests,
            total_price=total_inr,
            status=Booking.Status.PENDING,
            special_requests=special_requests,
            guest_details=guest_details,
            payment_method=Booking.PaymentMethod.RAZORPAY,
            razorpay_order_id=order_id,
            razorpay_payment_id=payment_id,
        )
        out = BookingSerializer(booking, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)
