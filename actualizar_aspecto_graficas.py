#!/usr/bin/env python3
"""
Actualiza el archivo JavaScript para mejorar el aspecto de las gráficas
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Cambiar maintainAspectRatio de true a false
content = content.replace(
    'maintainAspectRatio: true,',
    'maintainAspectRatio: false,'
)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Configuración de aspecto ratio actualizada")
print("   - maintainAspectRatio: false (las gráficas usarán la altura del contenedor)")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr)
