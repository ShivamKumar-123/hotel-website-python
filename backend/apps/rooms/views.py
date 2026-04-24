"""Room catalog with search, ordering, and query filters."""
from decimal import Decimal

from rest_framework import permissions, viewsets

from apps.users.permissions import IsStaffOrAdmin

from .models import Room
from .serializers import RoomDetailSerializer, RoomListSerializer, RoomWriteSerializer


def _parse_bool(value):
    if value is None or value == '':
        return None
    s = str(value).lower().strip()
    if s in ('1', 'true', 'yes', 'on'):
        return True
    if s in ('0', 'false', 'no', 'off'):
        return False
    return None


class RoomViewSet(viewsets.ModelViewSet):
    """
    List/retrieve are public (read-only for anonymous).
    Create/update/delete require staff or admin.
    """
    lookup_field = 'slug'
    queryset = Room.objects.filter(is_active=True)
    permission_classes = (permissions.AllowAny,)
    search_fields = ('name', 'description', 'bed_type')
    ordering_fields = ('price_per_night', 'name', 'created_at', 'max_guests')
    ordering = ['-is_featured', 'name']

    def get_queryset(self):
        qs = Room.objects.all() if self.request.user.is_authenticated and getattr(
            self.request.user, 'is_staff_role', False
        ) else Room.objects.filter(is_active=True)

        params = self.request.query_params
        featured = params.get('featured')
        if featured and featured.lower() in ('1', 'true', 'yes'):
            qs = qs.filter(is_featured=True)

        min_p = params.get('min_price')
        max_p = params.get('max_price')
        if min_p:
            try:
                qs = qs.filter(price_per_night__gte=Decimal(min_p))
            except (ValueError, TypeError):
                pass
        if max_p:
            try:
                qs = qs.filter(price_per_night__lte=Decimal(max_p))
            except (ValueError, TypeError):
                pass

        bed = params.get('bed_type')
        if bed:
            qs = qs.filter(bed_type__iexact=bed.strip())

        guests = params.get('min_guests')
        if guests:
            try:
                qs = qs.filter(max_guests__gte=int(guests))
            except (ValueError, TypeError):
                pass

        max_g = params.get('max_guests')
        if max_g:
            try:
                qs = qs.filter(max_guests__lte=int(max_g))
            except (ValueError, TypeError):
                pass

        exact_cap = params.get('guests') or params.get('capacity')
        if exact_cap:
            try:
                qs = qs.filter(max_guests=int(exact_cap))
            except (ValueError, TypeError):
                pass

        ac = _parse_bool(params.get('has_ac'))
        if ac is not None:
            qs = qs.filter(has_ac=ac)

        balcony = _parse_bool(params.get('has_balcony'))
        if balcony is not None:
            qs = qs.filter(has_balcony=balcony)

        garden = _parse_bool(params.get('garden_facing'))
        if garden is not None:
            qs = qs.filter(garden_facing=garden)

        wash = params.get('washroom_type')
        if wash:
            w = wash.strip().lower()
            if w in ('western', 'indian'):
                qs = qs.filter(washroom_type=w)

        return qs

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return RoomWriteSerializer
        if self.action == 'retrieve':
            return RoomDetailSerializer
        return RoomListSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsStaffOrAdmin()]
        return [permissions.AllowAny()]
