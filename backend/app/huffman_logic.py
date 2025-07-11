import heapq
import json
import copy
import math

def _convertir_arbol_a_formato_d3(nodo, bit_del_enlace=None):
    if not nodo:
        return None
    
    if isinstance(nodo[2], str):
        nombre_caracter = nodo[2].replace("'", "\\'").replace("\n", "\\n")
        return {"name": f"{nombre_caracter}", "value": nodo[0], "bit_code": bit_del_enlace} 
    
    nombre_nodo = str(nodo[0])
    nodo_izquierdo, nodo_derecho = nodo[2]
    
    return {
        "name": nombre_nodo,
        "children": [
            _convertir_arbol_a_formato_d3(nodo_izquierdo, "0"),
            _convertir_arbol_a_formato_d3(nodo_derecho, "1")
        ],
        "bit_code": bit_del_enlace 
    }

def _construir_arbol_y_pasos(mapa_frecuencias):
    contador_desempate = 0
    cola_prioridad = []
    for caracter, frec in mapa_frecuencias.items():
        cola_prioridad.append([frec, contador_desempate, caracter])
        contador_desempate += 1
    
    heapq.heapify(cola_prioridad)

    pasos_construccion_huffman = []
    initial_nodes = sorted(copy.deepcopy(cola_prioridad))
    pasos_construccion_huffman.append({
        "nivel": 0,
        "nodos": [f"('{item[2]}', {item[0]})" for item in initial_nodes]
    })
    
    while len(cola_prioridad) > 1:
        nodo_menor = heapq.heappop(cola_prioridad)
        nodo_siguiente = heapq.heappop(cola_prioridad)
        
        datos_nodo_combinado = [nodo_menor, nodo_siguiente]
        frecuencia_total = nodo_menor[0] + nodo_siguiente[0]
        
        nodo_combinado = [frecuencia_total, contador_desempate, datos_nodo_combinado]
        heapq.heappush(cola_prioridad, nodo_combinado)
        contador_desempate += 1
        
        current_nodes = sorted(copy.deepcopy(cola_prioridad))
        node_reprs = []
        for item in current_nodes:
            if isinstance(item[2], str):
                node_reprs.append(f"('{item[2]}', {item[0]})")
            else:
                node_reprs.append(f"(Interno, {item[0]})")
        
        pasos_construccion_huffman.append({
            "nivel": len(pasos_construccion_huffman),
            "nodos": node_reprs
        })
        
    arbol_final = cola_prioridad[0] if cola_prioridad else None
    return arbol_final, pasos_construccion_huffman

def _generar_codigos_desde_arbol(arbol_huffman):
    mapa_codigos = {}
    def _recorrer_arbol(nodo, codigo_actual=""):
        if not nodo: return
        if isinstance(nodo[2], str):
            mapa_codigos[nodo[2]] = codigo_actual or "0"
            return
        
        nodo_izquierdo, nodo_derecho = nodo[2]
        _recorrer_arbol(nodo_izquierdo, codigo_actual + "0")
        _recorrer_arbol(nodo_derecho, codigo_actual + "1")
    
    _recorrer_arbol(arbol_huffman)
    return mapa_codigos


def calcular_estadisticas_huffman(texto_entrada):
    if not texto_entrada:
        return {"error": "El mensaje está vacío."}

    mapa_frecuencias = {caracter: texto_entrada.count(caracter) for caracter in set(texto_entrada)}
    
    arbol_huffman, pasos_construccion = _construir_arbol_y_pasos(mapa_frecuencias)
    mapa_codigos = _generar_codigos_desde_arbol(arbol_huffman)
    
    cadena_bits_codificada = "".join(mapa_codigos.get(c, "") for c in texto_entrada)
    longitud_comprimida_bits = len(cadena_bits_codificada)
    total_caracteres = len(texto_entrada)

    tabla_codigos = []
    for caracter, frec in mapa_frecuencias.items():
        probabilidad = frec / total_caracteres if total_caracteres > 0 else 0
        tabla_codigos.append({
            "caracter": caracter if caracter != ' ' else "' '",
            "frecuencia": frec,
            "probabilidad": round(probabilidad, 4),
            "codigo": mapa_codigos.get(caracter, "ERROR")
        })

    longitud_original_bits = total_caracteres * 8
    tasa_compresion = (1 - (longitud_comprimida_bits / longitud_original_bits)) * 100 if longitud_original_bits > 0 else 0
    longitud_promedio_codigo = sum((item["frecuencia"] / total_caracteres) * len(item["codigo"]) for item in tabla_codigos if item["codigo"] != "ERROR")
    
    entropia = 0
    if total_caracteres > 0:
        for frec in mapa_frecuencias.values():
            probabilidad = frec / total_caracteres
            if probabilidad > 0:
                entropia -= probabilidad * math.log2(probabilidad)

    eficiencia = (entropia / longitud_promedio_codigo) * 100 if longitud_promedio_codigo > 0 else 0
    
    datos_visualizacion_arbol = _convertir_arbol_a_formato_d3(arbol_huffman, None) if arbol_huffman else None

    # Se devuelve un diccionario con una estructura consistente para la API
    return {
        "mensaje_original": texto_entrada,
        "estadisticas_huffman": {
            "cadena_bits_codificada": cadena_bits_codificada,
            "longitud_comprimida_bits": longitud_comprimida_bits,
            "tabla_codigos": sorted(tabla_codigos, key=lambda x: x['frecuencia'], reverse=True),
            "tasa_compresion_porcentaje": round(tasa_compresion, 2),
            "longitud_promedio_codigo": round(longitud_promedio_codigo, 4),
            "eficiencia": round(eficiencia, 2),
            "mapa_frecuencias": mapa_frecuencias,
            "datos_visualizacion_arbol": datos_visualizacion_arbol, 
            "pasos_construccion_huffman": pasos_construccion,
        },
        "error": None
    }
