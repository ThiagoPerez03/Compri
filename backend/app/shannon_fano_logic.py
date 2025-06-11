# backend/app/shannon_fano_logic.py
from collections import Counter
import math

# --- Funciones internas del algoritmo ---

def _calcular_frecuencias(cadena):
    total_simbolos = len(cadena)
    if total_simbolos == 0:
        return {}
    frecuencias_absolutas = Counter(cadena)
    return {simbolo: freq / total_simbolos for simbolo, freq in frecuencias_absolutas.items()}

def _ordenar_simbolos(frecuencias):
    return sorted(frecuencias.items(), key=lambda item: -item[1])

def _generar_codigos_recursivo(simbolos, codigo_actual="", codigos={}):
    if len(simbolos) == 1:
        codigos[simbolos[0][0]] = codigo_actual or "0"
        return codigos
    
    total_frecuencia = sum(freq for _, freq in simbolos)
    frecuencia_acumulada = 0
    punto_division = 0
    for i, (_, freq) in enumerate(simbolos):
        frecuencia_acumulada += freq
        if frecuencia_acumulada >= total_frecuencia / 2:
            punto_division = i + 1
            break
            
    _generar_codigos_recursivo(simbolos[:punto_division], codigo_actual + "0", codigos)
    _generar_codigos_recursivo(simbolos[punto_division:], codigo_actual + "1", codigos)
    
    return codigos

def _codificar(cadena, codigos):
    return "".join(codigos.get(simbolo, "") for simbolo in cadena)

def _decodificar(cadena_codificada, codigos):
    if not cadena_codificada:
        return ""
    codigo_a_simbolo = {v: k for k, v in codigos.items()}
    resultado = ""
    codigo_actual = ""
    for bit in cadena_codificada:
        codigo_actual += bit
        if codigo_actual in codigo_a_simbolo:
            resultado += codigo_a_simbolo[codigo_actual]
            codigo_actual = ""
    return resultado

# --- Función Principal para la API ---

def calcular_estadisticas_shannon_fano(texto_entrada):
    """
    Función principal que toma un texto, aplica Shannon-Fano, y devuelve estadísticas.
    """
    if not texto_entrada:
        return {"error": "El mensaje está vacío."}

    frecuencias_relativas = _calcular_frecuencias(texto_entrada)
    simbolos_ordenados = _ordenar_simbolos(frecuencias_relativas)
    mapa_codigos = _generar_codigos_recursivo(list(simbolos_ordenados), codigos={})

    frecuencias_absolutas = Counter(texto_entrada)
    total_caracteres = len(texto_entrada)
    tabla_codigos = []
    for caracter, frec in frecuencias_absolutas.items():
        tabla_codigos.append({
            "caracter": caracter if caracter != ' ' else "' '",
            "codigo": mapa_codigos.get(caracter, "ERROR"),
            "frecuencia": frec,
            "probabilidad": round(frec / total_caracteres, 4)
        })

    cadena_bits_codificada = _codificar(texto_entrada, mapa_codigos)
    mensaje_decodificado = _decodificar(cadena_bits_codificada, mapa_codigos)
    longitud_comprimida_bits = len(cadena_bits_codificada)
    
    longitud_original_bits = total_caracteres * 7
    tasa_compresion = (1 - (longitud_comprimida_bits / longitud_original_bits)) * 100 if longitud_original_bits > 0 else 0
    
    longitud_promedio_codigo = sum(frecuencias_relativas[s] * len(mapa_codigos[s]) for s in mapa_codigos)
    
    return {
        "cadena_bits_codificada": cadena_bits_codificada,
        "longitud_comprimida_bits": longitud_comprimida_bits,
        "tabla_codigos": sorted(tabla_codigos, key=lambda x: x['frecuencia'], reverse=True),
        "tasa_compresion_porcentaje": round(tasa_compresion, 2),
        "longitud_promedio_codigo": round(longitud_promedio_codigo, 2),
        "mensaje_decodificado": mensaje_decodificado,
        "error": None
    }
