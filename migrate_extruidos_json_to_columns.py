#!/usr/bin/env python3
"""
Script de migración: Carga datos de Registro cada 4 Horas desde JSON a columnas
Para registros EXTRUIDOS que tienen datos en el campo 'data' pero no en las columnas específicas
"""

import sqlite3
import json
import sys
from pathlib import Path
from datetime import datetime

def migrar_datos_extruidos():
    """Migra datos del JSON 'data' a las columnas específicas de registro_4horas"""

    db_path = Path(__file__).parent / 'instance' / 'app.db'

    if not db_path.exists():
        print(f"❌ Error: No se encontró la base de datos en {db_path}")
        return False

    print(f"📂 Conectando a base de datos: {db_path}")

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Obtener todos los registros EXTRUIDOS
        print("\n🔍 Buscando registros EXTRUIDOS con datos JSON...")
        cursor.execute("""
            SELECT id, fecha, hora_bloque, producto, data,
                   registro_4horas_aplica,
                   extrusor_humedad_cereal,
                   freidor_tiempo_residencia,
                   freidor_temperatura,
                   sazonado_temp_slurry
            FROM pae_registros
            WHERE categoria = 'EXTRUIDOS'
            ORDER BY fecha DESC, hora_bloque DESC
        """)

        registros = cursor.fetchall()
        print(f"📊 Encontrados {len(registros)} registros EXTRUIDOS")

        registros_actualizados = 0
        registros_con_datos_4h = 0
        registros_sin_cambios = 0

        for registro in registros:
            (id_reg, fecha, hora_bloque, producto, data_json,
             registro_4h_aplica, humedad_actual, tiempo_actual,
             temp_actual, slurry_actual) = registro

            # Si no hay JSON, saltar
            if not data_json:
                continue

            try:
                data = json.loads(data_json)
            except json.JSONDecodeError:
                print(f"⚠️  Registro {id_reg}: JSON inválido, saltando...")
                continue

            # Extraer valores del JSON
            ext_humedad = data.get('EXT-HUMEDAD')
            ext_tiempo = data.get('EXT-TIEMPO')
            ext_temp = data.get('EXT-TEMP')
            ext_slurry = data.get('EXT-SLURRY')

            # Verificar si hay algún dato de 4 horas en el JSON
            tiene_datos_4h = any([ext_humedad, ext_tiempo, ext_temp, ext_slurry])

            if tiene_datos_4h:
                registros_con_datos_4h += 1

                # Verificar si las columnas ya tienen datos
                columnas_vacias = all([
                    humedad_actual is None,
                    tiempo_actual is None,
                    temp_actual is None,
                    slurry_actual is None
                ])

                if columnas_vacias:
                    # Migrar datos del JSON a las columnas
                    print(f"📝 Migrando registro {id_reg} - {fecha} {hora_bloque}:00 - {producto}")
                    print(f"   Datos: Humedad={ext_humedad}, Tiempo={ext_tiempo}, Temp={ext_temp}, Slurry={ext_slurry}")

                    cursor.execute("""
                        UPDATE pae_registros
                        SET registro_4horas_aplica = ?,
                            extrusor_humedad_cereal = ?,
                            freidor_tiempo_residencia = ?,
                            freidor_temperatura = ?,
                            sazonado_temp_slurry = ?
                        WHERE id = ?
                    """, (
                        1,  # TRUE
                        float(ext_humedad) if ext_humedad else None,
                        float(ext_tiempo) if ext_tiempo else None,
                        float(ext_temp) if ext_temp else None,
                        float(ext_slurry) if ext_slurry else None,
                        id_reg
                    ))

                    registros_actualizados += 1
                else:
                    registros_sin_cambios += 1

        # Confirmar cambios
        conn.commit()

        # Mostrar resumen
        print("\n" + "="*60)
        print("📊 RESUMEN DE MIGRACIÓN")
        print("="*60)
        print(f"Total de registros EXTRUIDOS: {len(registros)}")
        print(f"Registros con datos 4 horas en JSON: {registros_con_datos_4h}")
        print(f"Registros migrados (JSON → Columnas): {registros_actualizados}")
        print(f"Registros que ya tenían datos en columnas: {registros_sin_cambios}")
        print("="*60)

        # Verificación final
        print("\n🔍 Verificación post-migración...")
        cursor.execute("""
            SELECT COUNT(*)
            FROM pae_registros
            WHERE categoria = 'EXTRUIDOS'
            AND registro_4horas_aplica = 1
        """)
        count = cursor.fetchone()[0]
        print(f"✅ Registros con registro_4horas_aplica = TRUE: {count}")

        # Mostrar algunos ejemplos
        if registros_actualizados > 0:
            print("\n📋 Ejemplos de registros migrados:")
            cursor.execute("""
                SELECT fecha, hora_bloque, producto,
                       extrusor_humedad_cereal,
                       freidor_tiempo_residencia,
                       freidor_temperatura,
                       sazonado_temp_slurry
                FROM pae_registros
                WHERE categoria = 'EXTRUIDOS'
                AND registro_4horas_aplica = 1
                ORDER BY fecha DESC, hora_bloque DESC
                LIMIT 3
            """)

            for row in cursor.fetchall():
                fecha, hora, prod, hum, tiempo, temp, slurry = row
                print(f"  • {fecha} {hora}:00 - {prod}")
                print(f"    Humedad: {hum}% | Tiempo: {tiempo}s | Temp: {temp}°C | Slurry: {slurry}°C")

        conn.close()

        print("\n✅ Migración completada exitosamente!")
        return True

    except sqlite3.Error as e:
        print(f"\n❌ Error de base de datos: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("MIGRACIÓN: Datos JSON → Columnas (Registro 4 Horas EXTRUIDOS)")
    print("=" * 60)
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    if migrar_datos_extruidos():
        print("\n" + "=" * 60)
        print("✅ PROCESO COMPLETADO EXITOSAMENTE")
        print("=" * 60)
        sys.exit(0)
    else:
        print("\n" + "=" * 60)
        print("❌ MIGRACIÓN FALLIDA")
        print("=" * 60)
        sys.exit(1)
