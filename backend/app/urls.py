# backend/app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Apunta a la función 'api_de_compresion' que está en views.py
    path('api/compress/', views.api_de_compresion, name='api_de_compresion'),
]
