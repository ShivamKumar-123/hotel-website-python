"""Bookings and dashboard stats."""
from django.urls import path
from rest_framework.routers import DefaultRouter

from .razorpay_views import RazorpayConfirmView, RazorpayCreateOrderView
from .views import BookingViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('bookings/razorpay/create-order/', RazorpayCreateOrderView.as_view(), name='razorpay-create-order'),
    path('bookings/razorpay/confirm/', RazorpayConfirmView.as_view(), name='razorpay-confirm'),
] + router.urls + [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
