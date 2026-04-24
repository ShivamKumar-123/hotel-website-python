"""
Hotel room catalog with filtering-friendly fields and media URLs.
"""
from django.db import models
from django.utils.text import slugify


class Room(models.Model):
    class WashroomType(models.TextChoices):
        WESTERN = 'western', 'Western'
        INDIAN = 'indian', 'Indian'

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, db_index=True)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    max_guests = models.PositiveSmallIntegerField(default=2)
    size_sqm = models.PositiveIntegerField(default=30)
    bed_type = models.CharField(max_length=80, default='King')
    has_ac = models.BooleanField(default=True, help_text='Air-conditioned room')
    has_balcony = models.BooleanField(default=False)
    garden_facing = models.BooleanField(default=False, help_text='Faces garden / courtyard')
    washroom_type = models.CharField(
        max_length=20,
        choices=WashroomType.choices,
        default=WashroomType.WESTERN,
    )
    amenities = models.JSONField(default=list, blank=True)
    cover_image = models.URLField(max_length=500)
    gallery = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
