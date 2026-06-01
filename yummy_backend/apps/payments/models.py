from django.db   import models
from django.conf import settings


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending',  'Pending'),
        ('paid',     'Paid'),
        ('failed',   'Failed'),
        ('refunded', 'Refunded'),
    ]

    METHOD_CHOICES = [
        ('jazzcash',  'JazzCash'),
        ('easypaisa', 'EasyPaisa'),
        ('cod',       'Cash on Delivery'),
    ]

    order  = models.OneToOneField(
        'orders.Order', on_delete=models.CASCADE, related_name='payment'
    )
    user   = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    method         = models.CharField(max_length=20, choices=METHOD_CHOICES, default='cod')
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount         = models.DecimalField(max_digits=10, decimal_places=2)

    # JazzCash fields
    txn_ref_no     = models.CharField(max_length=50,  blank=True)
    jazzcash_txn   = models.CharField(max_length=100, blank=True)

    # EasyPaisa fields
    ep_order_ref   = models.CharField(max_length=50,  blank=True)   # orderRefNum
    ep_txn_ref     = models.CharField(max_length=100, blank=True)   # transactionId from EP

    # Shared
    response_code  = models.CharField(max_length=10,  blank=True)
    response_msg   = models.TextField(blank=True)
    raw_response   = models.JSONField(default=dict, blank=True)

    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

    def __str__(self):
        return f'Payment #{self.id} | {self.method} | {self.status} | Rs.{self.amount}'

    @property
    def is_paid(self):
        return self.status == 'paid'