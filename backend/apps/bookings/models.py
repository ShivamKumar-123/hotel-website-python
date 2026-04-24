"""
Guest reservations linked to users and rooms.
"""
from django.conf import settings
from django.db import models


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'

    class PaymentMethod(models.TextChoices):
        UPI = 'upi', 'UPI'
        QR = 'qr', 'QR code'
        RAZORPAY = 'razorpay', 'Razorpay'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    room = models.ForeignKey(
        'rooms.Room',
        on_delete=models.PROTECT,
        related_name='bookings',
    )
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveSmallIntegerField(default=1)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.PENDING,
    )
    special_requests = models.TextField(blank=True)
    guest_details = models.JSONField(
        default=list,
        blank=True,
        help_text='List of {full_name, phone, email} per guest.',
    )
    payment_method = models.CharField(
        max_length=16,
        choices=PaymentMethod.choices,
        blank=True,
    )
    payment_screenshot = models.ImageField(
        upload_to='booking_payments/%Y/%m/',
        blank=True,
        null=True,
    )
    razorpay_order_id = models.CharField(max_length=64, blank=True, default='')
    razorpay_payment_id = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} — {self.room.name} ({self.check_in})'
