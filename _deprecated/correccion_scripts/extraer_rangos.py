#!/usr/bin/env python3
"""
Extrae rangos de humedadBase y aceiteBase de analisis_fisicoquimicos.js
"""
import re
import json

with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer la sección de rangosIdeales
match = re.search(r'const rangosIdeales\s*=\s*\{(.*?)\n\s*\};', content, re.DOTALL)
if not match:
    print("❌ No se encontró rangosIdeales")
    exit(1)

rangos_text = match.group(1)

# Buscar todos los productos y sus rangos
productos = {}
categoria_actual = None

# Buscar categorías (EXTRUIDOS, TORTILLA, PAPA)
for linea in rangos_text.split('\n'):
    # Detectar categoría
    if "'EXTRUIDOS':" in linea or "'TORTILLA':" in linea or "'PAPA':" in linea:
        match_cat = re.search(r"'([A-Z]+)':", linea)
        if match_cat:
            categoria_actual = match_cat.group(1)
            productos[categoria_actual] = {}
    
    # Detectar producto dentro de categoría
    elif categoria_actual and re.match(r"\s+'[A-Z]", linea):
        match_prod = re.search(r"'([^']+)':\s*\{", linea)
        if match_prod:
            producto_nombre = match_prod.group(1)
            # Buscar rangos en las siguientes líneas
            idx = rangos_text.find(linea)
            siguiente_texto = rangos_text[idx:idx+500]
            
            # Extraer humedadBase
            hum_match = re.search(r'humedadBase:\s*\{\s*min:\s*([\d.]+),\s*max:\s*([\d.]+)(?:,\s*warning_low:\s*([\d.]+),\s*warning_high:\s*([\d.]+))?\s*\}', siguiente_texto)
            
            # Extraer aceiteBase
            ace_match = re.search(r'aceiteBase:\s*\{\s*min:\s*([\d.]+),\s*max:\s*([\d.]+)(?:,\s*warning_low:\s*([\d.]+),\s*warning_high:\s*([\d.]+))?\s*\}', siguiente_texto)
            
            if hum_match or ace_match:
                productos[categoria_actual][producto_nombre] = {}
                
                if hum_match:
                    productos[categoria_actual][producto_nombre]['humedad_base_frita'] = {
                        'min': float(hum_match.group(1)),
                        'max': float(hum_match.group(2)),
                        'warning_low': float(hum_match.group(3)) if hum_match.group(3) else None,
                        'warning_high': float(hum_match.group(4)) if hum_match.group(4) else None
                    }
                
                if ace_match:
                    productos[categoria_actual][producto_nombre]['aceite_base_frita'] = {
                        'min': float(ace_match.group(1)),
                        'max': float(ace_match.group(2)),
                        'warning_low': float(ace_match.group(3)) if ace_match.group(3) else None,
                        'warning_high': float(ace_match.group(4)) if ace_match.group(4) else None
                    }

# Imprimir resultado
print("=== RANGOS EXTRAÍDOS ===\n")
print(json.dumps(productos, indent=2, ensure_ascii=False))

# Guardar en archivo JS para usar en graficas_base_frita.js
js_output = "const rangosPorProducto = " + json.dumps(productos, indent=2, ensure_ascii=False) + ";\n"

with open('rangos_extraidos.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print("\n✅ Rangos guardados en: rangos_extraidos.js")
