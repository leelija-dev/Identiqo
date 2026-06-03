from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.admin_register, name='admin_register'),
    path('login/', views.admin_login, name='admin_login'),
] 