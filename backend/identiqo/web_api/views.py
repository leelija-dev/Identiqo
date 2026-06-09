from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from admin_api.models import SubscriptionPlan, AdminUser
from admin_api.serializers import SubscriptionPlanSerializer
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import (
    UserRegisterSerializer, UserLoginSerializer, UserProfileSerializer,
    ChangePasswordSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
)
import logging
logger = logging.getLogger(__name__)




# class RegisterView(generics.CreateAPIView):
#     """
#     API endpoint for user registration
#     URL: /api/register/
#     Method: POST
#     """
#     queryset = Users.objects.all()
#     serializer_class = UserRegisterSerializer
#     permission_classes = [AllowAny]
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
        
#         # Optional: Send welcome email
#         # self.send_welcome_email(user)
        
#         return Response({
#             'message': 'User registered successfully',
#             'user': {
#                 'id': user.id,
#                 'email': user.email,
#                 'full_name': user.full_name,
#                 'phone': user.phone
#             }
#         }, status=status.HTTP_201_CREATED)
    
#     def send_welcome_email(self, user):
#         """Send welcome email to new user"""
#         subject = 'Welcome to Identiqo!'
#         message = f"""
#         Hi {user.full_name or user.email},
        
#         Welcome to Identiqo! Your account has been successfully created.
        
#         You can now log in to start using our services.
        
#         Best regards,
#         Identiqo Team
#         """
#         send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

# class RegisterView(generics.CreateAPIView):
#     """
#     API endpoint for user registration
#     URL: /api/register/
#     Method: POST
#     """
#     queryset = Users.objects.all()
#     serializer_class = UserRegisterSerializer
#     permission_classes = [AllowAny]
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
        
#         return Response({
#             'message': 'User registered successfully',
#             'user': {
#                 'id': user.id,
#                 'email': user.email,
#                 'full_name': user.full_name,
#                 'phone': user.phone
#             }
#         }, status=status.HTTP_201_CREATED)

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    URL: /api/register/
    Method: POST
    """
    queryset = Users.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'address': user.address,
                'created_at': user.created_at
            }
        }, status=status.HTTP_201_CREATED)
        
class LoginView(APIView):
    """
    API endpoint for user login
    URL: /api/login/
    Method: POST
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Generate session token or JWT
        # For Django session-based authentication
        from django.contrib.auth import login
        login(request, user)
        
        # You can also generate a token if using token authentication
        # from rest_framework.authtoken.models import Token
        # token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'phone': user.phone
            },
            # 'token': token.key  # Uncomment if using token auth
        }, status=status.HTTP_200_OK)


# class LogoutView(APIView):
#     """
#     API endpoint for user logout
#     URL: /api/logout/
#     Method: POST
#     """
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         from django.contrib.auth import logout
#         logout(request)
        
#         # If using token authentication
#         # request.user.auth_token.delete()
        
