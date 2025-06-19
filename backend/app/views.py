# backend/app/views.py
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import io
import zipfile

from .huffman_logic import calcular_estadisticas_huffman, descomprimir_huffman_desde_archivo
from .shannon_fano_logic import calcular_estadisticas_shannon_fano, descomprimir_shannon_desde_archivo

@csrf_exempt
def api_de_compresion(peticion):
    if peticion.method == 'POST':
        # ... (toda la lógica para leer texto_a_comprimir o archivo_subido es la misma) ...
        texto_a_comprimir = None
        contenido_archivo = None
        try:
            if peticion.body and 'application/json' in peticion.content_type:
                datos = json.loads(peticion.body)
                texto_a_comprimir = datos.get('text')
        except json.JSONDecodeError:
            pass
        if not texto_a_comprimir:
            texto_a_comprimir = peticion.POST.get('text')
        archivo_subido = peticion.FILES.get('file')
        if archivo_subido:
            contenido_archivo = archivo_subido.read().decode('utf-8')
        
        datos_de_entrada = contenido_archivo if contenido_archivo else texto_a_comprimir
        if not datos_de_entrada:
            return JsonResponse({"error": "No se proporcionó texto ni archivo."}, status=400)

        quiere_descargar = peticion.GET.get('download') == 'true'
        algoritmo_descarga = peticion.GET.get('algorithm', 'huffman')

        resultados_huffman = calcular_estadisticas_huffman(datos_de_entrada)
        resultados_shannon_fano = calcular_estadisticas_shannon_fano(datos_de_entrada)

        if quiere_descargar:
            stats = None
            if algoritmo_descarga == 'huffman':
                stats = resultados_huffman.get("estadisticas_huffman", {})
            elif algoritmo_descarga == 'shannon_fano':
                stats = resultados_shannon_fano
            else:
                return JsonResponse({"error": f"Algoritmo '{algoritmo_descarga}' no válido."}, status=400)
            
            mapa_frecuencias = stats.get("mapa_frecuencias")
            cadena_bits_codificada = stats.get("cadena_bits_codificada")

            # --- Lógica para crear el contenido del archivo interno ---
            header_json = json.dumps(mapa_frecuencias)
            header_bytes = header_json.encode('utf-8')
            separador = b'###SEPARATOR###'
            num_padding = 8 - (len(cadena_bits_codificada) % 8)
            if num_padding == 8: num_padding = 0
            cadena_bits_codificada += '0' * num_padding
            padding_info = num_padding.to_bytes(1, 'big')
            array_bytes = bytearray(int(cadena_bits_codificada[i:i+8], 2) for i in range(0, len(cadena_bits_codificada), 8))
            contenido_interno_binario = header_bytes + separador + padding_info + bytes(array_bytes)
            
            # --- NUEVA LÓGICA PARA CREAR EL ARCHIVO ZIP EN MEMORIA ---
            buffer_memoria = io.BytesIO()
            with zipfile.ZipFile(buffer_memoria, 'w', zipfile.ZIP_DEFLATED) as zf:
                # El nombre del archivo que irá DENTRO del ZIP
                nombre_archivo_interno = f'comprimido.{algoritmo_descarga}'
                zf.writestr(nombre_archivo_interno, contenido_interno_binario)
            
            # Mover el cursor al inicio del buffer para leer su contenido
            buffer_memoria.seek(0)

            # Crear la respuesta HTTP con el contenido del ZIP
            response = HttpResponse(buffer_memoria.read(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="archivo.zip"'
            return response
        else:
            # La lógica para devolver JSON sigue igual
            datos_respuesta = {
                "mensaje_original": datos_de_entrada,
                "longitud_original_bits": len(datos_de_entrada) * 7,
                "algoritmos": {
                    "huffman": resultados_huffman.get("estadisticas_huffman"),
                    "shannon_fano": resultados_shannon_fano
                }
            }
            return JsonResponse(datos_respuesta)

    return JsonResponse({"error": "Método no permitido."}, status=405)


@csrf_exempt
def api_de_descompresion(peticion):
    if peticion.method == 'POST':
        archivo_zip_subido = peticion.FILES.get('file')
        algoritmo = peticion.POST.get('algorithm', 'huffman')

        if not archivo_zip_subido:
            return JsonResponse({"error": "No se subió ningún archivo."}, status=400)
        
        try:
            # --- NUEVA LÓGICA PARA LEER DENTRO DEL ZIP ---
            with zipfile.ZipFile(archivo_zip_subido, 'r') as zf:
                # Asumimos que el archivo que nos interesa es el primero dentro del ZIP
                nombre_del_archivo_interno = zf.namelist()[0]
                contenido_archivo = zf.read(nombre_del_archivo_interno)
        except zipfile.BadZipFile:
            return JsonResponse({"error": "El archivo subido no es un ZIP válido."}, status=400)
        except IndexError:
            return JsonResponse({"error": "El archivo ZIP está vacío."}, status=400)

        resultado = None
        if algoritmo == 'huffman':
            resultado = descomprimir_huffman_desde_archivo(contenido_archivo)
        elif algoritmo == 'shannon_fano':
            resultado = descomprimir_shannon_desde_archivo(contenido_archivo)
        else:
            return JsonResponse({"error": f"Algoritmo '{algoritmo}' no soportado."}, status=400)

        if "error" in resultado:
            return JsonResponse(resultado, status=400)

        return JsonResponse(resultado)

    return JsonResponse({"error": "Método no permitido."}, status=405)