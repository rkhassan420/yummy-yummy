"""
Cart Views — Yummy-Yummy
All routes require authentication
GET    /api/cart/           — Get full cart
POST   /api/cart/add/       — Add item
PUT    /api/cart/update/{id}/ — Update qty
DELETE /api/cart/remove/{id}/ — Remove item
DELETE /api/cart/clear/     — Clear entire cart
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    """GET /api/cart/ — Return full cart with items and totals"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    """POST /api/cart/add/ — Add a dish or increment qty if already exists"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request.user)
        data = serializer.validated_data

        # If dish already in cart, increment qty
        existing = cart.items.filter(dish_id=data.get('dish_id'), name=data['name']).first()
        if existing:
            existing.qty += 1
            existing.save()
            item = existing
        else:
            item = CartItem.objects.create(
                cart    = cart,
                dish_id = data.get('dish_id'),
                name    = data['name'],
                image   = data.get('image', ''),
                price   = data['price'],
                qty     = 1,
            )

        cart_data = CartSerializer(cart).data
        return Response({
            'message': f'"{item.name}" added to cart.',
            'cart': cart_data,
        }, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    """PUT /api/cart/update/{id}/ — Update qty of a specific cart item"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            item.qty = serializer.validated_data['qty']
            item.save()
            return Response({
                'message': 'Quantity updated.',
                'cart': CartSerializer(cart).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RemoveCartItemView(APIView):
    """DELETE /api/cart/remove/{id}/ — Remove specific item"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(pk=pk)
            name = item.name
            item.delete()
            return Response({
                'message': f'"{name}" removed from cart.',
                'cart': CartSerializer(cart).data,
            })
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class ClearCartView(APIView):
    """DELETE /api/cart/clear/ — Remove all items"""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared.', 'cart': CartSerializer(cart).data})
