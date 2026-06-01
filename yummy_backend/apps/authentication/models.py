# """
# Authentication Models — Yummy-Yummy
# Custom User model replacing reg_customer table
# """
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db import models
#
#
# class CustomerManager(BaseUserManager):
#     """Custom manager for Customer model"""
#
#     def create_user(self, email, first_name, password=None, **extra_fields):
#         if not email:
#             raise ValueError('Email is required')
#         email = self.normalize_email(email)
#         user  = self.model(email=email, first_name=first_name, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#
#     def create_superuser(self, email, first_name, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, first_name, password, **extra_fields)
#
#
# class Customer(AbstractBaseUser, PermissionsMixin):
#     """
#     Custom User model — maps to reg_customer table in food.sql
#     Fields: id, first_name, last_name, email, password,
#             cnumber, address, postal_code
#     """
#     first_name  = models.CharField(max_length=100)
#     last_name   = models.CharField(max_length=100, blank=True)
#     email       = models.EmailField(unique=True)
#     cnumber     = models.CharField(max_length=50, blank=True)
#     address     = models.TextField(blank=True)
#     postal_code = models.CharField(max_length=10, blank=True)
#
#     # Django required fields
#     is_active   = models.BooleanField(default=True)
#     is_staff    = models.BooleanField(default=False)   # True = Admin
#     date_joined = models.DateTimeField(auto_now_add=True)
#
#     objects  = CustomerManager()
#
#     USERNAME_FIELD  = 'email'
#     REQUIRED_FIELDS = ['first_name']
#
#     class Meta:
#         db_table = 'reg_customer'
#         verbose_name = 'Customer'
#         verbose_name_plural = 'Customers'
#
#     def __str__(self):
#         return f'{self.first_name} {self.last_name} <{self.email}>'
#
#     @property
#     def full_name(self):
#         return f'{self.first_name} {self.last_name}'.strip()
#
#
# class AdminUser(models.Model):
#     """
#     Admin login model — maps directly to admin_login table in food.sql
#     Kept separate from Customer model as per original system
#     """
#     admin_id = models.CharField(max_length=255, primary_key=True)
#     password = models.CharField(max_length=255)
#
#     class Meta:
#         db_table = 'admin_login'
#         verbose_name = 'Admin'
#
#     def __str__(self):
#         return self.admin_id
#
#
# class PasswordResetToken(models.Model):
#     """Temporary token for password reset flow"""
#     customer  = models.ForeignKey(Customer, on_delete=models.CASCADE)
#     token     = models.CharField(max_length=64, unique=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     is_used   = models.BooleanField(default=False)
#
#     class Meta:
#         db_table = 'password_reset_tokens'
#
#     def __str__(self):
#         return f'Reset token for {self.customer.email}'

"""
Authentication Models — Yummy-Yummy
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db   import models
from django.utils import timezone
from django.conf  import settings
import random


class CustomerManager(BaseUserManager):
    def create_user(self, email, first_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user  = self.model(email=email, first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff',     True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, password, **extra_fields)


class Customer(AbstractBaseUser, PermissionsMixin):
    """Maps to reg_customer table"""
    first_name  = models.CharField(max_length=100)
    last_name   = models.CharField(max_length=100, blank=True)
    email       = models.EmailField(unique=True)
    cnumber     = models.CharField(max_length=50, blank=True)
    address     = models.TextField(blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomerManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        db_table     = 'reg_customer'
        verbose_name = 'Customer'

    def __str__(self):
        return f'{self.first_name} {self.last_name} <{self.email}>'

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()


class AdminUser(models.Model):
    """Maps to admin_login table"""
    admin_id = models.CharField(max_length=255, primary_key=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = 'admin_login'

    def __str__(self):
        return self.admin_id


class OTPCode(models.Model):
    """
    6-digit OTP for password reset.
    Sent via email. Expires after OTP_EXPIRY_MINUTES.
    """
    customer   = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='otps')
    code       = models.CharField(max_length=6)
    is_used    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table  = 'otp_codes'
        ordering  = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.expires_at:
            from django.conf import settings
            minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
            self.expires_at = timezone.now() + timezone.timedelta(minutes=minutes)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired

    @staticmethod
    def generate_code():
        """Generate a secure 6-digit OTP"""
        return str(random.SystemRandom().randint(100000, 999999))

    def __str__(self):
        return f'OTP {self.code} for {self.customer.email} (valid={self.is_valid})'


# Keep old PasswordResetToken for backwards compatibility
class PasswordResetToken(models.Model):
    customer   = models.ForeignKey(Customer, on_delete=models.CASCADE)
    token      = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used    = models.BooleanField(default=False)

    class Meta:
        db_table = 'password_reset_tokens'
