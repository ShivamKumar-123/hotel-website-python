from django.contrib import admin

from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'slug', 'price_per_night', 'max_guests', 'has_ac', 'has_balcony',
        'garden_facing', 'washroom_type', 'is_featured', 'is_active',
    )
    list_filter = (
        'is_featured', 'is_active', 'bed_type', 'has_ac', 'has_balcony',
        'garden_facing', 'washroom_type',
    )
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
