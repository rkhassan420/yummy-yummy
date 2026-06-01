"""
Cart Serializers — Yummy-Yummy
"""
from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()

    class Meta:
        model  = CartItem
        fields = ['id', 'dish_id', 'name', 'image', 'price', 'qty', 'total_price', 'added_at']
        read_only_fields = ['id', 'added_at']


class AddToCartSerializer(serializers.Serializer):
    """Used when adding a dish to cart"""
    dish_id = serializers.IntegerField(required=False)
    name    = serializers.CharField(max_length=255)
    image   = serializers.CharField(max_length=255, required=False, allow_blank=True)
    price   = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be positive.')
        return value


class UpdateCartItemSerializer(serializers.Serializer):
    """Used when updating quantity"""
    qty = serializers.IntegerField(min_value=1)


class CartSerializer(serializers.ModelSerializer):
    items        = CartItemSerializer(many=True, read_only=True)
    sub_total    = serializers.ReadOnlyField()
    delivery_fee = serializers.ReadOnlyField()
    grand_total  = serializers.ReadOnlyField()
    item_count   = serializers.SerializerMethodField()

    class Meta:
        model  = Cart
        fields = [
            'id', 'items', 'item_count',
            'sub_total', 'delivery_fee', 'grand_total',
            'updated_at'
        ]

    def get_item_count(self, obj):
        return sum(item.qty for item in obj.items.all())
