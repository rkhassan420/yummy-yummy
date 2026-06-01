from django.urls import path
from .views import SubmitContactView, AdminMessageListView, AdminMessageDeleteView

urlpatterns = [
    path('',                        SubmitContactView.as_view(),     name='contact-submit'),
    path('admin/messages/',         AdminMessageListView.as_view(),  name='admin-messages'),
    path('admin/messages/<int:pk>/',AdminMessageDeleteView.as_view(),name='admin-message-delete'),
]
