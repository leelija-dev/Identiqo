from rest_framework import serializers
from .models import AdminUser
from django.contrib.auth.hashers import make_password, check_password
from .models import SubscriptionPlan


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'email', 'password', 'full_name', 'phone', 'status', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class AdminRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = AdminUser
        fields = ['email', 'password', 'confirm_password', 'full_name', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class SubscriptionPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
