#!/usr/bin/env python3
"""
Script para migrar datos del campo JSON 'data' a las columnas individuales de la BD
"""
import sqlite3
import json

def migrar_datos():
    conn = sqlite3.connect('instance/app.db')
    cursor = conn.cursor()
    
    # Obtener todos los registros con datos JSON
    cursor.execute("""
        SELECT id, categoria, data 
        FROM pae_registros 
        WHERE data IS NOT NULL AND data != ''
    """)
    registros = cursor.fetchall()
    
    print(f"=== MIGRACIÓN JSON → COLUMNAS ===")
    print(f"Total registros a procesar: {len(registros)}")
    
    actualizados = 0
    errores = 0
    
    for registro in registros:
        reg_id = registro[0]
        categoria = registro[1]
        data_json = registro[2]
        
        try:
            data = json.loads(data_json)
            
            # Solo para EXTRUIDOS - campos de 4 horas
            if categoria == 'EXTRUIDOS':
                ext_humedad = data.get('EXT-HUMEDAD')
                ext_tiempo = data.get('EXT-TIEMPO')
                ext_temp = data.get('EXT-TEMP')
                ext_slurry = data.get('EXT-SLURRY')
                
                # Si hay algún dato de 4 horas
                if any([ext_humedad, ext_tiempo, ext_temp, ext_slurry]):
                    cursor.execute("""
                        UPDATE pae_registros SET
                            registro_4horas_aplica = 1,
                            extrusor_humedad_cereal = ?,
                            freidor_tiempo_residencia = ?,
                            freidor_temperatura = ?,
                            sazonado_temp_slurry = ?
                        WHERE id = ?
                    """, (
                        float(ext_humedad) if ext_humedad and ext_humedad != '0' else None,
                        float(ext_tiempo) if ext_tiempo and ext_tiempo != '0' else None,
                        float(ext_temp) if ext_temp and ext_temp != '0' else None,
                        float(ext_slurry) if ext_slurry and ext_slurry != '0' else None,
                        reg_id
                    ))
                    actualizados += 1
                    
        except (json.JSONDecodeError, ValueError, TypeError) as e:
            errores += 1
            print(f"  ❌ Error en registro {reg_id}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n=== RESULTADO ===")
    print(f"✅ Registros actualizados: {actualizados}")
    print(f"❌ Errores: {errores}")
    print(f"📊 Total procesados: {len(registros)}")

if __name__ == '__main__':
    migrar_datos()
