"""
Orders Serializers — Yummy-Yummy
"""
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    total = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ['id', 'dish_name', 'image', 'price', 'qty', 'total']


class OrderSerializer(serializers.ModelSerializer):
    items          = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'order_id', 'customer_name', 'address',
            'total_price', 'status', 'status_display',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_id', 'created_at', 'updated_at']


class PlaceOrderSerializer(serializers.Serializer):
    """Validates data when placing a new order from cart"""
    address = serializers.CharField(max_length=500)

    def validate_address(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Please enter a valid full address.')
        return value.strip()


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Admin only — update order status"""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
