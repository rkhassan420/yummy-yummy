"""
Root URL Configuration — Yummy-Yummy
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # ── API Routes ────────────────────────────────────────────────────────
    path('api/auth/',     include('apps.authentication.urls')),
    path('api/menu/',     include('apps.menu.urls')),
    path('api/cart/',     include('apps.cart.urls')),
    path('api/orders/',   include('apps.orders.urls')),
    path('api/contact/',  include('apps.contact.urls')),
    path('api/feedback/', include('apps.feedback.urls')),
    path('api/admin/',    include('apps.admin_panel.urls')),
    path('api/payments/', include('apps.payments.urls')),

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

