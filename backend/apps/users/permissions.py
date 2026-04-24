"""Role helpers for DRF permissions."""
from rest_framework.permissions import BasePermission


class IsStaffOrAdmin(BasePermission):
    """Staff and admin can manage operational resources."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and getattr(u, 'is_staff_role', False))


class IsAdminRole(BasePermission):
    """Admin-only (e.g. user role changes)."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and getattr(u, 'is_admin_role', False))
