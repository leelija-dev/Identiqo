from django.urls import path

from . import dashboard_views as views

app_name = 'super_admin'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.dashboard_home, name='dashboard'),

    path('users/', views.users_list, name='users_list'),
    path('users/add/', views.user_create, name='user_create'),
    path('users/<int:pk>/edit/', views.user_edit, name='user_edit'),
    path('users/<int:pk>/delete/', views.user_delete, name='user_delete'),

    path('organizations/', views.organizations_list, name='organizations_list'),
    path('organizations/add/', views.organization_create, name='organization_create'),
    path('organizations/<int:pk>/edit/', views.organization_edit, name='organization_edit'),

    path('templates/', views.templates_list, name='templates_list'),
    path('templates/add/', views.template_create, name='template_create'),
    path('templates/<int:pk>/edit/', views.template_edit, name='template_edit'),
    path('templates/<int:pk>/delete/', views.template_delete, name='template_delete'),

    path('plans/', views.plans_list, name='plans_list'),
    path('plans/add/', views.plan_create, name='plan_create'),
    path('plans/<int:pk>/edit/', views.plan_edit, name='plan_edit'),

    path('subscriptions/', views.subscriptions_list, name='subscriptions_list'),
    path('payments/', views.payments_list, name='payments_list'),

    path('contact/', views.contact_list, name='contact_list'),
    path('contact/<int:pk>/', views.contact_detail, name='contact_detail'),

    path('blog/', views.blog_list, name='blog_list'),
    path('blog/add/', views.blog_create, name='blog_create'),
    path('blog/<int:pk>/edit/', views.blog_edit, name='blog_edit'),
    path('blog/<int:pk>/delete/', views.blog_delete, name='blog_delete'),

    path('audit/', views.audit_list, name='audit_list'),

    path('admins/', views.admins_list, name='admins_list'),
    path('admins/add/', views.admin_create, name='admin_create'),

    path('settings/', views.settings_list, name='settings_list'),
    path('settings/add/', views.setting_create, name='setting_create'),
    path('settings/maintenance/', views.toggle_maintenance, name='toggle_maintenance'),
]
