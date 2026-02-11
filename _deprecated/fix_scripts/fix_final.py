import os

# Leer archivo línea por línea
with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Eliminar líneas 3912-4171 (código después del return)
# Python usa índices 0-based, así que línea 3912 = índice 3911
fixed_lines = lines[:3911] + lines[4171:]

# Escribir archivo corregido
with open('app.py', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("✅ Archivo corregido - eliminadas 260 líneas problemáticas después del return")
print("🚀 app.py listo para ejecutar")
