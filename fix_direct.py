import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar la sección problemática alrededor de línea 3847
lines = content.split('\n')

# Encontrar el contexto de la línea 3847
start_idx = 3840
end_idx = 3860

print("Líneas problemáticas:")
for i in range(start_idx, min(end_idx, len(lines))):
    print(f"{i+1}: '{lines[i]}'")

# Reparar específicamente la estructura de función
fixed_lines = []
for i, line in enumerate(lines):
    if i >= start_idx and i < end_idx:
        # Si es una línea de decorador o función dentro de create_app
        if line.strip().startswith('@') or line.strip().startswith('def '):
            fixed_lines.append('    ' + line.strip())
        # Si es código dentro de función
        elif line.strip() and not line.startswith('    ') and not line.strip().startswith('#'):
            fixed_lines.append('        ' + line.strip())
        else:
            fixed_lines.append(line)
    else:
        fixed_lines.append(line)

# Guardar
with open('app.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fixed_lines))

print("✅ Reparación aplicada")
