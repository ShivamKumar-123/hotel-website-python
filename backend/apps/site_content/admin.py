from django.contrib import admin

from .models import SiteHomeContent


@admin.register(SiteHomeContent)
class SiteHomeContentAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')
