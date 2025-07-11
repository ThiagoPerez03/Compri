# backend/app/urls.py

from django.urls import path
from .views import compress_and_download, process_file_view # Importa la nueva vista

urlpatterns = [
    # Las URLs antiguas ya no las necesitarás desde el frontend para procesar el texto inicial
    # path('huffman/', huffman_view, name='huffman'),
    # path('shannon_fano/', shannon_fano_view, name='shannon_fano'),
    
    # NUEVA URL para subir y procesar el archivo
    path('api/process-file/', process_file_view, name='process_file'),
    
    # La URL de descarga se mantiene igual
    path('compress/', compress_and_download, name='compress_and_download'),
]