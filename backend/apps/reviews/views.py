"""Reviews: public sees approved only; guests submit; staff moderates."""
from rest_framework import permissions, viewsets

from apps.users.permissions import IsStaffOrAdmin

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Review.objects.select_related('user', 'room')
        user = self.request.user
        if user.is_authenticated and getattr(user, 'is_staff_role', False):
            approved = self.request.query_params.get('approved')
            if approved is not None:
                if approved.lower() in ('1', 'true', 'yes'):
                    qs = qs.filter(is_approved=True)
                elif approved.lower() in ('0', 'false', 'no'):
                    qs = qs.filter(is_approved=False)
            return qs
        return qs.filter(is_approved=True)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsStaffOrAdmin()]
        return [permissions.AllowAny()]
