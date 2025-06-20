from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import io
import zipfile

# Asegúrate que los nombres de las funciones importadas coincidan
from .huffman_logic import calcular_estadisticas_huffman
from .shannon_fano_logic import calcular_estadisticas_shannon_fano

@csrf_exempt
def api_de_compresion(peticion):
    # --- Lógica para la Descarga (GET) ---
    if peticion.method == 'GET' and peticion.GET.get('download') == 'true':
        texto_original_para_descarga = peticion.GET.get('original_text')
        algoritmo_descarga = peticion.GET.get('algorithm', 'huffman')

        if not texto_original_para_descarga:
            return JsonResponse({"error": "No se proporcionó texto original para la descarga."}, status=400)

        # Volvemos a calcular las estadísticas para obtener los datos de compresión
        resultados = None
        if algoritmo_descarga == 'huffman':
            resultados = calcular_estadisticas_huffman(texto_original_para_descarga).get("estadisticas_huffman", {})
        elif algoritmo_descarga == 'shannon_fano':
            resultados = calcular_estadisticas_shannon_fano(texto_original_para_descarga)
        
        if not resultados or resultados.get("error"):
             return JsonResponse({"error": "No se pudieron generar los datos de compresión para la descarga."}, status=500)

        # Extraemos la tabla de códigos y el bitstring
        tabla_codigos = {item['caracter'].replace("' '", " "): item['codigo'] for item in resultados.get("tabla_codigos", [])}
        cadena_bits_codificada = resultados.get("cadena_bits_codificada")

        if not tabla_codigos or cadena_bits_codificada is None:
            return JsonResponse({"error": "Datos de compresión inválidos para generar el archivo."}, status=500)
        
        # Preparamos el contenido del archivo comprimido
        contenido_json = json.dumps({"codigos": tabla_codigos, "mensaje_comprimido": cadena_bits_codificada})
        
        # Creamos un archivo ZIP en memoria
        buffer_memoria = io.BytesIO()
        with zipfile.ZipFile(buffer_memoria, 'w', zipfile.ZIP_DEFLATED) as zf:
            nombre_archivo_interno = f'comprimido_{algoritmo_descarga}.json'
            zf.writestr(nombre_archivo_interno, contenido_json)
        
        buffer_memoria.seek(0)

        # Enviamos el archivo ZIP como respuesta
        response = HttpResponse(buffer_memoria.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="comprimido_{algoritmo_descarga}.zip"'
        return response

    # --- Lógica para la Compresión (POST) ---
    elif peticion.method == 'POST':
        datos_de_entrada = None

        # Lógica mejorada para manejar diferentes tipos de petición
        if 'multipart/form-data' in peticion.content_type:
            archivo_subido = peticion.FILES.get('file')
            if archivo_subido:
                if archivo_subido.name.endswith('.txt'):
                    datos_de_entrada = archivo_subido.read().decode('utf-8')
                else:
                    return JsonResponse({"error": "Tipo de archivo no permitido. Solo se aceptan .txt."}, status=400)
        elif 'application/json' in peticion.content_type:
            try:
                datos = json.loads(peticion.body)
                datos_de_entrada = datos.get('text')
            except json.JSONDecodeError:
                return JsonResponse({"error": "El JSON enviado es inválido."}, status=400)

        if not datos_de_entrada:
            return JsonResponse({"error": "No se proporcionó texto ni archivo para comprimir."}, status=400)

        # Llama a la lógica de AMBOS algoritmos
        resultados_huffman = calcular_estadisticas_huffman(datos_de_entrada)
        resultados_shannon = calcular_estadisticas_shannon_fano(datos_de_entrada)
        
        datos_respuesta = {
            "mensaje_original": datos_de_entrada,
            "longitud_original_bits": len(datos_de_entrada) * 7,
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
        archivo_zip_subido = peticion.FILES.get('file')
        if not archivo_zip_subido:
            return JsonResponse({"error": "No se subió ningún archivo."}, status=400)
        
        try:
            with zipfile.ZipFile(archivo_zip_subido, 'r') as zf:
                nombre_del_archivo_interno = zf.namelist()[0]
                datos_comprimidos = json.loads(zf.read(nombre_del_archivo_interno))
                codigos = datos_comprimidos.get("codigos")
                mensaje_comprimido = datos_comprimidos.get("mensaje_comprimido")

                if not codigos or mensaje_comprimido is None:
                    return JsonResponse({"error": "El archivo comprimido no tiene el formato correcto."}, status=400)
                
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
            return JsonResponse({"error": "El archivo ZIP es inválido o tiene un formato incorrecto."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)