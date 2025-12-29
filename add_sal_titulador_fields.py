"""
Script de migración para agregar campos de Sal Titulador y Cloruros

IMPORTANTE: Ejecutar este script cuando el servidor esté detenido

Campos a agregar:
- cloruros_base: Valor único de cloruros para todos los tanques
- tanque1_sal_titulador: Sal titulador del tanque 1
- tanque2_sal_titulador: Sal titulador del tanque 2
- tanque3_sal_titulador: Sal titulador del tanque 3

Fórmula: Sal PT = Sal Titulador - Cloruros Base
"""

from app import create_app
from models import db, AnalisisCalidad

def add_columns():
    """Agrega las columnas de sal_titulador y cloruros_base"""

    app = create_app()
    with app.app_context():
        columnas = [
            'cloruros_base',
            'tanque1_sal_titulador',
            'tanque2_sal_titulador',
            'tanque3_sal_titulador'
        ]

        columnas_agregadas = 0
        columnas_existentes = 0

        # Agregar cada columna individualmente con transacciones separadas
        for columna in columnas:
            print(f"\n[*] Agregando columna {columna}...")
            try:
                with db.engine.connect() as conn:
                    with conn.begin():  # Transacción individual
                        conn.execute(db.text(f"ALTER TABLE analisis_calidad ADD COLUMN {columna} VARCHAR(20)"))
                print(f"[OK] {columna} agregado")
                columnas_agregadas += 1
            except Exception as e:
                error_str = str(e).lower()
                if "duplicate column" in error_str or "already exists" in error_str or "duplicate" in error_str:
                    print(f"[!] {columna} ya existe - omitiendo")
                    columnas_existentes += 1
                else:
                    print(f"[ERROR] Error agregando {columna}: {str(e)}")
                    print(f"[INFO] Continuando con las siguientes columnas...")
                    continue

        print("\n" + "="*60)
        print(f"[RESUMEN] Columnas agregadas: {columnas_agregadas}")
        print(f"[RESUMEN] Columnas ya existentes: {columnas_existentes}")
        print(f"[RESUMEN] Total procesadas: {len(columnas)}")
        print("="*60)

        if columnas_agregadas > 0 or columnas_existentes == len(columnas):
            print("\n[OK] Migracion completada exitosamente")
            print("\nAhora puedes reiniciar el servidor.")
        else:
            print("\n[ADVERTENCIA] Algunas columnas no pudieron ser agregadas")

if __name__ == "__main__":
    print("="*60)
    print("MIGRACION: Agregar campos Sal Titulador y Cloruros")
    print("="*60)
    print("\nEste script agregara los siguientes campos a analisis_calidad:")
    print("  - cloruros_base")
    print("  - tanque1_sal_titulador")
    print("  - tanque2_sal_titulador")
    print("  - tanque3_sal_titulador")
    print("\n" + "="*60)

    respuesta = input("\nDeseas continuar? (s/n): ")

    if respuesta.lower() == 's':
        add_columns()
    else:
        print("\n[CANCELADO] Migracion cancelada")
