from django.urls import path
from .views import (
    InitiateJazzCashView,
    JazzCashWebhookView,
    InitiateEasyPaisaView,
    EasyPaisaWebhookView,
    CashOnDeliveryView,
    PaymentStatusView,
)

urlpatterns = [
    # JazzCash
    path('initiate/',              InitiateJazzCashView.as_view(),   name='payment-initiate'),
    path('webhook/',               JazzCashWebhookView.as_view(),    name='payment-webhook'),

    # EasyPaisa
    path('easypaisa/initiate/',    InitiateEasyPaisaView.as_view(),  name='easypaisa-initiate'),
    path('easypaisa/webhook/',     EasyPaisaWebhookView.as_view(),   name='easypaisa-webhook'),

    # Shared
    path('cod/',                   CashOnDeliveryView.as_view(),     name='payment-cod'),
    path('status/<int:order_id>/', PaymentStatusView.as_view(),      name='payment-status'),
]