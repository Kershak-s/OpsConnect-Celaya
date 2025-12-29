#!/usr/bin/env python
"""
Migración para agregar campos de Registro cada 4 Horas para TORTILLA
"""
import sqlite3
import os

def migrate():
    # Ruta a la base de datos
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'app.db')

    if not os.path.exists(db_path):
        print(f"Error: No se encontró la base de datos en {db_path}")
        return False

    print(f"Conectando a: {db_path}")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Columnas a agregar para TORTILLA 4 horas
    nuevas_columnas = {
        'registro_4horas_tortilla_aplica': 'INTEGER DEFAULT 0',
        'tortilla_tiempo_reposo': 'REAL',
        'tortilla_temp_masa': 'REAL',
        'tortilla_humedad_masa': 'REAL',
        'tortilla_peso_10_base': 'REAL',
        'tortilla_temp_freidor': 'REAL'
    }

    # Verificar columnas existentes
    cursor.execute("PRAGMA table_info(pae_registros)")
    columnas_existentes = [row[1] for row in cursor.fetchall()]
    print(f"Columnas existentes: {len(columnas_existentes)}")

    # Agregar columnas faltantes
    columnas_agregadas = 0
    for columna, tipo in nuevas_columnas.items():
        if columna not in columnas_existentes:
            try:
                sql = f"ALTER TABLE pae_registros ADD COLUMN {columna} {tipo}"
                cursor.execute(sql)
                print(f"  + Columna '{columna}' agregada exitosamente")
                columnas_agregadas += 1
            except sqlite3.OperationalError as e:
                print(f"  ! Error agregando '{columna}': {e}")
        else:
            print(f"  - Columna '{columna}' ya existe")

    conn.commit()

    # Verificar resultado
    cursor.execute("PRAGMA table_info(pae_registros)")
    columnas_finales = [row[1] for row in cursor.fetchall()]

    print(f"\nColumnas agregadas: {columnas_agregadas}")
    print(f"Total columnas ahora: {len(columnas_finales)}")

    # Verificar que todas las columnas nuevas existen
    print("\nVerificación de columnas TORTILLA 4 horas:")
    for columna in nuevas_columnas.keys():
        if columna in columnas_finales:
            print(f"  [OK] {columna}")
        else:
            print(f"  [ERROR] {columna} NO ENCONTRADA")

    conn.close()
    print("\nMigración completada exitosamente!")
    return True

if __name__ == '__main__':
    migrate()
