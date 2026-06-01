"""
Menu Filters — django-filter for MenuDish
"""
import django_filters
from .models import MenuDish


class MenuDishFilter(django_filters.FilterSet):
    category    = django_filters.NumberFilter(field_name='category__id')
    category_name = django_filters.CharFilter(
        field_name='category__name', lookup_expr='icontains'
    )
    min_price   = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price   = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model  = MenuDish
        fields = ['category', 'category_name', 'min_price', 'max_price']
