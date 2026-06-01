# """
# Menu Views — Yummy-Yummy
# CRUD for Categories, MenuDishes, PopularDishes
# Public: GET (list + detail)
# Admin only: POST, PUT, PATCH, DELETE
# """
# from rest_framework import generics, filters, status
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
#
# from .models import Category, MenuDish, PopularDish
# from .serializers import (
#     CategorySerializer,
#     MenuDishSerializer,
#     MenuDishWriteSerializer,
#     PopularDishSerializer,
#     PopularDishWriteSerializer,
# )
# from .filters import MenuDishFilter
#
#
# # ─── CATEGORIES ───────────────────────────────────────────────────────────────
# class CategoryListCreateView(generics.ListCreateAPIView):
#     """
#     GET  /api/menu/categories/  — Public (list all categories)
#     POST /api/menu/categories/  — Admin only (create category)
#     """
#     queryset   = Category.objects.all()
#     serializer_class = CategorySerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#
# class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     GET    /api/menu/categories/{id}/  — Public
#     PUT    /api/menu/categories/{id}/  — Admin
#     DELETE /api/menu/categories/{id}/  — Admin
#     """
#     queryset         = Category.objects.all()
#     serializer_class = CategorySerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#
# # ─── MENU DISHES ──────────────────────────────────────────────────────────────
# class MenuDishListCreateView(generics.ListCreateAPIView):
#     """
#     GET  /api/menu/dishes/  — Public
#          Supports: ?category=1  ?search=pizza  ?ordering=price
#     POST /api/menu/dishes/  — Admin (multipart/form-data for image upload)
#     """
#     queryset = MenuDish.objects.select_related('category').all()
#     parser_classes   = [MultiPartParser, FormParser, JSONParser]
#     filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_class  = MenuDishFilter
#     search_fields    = ['name', 'category__name']
#     ordering_fields  = ['price', 'name', 'id']
#     ordering         = ['category', 'name']
#
#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return MenuDishWriteSerializer
#         return MenuDishSerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context
#
#
# class MenuDishDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     GET    /api/menu/dishes/{id}/  — Public
#     PUT    /api/menu/dishes/{id}/  — Admin
#     DELETE /api/menu/dishes/{id}/  — Admin
#     """
#     queryset       = MenuDish.objects.select_related('category').all()
#     parser_classes = [MultiPartParser, FormParser, JSONParser]
#
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return MenuDishWriteSerializer
#         return MenuDishSerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context
#
#
# # ─── POPULAR DISHES ───────────────────────────────────────────────────────────
# class PopularDishListCreateView(generics.ListCreateAPIView):
#     """
#     GET  /api/menu/popular/  — Public
#     POST /api/menu/popular/  — Admin
#     """
#     queryset       = PopularDish.objects.all()
#     parser_classes = [MultiPartParser, FormParser, JSONParser]
#
#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return PopularDishWriteSerializer
#         return PopularDishSerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context
#
#
# class PopularDishDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     GET    /api/menu/popular/{id}/  — Public
#     PUT    /api/menu/popular/{id}/  — Admin
#     DELETE /api/menu/popular/{id}/  — Admin
#     """
#     queryset       = PopularDish.objects.all()
#     parser_classes = [MultiPartParser, FormParser, JSONParser]
#
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return PopularDishWriteSerializer
#         return PopularDishSerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]
#         return [IsAdminUser()]
#
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context

"""
Menu Views — Optimized for fast frontend loading
Key change: supports ?page_size=200 for bulk fetch
"""
from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, MenuDish, PopularDish
from .serializers import (
    CategorySerializer,
    MenuDishSerializer, MenuDishWriteSerializer,
    PopularDishSerializer, PopularDishWriteSerializer,
)
from .filters import MenuDishFilter


class FlexiblePagination(PageNumberPagination):
    """
    Allows frontend to request larger pages via ?page_size=200
    Default: 50 items. Max: 500 items.
    """
    page_size             = 50
    page_size_query_param = 'page_size'
    max_page_size         = 500


# ─── CATEGORIES ───────────────────────────────────────────────────────────────
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None   # Return all categories — always small list

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]


# ─── MENU DISHES ──────────────────────────────────────────────────────────────
class MenuDishListCreateView(generics.ListCreateAPIView):
    queryset         = MenuDish.objects.select_related('category').all()
    parser_classes   = [MultiPartParser, FormParser, JSONParser]
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class  = MenuDishFilter
    search_fields    = ['name', 'category__name']
    ordering_fields  = ['price', 'name', 'id']
    ordering         = ['category', 'name']
    pagination_class = FlexiblePagination   # supports ?page_size=200

    def get_serializer_class(self):
        return MenuDishWriteSerializer if self.request.method == 'POST' else MenuDishSerializer

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class MenuDishDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset       = MenuDish.objects.select_related('category').all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        return MenuDishWriteSerializer if self.request.method in ['PUT', 'PATCH'] else MenuDishSerializer

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


# ─── POPULAR DISHES ───────────────────────────────────────────────────────────
class PopularDishListCreateView(generics.ListCreateAPIView):
    queryset         = PopularDish.objects.all()
    parser_classes   = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None   # Always return all popular dishes

    def get_serializer_class(self):
        return PopularDishWriteSerializer if self.request.method == 'POST' else PopularDishSerializer

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class PopularDishDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset       = PopularDish.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        return PopularDishWriteSerializer if self.request.method in ['PUT', 'PATCH'] else PopularDishSerializer

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAdminUser()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

