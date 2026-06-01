"""
Authentication Serializers — Yummy-Yummy
"""
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Customer, AdminUser


# ─── REGISTER ────────────────────────────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, label='Confirm Password')

    class Meta:
        model  = Customer
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def validate_email(self, value):
        if Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered.')
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer


# ─── LOGIN ────────────────────────────────────────────────────────────────────
class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        attrs['user'] = user
        return attrs


# ─── CUSTOMER PROFILE ─────────────────────────────────────────────────────────
class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Customer
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'cnumber', 'address', 'postal_code', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'date_joined']


# ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Customer
        fields = ['first_name', 'last_name', 'cnumber', 'address', 'postal_code']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
class ChangePasswordSerializer(serializers.Serializer):
    old_password     = serializers.CharField(write_only=True)
    new_password     = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


# ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email not found.')
        return value


# ─── RESET PASSWORD ───────────────────────────────────────────────────────────
class ResetPasswordSerializer(serializers.Serializer):
    token            = serializers.CharField()
    new_password     = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return attrs


# ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
class AdminLoginSerializer(serializers.Serializer):
    admin_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            admin = AdminUser.objects.get(admin_id=attrs['admin_id'])
            # Original system stores plain text — compare directly
            if admin.password != attrs['password']:
                raise serializers.ValidationError('Incorrect ID or password.')
            attrs['admin'] = admin
        except AdminUser.DoesNotExist:
            raise serializers.ValidationError('Incorrect ID or password.')
        return attrs


# ─── TOKEN RESPONSE ───────────────────────────────────────────────────────────
class TokenResponseSerializer(serializers.Serializer):
    """Helper to build token + user response"""

    @staticmethod
    def get_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        }
