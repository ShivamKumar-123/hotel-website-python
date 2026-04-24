"""Review serializers with moderation fields for staff."""
from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            'id', 'user', 'user_name', 'room', 'rating', 'comment',
            'is_approved', 'created_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'user_name', 'is_approved')

    def get_user_name(self, obj):
        u = obj.user
        name = (u.first_name or '').strip() or u.username
        return f'{name}'.strip() or u.email

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user.is_authenticated and getattr(
            request.user, 'is_staff_role', False
        ):
            self.fields['is_approved'].read_only = False

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # New guest reviews start unapproved for moderation
        validated_data.setdefault('is_approved', False)
        return super().create(validated_data)
