"""
Cart Models — Yummy-Yummy
Maps to: cart table in food.sql
Fields: user_id, id, name, image, price, qty
"""
from django.db import models
from django.conf import settings


class Cart(models.Model):
    """One cart per user"""
    user       = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart_header'

    def __str__(self):
        return f"Cart of {self.user.email}"

    @property
    def sub_total(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def delivery_fee(self):
        return 200 if self.items.exists() else 0

    @property
    def grand_total(self):
        return self.sub_total + self.delivery_fee


class CartItem(models.Model):
    """
    Maps to original cart table columns:
    user_id, id, name, image, price, qty
    """
    cart      = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    dish_id   = models.IntegerField(null=True, blank=True)   # reference to menu_dish id
    name      = models.CharField(max_length=255)
    image     = models.CharField(max_length=255, blank=True)
    price     = models.DecimalField(max_digits=10, decimal_places=2)
    qty       = models.PositiveIntegerField(default=1)
    added_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cart'

    def __str__(self):
        return f'{self.qty} × {self.name}'

    @property
    def total_price(self):
        return self.price * self.qty
