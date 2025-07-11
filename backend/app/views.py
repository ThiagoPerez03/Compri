from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import io
import zipfile

from .huffman_logic import calcular_estadisticas_huffman
from .shannon_fano_logic import calcular_estadisticas_shannon_fano

@csrf_exempt
def api_de_compresion(peticion):
    # --- Lógica para la Descarga (ahora vía POST) ---
    if peticion.method == 'POST' and peticion.GET.get('download') == 'true':
        try:
            datos = json.loads(peticion.body)
            texto_original = datos.get('text')
            algoritmo = datos.get('algorithm', 'huffman')

            if not texto_original:
                return JsonResponse({"error": "Texto original no proporcionado para la descarga."}, status=400)

            # Volver a calcular las estadísticas para generar el archivo
            resultados = calcular_estadisticas_huffman(texto_original) if algoritmo == 'huffman' else calcular_estadisticas_shannon_fano(texto_original)
            stats = resultados.get("estadisticas_huffman") if algoritmo == 'huffman' else resultados

            if not stats or stats.get("error"):
                return JsonResponse({"error": "No se pudieron generar los datos para el archivo."}, status=500)

            tabla_codigos = {item['caracter'].replace("' '", " "): item['codigo'] for item in stats.get("tabla_codigos", [])}
            cadena_bits = stats.get("cadena_bits_codificada")
            
            contenido_zip = json.dumps({"codigos": tabla_codigos, "mensaje_comprimido": cadena_bits})
            
            buffer = io.BytesIO()
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                zf.writestr(f'comprimido_{algoritmo}.json', contenido_zip)
            buffer.seek(0)
            
            response = HttpResponse(buffer.read(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="comprimido_{algoritmo}.zip"'
            return response
        except Exception as e:
            return JsonResponse({'error': f'Error al generar la descarga: {str(e)}'}, status=500)

    # --- Lógica para la Compresión (subida de texto o archivo) ---
    elif peticion.method == 'POST':
        datos_de_entrada = None
        
        # Primero, revisa si se envió un archivo
        if peticion.FILES.get('file'):
            archivo_subido = peticion.FILES.get('file')
            if archivo_subido.name.endswith('.txt'):
                datos_de_entrada = archivo_subido.read().decode('utf-8')
            else:
                return JsonResponse({"error": "Tipo de archivo no permitido."}, status=400)
        # Si no, revisa si se envió texto JSON
        else:
            try:
                datos = json.loads(peticion.body)
                datos_de_entrada = datos.get('text')
            except (json.JSONDecodeError, AttributeError):
                return JsonResponse({"error": "Petición POST inválida."}, status=400)

        if not datos_de_entrada:
            return JsonResponse({"error": "No se proporcionó texto ni archivo."}, status=400)

        resultados_huffman = calcular_estadisticas_huffman(datos_de_entrada)
        resultados_shannon = calcular_estadisticas_shannon_fano(datos_de_entrada)
        
        datos_respuesta = {
            "mensaje_original": datos_de_entrada,
            "algoritmos": {
                "huffman": resultados_huffman.get("estadisticas_huffman"),
                "shannon_fano": resultados_shannon
            }
        }
        return JsonResponse(datos_respuesta)

    return JsonResponse({"error": "Método no permitido."}, status=405)


@csrf_exempt
def api_de_descompresion(peticion):
    if peticion.method == 'POST':
        archivo_zip = peticion.FILES.get('file')
        if not archivo_zip:
            return JsonResponse({"error": "No se subió ningún archivo .zip."}, status=400)
        
        try:
            with zipfile.ZipFile(archivo_zip, 'r') as zf:
                nombre_archivo_interno = zf.namelist()[0]
                datos_comprimidos = json.loads(zf.read(nombre_archivo_interno))
            
            codigos = datos_comprimidos.get("codigos")
            mensaje_comprimido = datos_comprimidos.get("mensaje_comprimido")

            if not codigos or mensaje_comprimido is None:
                raise ValueError("Formato de archivo comprimido incorrecto.")

            mapa_inverso = {v: k for k, v in codigos.items()}
            mensaje_decodificado = ""
            codigo_actual = ""
            for bit in mensaje_comprimido:
                codigo_actual += bit
                if codigo_actual in mapa_inverso:
                    mensaje_decodificado += mapa_inverso[codigo_actual]
                    codigo_actual = ""
            
            return JsonResponse({"mensaje_decodificado": mensaje_decodificado})

        except Exception:
            return JsonResponse({"error": "El archivo es inválido o no se pudo procesar."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)