from django.urls import path
from .views import FeedbackListCreateView, AdminFeedbackDeleteView

urlpatterns = [
    path('',              FeedbackListCreateView.as_view(),  name='feedback-list'),
    path('admin/<int:pk>/', AdminFeedbackDeleteView.as_view(), name='admin-feedback-delete'),
]
