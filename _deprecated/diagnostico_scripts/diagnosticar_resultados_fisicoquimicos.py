#!/usr/bin/env python3
"""
Diagnostica por qué no se muestran resultados en EXTRUIDOS
"""

import sqlite3
from datetime import datetime, timedelta

# Conectar a la base de datos
conn = sqlite3.connect('instance/app.db')
cursor = conn.cursor()

print("=" * 70)
print("🔍 DIAGNÓSTICO - Resultados Fisicoquímicos EXTRUIDOS")
print("=" * 70)

# 1. Verificar si existe la tabla
print("\n1️⃣ Verificando tabla analisis_calidad...")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='analisis_calidad'")
tabla = cursor.fetchone()
if tabla:
    print(f"   ✅ Tabla 'analisis_calidad' existe")
else:
    print(f"   ❌ Tabla 'analisis_calidad' NO existe")
    conn.close()
    exit(1)

# 2. Contar registros de EXTRUIDOS
print("\n2️⃣ Contando registros de EXTRUIDOS...")
cursor.execute("SELECT COUNT(*) FROM analisis_calidad WHERE categoria = 'EXTRUIDOS'")
total_extruidos = cursor.fetchone()[0]
print(f"   Total registros EXTRUIDOS: {total_extruidos}")

# 3. Ver los últimos 5 registros
print("\n3️⃣ Últimos 5 registros de EXTRUIDOS:")
cursor.execute("""
    SELECT id, folio, fecha, turno, producto, 
           humedad_base_frita, aceite_base_frita,
           tanque1_aceite_pt, tanque1_humedad_pt, tanque1_sal_pt
    FROM analisis_calidad 
    WHERE categoria = 'EXTRUIDOS' 
    ORDER BY fecha DESC, created_at DESC 
    LIMIT 5
""")
registros = cursor.fetchall()

if registros:
    for reg in registros:
        print(f"\n   ID: {reg[0]}")
        print(f"   Folio: {reg[1]}")
        print(f"   Fecha: {reg[2]}")
        print(f"   Turno: {reg[3]}")
        print(f"   Producto: {reg[4]}")
        print(f"   Humedad Base: {reg[5]}")
        print(f"   Aceite Base: {reg[6]}")
        print(f"   T1 Aceite PT: {reg[7]}")
        print(f"   T1 Humedad PT: {reg[8]}")
        print(f"   T1 Sal PT: {reg[9]}")
else:
    print("   ⚠️ No hay registros de EXTRUIDOS")

# 4. Ver distribución por producto
print("\n4️⃣ Distribución por producto:")
cursor.execute("""
    SELECT producto, COUNT(*) as cantidad
    FROM analisis_calidad 
    WHERE categoria = 'EXTRUIDOS'
    GROUP BY producto
    ORDER BY cantidad DESC
""")
productos = cursor.fetchall()
if productos:
    for prod in productos:
        print(f"   {prod[0]}: {prod[1]} registros")
else:
    print("   ⚠️ No hay productos")

# 5. Verificar registros del último mes
print("\n5️⃣ Registros del último mes:")
fecha_mes_atras = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
cursor.execute("""
    SELECT COUNT(*) 
    FROM analisis_calidad 
    WHERE categoria = 'EXTRUIDOS' 
    AND fecha >= ?
""", (fecha_mes_atras,))
registros_mes = cursor.fetchone()[0]
print(f"   Registros últimos 30 días: {registros_mes}")

# 6. Verificar registros de ayer y hoy (el default del filtro)
print("\n6️⃣ Registros de ayer y hoy (default del filtro):")
ayer = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
hoy = datetime.now().strftime('%Y-%m-%d')
cursor.execute("""
    SELECT COUNT(*) 
    FROM analisis_calidad 
    WHERE categoria = 'EXTRUIDOS' 
    AND fecha BETWEEN ? AND ?
""", (ayer, hoy))
registros_ayer_hoy = cursor.fetchone()[0]
print(f"   Registros entre {ayer} y {hoy}: {registros_ayer_hoy}")

if registros_ayer_hoy == 0:
    print(f"   ⚠️ NO HAY REGISTROS EN EL RANGO DEFAULT (ayer-hoy)")
    print(f"   💡 Esto explica por qué no se ven resultados!")

# 7. Ver columnas de la tabla
print("\n7️⃣ Estructura de la tabla:")
cursor.execute("PRAGMA table_info(analisis_calidad)")
columnas = cursor.fetchall()
print(f"   Total columnas: {len(columnas)}")
campos_importantes = ['humedad_base_frita', 'aceite_base_frita', 'tanque1_aceite_pt', 
                      'tanque1_humedad_pt', 'tanque1_sal_pt']
for col in columnas:
    if col[1] in campos_importantes:
        print(f"   ✓ {col[1]}: {col[2]}")

conn.close()

print("\n" + "=" * 70)
print("📊 RESUMEN:")
print(f"   - Total EXTRUIDOS: {total_extruidos}")
print(f"   - Últimos 30 días: {registros_mes}")
print(f"   - Ayer a hoy: {registros_ayer_hoy}")
if registros_ayer_hoy == 0 and total_extruidos > 0:
    print(f"\n💡 PROBLEMA IDENTIFICADO:")
    print(f"   El filtro por defecto busca registros de AYER a HOY")
    print(f"   pero NO hay registros en ese rango.")
    print(f"\n✅ SOLUCIÓN:")
    print(f"   1. Cambiar periodo a 'Último Mes' o 'Todo el tiempo'")
    print(f"   2. O crear registros nuevos para hoy")
print("=" * 70)
