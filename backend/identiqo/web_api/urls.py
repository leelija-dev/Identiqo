from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/profile/', views.UserProfileView.as_view(), name='profile'),
    path('api/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('api/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('api/delete-account/', views.DeleteAccountView.as_view(), name='delete-account'),

    # Public subscription plan list (read-only)
    path('api/subscription-plans/', views.SubscriptionPlanListView.as_view(), name='subscription-plan-list'),
    
    # Employee 
    path("api/all-employees/<int:user_id>/", views.EmployeeListView.as_view(), name="all-employees"),
    path('api/create-employee/', views.EmployeeCreateView.as_view(), name='employee-create'),  
    path('api/employee/<int:id>/', views.EmployeeDetailView.as_view(), name='employee-detail'),
    
]