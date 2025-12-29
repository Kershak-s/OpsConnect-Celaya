#!/usr/bin/env python3
"""
Corrige las llaves mal cerradas en rangosIdeales
"""

with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Quitar llave extra después de DORITOS FH (línea ~148)
old_doritos_fh = """            'DORITOS FH': {
                humedad_base: {min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3},
                aceite_base: {min: 20, max: 23, warning_low: 19.0, warning_high: 24},
                aceite_pt: {min: 22.71, max: 25.71, warning_low: 21.71, warning_high: 26.71},
                humedad_pt: {min: 1.12, max: 1.72, warning_low: 1.07, warning_high: 1.77},
                sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
                        },"""

new_doritos_fh = """            'DORITOS FH': {
                humedad_base: {min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3},
                aceite_base: {min: 20, max: 23, warning_low: 19.0, warning_high: 24},
                aceite_pt: {min: 22.71, max: 25.71, warning_low: 21.71, warning_high: 26.71},
                humedad_pt: {min: 1.12, max: 1.72, warning_low: 1.07, warning_high: 1.77},
                sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
            },"""

if old_doritos_fh in content:
    content = content.replace(old_doritos_fh, new_doritos_fh)
    print("✅ Corregido cierre de DORITOS FH")

# Fix 2: Quitar coma después del último RANCHERITOS (línea ~156)
old_rancheritos = """            'RANCHERITOS': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.99, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            },
        },"""

new_rancheritos = """            'RANCHERITOS': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.99, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            }
        },"""

if old_rancheritos in content:
    content = content.replace(old_rancheritos, new_rancheritos)
    print("✅ Corregido cierre de RANCHERITOS")

# Guardar
with open('static/js/custom/analisis_fisicoquimicos.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado")

# Verificar
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/analisis_fisicoquimicos.js'], 
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n🎉 SINTAXIS VÁLIDA - ¡Archivo JavaScript correcto!")
else:
    print("\n❌ ERROR:")
    print(result.stderr)
