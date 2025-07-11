# backend/app/views.py

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import io
import zipfile

from .huffman_logic import calcular_estadisticas_huffman
from .shannon_fano_logic import calcular_estadisticas_shannon_fano

@csrf_exempt
def process_text_or_file(request):
    """
    Este endpoint procesa un texto o un archivo .txt subido.
    Recibe una petición POST con un archivo (multipart/form-data) o un JSON con texto.
    Devuelve las estadísticas de compresión para Huffman y Shannon-Fano.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido. Solo se aceptan peticiones POST."}, status=405)

    file_content = None
    file_name = "texto_ingresado"

    # Opción 1: El usuario sube un archivo .txt
    if request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        if not uploaded_file.name.endswith('.txt'):
            return JsonResponse({"error": "Tipo de archivo no permitido. Solo se aceptan .txt"}, status=400)
        
        file_content = uploaded_file.read().decode('utf-8')
        file_name = uploaded_file.name

    # Opción 2: El usuario pega texto en un área de texto (enviado como JSON)
    else:
        try:
            data = json.loads(request.body)
            file_content = data.get('text')
        except (json.JSONDecodeError, AttributeError):
            return JsonResponse({"error": "Cuerpo de la petición POST inválido. Se esperaba un JSON con 'text' o un archivo."}, status=400)

    if not file_content:
        return JsonResponse({"error": "No se proporcionó texto ni un archivo válido."}, status=400)

    # Procesar el contenido con ambos algoritmos
    try:
        huffman_results = calcular_estadisticas_huffman(file_content)
        shannon_fano_results = calcular_estadisticas_shannon_fano(file_content)
        
        # Construir una respuesta unificada
        response_data = {
            "fileName": file_name,
            "huffman": huffman_results.get("estadisticas_huffman", {}),
            "shannonFano": shannon_fano_results
        }
        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({'error': f'Ocurrió un error durante el procesamiento: {str(e)}'}, status=500)


def compress_and_download(request):
    """
    Este endpoint recibe los bits comprimidos de ambos algoritmos y crea un archivo .zip para descargar.
    Recibe una petición POST con un JSON que contiene los bits y el nombre del archivo.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Esta vista solo acepta peticiones POST.'}, status=405)

    try:
        data = json.loads(request.body)
        huffman_bits = data.get('huffmanBits')
        shannon_fano_bits = data.get('shannonFanoBits')
        # Usamos el nombre original del archivo, quitando la extensión .txt
        original_file_name = data.get('fileName', 'comprimido').replace('.txt', '')

        if huffman_bits is None or shannon_fano_bits is None:
            return JsonResponse({'error': 'Faltan datos de bits para la compresión.'}, status=400)

        # Crear un archivo ZIP en memoria
        in_memory_zip = io.BytesIO()
        with zipfile.ZipFile(in_memory_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
            # Agregar el archivo de Huffman
            zf.writestr(f'{original_file_name}_huffman.txt', huffman_bits)
            # Agregar el archivo de Shannon-Fano
            zf.writestr(f'{original_file_name}_shannon_fano.txt', shannon_fano_bits)

        # Preparar la respuesta para descargar el archivo ZIP
        response = HttpResponse(in_memory_zip.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{original_file_name}_comprimido.zip"'
        
        return response

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Cuerpo de la solicitud JSON inválido.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Ocurrió un error al crear el ZIP: {str(e)}'}, status=500)