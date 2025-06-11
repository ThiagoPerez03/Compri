# backend/app/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# Asegúrate de que los nombres de las funciones importadas coincidan con los de tus archivos de lógica
from .huffman_logic import calcular_estadisticas_huffman 
from .shannon_fano_logic import calcular_estadisticas_shannon_fano

@csrf_exempt
def api_de_compresion(peticion):
    if peticion.method == 'POST':
        # inicialización de variables
        texto_a_comprimir = None
        contenido_archivo = None
        
        # intenta leer texto directo desde un JSON
        try:
            if peticion.body and 'application/json' in peticion.content_type:
                datos = json.loads(peticion.body)
                texto_a_comprimir = datos.get('text')
        except json.JSONDecodeError:
            pass # si no es JSON, no hay problema, sigue adelante
        
        # si no se encontró texto en el JSON, busca en los datos de formulario
        if not texto_a_comprimir:
            texto_a_comprimir = peticion.POST.get('text')

        # revisa si se subió un archivo
        archivo_subido = peticion.FILES.get('file')
        if archivo_subido:
            if archivo_subido.name.endswith('.txt'):
                try:
                    # lee el contenido del archivo y lo convierte a texto
                    contenido_archivo = archivo_subido.read().decode('utf-8')
                except Exception as e:
                    return JsonResponse({"error": f"Error al leer el archivo: {str(e)}"}, status=500)
            else:
                return JsonResponse({"error": "Tipo de archivo no permitido. Solo se aceptan .txt."}, status=400)
        
        # decide qué texto usar, dando prioridad al archivo si existe
        datos_de_entrada = contenido_archivo if contenido_archivo else texto_a_comprimir

        # valida que tengamos datos para procesar
        if not datos_de_entrada:
            return JsonResponse({"error": "No se proporcionó texto ni archivo para comprimir."}, status=400)

        # llama a la lógica de AMBOS algoritmos
        resultados_huffman = calcular_estadisticas_huffman(datos_de_entrada)
        resultados_shannon_fano = calcular_estadisticas_shannon_fano(datos_de_entrada)

        # verifica si alguno de los algoritmos devolvió un error
        if resultados_huffman.get("error") or resultados_shannon_fano.get("error"):
            return JsonResponse({
                "error": "Ocurrió un error durante la compresión.",
                "error_huffman": resultados_huffman.get("error"),
                "error_shannon_fano": resultados_shannon_fano.get("error"),
            }, status=400)

        # construye la respuesta JSON combinada
        datos_respuesta = {
            "mensaje_original": datos_de_entrada,
            "longitud_original_bits": len(datos_de_entrada) * 7,
            "algoritmos": {
                "huffman": resultados_huffman.get("estadisticas_huffman"),
                "shannon_fano": resultados_shannon_fano # La función de SF ya devuelve la estructura correcta
            }
        }
        
        return JsonResponse(datos_respuesta)

    return JsonResponse({"error": "Método no permitido. Usar POST."}, status=405)
