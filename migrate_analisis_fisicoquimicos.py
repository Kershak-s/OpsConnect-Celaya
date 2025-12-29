#!/usr/bin/env python3
"""
Script de migración para agregar campos PT Producto Terminado a la tabla analisis_calidad
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Agrega los nuevos campos PT Producto Terminado a la tabla analisis_calidad"""
    
    # Ruta a la base de datos
    db_path = os.path.join('instance', 'app.db')
    
    if not os.path.exists(db_path):
        print(f"❌ Base de datos no encontrada en: {db_path}")
        print("   Asegúrate de que la aplicación haya sido ejecutada al menos una vez.")
        return False
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si la tabla existe
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='analisis_calidad'
        """)
        
        if not cursor.fetchone():
            print("❌ Tabla 'analisis_calidad' no encontrada")
            return False
        
        print("📊 Iniciando migración de la tabla analisis_calidad...")
        
        # Verificar si las columnas ya existen
        cursor.execute("PRAGMA table_info(analisis_calidad)")
        existing_columns = [column[1] for column in cursor.fetchall()]
        
        new_columns = [
            'aceite_pt_producto_terminado',
            'humedad_pt_producto_terminado', 
            'sal_pt_producto_terminado'
        ]
        
        columns_to_add = []
        for column in new_columns:
            if column not in existing_columns:
                columns_to_add.append(column)
            else:
                print(f"⚠️  La columna '{column}' ya existe")
        
        if not columns_to_add:
            print("✅ Todas las columnas ya existen. No es necesaria la migración.")
            return True
        
        # Agregar las nuevas columnas
        for column in columns_to_add:
            try:
                cursor.execute(f"""
                    ALTER TABLE analisis_calidad 
                    ADD COLUMN {column} VARCHAR(20)
                """)
                print(f"✅ Columna '{column}' agregada exitosamente")
            except sqlite3.Error as e:
                print(f"❌ Error al agregar la columna '{column}': {e}")
                conn.rollback()
                return False
        
        # Confirmar los cambios
        conn.commit()
        
        # Verificar las columnas finales
        cursor.execute("PRAGMA table_info(analisis_calidad)")
        final_columns = [column[1] for column in cursor.fetchall()]
        
        print("\n📋 Estructura final de la tabla:")
        for i, column in enumerate(final_columns, 1):
            print(f"   {i:2d}. {column}")
        
        print(f"\n✅ Migración completada exitosamente")
        print(f"   📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   📊 Columnas agregadas: {len(columns_to_add)}")
        
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Error de base de datos: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False
    finally:
        if conn:
            conn.close()

def verify_migration():
    """Verifica que la migración se haya aplicado correctamente"""
    
    db_path = os.path.join('instance', 'app.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar estructura de la tabla
        cursor.execute("PRAGMA table_info(analisis_calidad)")
        columns = [column[1] for column in cursor.fetchall()]
        
        required_columns = [
            'aceite_pt_producto_terminado',
            'humedad_pt_producto_terminado',
            'sal_pt_producto_terminado'
        ]
        
        missing_columns = []
        for column in required_columns:
            if column not in columns:
                missing_columns.append(column)
        
        if missing_columns:
            print(f"❌ Faltan las siguientes columnas: {missing_columns}")
            return False
        else:
            print("✅ Verificación exitosa: Todas las columnas están presentes")
            return True
            
    except Exception as e:
        print(f"❌ Error durante la verificación: {e}")
        return False
    finally:
        if conn:
            conn.close()

def rollback_migration():
    """Rollback de la migración - elimina las columnas agregadas"""
    
    print("⚠️  ROLLBACK: Este proceso eliminará las columnas agregadas")
    response = input("¿Estás seguro? (escriba 'SI' para confirmar): ")
    
    if response != 'SI':
        print("❌ Rollback cancelado")
        return False
    
    db_path = os.path.join('instance', 'app.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # SQLite no soporta DROP COLUMN directamente
        # Necesitamos recrear la tabla sin las columnas
        print("📊 Iniciando rollback...")
        
        # Obtener esquema actual
        cursor.execute("SELECT sql FROM sqlite_master WHERE name='analisis_calidad'")
        original_schema = cursor.fetchone()[0]
        
        print("⚠️  Para hacer rollback en SQLite, se requiere recrear la tabla")
        print("   Este proceso es complejo y puede causar pérdida de datos")
        print("   Se recomienda hacer un backup de la base de datos antes")
        
        return False
        
    except Exception as e:
        print(f"❌ Error durante el rollback: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🔧 MIGRACIÓN DE BASE DE DATOS - Análisis Fisicoquímicos")
    print("=" * 60)
    print()
    
    # Verificar directorio actual
    if not os.path.exists('app.py'):
        print("❌ Este script debe ejecutarse desde el directorio raíz del proyecto")
        print("   Asegúrate de estar en la carpeta app_gestion")
        exit(1)
    
    # Ejecutar migración
    success = migrate_database()
    
    if success:
        print()
        verify_migration()
        print()
        print("🎉 ¡Migración completada!")
        print("   Ahora puedes reiniciar la aplicación para usar los nuevos campos")
    else:
        print()
        print("❌ La migración falló")
        print("   Revisa los errores anteriores y vuelve a intentar")
        
    print()
    print("=" * 60)
