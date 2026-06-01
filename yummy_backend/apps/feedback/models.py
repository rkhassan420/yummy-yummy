"""
Feedback Model — Yummy-Yummy
Maps to: user_feedback table in food.sql
Fields: id, review, name, cdate
"""
from django.db import models
from django.conf import settings


class UserFeedback(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='feedbacks'
    )
    name       = models.CharField(max_length=50)
    review     = models.TextField()
    rating     = models.PositiveSmallIntegerField(choices=RATING_CHOICES, default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} — ⭐{self.rating}'
