import re

# Leer archivo
with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Buscar línea con el return problemático y eliminar código posterior hasta @app.route
in_problem_area = False
fixed_lines = []

for i, line in enumerate(lines):
    if 'return categoria_rangos.get(producto, categoria_rangos[\'default\'])' in line:
        fixed_lines.append(line)
        in_problem_area = True
        # Agregar líneas vacías hasta el próximo @app.route
        continue
    elif in_problem_area and line.strip().startswith('@app.route'):
        # Encontramos el siguiente @app.route, agregar línea vacía y continuar normalmente
        fixed_lines.append('\n    ')
        fixed_lines.append(line)
        in_problem_area = False
        continue
    elif not in_problem_area:
        fixed_lines.append(line)

# Escribir archivo corregido
with open('app.py', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("✅ Error de indentación corregido")
print("🗑️ Código después del 'return' eliminado")
