"""
Orders URLs — /api/orders/
"""
from django.urls import path
from .views import (
    OrderListView,
    PlaceOrderView,
    OrderDetailView,
    AdminOrderListView,
    AdminUpdateOrderStatusView,
    AdminDeleteOrderView,          # ← new
)

urlpatterns = [
    # ── Customer ──────────────────────────────────────────────────────────────
    path('',               OrderListView.as_view(),   name='order-list'),
    path('place/',         PlaceOrderView.as_view(),  name='order-place'),
    path('<int:pk>/',      OrderDetailView.as_view(), name='order-detail'),

    # ── Admin ─────────────────────────────────────────────────────────────────
    path('admin/all/',             AdminOrderListView.as_view(),         name='admin-order-list'),
    path('admin/<int:pk>/status/', AdminUpdateOrderStatusView.as_view(), name='admin-order-status'),
    path('admin/<int:pk>/delete/', AdminDeleteOrderView.as_view(),       name='admin-order-delete'),  # ← new
]