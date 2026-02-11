#!/usr/bin/env python3
"""
Corrige error de sintaxis en analisis_fisicoquimicos.js línea 96
"""

# Leer archivo
with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('static/js/custom/analisis_fisicoquimicos.js.backup_syntax', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: static/js/custom/analisis_fisicoquimicos.js.backup_syntax")

# Buscar y reemplazar el error (falta coma después de CHEETOS EXTRA FH NUEVO)
old_code = """                    salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                    
            }
        },"""

new_code = """                    salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                }
            },"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("✅ Error de sintaxis corregido (agregada coma faltante)")
else:
    print("⚠️  Patrón no encontrado, intentando método alternativo...")
    # Buscar patrón más específico
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if i >= 94 and i <= 98:
            print(f"Línea {i+1}: {line[:80]}")

# Guardar
with open('static/js/custom/analisis_fisicoquimicos.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo corregido")
print("📁 Backup: static/js/custom/analisis_fisicoquimicos.js.backup_syntax")
print("\n🔄 Por favor recarga la página con Ctrl+Shift+R")
