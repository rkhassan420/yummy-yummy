"""
Django Settings — Yummy-Yummy Food Ordering System
FIXED: Uses PyMySQL (no C++ compiler needed on Windows)
"""
import os
from pathlib import Path
from datetime import timedelta
import pymysql
from decouple import config

# PyMySQL acts as MySQLdb — must be called before Django loads
pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── SECURITY ─────────────────────────────────────────────────────────────────
SECRET_KEY    = 'django-yummy-yummy-secret-key-change-in-production-2024'
DEBUG         = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']

# ─── APPLICATIONS ─────────────────────────────────────────────────────────────
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'apps.authentication',
    'apps.menu',
    'apps.cart',
    'apps.orders',
    'apps.contact',
    'apps.feedback',
    'apps.admin_panel',
    'apps.payments',

]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # ✅ ADD THIS

        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



WSGI_APPLICATION = 'config.wsgi.application'

# ─── DATABASE — MySQL via PyMySQL (XAMPP) ─────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.mysql',
        'NAME':     'food',
        'USER':     'root',
        'PASSWORD': '',       # ← Leave blank for XAMPP default
        'HOST':     '127.0.0.1',
        'PORT':     '3306',
        'OPTIONS': {
            'charset':       'utf8mb4',
            'connect_timeout': 10,
        },
    }
}

# ─── CUSTOM USER MODEL ────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'authentication.Customer'

# ─── PASSWORD VALIDATION ──────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

# ─── EMAIL / SMTP ─────────────────────────────────────────────────────────────
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Yummy-Yummy <noreply@yummyyummy.com>')

# OTP settings
OTP_EXPIRY_MINUTES = config('OTP_EXPIRY_MINUTES', default=10, cast=int)
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')

# ─── INTERNATIONALISATION ─────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'Asia/Karachi'
USE_I18N      = True
USE_TZ        = True

# ─── STATIC & MEDIA ───────────────────────────────────────────────────────────
STATIC_URL  = '/static/'
MEDIA_URL   = '/media/'
MEDIA_ROOT  = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── DJANGO REST FRAMEWORK ────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# ─── SIMPLE JWT ───────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':    timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME':   timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':    True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES':        ('Bearer',),
}

# ─── CORS — Allow React dev server ────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CORS_ALLOW_CREDENTIALS = True




JAZZCASH_MERCHANT_ID   = config('JAZZCASH_MERCHANT_ID',   default='')
JAZZCASH_PASSWORD      = config('JAZZCASH_PASSWORD',      default='')
JAZZCASH_INTEGRITY_SALT = config('JAZZCASH_INTEGRITY_SALT', default='')
JAZZCASH_SANDBOX       = config('JAZZCASH_SANDBOX',       default=True,  cast=bool)
JAZZCASH_RETURN_URL    = config('JAZZCASH_RETURN_URL',    default='http://localhost:8000/api/payments/webhook/')


EASYPAISA_STORE_ID      = os.getenv('EASYPAISA_STORE_ID',    'EP12345')
EASYPAISA_ACCOUNT_NUM   = os.getenv('EASYPAISA_ACCOUNT_NUM', '03001234567')
EASYPAISA_HASH_KEY      = os.getenv('EASYPAISA_HASH_KEY',    'hashkey123')
EASYPAISA_SANDBOX       = os.getenv('EASYPAISA_ENV', 'sandbox') == 'sandbox'
EASYPAISA_RETURN_URL    = os.getenv('EASYPAISA_RETURN_URL',  'http://localhost:5173/payment/callback')