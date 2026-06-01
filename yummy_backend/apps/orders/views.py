"""
Orders Views — Yummy-Yummy
"""
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer, UpdateOrderStatusSerializer
from apps.authentication.email_service import send_order_confirmation_email


class OrderListView(generics.ListAPIView):
    """GET /api/orders/ — logged-in user's orders"""
    serializer_class= OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items').order_by('-created_at')


class PlaceOrderView(APIView):
    """POST /api/orders/place/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user          = request.user,
            customer_name = request.user.full_name or request.user.email,
            address       = serializer.validated_data['address'],
            total_price   = cart.grand_total,
        )

        OrderItem.objects.bulk_create([
            OrderItem(
                order     = order,
                dish_name = item.name,
                image     = item.image,
                price     = item.price,
                qty       = item.qty,
            )
            for item in cart_items
        ])

        cart_items.delete()

        send_order_confirmation_email(request.user, order)

        return Response({
            'message': 'Order placed successfully!',
            'order':   OrderSerializer(order).data,
        }, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/{id}/"""
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')


# ─── ADMIN VIEWS ──────────────────────────────────────────────────────────────

class AdminOrderListView(generics.ListAPIView):
    """GET /api/orders/admin/all/"""
    serializer_class   = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Order.objects.all().prefetch_related('items').select_related('user')

        # Optional filter by user id: ?user=5
        user_id = self.request.query_params.get('user')
        if user_id:
            qs = qs.filter(user__id=user_id)

        return qs.order_by('-created_at')


class AdminUpdateOrderStatusView(APIView):
    """PUT /api/orders/admin/{id}/status/"""
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateOrderStatusSerializer(data=request.data)
        if serializer.is_valid():
            order.status = serializer.validated_data['status']
            order.save()
            return Response({
                'message': f'Status updated to "{order.get_status_display()}".',
                'order':   OrderSerializer(order).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDeleteOrderView(APIView):
    """
    DELETE /api/orders/admin/{id}/delete/
    Permanently deletes an order and all its items.
    Admin only.
    """
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        order_id = order.order_id
        order.delete()   # cascade deletes OrderItems too

        return Response(
            {'message': f'Order {order_id} permanently deleted.'},
            status=status.HTTP_200_OK
        )