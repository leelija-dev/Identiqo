from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.admin_register, name='admin_register'),
    path('login/', views.admin_login, name='admin_login'),
    path('subscription/add/', views.add_subscription_plan, name='add_subscription_plan'),
    path('subscriptions/', views.subscription_plan_list, name='subscription_plan_list'),
] 