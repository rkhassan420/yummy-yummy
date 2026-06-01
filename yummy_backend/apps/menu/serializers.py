"""
Menu Serializers — Yummy-Yummy
"""
from rest_framework import serializers
from .models import Category, MenuDish, PopularDish


class CategorySerializer(serializers.ModelSerializer):
    dish_count = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'dish_count']

    def get_dish_count(self, obj):
        return obj.dishes.count()


class MenuDishSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url     = serializers.SerializerMethodField()

    class Meta:
        model  = MenuDish
        fields = [
            'id', 'category', 'category_name',
            'name', 'price', 'image', 'image_url'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class MenuDishWriteSerializer(serializers.ModelSerializer):
    """Used for create / update — accepts image file upload"""

    class Meta:
        model  = MenuDish
        fields = ['category', 'name', 'price', 'image']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero.')
        return value


class PopularDishSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = PopularDish
        fields = ['id', 'name', 'price', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class PopularDishWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model  = PopularDish
        fields = ['name', 'price', 'image']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero.')
        return value
