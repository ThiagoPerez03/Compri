# backend/app/huffman_logic.py
import heapq
import copy

def calcular_estadisticas_huffman(texto_entrada):
    if not texto_entrada:
        return {"error": "El mensaje está vacío."}

    # crea un diccionario para almacenar la frecuencia de cada caracter
    mapa_frecuencias = {}
    for caracter in texto_entrada:
        mapa_frecuencias[caracter] = mapa_frecuencias.get(caracter, 0) + 1

    # crea la cola de prioridad
    contador_desempate = 0
    cola_prioridad = []
    for caracter, frec in mapa_frecuencias.items():
        # Estructura del Nodo: [frecuencia, contador_desempate, caracter]
        cola_prioridad.append([frec, contador_desempate, caracter])
        contador_desempate += 1
    
    heapq.heapify(cola_prioridad) # Convierte la lista en un heap (recomendado por el profesor)

    pasos_construccion_huffman = []
    pasos_construccion_huffman.append(copy.deepcopy(cola_prioridad)) # guarda el estado inicial

    # combina los nodos hasta que solo quede uno
    while len(cola_prioridad) > 1:
        nodo_menor = heapq.heappop(cola_prioridad) # saca el nodo con menor frecuencia
        nodo_siguiente = heapq.heappop(cola_prioridad) # saca el siguiente nodo con menor frecuencia
        
        datos_nodo_combinado = [nodo_menor, nodo_siguiente]
        nuevo_nodo_combinado = [nodo_menor[0] + nodo_siguiente[0], contador_desempate, datos_nodo_combinado]
        contador_desempate += 1
        
        heapq.heappush(cola_prioridad, nuevo_nodo_combinado)
        
        pasos_construccion_huffman.append(copy.deepcopy(cola_prioridad))
    
    raiz_arbol_huffman = cola_prioridad[0] if cola_prioridad else None
    
    # genera los códigos recorriendo el árbol
    mapa_codigos_final = {}
    if raiz_arbol_huffman:
        def generar_codigos_recursivo(nodo, codigo_actual):
            # si es una hoja (un caracter), guarda el código
            if isinstance(nodo[2], str):
                mapa_codigos_final[nodo[2]] = codigo_actual if codigo_actual else "0"
                return
            
            # si es un nodo interno, sigue recorriendo
            hijo_izquierdo, hijo_derecho = nodo[2]
            
            generar_codigos_recursivo(hijo_izquierdo, codigo_actual + '0') # va a la izquierda
            generar_codigos_recursivo(hijo_derecho, codigo_actual + '1') # va a la derecha

        generar_codigos_recursivo(raiz_arbol_huffman, "")

    # formatea la salida para el frontend
    def formatear_nodo_para_json(nodo):
        frec = nodo[0]
        datos = nodo[2]
        if isinstance(datos, str):
            return f"('{datos}', {frec})"
        else:
            return f"(Interno, {frec})"

    pasos_formateados = []
    for indice_paso, nodos_del_paso in enumerate(pasos_construccion_huffman):
        nodos_formateados = [formatear_nodo_para_json(nodo) for nodo in sorted(nodos_del_paso)]
        pasos_formateados.append({
            "nivel": indice_paso,
            "nodos": nodos_formateados
        })
        
    def formatear_arbol_para_frontend(nodo):
        if isinstance(nodo[2], str):
            return {"name": f"'{nodo[2]}'", "value": nodo[0]}
        
        frec = nodo[0]
        datos_hijo_izquierdo = formatear_arbol_para_frontend(nodo[2][0])
        datos_hijo_derecho = formatear_arbol_para_frontend(nodo[2][1])
        
        return {
            "name": f"{frec}",
            "children": [datos_hijo_izquierdo, datos_hijo_derecho]
        }

    datos_visualizacion_arbol = formatear_arbol_para_frontend(raiz_arbol_huffman) if raiz_arbol_huffman else None

    # construye la tabla de códigos
    tabla_codigos = []
    total_caracteres = len(texto_entrada)
    for caracter, frec in mapa_frecuencias.items():
        tabla_codigos.append({
            "caracter": caracter if caracter != ' ' else "' '",
            "codigo": mapa_codigos_final.get(caracter, "ERROR"),
            "frecuencia": frec,
            "probabilidad": round(frec / total_caracteres, 4) if total_caracteres > 0 else 0
        })

    # codifica el mensaje
    cadena_bits_codificada = "".join([mapa_codigos_final.get(caracter, "") for caracter in texto_entrada])
    longitud_comprimida_bits = len(cadena_bits_codificada)

    # decodifica para verificación
    mapa_inverso_codigos = {codigo: caracter for caracter, codigo in mapa_codigos_final.items() if codigo != "ERROR"}
    mensaje_decodificado = ""
    codigo_actual_coincidir = ""
    for bit in cadena_bits_codificada:
        codigo_actual_coincidir += bit
        if codigo_actual_coincidir in mapa_inverso_codigos:
            mensaje_decodificado += mapa_inverso_codigos[codigo_actual_coincidir]
            codigo_actual_coincidir = ""
            
    # calcula estadísticas finales
    longitud_original_bits = total_caracteres * 7
    tasa_compresion = (1 - (longitud_comprimida_bits / longitud_original_bits)) * 100 if longitud_original_bits > 0 else 0
    longitud_promedio_codigo = 0
    if total_caracteres > 0:
        for item in tabla_codigos:
             if item["codigo"] != "ERROR":
                 longitud_promedio_codigo += (item["frecuencia"] / total_caracteres) * len(item["codigo"])

    # devuelve todo en un diccionario
    return {
        "mensaje_original": texto_entrada,
        "longitud_original_bits": longitud_original_bits,
        "estadisticas_huffman": {
            "cadena_bits_codificada": cadena_bits_codificada,
            "longitud_comprimida_bits": longitud_comprimida_bits,
            "tabla_codigos": sorted(tabla_codigos, key=lambda x: x['frecuencia'], reverse=True),
            "tasa_compresion_porcentaje": round(tasa_compresion, 2),
            "longitud_promedio_codigo": round(longitud_promedio_codigo, 2),
            "datos_visualizacion_arbol": datos_visualizacion_arbol,
            "pasos_construccion_huffman": pasos_formateados,
            "mensaje_decodificado": mensaje_decodificado,
            "error": None
        },
    }
