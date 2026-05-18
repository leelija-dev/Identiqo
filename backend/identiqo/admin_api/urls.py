from django.urls import path, include
from . import views

urlpatterns = [
    path('register/', views.admin_register, name='admin_register'),
]