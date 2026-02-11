#!/usr/bin/env python3
"""
Script para actualizar pae_visualizacion_routes.py con campos de Registro cada 4 Horas
"""

import re

def patch_visualizacion():
    with open('pae_visualizacion_routes.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Backup
    with open('pae_visualizacion_routes.py.backup_4horas', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Backup creado: pae_visualizacion_routes.py.backup_4horas")

    # PARCHE 1: Agregar rangos para campos 4 horas en RANGOS_EXTRUIDOS
    search_pattern1 = r"(RANGOS_EXTRUIDOS = \{[^}]+)'G': \{'verde': \[100, 100\], 'descripcion': 'Cobertura'\}\s*\}"
    
    replacement1 = r"""\1'G': {'verde': [100, 100], 'descripcion': 'Cobertura'},
    # Campos Registro cada 4 Horas (EXTRUIDOS)
    'EXT-HUMEDAD': {'verde': [15, 16.5], 'descripcion': 'Humedad cereal trompo'},
    'EXT-TIEMPO': {'verde': [30, 40], 'descripcion': 'Tiempo residencia freidor'},
    'EXT-TEMP': {'verde': [188, 194], 'descripcion': 'Temperatura freidor'},
    'EXT-SLURRY': {'verde': [40, 46], 'descripcion': 'Temperatura slurry marmitas'}
}"""

    if re.search(search_pattern1, content):
        content = re.sub(search_pattern1, replacement1, content)
        print("✅ Parche 1: Rangos de campos 4 horas agregados a RANGOS_EXTRUIDOS")
    else:
        print("⚠️  Parche 1: Patrón no encontrado")

    # PARCHE 2: Agregar sección de Registro cada 4 Horas a campos_extruidos
    search_pattern2 = r"(campos_extruidos = \{[^}]+\{'codigo': 'G', 'nombre': 'Cobertura'\}\s*\]\s*\})"
    
    replacement2 = r"""\1,
        'REGISTRO CADA 4 HORAS': [
            {'codigo': 'EXT-HUMEDAD', 'nombre': 'Humedad cereal trompo (%)'},
            {'codigo': 'EXT-TIEMPO', 'nombre': 'Tiempo residencia freidor (seg)'},
            {'codigo': 'EXT-TEMP', 'nombre': 'Temperatura freidor (°C)'},
            {'codigo': 'EXT-SLURRY', 'nombre': 'Temperatura slurry marmitas (°C)'}
        ]
    }"""

    if re.search(search_pattern2, content, re.DOTALL):
        content = re.sub(search_pattern2, replacement2, content, flags=re.DOTALL)
        print("✅ Parche 2: Sección 'REGISTRO CADA 4 HORAS' agregada a campos_extruidos")
    else:
        print("⚠️  Parche 2: Patrón no encontrado")

    # PARCHE 3: Agregar información de columnas específicas al response
    search_pattern3 = r"(response = \{[^}]+)'observaciones': registro\.observaciones or 'Sin observaciones',\s*'created_at': registro\.created_at\.strftime\('%d/%m/%Y %H:%M'\) if hasattr\(registro, 'created_at'\) else 'N/A'\s*\}\s*\n\s*return jsonify\(response\)"
    
    replacement3 = r"""\1'observaciones': registro.observaciones or 'Sin observaciones',
        'created_at': registro.created_at.strftime('%d/%m/%Y %H:%M') if hasattr(registro, 'created_at') else 'N/A',
        # Información de Registro cada 4 Horas (columnas específicas)
        'registro_4horas': {
            'aplica': bool(registro.registro_4horas_aplica),
            'humedad_cereal': registro.extrusor_humedad_cereal if registro.extrusor_humedad_cereal else None,
            'tiempo_freidor': registro.freidor_tiempo_residencia if registro.freidor_tiempo_residencia else None,
            'temp_freidor': registro.freidor_temperatura if registro.freidor_temperatura else None,
            'temp_slurry': registro.sazonado_temp_slurry if registro.sazonado_temp_slurry else None
        }
    }

    return jsonify(response)"""

    if re.search(search_pattern3, content, re.DOTALL):
        content = re.sub(search_pattern3, replacement3, content, flags=re.DOTALL)
        print("✅ Parche 3: Información de registro_4horas agregada al response")
    else:
        print("⚠️  Parche 3: Patrón no encontrado")

    # Guardar cambios
    with open('pae_visualizacion_routes.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ pae_visualizacion_routes.py actualizado exitosamente")
    print("📁 Backup guardado en: pae_visualizacion_routes.py.backup_4horas")

if __name__ == '__main__':
    patch_visualizacion()
