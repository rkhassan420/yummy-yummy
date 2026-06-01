"""
Menu Models — Yummy-Yummy
Maps: categories, menu_dishes, popular_dishes tables from food.sql
"""
from django.db import models


class Category(models.Model):
    """
    Maps to: categories table
    Data: Breakfast, Dinner, Desert, BBQ, Chinese, Bread, Sweet, Drink
    """
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table  = 'categories'
        verbose_name_plural = 'Categories'
        ordering  = ['name']

    def __str__(self):
        return self.name


class MenuDish(models.Model):
    """
    Maps to: menu_dishes table
    Has CategoryID FK to categories
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='dishes',
        db_column='CategoryID'
    )
    name  = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/', blank=True)

    class Meta:
        db_table = 'menu_dishes'
        ordering = ['category', 'name']

    def __str__(self):
        return f'{self.name} — Rs.{self.price}'


class PopularDish(models.Model):
    """
    Maps to: popular_dishes table
    Standalone — not linked to categories
    Examples: Zinger Burger, Yummy Pizza, Fries, Turkish Platter
    """
    name  = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='popular_images/', blank=True)

    class Meta:
        db_table = 'popular_dishes'
        verbose_name = 'Popular Dish'
        verbose_name_plural = 'Popular Dishes'

    def __str__(self):
        return f'{self.name} — Rs.{self.price}'
