from django.db import models


class SiteHomeContent(models.Model):
    """
    Singleton (pk=1): hero carousel + home page bento gallery JSON.
    Empty lists mean the public site falls back to built-in defaults.
    """

    id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    hero_carousel = models.JSONField(default=list, blank=True)
    home_gallery = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Home page content'
        verbose_name_plural = 'Home page content'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
