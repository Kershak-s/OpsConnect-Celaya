#!/usr/bin/env python3
with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar coma faltante
old = """            salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            }

        'PAPA': {"""

new = """            salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            }
        },
        'PAPA': {"""

content = content.replace(old, new)

with open('static/js/custom/analisis_fisicoquimicos.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Coma agregada antes de 'PAPA'")

# Verificar
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/analisis_fisicoquimicos.js'], 
                       capture_output=True, text=True)

if result.returncode == 0:
    print("🎉 ¡SINTAXIS VÁLIDA!")
else:
    print(f"❌ Error: {result.stderr[:200]}")
