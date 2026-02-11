#!/usr/bin/env python3
"""
Corrige la detección de categoría para que use data-categoria del HTML
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar la detección de categoría
old_categoria = '''    // Detectar categoría desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria') || 'EXTRUIDOS';
    console.log('📊 Categoría:', categoria);'''

new_categoria = '''    // Detectar categoría desde data-attribute del HTML o URL
    const contenedor = document.querySelector('[data-categoria]');
    const urlParams = new URLSearchParams(window.location.search);
    
    // Prioridad: 1) data-categoria del HTML, 2) URL param, 3) EXTRUIDOS por defecto
    const categoria = contenedor?.dataset.categoria || urlParams.get('categoria') || 'EXTRUIDOS';
    console.log('📊 Categoría detectada:', categoria);
    console.log('   (Fuente:', contenedor?.dataset.categoria ? 'data-categoria' : 'URL/default', ')');'''

content = content.replace(old_categoria, new_categoria)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Detección de categoría corregida")
print("")
print("Ahora la categoría se detecta de:")
print("  1. data-categoria del HTML (prioridad)")
print("  2. Parámetro ?categoria= de la URL")
print("  3. 'EXTRUIDOS' por defecto")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
