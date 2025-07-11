# backend/app/urls.py

from django.urls import path
# Asegúrate de que los nombres aquí coincidan con los de views.py
from .views import process_text_or_file, compress_and_download

urlpatterns = [
    # URL para procesar archivos o texto
    path('api/process-file/', process_text_or_file, name='process_file'),
    
    # URL para descargar el ZIP
    path('compress/', compress_and_download, name='compress_and_download'),
]