"""
Admin Panel Views — Yummy-Yummy
All views require IsAdminUser permission

GET /api/admin/dashboard/stats/ — Overview counts
GET /api/admin/customers/       — All registered customers
"""
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from apps.menu.models import MenuDish, PopularDish, Category
from apps.orders.models import Order
from apps.contact.models import ContactMessage
from apps.feedback.models import UserFeedback
from apps.authentication.serializers import CustomerProfileSerializer

Customer = get_user_model()


class DashboardStatsView(APIView):
    """
    GET /api/admin/dashboard/stats/
    Returns all counts shown on admin home.php
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            'popular_dishes':      PopularDish.objects.count(),
            'menu_dishes':         MenuDish.objects.count(),
            'categories':          Category.objects.count(),
            'total_orders':        Order.objects.count(),
            'pending_orders':      Order.objects.filter(status='pending').count(),
            'delivered_orders':    Order.objects.filter(status='delivered').count(),
            'customer_messages':   ContactMessage.objects.count(),
            'customer_feedback':   UserFeedback.objects.count(),
            'registered_customers': Customer.objects.filter(is_staff=False).count(),
            'today_date':          __import__('datetime').date.today().strftime('%d-%m-%Y'),
        }
        return Response(stats)


class AdminCustomerListView(generics.ListAPIView):
    """
    GET /api/admin/customers/
    Lists all registered customers (non-staff)
    """
    serializer_class   = CustomerProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Customer.objects.filter(is_staff=False).order_by('-date_joined')


class AdminCustomerDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/admin/customers/{id}/  — View customer
    DELETE /api/admin/customers/{id}/  — Delete customer
    """
    serializer_class   = CustomerProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Customer.objects.filter(is_staff=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Customer deleted.'})
