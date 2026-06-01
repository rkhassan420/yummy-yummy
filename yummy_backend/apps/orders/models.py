"""
Orders Models — Yummy-Yummy
Maps to: orders table in food.sql
Fields: id, order_id, customer_name, items, address, total_price
"""
import uuid
from django.db import models
from django.conf import settings


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('preparing',  'Preparing'),
        ('on_the_way', 'On the Way'),
        ('delivered',  'Delivered'),
        ('cancelled',  'Cancelled'),
    ]

    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    order_id      = models.CharField(max_length=255, unique=True, blank=True)
    customer_name = models.CharField(max_length=255)
    address       = models.TextField()
    total_price   = models.DecimalField(max_digits=10, decimal_places=2)
    status        = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f'ORD-{str(uuid.uuid4()).upper()[:8]}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.order_id} — {self.customer_name} ({self.status})'


class OrderItem(models.Model):
    """Individual items within an order"""
    order     = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    dish_name = models.CharField(max_length=255)
    image     = models.CharField(max_length=255, blank=True)
    price     = models.DecimalField(max_digits=10, decimal_places=2)
    qty       = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f'{self.qty} × {self.dish_name}'

    @property
    def total(self):
        return self.price * self.qty
