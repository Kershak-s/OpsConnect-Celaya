import re

# Leer archivo
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar el patrón problemático y reemplazarlo
# Buscar desde "return categoria_rangos.get" hasta el próximo @app.route o def
pattern = r'(return categoria_rangos\.get\(producto, categoria_rangos\[\'default\'\]\))\s*\n\s*# Crear Excel.*?(?=\s*@app\.route)'
replacement = r'\1\n\n    '

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Guardar archivo
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Corrección aplicada")
