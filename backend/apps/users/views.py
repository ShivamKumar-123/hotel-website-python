"""Auth registration and user management."""
import logging
from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import IsAdminRole, IsStaffOrAdmin
from .serializers import (
    CustomTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class MeView(APIView):
    """Current JWT user profile."""

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    """
    Staff: list/retrieve users. Admin: partial_update role/is_active.
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = (IsStaffOrAdmin,)

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve', 'partial_update', 'update'):
            return UserAdminSerializer
        return UserAdminSerializer

    def get_permissions(self):
        if self.action in ('partial_update', 'update', 'destroy'):
            return [IsAdminRole()]
        return [IsStaffOrAdmin()]

    def create(self, request, *args, **kwargs):
        return Response({'detail': 'Use POST /api/auth/register/ to create an account.'}, status=405)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'User deletion disabled.'}, status=405)

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(username__icontains=search))
        return qs.distinct()


class RoleTokenObtainPairView(TokenObtainPairView):
    """JWT login — includes serialized user in the response."""

    serializer_class = CustomTokenObtainPairSerializer


class PasswordResetRequestView(APIView):
    """
    POST email — sends reset link if user exists (same response either way).
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        ser = PasswordResetRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data['email'].strip().lower()
        user = User.objects.filter(email__iexact=email).first()
        if user and user.is_active:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            uid_str = uid.decode() if isinstance(uid, bytes) else uid
            reset_url = f"{settings.FRONTEND_URL}/reset-password?{urlencode({'uid': uid_str, 'token': token})}"
            subject = 'Reset your Aurum Grand password'
            body = (
                f'Hello,\n\n'
                f'We received a request to reset the password for your Aurum Grand account ({user.email}).\n\n'
                f'Open this link in your browser (valid for a limited time):\n{reset_url}\n\n'
                f'If you did not ask for this, you can ignore this email.\n\n'
                f'— Aurum Grand'
            )
            try:
                send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception:
                logger.exception('password_reset email failed for %s', user.email)
        return Response(
            {
                'detail': 'If an account exists for this email, you will receive password reset instructions shortly.',
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    """POST uid, token, new_password, new_password_confirm — sets password if token valid."""

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        ser = PasswordResetConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']
        user.set_password(ser.validated_data['new_password'])
        user.save()
        return Response(
            {'detail': 'Your password has been reset. You can sign in now.'},
            status=status.HTTP_200_OK,
        )