#         return Response({
#             'message': 'Logout successful'
#         }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request):
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)

        logout(request)

        return Response({
            "message": "Logout successful"
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to get and update user profile
    URL: /api/profile/
    Methods: GET, PUT, PATCH
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response({
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    API endpoint to change user password
    URL: /api/change-password/
    Method: POST
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    """
    API endpoint to request password reset
    URL: /api/forgot-password/
    Method: POST
    """
    permission_classes = [AllowAny]
    
    def generate_otp(self):
        """Generate 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.context['user']
        
        # Generate OTP
        otp = self.generate_otp()
        
        # Store OTP (you should implement this - using cache or a separate model)
        # For now, we'll just return it in response for testing
        # In production, store OTP in cache with expiration (e.g., 15 minutes)
        # cache.set(f'password_reset_otp_{user.email}', otp, timeout=900)
        
        # Send OTP via email
        try:
            subject = 'Password Reset Request - Identiqo'
            message = f"""
            Hello {user.full_name or user.email},
            
            We received a request to reset your password.
            
            Your OTP for password reset is: {otp}
            
            This OTP is valid for 15 minutes.
            
            If you didn't request this, please ignore this email.
            
            Best regards,
            Identiqo Team
            """
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            
            # For testing only - in production, don't return OTP
            return Response({
                'message': 'Password reset OTP sent to your email',
                'otp': otp  # Remove this in production
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Failed to send OTP email',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    """
    API endpoint to reset password using OTP
    URL: /api/reset-password/
    Method: POST
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        email = data['email'].lower()
        otp = data['otp']
        new_password = data['new_password']
        
        # Verify OTP (you need to implement this)
        # stored_otp = cache.get(f'password_reset_otp_{email}')
        # if not stored_otp or stored_otp != otp:
        #     return Response({
        #         'error': 'Invalid or expired OTP'
        #     }, status=status.HTTP_400_BAD_REQUEST)
        
        # For testing - accept any OTP that matches what was sent
        # In production, validate against stored OTP
        
        try:
            user = Users.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            
            # Delete OTP from cache
            # cache.delete(f'password_reset_otp_{email}')
            
            return Response({
                'message': 'Password reset successfully'
            }, status=status.HTTP_200_OK)
            
        except Users.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class DeleteAccountView(APIView):
    """
    API endpoint to delete user account
    URL: /api/delete-account/
    Method: DELETE
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        
        # Optional: Ask for password confirmation
        password = request.data.get('password')
        if password and not check_password(password, user.password):
            return Response({
                'error': 'Invalid password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete user
        user.delete()
        
        # Logout user
        from django.contrib.auth import logout
        logout(request)
        
        return Response({
            'message': 'Account deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
# ==================== SUBSCRIPTION PLAN APIS ====================

class SubscriptionPlanListView(generics.ListAPIView):
    """
    API endpoint to list all active subscription plans.
    Access: Public (no authentication required for listing)
    """
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Optional filtering by billing_cycle
        billing_cycle = self.request.query_params.get('billing_cycle')
        if billing_cycle:
            queryset = queryset.filter(billing_cycle=billing_cycle)
        
        # Optional filtering by plan code
        plan_code = self.request.query_params.get('code')
        if plan_code:
            queryset = queryset.filter(code=plan_code)
        
        return queryset


class SubscriptionPlanCreateView(generics.CreateAPIView):
    """
    API endpoint to create a new subscription plan.
    Access: Admin only
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new subscription plan with validation
        """
        # Check if user is admin (you can implement admin check based on your auth system)
        user_email = request.user.email if hasattr(request.user, 'email') else None
        
        # Check if user exists in AdminUser table
        if not AdminUser.objects.filter(email=user_email).exists():
            return Response(
                {
                    'error': 'Unauthorized',
                    'message': 'Only admin users can create subscription plans.'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Subscription plan created successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def perform_create(self, serializer):
        """Save the subscription plan"""
        serializer.save()


# Optional: Add a combined view for retrieving, updating, and deleting individual plans
class SubscriptionPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a specific subscription plan.
    Access: 
        - Retrieve: Public
        - Update/Delete: Admin only
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_permissions(self):
        """
        Allow public access for retrieve (GET), but require admin for modifications
        """
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        """Update subscription plan - admin only"""
        # Admin check
        user_email = request.user.email if hasattr(request.user, 'email') else None
        if not AdminUser.objects.filter(email=user_email).exists():
            return Response(
                {'error': 'Unauthorized', 'message': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Subscription plan updated successfully',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """Delete subscription plan - admin only"""
        # Admin check
        user_email = request.user.email if hasattr(request.user, 'email') else None
        if not AdminUser.objects.filter(email=user_email).exists():
            return Response(
                {'error': 'Unauthorized', 'message': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Subscription plan deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# Optional: Bulk operations for subscription plans
class SubscriptionPlanBulkCreateView(APIView):
    """
    API endpoint to bulk create subscription plans.
    Access: Admin only
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Admin check
        user_email = request.user.email if hasattr(request.user, 'email') else None
        if not AdminUser.objects.filter(email=user_email).exists():
            return Response(
                {'error': 'Unauthorized', 'message': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        plans_data = request.data.get('plans', [])
        if not plans_data:
            return Response(
                {'error': 'No plans data provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SubscriptionPlanSerializer(data=plans_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': f'{len(plans_data)} subscription plans created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)