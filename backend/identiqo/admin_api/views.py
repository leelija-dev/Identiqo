from django.contrib.auth.hashers import check_password
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from web_api.models import Users

from .models import (
    AdminUser,
    AuditLog,
    BlogPost,
    CardTemplate,
    ContactSubmission,
    Organization,
    PlatformSetting,
    Subscription,
    SubscriptionPayment,
    SubscriptionPlan,
)
from .serializers import SubscriptionPlanSerializer
from .utils import log_admin_action


# ==================== REST API VIEWS (CLASS-BASED) ====================

class LoginAPIView(APIView):
    """POST /api/admin/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            admin = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not admin.status:
            return Response(
                {'error': 'Account is inactive'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not check_password(password, admin.password):
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create session for API access
        request.session['admin_id'] = admin.id
        request.session.set_expiry(60 * 60 * 12)
        
        log_admin_action(request, 'login', 'AdminUser', admin.id)
        
        return Response({
            'message': 'Login successful',
            'data': {
                'id': admin.id,
                'email': admin.email,
                'full_name': admin.full_name,
                'phone': admin.phone,
                'status': admin.status
            }
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    """POST /api/admin/logout/"""
    
    def post(self, request):
        if request.session.get('admin_id'):
            log_admin_action(request, 'logout', 'AdminUser', request.session.get('admin_id'))
        request.session.flush()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class SubscriptionPlanListAPIView(generics.ListAPIView):
    """GET /api/admin/plans/"""
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]


class SubscriptionPlanCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/plans/create/"""
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'Subscription plan created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class SubscriptionPlanDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT, PATCH, DELETE /api/admin/plans/<id>/"""
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Subscription plan updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Subscription plan deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


class UserListAPIView(generics.ListAPIView):
    """GET /api/admin/users/"""
    queryset = Users.objects.all().order_by('-created_at')
    serializer_class = None  # Add UserSerializer if needed
    permission_classes = [AllowAny]


class UserCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/users/create/"""
    queryset = Users.objects.all()
    serializer_class = None  # Add UserSerializer if needed
    permission_classes = [AllowAny]


class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT, PATCH, DELETE /api/admin/users/<id>/"""
    queryset = Users.objects.all()
    serializer_class = None  # Add UserSerializer if needed
    permission_classes = [AllowAny]
    lookup_field = 'id'


class OrganizationListAPIView(generics.ListAPIView):
    """GET /api/admin/organizations/"""
    queryset = Organization.objects.select_related('owner').order_by('-created_at')
    serializer_class = None  # Add OrganizationSerializer if needed
    permission_classes = [AllowAny]


class OrganizationCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/organizations/create/"""
    queryset = Organization.objects.all()
    serializer_class = None  # Add OrganizationSerializer if needed
    permission_classes = [AllowAny]


class OrganizationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT, PATCH, DELETE /api/admin/organizations/<id>/"""
    queryset = Organization.objects.all()
    serializer_class = None  # Add OrganizationSerializer if needed
    permission_classes = [AllowAny]
    lookup_field = 'id'


class TemplateListAPIView(generics.ListAPIView):
    """GET /api/admin/templates/"""
    queryset = CardTemplate.objects.all()
    serializer_class = None  # Add CardTemplateSerializer if needed
    permission_classes = [AllowAny]


class TemplateCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/templates/create/"""
    queryset = CardTemplate.objects.all()
    serializer_class = None  # Add CardTemplateSerializer if needed
    permission_classes = [AllowAny]


class TemplateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT, PATCH, DELETE /api/admin/templates/<id>/"""
    queryset = CardTemplate.objects.all()
    serializer_class = None  # Add CardTemplateSerializer if needed
    permission_classes = [AllowAny]
    lookup_field = 'id'


class SubscriptionListAPIView(generics.ListAPIView):
    """GET /api/admin/subscriptions/"""
    queryset = Subscription.objects.select_related('user', 'plan', 'organization').order_by('-created_at')
    serializer_class = None  # Add SubscriptionSerializer if needed
    permission_classes = [AllowAny]


class PaymentListAPIView(generics.ListAPIView):
    """GET /api/admin/payments/"""
    queryset = SubscriptionPayment.objects.select_related('subscription__user', 'subscription__plan').order_by('-created_at')
    serializer_class = None  # Add PaymentSerializer if needed
    permission_classes = [AllowAny]


class ContactListAPIView(generics.ListAPIView):
    """GET /api/admin/contact/"""
    queryset = ContactSubmission.objects.all()
    serializer_class = None  # Add ContactSerializer if needed
    permission_classes = [AllowAny]


class ContactDetailAPIView(generics.RetrieveUpdateAPIView):
    """GET, PUT, PATCH /api/admin/contact/<id>/"""
    queryset = ContactSubmission.objects.all()
    serializer_class = None  # Add ContactSerializer if needed
    permission_classes = [AllowAny]
    lookup_field = 'id'


class BlogListAPIView(generics.ListAPIView):
    """GET /api/admin/blog/"""
    queryset = BlogPost.objects.all()
    serializer_class = None  # Add BlogPostSerializer if needed
    permission_classes = [AllowAny]


class BlogCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/blog/create/"""
    queryset = BlogPost.objects.all()
    serializer_class = None  # Add BlogPostSerializer if needed
    permission_classes = [AllowAny]


class BlogDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT, PATCH, DELETE /api/admin/blog/<id>/"""
    queryset = BlogPost.objects.all()
    serializer_class = None  # Add BlogPostSerializer if needed
    permission_classes = [AllowAny]
    lookup_field = 'id'


class AuditListAPIView(generics.ListAPIView):
    """GET /api/admin/audit/"""
    queryset = AuditLog.objects.select_related('admin').order_by('-created_at')
    serializer_class = None  # Add AuditLogSerializer if needed
    permission_classes = [AllowAny]


class AdminListAPIView(generics.ListAPIView):
    """GET /api/admin/admins/"""
    queryset = AdminUser.objects.order_by('-created_at')
    serializer_class = None  # Add AdminUserSerializer if needed
    permission_classes = [AllowAny]


class AdminCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/admins/create/"""
    queryset = AdminUser.objects.all()
    serializer_class = None  # Add AdminUserSerializer if needed
    permission_classes = [AllowAny]


class SettingsListAPIView(generics.ListAPIView):
    """GET /api/admin/settings/"""
    queryset = PlatformSetting.objects.all()
    serializer_class = None  # Add PlatformSettingSerializer if needed
    permission_classes = [AllowAny]


class SettingsCreateAPIView(generics.CreateAPIView):
    """POST /api/admin/settings/create/"""
    queryset = PlatformSetting.objects.all()
    serializer_class = None  # Add PlatformSettingSerializer if needed
    permission_classes = [AllowAny]
