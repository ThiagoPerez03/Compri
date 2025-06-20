from django.urls import path
from . import views

urlpatterns = [
    # Se añade 'api/' para que la ruta completa sea /app/api/compress/
    path('api/compress/', views.api_de_compresion, name='api_de_compresion'),
    
    # Se añade 'api/' para que la ruta completa sea /app/api/decompress/
    path('api/decompress/', views.api_de_descompresion, name='api_de_descompresion'),
]
