from django.urls import path
from . import views

urlpatterns = [
    path('compress/', views.api_de_compresion, name='api_de_compresion'),
    path('decompress/', views.api_de_descompresion, name='api_de_descompresion'),
]