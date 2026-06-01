"""
Contact App — models.py
Maps to: contact table in food.sql
Fields: id, name, email, cell_number, msg, cdate, ctime
"""
from django.db import models


class ContactMessage(models.Model):
    name        = models.CharField(max_length=255)
    email       = models.EmailField()
    cell_number = models.CharField(max_length=50, blank=True)
    msg         = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} — {self.email}'
