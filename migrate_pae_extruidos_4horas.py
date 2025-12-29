#!/usr/bin/env python3
"""
Script de migración para agregar campos de 'Registro cada 4 Horas' para EXTRUIDOS
en la tabla pae_registros
"""

import sqlite3
import sys
from pathlib import Path

def migrar_base_datos():
    """Agrega los nuevos campos para Registro cada 4 Horas de EXTRUIDOS"""

    # Ruta a la base de datos
    db_path = Path(__file__).parent / 'instance' / 'app.db'

    if not db_path.exists():
        print(f"❌ Error: No se encontró la base de datos en {db_path}")
        return False

    print(f"📂 Conectando a base de datos: {db_path}")

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        print("\n🔍 Verificando tabla pae_registros...")

        # Verificar que la tabla existe
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name='pae_registros'
        """)

        if not cursor.fetchone():
            print("❌ Error: La tabla pae_registros no existe")
            return False

        print("✅ Tabla encontrada")

        # Verificar columnas actuales
        cursor.execute("PRAGMA table_info(pae_registros)")
        columnas_existentes = [col[1] for col in cursor.fetchall()]

        print(f"\n📋 Columnas actuales: {len(columnas_existentes)}")

        # Campos a agregar
        nuevos_campos = {
            'registro_4horas_aplica': 'INTEGER DEFAULT 0',
            'extrusor_humedad_cereal': 'REAL',
            'freidor_tiempo_residencia': 'REAL',
            'freidor_temperatura': 'REAL',
            'sazonado_temp_slurry': 'REAL'
        }

        campos_agregados = 0
        campos_existentes_ya = 0

        print("\n🔧 Iniciando migración...")

        for campo, tipo in nuevos_campos.items():
            if campo in columnas_existentes:
                print(f"⚠️  Campo '{campo}' ya existe, saltando...")
                campos_existentes_ya += 1
            else:
                try:
                    sql = f"ALTER TABLE pae_registros ADD COLUMN {campo} {tipo}"
                    print(f"   Agregando campo: {campo} ({tipo})")
                    cursor.execute(sql)
                    campos_agregados += 1
                    print(f"   ✅ Campo '{campo}' agregado exitosamente")
                except sqlite3.Error as e:
                    print(f"   ❌ Error al agregar campo '{campo}': {e}")
                    return False

        # Confirmar cambios
        conn.commit()

        # Verificar migración
        cursor.execute("PRAGMA table_info(pae_registros)")
        columnas_finales = [col[1] for col in cursor.fetchall()]

        print(f"\n📊 Resumen de migración:")
        print(f"   • Campos agregados: {campos_agregados}")
        print(f"   • Campos que ya existían: {campos_existentes_ya}")
        print(f"   • Total de columnas ahora: {len(columnas_finales)}")

        print("\n✅ Migración completada exitosamente!")

        # Mostrar los nuevos campos agregados
        if campos_agregados > 0:
            print("\n📝 Nuevos campos agregados:")
            for campo in nuevos_campos.keys():
                if campo in columnas_finales and campo not in columnas_existentes:
                    print(f"   • {campo}")

        conn.close()
        return True

    except sqlite3.Error as e:
        print(f"\n❌ Error de base de datos: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        return False

def verificar_migracion():
    """Verifica que los campos fueron agregados correctamente"""

    db_path = Path(__file__).parent / 'instance' / 'app.db'

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("PRAGMA table_info(pae_registros)")
        columnas = {col[1]: col[2] for col in cursor.fetchall()}

        campos_verificar = [
            'registro_4horas_aplica',
            'extrusor_humedad_cereal',
            'freidor_tiempo_residencia',
            'freidor_temperatura',
            'sazonado_temp_slurry'
        ]

        print("\n🔍 Verificación de campos:")
        todos_presentes = True

        for campo in campos_verificar:
            if campo in columnas:
                print(f"   ✅ {campo}: {columnas[campo]}")
            else:
                print(f"   ❌ {campo}: NO ENCONTRADO")
                todos_presentes = False

        conn.close()

        if todos_presentes:
            print("\n✅ Todos los campos están presentes!")
        else:
            print("\n⚠️  Faltan algunos campos")

        return todos_presentes

    except Exception as e:
        print(f"\n❌ Error al verificar: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("MIGRACIÓN: Registro cada 4 Horas para EXTRUIDOS (PAE)")
    print("=" * 60)

    # Ejecutar migración
    if migrar_base_datos():
        print("\n" + "=" * 60)

        # Verificar migración
        verificar_migracion()

        print("\n" + "=" * 60)
        print("✅ PROCESO COMPLETADO")
        print("=" * 60)
        sys.exit(0)
    else:
        print("\n" + "=" * 60)
        print("❌ MIGRACIÓN FALLIDA")
        print("=" * 60)
        sys.exit(1)
