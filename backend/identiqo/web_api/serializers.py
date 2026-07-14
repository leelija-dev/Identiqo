import re
import uuid

from rest_framework import serializers

from admin_api.models import SubscriptionPlan, Organization,CardTemplate
from .models import Users


def validate_password_strength(value):
    if len(value) < 8:
        raise serializers.ValidationError('Password must be at least 8 characters long.')

    if not re.search(r'[A-Z]', value):
        raise serializers.ValidationError('Password must contain at least one uppercase letter.')

    if not re.search(r'[a-z]', value):
        raise serializers.ValidationError('Password must contain at least one lowercase letter.')

    if not re.search(r'\d', value):
        raise serializers.ValidationError('Password must contain at least one number.')

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        raise serializers.ValidationError('Password must contain at least one special character.')

    return value


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    organization_slug = serializers.CharField(write_only=True, required=False, allow_blank=True)
    plan_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Users
        fields = [
            'id', 'user_type', 'name', 'email', 'phone', 'address',
            'password', 'confirm_password', 'organization_name', 'organization_slug',
            'plan_code', 'created_at', 'updated_at',
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'address': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'name': {'required': True},
            'user_type': {'required': True},
        }

    def validate_email(self, value):
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        normalized = value.lower()
        if not re.match(email_regex, normalized):
            raise serializers.ValidationError('Invalid email format.')
        if Users.objects.filter(email=normalized).exists():
            raise serializers.ValidationError('Email already registered.')
        return normalized

    def validate_password(self, value):
        return validate_password_strength(value)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        # Validate plan_code if provided
        plan_code = data.get('plan_code')
        if plan_code:
            # Validate that the plan exists and is active
            try:
                plan = SubscriptionPlan.objects.get(code=plan_code, is_active=True)
            except SubscriptionPlan.DoesNotExist:
                raise serializers.ValidationError({'plan_code': 'Invalid plan selected.'})

        # If user type is organization, validate organization fields
        if data.get('user_type') == 'organization':
            if not data.get('organization_name'):
                raise serializers.ValidationError({'organization_name': 'Organization name is required for organization accounts.'})
            if not data.get('organization_slug'):
                raise serializers.ValidationError({'organization_slug': 'Organization slug is required for organization accounts.'})

            # Check if organization slug already exists
            if Organization.objects.filter(slug=data['organization_slug']).exists():
                raise serializers.ValidationError({'organization_slug': 'Organization with this slug already exists.'})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        organization_name = validated_data.pop('organization_name', None)
        organization_slug = validated_data.pop('organization_slug', None)
        plan_code = validated_data.pop('plan_code', None)

        # Create user
        user = Users.objects.create_user(password=password, **validated_data)

        organization = None
        # If organization user, create organization
        if user.user_type == 'organization' and organization_name and organization_slug:
            organization = Organization.objects.create(
                name=organization_name,
                slug=organization_slug,
                owner=user,
                plan_tier='free',
                employee_id_limit=60,
            )

        # Create subscription
        from datetime import datetime, timedelta
        from admin_api.models import Subscription

        # If no plan_code provided, assign free plan
        if not plan_code:
            try:
                plan = SubscriptionPlan.objects.get(code='free', is_active=True)
            except SubscriptionPlan.DoesNotExist:
                # Fallback: create a free plan if it doesn't exist
                plan = SubscriptionPlan.objects.create(
                    name='Free',
                    code='free',
                    plan_type='personal',
                    price=0,
                    currency='USD',
                    duration_days=3650,  # 10 years (effectively forever)
                    description='Free plan with basic features',
                    features={'items': ['Basic ID cards', 'Limited templates']},
                    is_active=True,
                )
        else:
            plan = SubscriptionPlan.objects.get(code=plan_code, is_active=True)

        start_date = datetime.now()
        end_date = start_date + timedelta(days=plan.duration_days)

        subscription = Subscription.objects.create(
            user=user,
            organization=organization,
            plan=plan,
            status='active',
            start_date=start_date,
            end_date=end_date,
        )

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, data):
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password.')

        # Check if user has an active subscription
        from admin_api.models import Subscription
        active_subscription = Subscription.objects.filter(
            user=user,
            status='active'
        ).first()
        
        if not active_subscription:
            raise serializers.ValidationError('No active subscription found. Please select a plan to continue.')

        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'user_type', 'name', 'email', 'phone', 'address', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'user_type', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'user_type', 'name', 'email', 'phone', 'address', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

    def validate_new_password(self, value):
        return validate_password_strength(value)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError(
                {'confirm_new_password': 'New passwords do not match.'}
            )
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password must be different from the old password.'}
            )
        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        normalized = value.lower().strip()
        try:
            user = Users.objects.get(email=normalized)
        except Users.DoesNotExist:
            raise serializers.ValidationError('No user found with this email address.')
        self.context['user'] = user
        return normalized


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        return validate_password_strength(value)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Passwords do not match.'})
        return data

    def save(self):
        email = self.validated_data['email'].lower().strip()
        user = Users.objects.get(email=email)
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_code(self, value):
        if self.instance is None and SubscriptionPlan.objects.filter(code=value).exists():
            raise serializers.ValidationError(f"Plan with code '{value}' already exists.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero.')
        return value

    def validate_duration_days(self, value):
        if value <= 0:
            raise serializers.ValidationError('Duration days must be greater than zero.')
        return value
from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = "__all__"
        read_only_fields = (
            "employee_id",
            "created_at",
            "updated_at",
        )
class CardTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardTemplate
        fields = "__all__"