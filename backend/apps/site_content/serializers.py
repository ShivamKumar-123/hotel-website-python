from rest_framework import serializers

from .models import SiteHomeContent


class SiteHomeContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteHomeContent
        fields = ('hero_carousel', 'home_gallery', 'updated_at')
        read_only_fields = ('updated_at',)

    def validate_hero_carousel(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError('Expected a list of slides.')
        if len(value) > 12:
            raise serializers.ValidationError('At most 12 carousel slides.')
        required = ('id', 'image', 'title')
        for i, slide in enumerate(value):
            if not isinstance(slide, dict):
                raise serializers.ValidationError(f'Slide {i + 1} must be an object.')
            for key in required:
                if key not in slide or not str(slide.get(key, '')).strip():
                    raise serializers.ValidationError(
                        f'Slide {i + 1} is missing required field "{key}".'
                    )
        return value

    def validate_home_gallery(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError('Expected a list of gallery items.')
        if len(value) > 12:
            raise serializers.ValidationError('At most 12 gallery images.')
        for i, item in enumerate(value):
            if not isinstance(item, dict):
                raise serializers.ValidationError(f'Gallery item {i + 1} must be an object.')
            src = str(item.get('src', '')).strip()
            if not src:
                raise serializers.ValidationError(
                    f'Gallery item {i + 1} must include a non-empty "src" URL.'
                )
        return value
