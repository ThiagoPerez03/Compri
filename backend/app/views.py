from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import io
import zipfile

from .huffman_logic import calcular_estadisticas_huffman
from .shannon_fano_logic import calcular_estadisticas_shannon_fano

@csrf_exempt
def api_de_compresion(peticion):
    if peticion.method == 'GET' and peticion.GET.get('download') == 'true':
        texto_original = peticion.GET.get('original_text')
        algoritmo = peticion.GET.get('algorithm', 'huffman')
        
        if not texto_original:
            return JsonResponse({"error": "Texto original no proporcionado."}, status=400)

        resultados = calcular_estadisticas_huffman(texto_original) if algoritmo == 'huffman' else calcular_estadisticas_shannon_fano(texto_original)
        stats = resultados.get("estadisticas_huffman") if algoritmo == 'huffman' else resultados

        if not stats or stats.get("error"):
            return JsonResponse({"error": "No se pudieron generar los datos de compresión."}, status=500)

        tabla_codigos = {item['caracter'].replace("' '", " "): item['codigo'] for item in stats.get("tabla_codigos", [])}
        cadena_bits = stats.get("cadena_bits_codificada")

        contenido_json = json.dumps({"codigos": tabla_codigos, "mensaje_comprimido": cadena_bits})
        
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(f'comprimido_{algoritmo}.json', contenido_json)
        buffer.seek(0)

        response = HttpResponse(buffer.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="comprimido_{algoritmo}.zip"'
        return response

    elif peticion.method == 'POST':
        datos_de_entrada = None
        
        if peticion.FILES.get('file'):
            archivo_subido = peticion.FILES.get('file')
            if archivo_subido.name.endswith('.txt'):
                datos_de_entrada = archivo_subido.read().decode('utf-8')
            else:
                return JsonResponse({"error": "Tipo de archivo no permitido."}, status=400)
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

def compress_and_download(request):
    if request.method == 'POST':
        try:
            # Lee los datos del cuerpo de la solicitud POST
            data = json.loads(request.body)
            huffman_bits = data.get('huffmanBits')
            shannon_fano_bits = data.get('shannonFanoBits')
            file_name = data.get('fileName', 'comprimido')

            if huffman_bits is None or shannon_fano_bits is None:
                return JsonResponse({'error': 'Faltan datos de bits para la compresión.'}, status=400)

            # Crea un archivo ZIP en memoria
            in_memory_zip = io.BytesIO()
            with zipfile.ZipFile(in_memory_zip, 'w') as zf:
                # Agrega el archivo de Huffman
                zf.writestr('huffman_compressed.txt', huffman_bits)
                # Agrega el archivo de Shannon-Fano
                zf.writestr('shannon_fano_compressed.txt', shannon_fano_bits)

            # Prepara la respuesta para descargar el archivo ZIP
            response = HttpResponse(in_memory_zip.getvalue(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="{file_name}.zip"'
            
            return response

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Cuerpo de la solicitud JSON inválido.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Esta vista solo acepta peticiones POST.'}, status=405)