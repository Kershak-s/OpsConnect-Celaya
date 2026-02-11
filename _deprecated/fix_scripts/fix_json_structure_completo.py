#!/usr/bin/env python3
"""
Arregla TODOS los problemas de sintaxis en rangosIdeales
"""

with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("🔍 Analizando estructura...")

# Analizar llaves y comas problemáticas
problemas = []

for i, line in enumerate(lines[85:165], start=85):
    stripped = line.strip()
    
    # Buscar patrones problemáticos
    if stripped == '},':
        # Ver contexto
        contexto_anterior = lines[i-1].strip() if i > 0 else ""
        contexto_siguiente = lines[i+1].strip() if i < len(lines)-1 else ""
        
        print(f"L{i+1:3d}: {stripped:30} | Prev: {contexto_anterior[:30]:30} | Next: {contexto_siguiente[:30]:30}")

print("\n" + "="*80)
print("CORRECCIONES A REALIZAR:")
print("="*80)

# Lista de correcciones específicas
correcciones = [
    # Línea 96: Falta coma después de }
    (95, """                    salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                    
            }""", """                    salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                }"""),
]

content = ''.join(lines)

# Aplicar corrección 1: Fix línea 96
old_96 = """                salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                    
            }
        },"""

new_96 = """                salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                }
            },"""

if old_96 in content:
    content = content.replace(old_96, new_96)
    print("✅ Fix 1: Línea 96 (CHEETOS EXTRA FH NUEVO)")

# Aplicar corrección 2: Fix DORITOS FH (línea ~148)
old_dor = """                sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
                        },"""

new_dor = """                sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
            },"""

if old_dor in content:
    content = content.replace(old_dor, new_dor)
    print("✅ Fix 2: DORITOS FH (línea ~148)")

# Aplicar corrección 3: Fix RANCHERITOS duplicado (eliminar líneas 157-163)
old_ranc_dup = """            'RANCHERITOS': {
                humedad_base: {min: 0.8, max: 1.40, warning_low: 0.6, warning_high: 1.6},
                aceite_base: {min: 21.35, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                aceite_pt: {min: 22.01, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                humedad_pt: {min: 0.94, max: 1.44, warning_low: 0.84, warning_high: 1.54},
                sal_pt: {min: 1.38, max: 1.98, warning_low: 1.18, warning_high: 2.18}
                        }
        },"""

if old_ranc_dup in content:
    content = content.replace(old_ranc_dup, "")
    print("✅ Fix 3: Eliminado RANCHERITOS duplicado")

# Aplicar corrección 4: Fix último RANCHERITOS (quitar coma extra)
old_ranc_last = """            'RANCHERITOS': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.99, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            },"""

new_ranc_last = """            'RANCHERITOS': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.99, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            }"""

if old_ranc_last in content:
    content = content.replace(old_ranc_last, new_ranc_last)
    print("✅ Fix 4: Última coma de RANCHERITOS")

# Guardar
with open('static/js/custom/analisis_fisicoquimicos.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado")

# Verificar
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/analisis_fisicoquimicos.js'], 
                       capture_output=True, text=True)

print("\n" + "="*80)
if result.returncode == 0:
    print("🎉🎉🎉 SINTAXIS VÁLIDA - ¡TODO CORRECTO!")
    print("\n🔄 Ahora recarga la página con Ctrl+Shift+R")
else:
    print("❌ AÚN HAY ERRORES:")
    print(result.stderr[:400])
print("="*80)
