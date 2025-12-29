"""
Script para agregar campos de Rotura al modelo PAERegistro
"""
import sys
import os

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from sqlalchemy import text

def add_rotura_fields():
    app = create_app()
    
    with app.app_context():
        try:
            # Verificar si las columnas ya existen
            inspector = db.inspect(db.engine)
            existing_columns = [col['name'] for col in inspector.get_columns('pae_registros')]
            
            columns_to_add = [
                ('rotura_aplica', 'BOOLEAN DEFAULT 0'),
                ('hojuela_entera', 'FLOAT'),
                ('hojuela_entera_fiesta', 'FLOAT'),
                ('peladeras_scrap', 'FLOAT'),
                ('rotura_observaciones', 'TEXT')
            ]
            
            for column_name, column_type in columns_to_add:
                if column_name not in existing_columns:
                    print(f"Agregando columna: {column_name}")
                    sql = f"ALTER TABLE pae_registros ADD COLUMN {column_name} {column_type}"
                    db.session.execute(text(sql))
                else:
                    print(f"Columna {column_name} ya existe, saltando...")
            
            db.session.commit()
            print("\n✓ Campos de Rotura agregados exitosamente a la tabla pae_registros")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n✗ Error al agregar campos: {str(e)}")
            raise

if __name__ == '__main__':
    add_rotura_fields()
