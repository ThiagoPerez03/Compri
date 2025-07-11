# thiagoperez03/compri/Compri-1f5cff3e727635d6193603267c2bc161eaae92a4/backend/app/shannon_fano_logic.py
from collections import Counter
import json
import math # Agregado para usar math.log2


def _calcular_frecuencias_relativas(cadena):
    total_simbolos = len(cadena)
    if total_simbolos == 0: return {}
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

def _codificar(cadena, mapa_codigos):
    return "".join(mapa_codigos.get(c, "") for c in cadena)


def calcular_estadisticas_shannon_fano(texto_entrada):
    if not texto_entrada:
        return {"error": "El mensaje está vacío."}

    total_caracteres = len(texto_entrada)
    frecuencias_absolutas = Counter(texto_entrada)
    frecuencias_relativas = {s: f / total_caracteres for s, f in frecuencias_absolutas.items()}
    
    simbolos_ordenados = _ordenar_simbolos(frecuencias_relativas)
    mapa_codigos = _generar_codigos_recursivo(list(simbolos_ordenados), codigos={})

    tabla_codigos = []
    for caracter, frec in frecuencias_absolutas.items():
        tabla_codigos.append({
            "caracter": caracter if caracter != ' ' else "' '",
            "codigo": mapa_codigos.get(caracter, "ERROR"),
            "frecuencia": frec,
            "probabilidad": round(frec / total_caracteres, 4)
        })

    cadena_bits_codificada = _codificar(texto_entrada, mapa_codigos)
    longitud_comprimida_bits = len(cadena_bits_codificada)
    longitud_original_bits = total_caracteres * 7
    tasa_compresion = (1 - (longitud_comprimida_bits / longitud_original_bits)) * 100 if longitud_original_bits > 0 else 0
    longitud_promedio_codigo = sum(frecuencias_relativas.get(s, 0) * len(mapa_codigos.get(s, "")) for s in frecuencias_absolutas)
    
    # Cálculo de la entropía
    entropia = 0
    if total_caracteres > 0:
        for frec in frecuencias_absolutas.values():
            probabilidad = frec / total_caracteres
            entropia -= probabilidad * math.log2(probabilidad)

    # Cálculo de la eficiencia
    eficiencia = (entropia / longitud_promedio_codigo) * 100 if longitud_promedio_codigo > 0 else 0
    
    return {
        "cadena_bits_codificada": cadena_bits_codificada,
        "longitud_comprimida_bits": longitud_comprimida_bits,
        "tasa_compresion_porcentaje": round(tasa_compresion, 2),
        "longitud_promedio_codigo": round(longitud_promedio_codigo, 4),
        "tabla_codigos": sorted(tabla_codigos, key=lambda x: x['frecuencia'], reverse=True),
        "mapa_frecuencias": frecuencias_absolutas,
        "eficiencia": round(eficiencia, 2) # Se agrega la eficiencia a la respuesta
    }