"""
Menu URLs — /api/menu/
"""
from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    MenuDishListCreateView,
    MenuDishDetailView,
    PopularDishListCreateView,
    PopularDishDetailView,
)

urlpatterns = [
    # Categories
    path('categories/',      CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Menu Dishes
    path('dishes/',          MenuDishListCreateView.as_view(), name='dish-list'),
    path('dishes/<int:pk>/', MenuDishDetailView.as_view(),     name='dish-detail'),

    # Popular Dishes
    path('popular/',          PopularDishListCreateView.as_view(), name='popular-list'),
    path('popular/<int:pk>/', PopularDishDetailView.as_view(),     name='popular-detail'),
]
