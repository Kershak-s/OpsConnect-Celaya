#!/usr/bin/env python3
"""
Script de prueba para verificar que la generación de Excel funciona
"""

import sys
import sqlite3
import json
from datetime import datetime
from pathlib import Path

def test_excel_data():
    """Prueba la extracción de datos para Excel"""
    
    db_path = Path(__file__).parent / 'instance' / 'app.db'
    
    if not db_path.exists():
        print(f"❌ Base de datos no encontrada: {db_path}")
        return False
    
    print(f"📂 Conectando a: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener registros EXTRUIDOS recientes
        cursor.execute("""
            SELECT id, fecha, turno, hora_bloque, producto, data,
                   registro_4horas_aplica,
                   extrusor_humedad_cereal,
                   freidor_tiempo_residencia,
                   freidor_temperatura,
                   sazonado_temp_slurry
            FROM pae_registros
            WHERE categoria = 'EXTRUIDOS'
            ORDER BY fecha DESC, hora_bloque DESC
            LIMIT 5
        """)
        
        registros = cursor.fetchall()
        print(f"\n📊 Encontrados {len(registros)} registros EXTRUIDOS\n")
        
        for reg in registros:
            (id_reg, fecha, turno, hora, producto, data_json,
             aplica_4h, humedad, tiempo, temp, slurry) = reg
            
            print(f"ID: {id_reg} | {fecha} {hora}:00 | {producto}")
            
            # Parsear JSON
            if data_json:
                try:
                    data = json.loads(data_json)
                    campos_4h = {
                        'EXT-HUMEDAD': data.get('EXT-HUMEDAD'),
                        'EXT-TIEMPO': data.get('EXT-TIEMPO'),
                        'EXT-TEMP': data.get('EXT-TEMP'),
                        'EXT-SLURRY': data.get('EXT-SLURRY')
                    }
                    
                    print(f"  📝 JSON 4H: {campos_4h}")
                except:
                    print(f"  ⚠️  Error al parsear JSON")
            
            # Mostrar columnas
            print(f"  📊 Columnas:")
            print(f"     Aplica: {aplica_4h}")
            print(f"     Humedad: {humedad}")
            print(f"     Tiempo: {tiempo}")
            print(f"     Temp: {temp}")
            print(f"     Slurry: {slurry}")
            print()
        
        conn.close()
        print("✅ Prueba completada exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("="*60)
    print("PRUEBA: Datos para Generación de Excel")
    print("="*60)
    
    if test_excel_data():
        print("\n✅ Los datos están disponibles para Excel")
        sys.exit(0)
    else:
        print("\n❌ Hay problemas con los datos")
        sys.exit(1)
