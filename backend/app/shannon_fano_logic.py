from collections import Counter
import json


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
    
    return {
        "cadena_bits_codificada": cadena_bits_codificada,
        "longitud_comprimida_bits": longitud_comprimida_bits,
        "tasa_compresion_porcentaje": round(tasa_compresion, 2),
        "longitud_promedio_codigo": round(longitud_promedio_codigo, 4),
        "tabla_codigos": sorted(tabla_codigos, key=lambda x: x['frecuencia'], reverse=True),
        "mapa_frecuencias": frecuencias_absolutas # ¡AÑADIDO! Necesario para la descarga
    }


def descomprimir_shannon_desde_archivo(contenido_archivo):
    
    separador = b'###SEPARATOR###'
    try:
        header_bytes, resto_archivo = contenido_archivo.split(separador, 1)
    except ValueError:
        return {"error": "Formato de archivo inválido o corrupto (sin separador)."}

    try:
        header_json = header_bytes.decode('utf-8')
        mapa_frecuencias_absolutas = json.loads(header_json)
    except (UnicodeDecodeError, json.JSONDecodeError):
        return {"error": "El header del archivo está corrupto o no es JSON válido."}

    total_caracteres = sum(mapa_frecuencias_absolutas.values())
    mapa_frecuencias_relativas = {s: f / total_caracteres for s, f in mapa_frecuencias_absolutas.items()}
    simbolos_ordenados = _ordenar_simbolos(mapa_frecuencias_relativas)
    mapa_codigos = _generar_codigos_recursivo(list(simbolos_ordenados), codigos={})
    mapa_inverso_codigos = {v: k for k, v in mapa_codigos.items()}

    padding_info = resto_archivo[0]
    num_padding = int.from_bytes(padding_info.to_bytes(1, 'big'), 'big')
    datos_comprimidos = resto_archivo[1:]

    cadena_bits = "".join(f'{byte:08b}' for byte in datos_comprimidos)
    if num_padding > 0:
        cadena_bits = cadena_bits[:-num_padding]

    mensaje_decodificado = ""
    codigo_actual = ""
    for bit in cadena_bits:
        codigo_actual += bit
        if codigo_actual in mapa_inverso_codigos:
            mensaje_decodificado += mapa_inverso_codigos[codigo_actual]
            codigo_actual = ""
            
    return {"mensaje_decodificado": mensaje_decodificado}