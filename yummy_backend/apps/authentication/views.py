"""
Authentication Views — Yummy-Yummy
Handles: Register, Login, Logout, Profile, Change Password, Forgot/Reset Password, Admin Login
"""
import secrets
from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import PasswordResetToken
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    CustomerProfileSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    AdminLoginSerializer,
    TokenResponseSerializer,
)
from apps.authentication.email_service import send_welcome_email
from apps.authentication.email_service import send_otp_email

Customer = get_user_model()


# ─── REGISTER ────────────────────────────────────────────────────────────────
class RegisterView(APIView):
    """POST /api/auth/register/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()

            send_welcome_email(customer)

            tokens   = TokenResponseSerializer.get_tokens(customer)
            return Response({
                'message': 'Registration successful.',
                'user': CustomerProfileSerializer(customer).data,
                'tokens': tokens,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── LOGIN ────────────────────────────────────────────────────────────────────
class LoginView(APIView):
    """POST /api/auth/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.validated_data['user']
            tokens = TokenResponseSerializer.get_tokens(user)
            return Response({
                'message': 'Login successful.',
                'user': CustomerProfileSerializer(user).data,
                'tokens': tokens,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# ─── LOGOUT ───────────────────────────────────────────────────────────────────
class LogoutView(APIView):
    """POST /api/auth/logout/  — Blacklists refresh token"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


# ─── PROFILE ──────────────────────────────────────────────────────────────────
class ProfileView(APIView):
    """GET/PUT /api/auth/profile/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomerProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UpdateProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'user': CustomerProfileSerializer(updated_user).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
class ChangePasswordView(APIView):
    """POST /api/auth/change-password/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password changed successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
import random

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email    = serializer.validated_data['email']
            customer = Customer.objects.get(email=email)

            # Generate 6-digit OTP
            otp = str(random.randint(100000, 999999))

            # Invalidate old tokens
            PasswordResetToken.objects.filter(customer=customer, is_used=False).update(is_used=True)

            PasswordResetToken.objects.create(customer=customer, token=otp)
            send_otp_email(customer, otp)   # your existing email function

            return Response({'message': 'OTP sent to your email.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── RESET PASSWORD ───────────────────────────────────────────────────────────
class ResetPasswordView(APIView):
    """POST /api/auth/reset-password/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token_str = serializer.validated_data['token']
            try:
                reset_obj = PasswordResetToken.objects.get(
                    token=token_str, is_used=False
                )
            except PasswordResetToken.DoesNotExist:
                return Response(
                    {'error': 'Invalid or expired token.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            customer = reset_obj.customer
            customer.set_password(serializer.validated_data['new_password'])
            customer.save()
            reset_obj.is_used = True
            reset_obj.save()
            return Response({'message': 'Password reset successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
class AdminLoginView(APIView):
    """
    POST /api/admin/login/
    Authenticates against the admin_login table (original food.sql table)
    Returns a special admin JWT by finding/creating the staff user
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.validated_data['admin']
            # Get or create a Django staff user for JWT issuance
            staff_user, created = Customer.objects.get_or_create(
                email=f'{admin.admin_id}@yummyadmin.local',
                defaults={
                    'first_name': 'Admin',
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            if created:
                staff_user.set_unusable_password()
                staff_user.save()

            tokens = TokenResponseSerializer.get_tokens(staff_user)
            return Response({
                'message': 'Admin login successful.',
                'admin_id': admin.admin_id,
                'is_admin': True,
                'tokens': tokens,
            })
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
