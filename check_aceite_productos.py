#!/usr/bin/env python3
"""
Script para verificar productos en la tabla analisis_aceite
"""
import sqlite3
from pathlib import Path

# Ruta a la base de datos
db_path = Path(__file__).parent / 'instance' / 'app.db'

if not db_path.exists():
    print(f"❌ Error: No se encontró la base de datos en {db_path}")
    exit(1)

print(f"📂 Conectando a base de datos: {db_path}\n")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Obtener productos únicos de EXTRUIDOS
    cursor.execute("""
        SELECT DISTINCT producto
        FROM analisis_aceite
        WHERE categoria='EXTRUIDOS'
        ORDER BY producto
    """)

    productos = cursor.fetchall()

    print("📋 Productos guardados en analisis_aceite para EXTRUIDOS:")
    if productos:
        for (producto,) in productos:
            print(f"   • '{producto}'")
    else:
        print("   (No hay productos guardados)")

    # Contar registros por producto
    print("\n📊 Conteo de registros por producto:")
    cursor.execute("""
        SELECT producto, COUNT(*) as total
        FROM analisis_aceite
        WHERE categoria='EXTRUIDOS'
        GROUP BY producto
        ORDER BY total DESC
    """)

    conteos = cursor.fetchall()
    for producto, total in conteos:
        print(f"   • '{producto}': {total} registros")

    # Mostrar todos los registros recientes
    print("\n🔍 Últimos 10 registros de EXTRUIDOS:")
    cursor.execute("""
        SELECT id, fecha, turno, producto, ov, agl
        FROM analisis_aceite
        WHERE categoria='EXTRUIDOS'
        ORDER BY fecha DESC, id DESC
        LIMIT 10
    """)

    registros = cursor.fetchall()
    for id, fecha, turno, producto, ov, agl in registros:
        print(f"   ID {id}: {fecha} {turno} - '{producto}' (OV: {ov}, AGL: {agl})")

    conn.close()
    print("\n✅ Verificación completada")

except sqlite3.Error as e:
    print(f"\n❌ Error de base de datos: {e}")
    exit(1)
except Exception as e:
    print(f"\n❌ Error inesperado: {e}")
    exit(1)
