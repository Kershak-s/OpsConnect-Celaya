#!/usr/bin/env python3
"""
Corrige los IDs de los filtros en el JavaScript
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar IDs incorrectos por los correctos
cambios = [
    ("'periodo-analisis'", "'periodo-selector'"),
    ("'producto-analisis'", "'producto-selector'"),
    ("'fecha-inicio-analisis'", "'fecha-inicio-filtro'"),
    ("'fecha-fin-analisis'", "'fecha-fin-filtro'")
]

for viejo, nuevo in cambios:
    content = content.replace(viejo, nuevo)
    print(f"✅ Cambiado: {viejo} → {nuevo}")

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ IDs de filtros corregidos")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr)
