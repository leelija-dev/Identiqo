import logging
import random
import string
import cloudinary.uploader
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from admin_api.models import AdminUser, SubscriptionPlan
from admin_api.serializers import SubscriptionPlanSerializer

from .models import Users, Employee
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserRegisterSerializer,
    EmployeeSerializer,
)


logger = logging.getLogger(__name__)

PASSWORD_RESET_OTP_TIMEOUT = 900  # 15 minutes


def _user_payload(user):
    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'address': user.address,
    }


def _jwt_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


class RegisterView(generics.CreateAPIView):
    """POST /api/register/"""
    queryset = Users.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        payload = _jwt_tokens_for_user(user)
        return Response(
            {
                'message': 'User registered successfully',
                **payload,
                'user': {
                    **_user_payload(user),
                    'created_at': user.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        payload = _jwt_tokens_for_user(user)
        return Response(
            {
                'message': 'Login successful',
                **payload,
                'user': _user_payload(user),
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """POST /api/logout/ — blacklist refresh token."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                logger.warning('Logout received invalid refresh token')

        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """GET, PUT, PATCH /api/profile/"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {
                'message': 'Profile updated successfully',
                'user': serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    """POST /api/change-password/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    """POST /api/forgot-password/"""
    permission_classes = [AllowAny]

    @staticmethod
    def _generate_otp():
        return ''.join(random.choices(string.digits, k=6))

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.context['user']

        otp = self._generate_otp()
        cache_key = f'password_reset_otp_{user.email}'
        cache.set(cache_key, otp, timeout=PASSWORD_RESET_OTP_TIMEOUT)

        try:
            subject = 'Password Reset Request - Identiqo'
            message = (
                f'Hello {user.name or user.email},\n\n'
                f'Your OTP for password reset is: {otp}\n\n'
                f'This OTP is valid for 15 minutes.\n\n'
                f"If you didn't request this, please ignore this email.\n\n"
                f'Best regards,\nIdentiqo Team'
            )
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

            response_data = {'message': 'Password reset OTP sent to your email'}
            if settings.DEBUG:
                response_data['otp'] = otp

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.exception('Failed to send password reset email')
            return Response(
                {'error': 'Failed to send OTP email', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResetPasswordView(APIView):
    """POST /api/reset-password/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].lower().strip()
        otp = serializer.validated_data['otp']
        cache_key = f'password_reset_otp_{email}'
        stored_otp = cache.get(cache_key)

        if not stored_otp or stored_otp != otp:
            return Response(
                {'error': 'Invalid or expired OTP'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        cache.delete(cache_key)

        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    """DELETE /api/delete-account/"""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        password = request.data.get('password')

        if password and not user.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# ==================== SUBSCRIPTION PLAN APIS (PUBLIC READ-ONLY) ====================


class SubscriptionPlanListView(generics.ListAPIView):
    """GET /api/subscription-plans/"""
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()

        billing_cycle = self.request.query_params.get('billing_cycle')
        if billing_cycle:
            queryset = queryset.filter(billing_cycle=billing_cycle)

        plan_code = self.request.query_params.get('code')
        if plan_code:
            queryset = queryset.filter(code=plan_code)

        return queryset

# Employee Api 
class EmployeeCreateView(APIView):

    def post(self, request):

        data = request.data.copy()

        # Get image from request
        image = request.FILES.get("profile_picture")

        if image:
            try:
                upload_result = cloudinary.uploader.upload(
                    image,
                    folder="employees/profile_pictures",
                )

                data["profile_picture"] = upload_result["secure_url"]
                data["profile_picture_public_id"] = upload_result["public_id"]

            except Exception as e:
                return Response(
                    {
                        "status": False,
                        "message": "Image upload failed.",
                        "error": str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = EmployeeSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "status": True,
                    "message": "Employee created successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "status": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class EmployeeListView(generics.ListAPIView):       # list of employees
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return Employee.objects.filter(user_id=user_id)

class EmployeeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        employee = get_object_or_404(Employee, id=id)
        serializer = EmployeeSerializer(employee)

        return Response({
            "status": True,
            "data": serializer.data
        })
