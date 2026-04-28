"""Bookings API and aggregated dashboard stats for staff."""
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework import permissions, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bookings.models import Booking
from apps.rooms.models import Room
from apps.reviews.models import Review
from apps.users.models import User
from apps.users.permissions import IsStaffOrAdmin

from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    """
    Guests: create and list their own bookings.
    Staff: full list, filter by status, update status.
    """
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (JSONParser, FormParser, MultiPartParser)

    def get_queryset(self):
        qs = Booking.objects.select_related('user', 'room').order_by('-created_at')
        if not getattr(self.request.user, 'is_staff_role', False):
            qs = qs.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        room_id = self.request.query_params.get('room')
        if room_id:
            qs = qs.filter(room_id=room_id)
        return qs

    def perform_create(self, serializer):
        serializer.save()


class DashboardStatsView(APIView):
    """KPIs and chart-friendly aggregates for the admin dashboard."""

    permission_classes = (IsStaffOrAdmin,)

    def get(self, request):
        total_users = User.objects.count()
        total_rooms = Room.objects.filter(is_active=True).count()
        bookings_qs = Booking.objects.all()

        by_status = dict(
            bookings_qs.values('status').annotate(c=Count('id')).values_list('status', 'c')
        )
        revenue = bookings_qs.filter(status=Booking.Status.CONFIRMED).aggregate(
            s=Sum('total_price')
        )['s'] or Decimal('0')

        monthly = list(
            bookings_qs.filter(status=Booking.Status.CONFIRMED)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(revenue=Sum('total_price'), count=Count('id'))
            .order_by('month')
        )
        monthly_fmt = [
            {
                'month': row['month'].strftime('%Y-%m') if row['month'] else '',
                'revenue': float(row['revenue'] or 0),
                'bookings': row['count'],
            }
            for row in monthly
        ]

        pending_reviews = Review.objects.filter(is_approved=False).count()

        return Response({
            'total_users': total_users,
            'total_rooms': total_rooms,
            'bookings_by_status': by_status,
            'revenue_confirmed': float(revenue),
            'pending_reviews': pending_reviews,
            'monthly': monthly_fmt,
        })
