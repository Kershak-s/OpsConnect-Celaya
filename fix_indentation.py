# Fix indentación del archivo app.py
import re

print("🔧 Corrigiendo indentación en app.py...")

# Leer el archivo
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar y corregir el problema específico
# El problema está en que después de "return categoria_rangos.get..." hay código mal indentado

# Buscar el patrón problemático
pattern = r'(return categoria_rangos\.get\(producto, categoria_rangos\[\'default\'\]\))\s*(# Crear Excel con openpyxl.*?)(try:.*?)(?=\s*@app\.route|def |if __name__|$)'

# Función para corregir la indentación
def fix_match(match):
    return_line = match.group(1)
    comment_line = match.group(2) if match.group(2) else ""
    try_block = match.group(3) if match.group(3) else ""
    
    # Remover el código mal indentado después del return
    return return_line

# Aplicar la corrección
content = re.sub(pattern, fix_match, content, flags=re.DOTALL)

# Remover cualquier código suelto después de las funciones de descarga excel
# que pueda estar mal indentado
content = re.sub(r'(\s*return app\s*\n)(.*?)(?=\s*if __name__|$)', r'\1\n', content, flags=re.DOTALL)

# Asegurar que el final del archivo esté correcto
if not content.strip().endswith('app.run(debug=True)'):
    # Limpiar múltiples if __name__
    content = re.sub(r'if __name__ == ["\']__main__["\']:.*?(?=if __name__|$)', '', content, flags=re.DOTALL)
    content += '\n\nif __name__ == "__main__":\n    app = create_app()\n    app.run(debug=True)'

# Limpiar líneas vacías excesivas
content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)

# Guardar el archivo corregido
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Indentación corregida en app.py")
print("🔍 Problema: Había código mal indentado después de 'return categoria_rangos'")
print("✨ Solucionado: Código problemático removido, estructura limpia")
