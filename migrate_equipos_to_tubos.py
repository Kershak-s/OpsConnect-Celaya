#!/usr/bin/env python3
"""
Script para migrar registros de WeakLink PAPA de 'Equipo' a 'Tubo'
"""

from app import create_app
from models import db, WeakLink

def migrate_equipos_to_tubos():
    app = create_app()
    with app.app_context():
        # Buscar todos los registros de WeakLink de PAPA con 'Equipo'
        registros = WeakLink.query.filter(
            WeakLink.categoria == 'PAPA',
            WeakLink.maquina.like('Equipo%')
        ).all()

        print(f'🔍 Encontrados {len(registros)} registros con "Equipo" en PAPA')

        if len(registros) == 0:
            print('✅ No hay registros para migrar')
            return

        # Actualizar cada registro
        for registro in registros:
            old_value = registro.maquina
            new_value = old_value.replace('Equipo', 'Tubo')
            registro.maquina = new_value
            print(f'  📝 Actualizado ID {registro.id}: {old_value} -> {new_value}')

        # Guardar cambios
        db.session.commit()
        print(f'✅ {len(registros)} registros actualizados correctamente')

if __name__ == '__main__':
    migrate_equipos_to_tubos()
