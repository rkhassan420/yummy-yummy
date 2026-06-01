from django.urls import path
from apps.authentication.views import AdminLoginView
from .views import DashboardStatsView, AdminCustomerListView, AdminCustomerDetailView

urlpatterns = [
    path('login/',                  AdminLoginView.as_view(),         name='admin-login'),
    path('dashboard/stats/',        DashboardStatsView.as_view(),     name='admin-stats'),
    path('customers/',              AdminCustomerListView.as_view(),   name='admin-customers'),
    path('customers/<int:pk>/',     AdminCustomerDetailView.as_view(), name='admin-customer-detail'),
]
