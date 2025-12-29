"""
Script automático para verificar y agregar columnas faltantes
Ejecutar cada vez que cambies de base de datos
"""

from app import create_app
from models import db
import sys

def check_and_add_columns():
    """Verifica si las columnas existen y las agrega si faltan"""

    app = create_app()
    with app.app_context():
        print("="*60)
        print("Verificando columnas en la base de datos...")
        print("="*60)

        # Columnas requeridas
        columnas_requeridas = [
            'cloruros_base',
            'tanque1_sal_titulador',
            'tanque2_sal_titulador',
            'tanque3_sal_titulador'
        ]

        # Verificar qué columnas existen
        columnas_existentes = []
        columnas_faltantes = []

        with db.engine.connect() as conn:
            # Obtener info de la tabla
            result = conn.execute(db.text("PRAGMA table_info(analisis_calidad)"))
            columnas_actuales = [row[1] for row in result]

            for columna in columnas_requeridas:
                if columna in columnas_actuales:
                    columnas_existentes.append(columna)
                else:
                    columnas_faltantes.append(columna)

        print(f"\n[INFO] Columnas existentes: {len(columnas_existentes)}/{len(columnas_requeridas)}")
        if columnas_existentes:
            for col in columnas_existentes:
                print(f"  [OK] {col}")

        if columnas_faltantes:
            print(f"\n[ADVERTENCIA] Columnas faltantes: {len(columnas_faltantes)}")
            for col in columnas_faltantes:
                print(f"  [!] {col}")

            print("\n[*] Agregando columnas faltantes...")

            # Agregar columnas faltantes
            agregadas = 0
            for columna in columnas_faltantes:
                try:
                    with db.engine.connect() as conn:
                        with conn.begin():
                            conn.execute(db.text(f"ALTER TABLE analisis_calidad ADD COLUMN {columna} VARCHAR(20)"))
                    print(f"  [OK] {columna} agregada")
                    agregadas += 1
                except Exception as e:
                    print(f"  [ERROR] Error agregando {columna}: {str(e)}")

            print(f"\n[RESUMEN] {agregadas} columnas agregadas exitosamente")
        else:
            print("\n[OK] Todas las columnas requeridas ya existen")

        print("="*60)
        print("[OK] Verificacion completada")
        print("="*60)

        return len(columnas_faltantes) == 0 or agregadas == len(columnas_faltantes)

if __name__ == "__main__":
    try:
        success = check_and_add_columns()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[ERROR] Error durante la verificacion: {str(e)}")
        sys.exit(1)
