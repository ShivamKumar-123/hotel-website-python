"""Shared DRF pagination — supports ?page_size= for admin tables and marketing grids."""
from rest_framework.pagination import PageNumberPagination


class OptionalPageSizePagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100
