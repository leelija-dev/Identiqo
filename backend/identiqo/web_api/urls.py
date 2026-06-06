from django.urls import path
from . import views

urlpatterns = [
    # Subscription Plan URLs
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/profile/', views.UserProfileView.as_view(), name='profile'),
    path('api/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('api/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('api/delete-account/', views.DeleteAccountView.as_view(), name='delete-account'),

    path('api/subscription-plans/', views.SubscriptionPlanListView.as_view(), name='subscription-plan-list'),
    path('api/subscription-plans/create/', views.SubscriptionPlanCreateView.as_view(), name='subscription-plan-create'),
    path('api/subscription-plans/<int:id>/', views.SubscriptionPlanDetailView.as_view(), name='subscription-plan-detail'),
    path('api/subscription-plans/bulk-create/', views.SubscriptionPlanBulkCreateView.as_view(), name='subscription-plan-bulk-create'),
    
    # Add more URLs as needed...
]