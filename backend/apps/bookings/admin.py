from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'room', 'check_in', 'check_out', 'status',
        'payment_method', 'razorpay_payment_id', 'total_price', 'created_at',
    )
    list_filter = ('status', 'check_in')
    search_fields = ('user__email', 'room__name')
    raw_id_fields = ('user', 'room')
