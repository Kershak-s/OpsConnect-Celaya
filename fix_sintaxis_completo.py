#!/usr/bin/env python3
"""
Corrige todos los errores de sintaxis en analisis_fisicoquimicos.js
"""

# Leer archivo
with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=" * 70)
print("🔧 CORRIGIENDO ERRORES DE SINTAXIS")
print("=" * 70)

# Mostrar líneas problemáticas
print("\n📋 Líneas 157-164 (RANCHERITOS duplicado):")
for i in range(156, 163):
    if i < len(lines):
        print(f"{i+1:4d}: {lines[i].rstrip()}")

# Encontrar y eliminar la entrada duplicada de RANCHERITOS
# La segunda entrada (líneas 157-162) tiene un formato diferente y una llave extra
problema_encontrado = False

for i in range(len(lines)):
    # Buscar la segunda entrada de RANCHERITOS (línea ~157)
    if i > 150 and i < 165 and "'RANCHERITOS': {" in lines[i]:
        # Verificar si es la segunda entrada
        if "'RANCHERITOS': {" in ''.join(lines[i-10:i]):
            print(f"\n⚠️  Encontrado RANCHERITOS duplicado en línea {i+1}")
            # Encontrar el cierre de este bloque (la llave extra en línea ~162)
            j = i + 1
            nivel = 1
            while j < len(lines) and nivel > 0:
                if '{' in lines[j]:
                    nivel += 1
                if '}' in lines[j]:
                    nivel -= 1
                j += 1
            
            # Eliminar desde la línea del segundo RANCHERITOS hasta su cierre
            print(f"   Eliminando líneas {i+1} hasta {j}")
            problema_encontrado = True
            # Marcar para eliminar
            for k in range(i, j):
                lines[k] = "###ELIMINAR###\n"
            break

if problema_encontrado:
    # Filtrar líneas marcadas
    lines = [line for line in lines if line.strip() != "###ELIMINAR###"]
    print("✅ Entrada duplicada eliminada")
else:
    print("⚠️  No se encontró el duplicado exacto")

# Guardar backup
with open('static/js/custom/analisis_fisicoquimicos.js.backup_full', 'w', encoding='utf-8') as f:
    with open('static/js/custom/analisis_fisicoquimicos.js', 'r', encoding='utf-8') as orig:
        f.write(orig.read())
print("\n✅ Backup completo: analisis_fisicoquimicos.js.backup_full")

# Guardar archivo corregido
with open('static/js/custom/analisis_fisicoquimicos.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Archivo corregido y guardado")

# Verificar sintaxis con node
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/analisis_fisicoquimicos.js'], 
                       capture_output=True, text=True)

print("\n" + "=" * 70)
if result.returncode == 0:
    print("✅ SINTAXIS VÁLIDA - El archivo JavaScript está correcto")
    print("\n🔄 Por favor recarga la página con Ctrl+Shift+R")
else:
    print("❌ TODAVÍA HAY ERRORES:")
    print(result.stderr[:300])
print("=" * 70)
