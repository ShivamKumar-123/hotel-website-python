from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'room', 'check_in', 'check_out', 'status',
        'payment_method', 'has_payment_proof', 'razorpay_payment_id', 'total_price', 'created_at',
    )
    list_filter = ('status', 'check_in', 'payment_method')
    search_fields = ('user__email', 'room__name')
    raw_id_fields = ('user', 'room')
    readonly_fields = ('created_at', 'payment_screenshot_preview')

    @admin.display(description='Proof', boolean=True)
    def has_payment_proof(self, obj):
        return bool(getattr(obj, 'payment_screenshot', None) and obj.payment_screenshot.name)

    @admin.display(description='Payment screenshot')
    def payment_screenshot_preview(self, obj):
        f = getattr(obj, 'payment_screenshot', None)
        if f and f.name:
            from django.utils.html import format_html

            return format_html(
                '<a href="{}"><img src="{}" style="max-height: 240px" /></a>',
                f.url,
                f.url,
            )
        return '—'
