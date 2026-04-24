"""Booking serializers with date validation and price computation."""
from datetime import date

from django.utils import timezone
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    payment_screenshot_url = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            'id', 'user', 'room', 'room_name', 'user_email',
            'check_in', 'check_out', 'guests', 'total_price', 'status',
            'special_requests', 'guest_details', 'payment_method',
            'payment_screenshot', 'payment_screenshot_url',
            'razorpay_order_id', 'razorpay_payment_id', 'created_at',
        )
        read_only_fields = (
            'id', 'user', 'total_price', 'created_at', 'room_name', 'user_email',
            'payment_screenshot_url', 'razorpay_order_id', 'razorpay_payment_id',
        )
        extra_kwargs = {
            'payment_screenshot': {'write_only': True, 'required': False},
        }

    def get_payment_screenshot_url(self, obj):
        f = getattr(obj, 'payment_screenshot', None)
        if not f or not getattr(f, 'name', None):
            return None
        return f.url

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        staff = bool(
            request and request.user.is_authenticated
            and getattr(request.user, 'is_staff_role', False)
        )
        self.fields['status'].read_only = not staff

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
        check_in = attrs.get('check_in')
        check_out = attrs.get('check_out')
        if self.instance:
            check_in = check_in if check_in is not None else self.instance.check_in
            check_out = check_out if check_out is not None else self.instance.check_out
        room = attrs.get('room', getattr(self.instance, 'room', None))
        guests = attrs.get('guests', getattr(self.instance, 'guests', 1))
        guest_details = attrs.get('guest_details')
        if guest_details is None and self.instance is not None:
            guest_details = self.instance.guest_details

        if self.instance is None:
            if guest_details is None:
                raise serializers.ValidationError(
                    {'guest_details': 'Guest details are required for each guest.'}
                )

        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError({'check_out': 'Must be after check-in.'})
            today = timezone.now().date()
            if self.instance is None and check_in < today:
                raise serializers.ValidationError({'check_in': 'Cannot book in the past.'})

        if room and guests and guests > room.max_guests:
            raise serializers.ValidationError(
                {'guests': f'Maximum guests for this room is {room.max_guests}.'}
            )

        if self.instance is None and guest_details is not None:
            if len(guest_details) != guests:
                raise serializers.ValidationError(
                    {
                        'guest_details': (
                            f'Provide exactly {guests} guest record(s); '
                            f'got {len(guest_details)}.'
                        ),
                    }
                )

        return attrs

    def create(self, validated_data):
        room = validated_data['room']
        check_in: date = validated_data['check_in']
        check_out: date = validated_data['check_out']
        nights = max(1, (check_out - check_in).days)
        validated_data['total_price'] = room.price_per_night * nights
        validated_data['user'] = self.context['request'].user
        # Status stays pending until staff confirms (even with payment proof).
        validated_data.setdefault('status', Booking.Status.PENDING)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        room = validated_data.get('room', instance.room)
        check_in = validated_data.get('check_in', instance.check_in)
        check_out = validated_data.get('check_out', instance.check_out)
        if any(k in validated_data for k in ('room', 'check_in', 'check_out')):
            nights = max(1, (check_out - check_in).days)
            validated_data['total_price'] = room.price_per_night * nights
        return super().update(instance, validated_data)
