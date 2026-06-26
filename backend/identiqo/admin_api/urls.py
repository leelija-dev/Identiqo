from django.urls import path

from . import dashboard_views, views

app_name = 'super_admin'

urlpatterns = [
    # HTML Dashboard Views (Class-Based) - from dashboard_views.py
    path('login/', dashboard_views.LoginView.as_view(), name='login'),
    path('logout/', dashboard_views.LogoutView.as_view(), name='logout'),
    path('', dashboard_views.DashboardView.as_view(), name='dashboard'),

    path('users/', dashboard_views.UserListView.as_view(), name='users_list'),
    path('users/add/', dashboard_views.UserCreateView.as_view(), name='user_create'),
    path('users/<int:pk>/edit/', dashboard_views.UserUpdateView.as_view(), name='user_edit'),
    path('users/<int:pk>/delete/', dashboard_views.UserDeleteView.as_view(), name='user_delete'),

    path('organizations/', dashboard_views.OrganizationListView.as_view(), name='organizations_list'),
    path('organizations/add/', dashboard_views.OrganizationCreateView.as_view(), name='organization_create'),
    path('organizations/<int:pk>/edit/', dashboard_views.OrganizationUpdateView.as_view(), name='organization_edit'),

    path('templates/', dashboard_views.TemplateListView.as_view(), name='templates_list'),
    path('templates/add/', dashboard_views.TemplateCreateView.as_view(), name='template_create'),
    path('templates/<int:pk>/edit/', dashboard_views.TemplateUpdateView.as_view(), name='template_edit'),
    path('templates/<int:pk>/delete/', dashboard_views.TemplateDeleteView.as_view(), name='template_delete'),

    path('plans/', dashboard_views.PlanListView.as_view(), name='plans_list'),
    path('plans/add/', dashboard_views.PlanCreateView.as_view(), name='plan_create'),
    path('plans/<int:pk>/edit/', dashboard_views.PlanUpdateView.as_view(), name='plan_edit'),
    path('plans/<int:pk>/delete/', dashboard_views.PlanDeleteView.as_view(), name='plan_delete'),

    path('subscriptions/', dashboard_views.SubscriptionListView.as_view(), name='subscriptions_list'),
    path('payments/', dashboard_views.PaymentListView.as_view(), name='payments_list'),

    path('contact/', dashboard_views.ContactListView.as_view(), name='contact_list'),
    path('contact/<int:pk>/', dashboard_views.ContactDetailView.as_view(), name='contact_detail'),

    path('blog/', dashboard_views.BlogListView.as_view(), name='blog_list'),
    path('blog/add/', dashboard_views.BlogCreateView.as_view(), name='blog_create'),
    path('blog/<int:pk>/edit/', dashboard_views.BlogUpdateView.as_view(), name='blog_edit'),
    path('blog/<int:pk>/delete/', dashboard_views.BlogDeleteView.as_view(), name='blog_delete'),

    path('audit/', dashboard_views.AuditListView.as_view(), name='audit_list'),

    path('admins/', dashboard_views.AdminListView.as_view(), name='admins_list'),
    path('admins/add/', dashboard_views.AdminCreateView.as_view(), name='admin_create'),

    path('settings/', dashboard_views.SettingsListView.as_view(), name='settings_list'),
    path('settings/add/', dashboard_views.SettingCreateView.as_view(), name='setting_create'),
    path('settings/maintenance/', dashboard_views.ToggleMaintenanceView.as_view(), name='toggle_maintenance'),

    # REST API Views (for programmatic access) - from views.py
    path('api/login/', views.LoginAPIView.as_view(), name='api_login'),
    path('api/logout/', views.LogoutAPIView.as_view(), name='api_logout'),
    path('api/plans/', views.SubscriptionPlanListAPIView.as_view(), name='api_plans_list'),
    path('api/plans/create/', views.SubscriptionPlanCreateAPIView.as_view(), name='api_plans_create'),
    path('api/plans/<int:id>/', views.SubscriptionPlanDetailAPIView.as_view(), name='api_plans_detail'),
    
    path('api/users/', views.UserListAPIView.as_view(), name='api_users_list'),
    path('api/users/create/', views.UserCreateAPIView.as_view(), name='api_users_create'),
    path('api/users/<int:id>/', views.UserDetailAPIView.as_view(), name='api_users_detail'),
    
    path('api/organizations/', views.OrganizationListAPIView.as_view(), name='api_organizations_list'),
    path('api/organizations/create/', views.OrganizationCreateAPIView.as_view(), name='api_organizations_create'),
    path('api/organizations/<int:id>/', views.OrganizationDetailAPIView.as_view(), name='api_organizations_detail'),
    
    path('api/templates/', views.TemplateListAPIView.as_view(), name='api_templates_list'),
    path('api/templates/create/', views.TemplateCreateAPIView.as_view(), name='api_templates_create'),
    path('api/templates/<int:id>/', views.TemplateDetailAPIView.as_view(), name='api_templates_detail'),
    
    path('api/subscriptions/', views.SubscriptionListAPIView.as_view(), name='api_subscriptions_list'),
    path('api/payments/', views.PaymentListAPIView.as_view(), name='api_payments_list'),
    
    path('api/contact/', views.ContactListAPIView.as_view(), name='api_contact_list'),
    path('api/contact/<int:id>/', views.ContactDetailAPIView.as_view(), name='api_contact_detail'),
    
    path('api/blog/', views.BlogListAPIView.as_view(), name='api_blog_list'),
    path('api/blog/create/', views.BlogCreateAPIView.as_view(), name='api_blog_create'),
    path('api/blog/<int:id>/', views.BlogDetailAPIView.as_view(), name='api_blog_detail'),
    
    path('api/audit/', views.AuditListAPIView.as_view(), name='api_audit_list'),
    
    path('api/admins/', views.AdminListAPIView.as_view(), name='api_admins_list'),
    path('api/admins/create/', views.AdminCreateAPIView.as_view(), name='api_admins_create'),
    
    path('api/settings/', views.SettingsListAPIView.as_view(), name='api_settings_list'),
    path('api/settings/create/', views.SettingsCreateAPIView.as_view(), name='api_settings_create'),
] 