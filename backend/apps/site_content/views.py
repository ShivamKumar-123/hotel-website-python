from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsStaffOrAdmin

from .models import SiteHomeContent
from .serializers import SiteHomeContentSerializer


def _get_singleton():
    obj, _ = SiteHomeContent.objects.get_or_create(
        pk=1,
        defaults={'hero_carousel': [], 'home_gallery': []},
    )
    return obj


class HomeContentView(APIView):
    """
    GET: public — hero carousel + home gallery JSON for the marketing home page.
    PATCH: staff/admin — partial update of hero_carousel and/or home_gallery.
    """

    def get_permissions(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [permissions.AllowAny()]
        return [IsStaffOrAdmin()]

    def get(self, request):
        obj = _get_singleton()
        return Response(SiteHomeContentSerializer(obj).data)

    def patch(self, request):
        obj = _get_singleton()
        ser = SiteHomeContentSerializer(obj, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)
