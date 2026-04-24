"""Room serializers for public and staff CRUD."""
from rest_framework import serializers

from .models import Room


class RoomListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            'id', 'name', 'slug', 'price_per_night', 'max_guests',
            'size_sqm', 'bed_type', 'has_ac', 'has_balcony', 'garden_facing',
            'washroom_type', 'cover_image', 'is_featured', 'is_active',
        )


class RoomDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            'id', 'name', 'slug', 'description', 'price_per_night',
            'max_guests', 'size_sqm', 'bed_type', 'has_ac', 'has_balcony',
            'garden_facing', 'washroom_type', 'amenities',
            'cover_image', 'gallery', 'is_featured', 'is_active', 'created_at',
        )
        read_only_fields = ('id', 'slug', 'created_at')


class RoomWriteSerializer(serializers.ModelSerializer):
    """Staff create/update — slug auto from name on model save."""

    class Meta:
        model = Room
        fields = (
            'name', 'description', 'price_per_night', 'max_guests',
            'size_sqm', 'bed_type', 'has_ac', 'has_balcony', 'garden_facing',
            'washroom_type', 'amenities', 'cover_image', 'gallery',
            'is_featured', 'is_active',
        )
