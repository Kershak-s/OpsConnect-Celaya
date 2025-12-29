#!/usr/bin/env python3
"""
Script para actualizar app.py con el código de Registro cada 4 Horas para EXTRUIDOS
"""

import re

def patch_app_py():
    with open('app.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Backup
    with open('app.py.backup_4horas', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Backup creado: app.py.backup_4horas")

    # PARCHE 1: Agregar extracción de campos 4 horas después de campos de rotura
    search_pattern1 = r"(rotura_observaciones = request\.form\.get\('rotura_observaciones', ''\)\s*\n\s*# Validar campos obligatorios)"
    
    replacement1 = r"""rotura_observaciones = request.form.get('rotura_observaciones', '')

                # Campos de Registro cada 4 Horas (solo para EXTRUIDOS)
                # Extraer del JSON para guardar también en columnas
                registro_4horas_aplica = False
                extrusor_humedad_cereal = None
                freidor_tiempo_residencia = None
                freidor_temperatura = None
                sazonado_temp_slurry = None

                if category == 'EXTRUIDOS':
                    try:
                        data_dict = json.loads(data_json)
                        ext_humedad = data_dict.get('EXT-HUMEDAD')
                        ext_tiempo = data_dict.get('EXT-TIEMPO')
                        ext_temp = data_dict.get('EXT-TEMP')
                        ext_slurry = data_dict.get('EXT-SLURRY')

                        # Si hay algún dato de 4 horas, marcar como aplicable
                        if any([ext_humedad, ext_tiempo, ext_temp, ext_slurry]):
                            registro_4horas_aplica = True
                            extrusor_humedad_cereal = float(ext_humedad) if ext_humedad else None
                            freidor_tiempo_residencia = float(ext_tiempo) if ext_tiempo else None
                            freidor_temperatura = float(ext_temp) if ext_temp else None
                            sazonado_temp_slurry = float(ext_slurry) if ext_slurry else None
                    except (json.JSONDecodeError, ValueError, TypeError) as e:
                        # Si hay error, continuar sin campos de 4 horas
                        print(f"Advertencia: No se pudieron extraer campos 4 horas: {e}")
                        pass

                # Validar campos obligatorios"""

    if re.search(search_pattern1, content):
        content = re.sub(search_pattern1, replacement1, content)
        print("✅ Parche 1: Extracción de campos 4 horas agregada")
    else:
        print("⚠️  Parche 1: Patrón no encontrado, verificar manualmente")

    # PARCHE 2: Agregar campos al crear nuevo registro
    search_pattern2 = r"(rotura_observaciones=rotura_observaciones if category == 'PAPA' else None,\s*\n\s*created_by=current_user\.id)"
    
    replacement2 = r"""rotura_observaciones=rotura_observaciones if category == 'PAPA' else None,
                        # Campos de Registro cada 4 Horas (solo para EXTRUIDOS)
                        registro_4horas_aplica=registro_4horas_aplica if category == 'EXTRUIDOS' else False,
                        extrusor_humedad_cereal=extrusor_humedad_cereal if category == 'EXTRUIDOS' else None,
                        freidor_tiempo_residencia=freidor_tiempo_residencia if category == 'EXTRUIDOS' else None,
                        freidor_temperatura=freidor_temperatura if category == 'EXTRUIDOS' else None,
                        sazonado_temp_slurry=sazonado_temp_slurry if category == 'EXTRUIDOS' else None,
                        created_by=current_user.id"""

    if re.search(search_pattern2, content):
        content = re.sub(search_pattern2, replacement2, content)
        print("✅ Parche 2: Campos 4 horas en creación de registro agregados")
    else:
        print("⚠️  Parche 2: Patrón no encontrado, verificar manualmente")

    # PARCHE 3: Agregar campos al actualizar registro existente
    search_pattern3 = r"(existing_record\.rotura_observaciones = rotura_observaciones\s*\n\s*\n\s*db\.session\.commit\(\))"
    
    replacement3 = r"""existing_record.rotura_observaciones = rotura_observaciones

                    # Actualizar campos de Registro cada 4 Horas (solo para EXTRUIDOS)
                    if category == 'EXTRUIDOS':
                        existing_record.registro_4horas_aplica = registro_4horas_aplica
                        existing_record.extrusor_humedad_cereal = extrusor_humedad_cereal
                        existing_record.freidor_tiempo_residencia = freidor_tiempo_residencia
                        existing_record.freidor_temperatura = freidor_temperatura
                        existing_record.sazonado_temp_slurry = sazonado_temp_slurry

                    db.session.commit()"""

    if re.search(search_pattern3, content):
        content = re.sub(search_pattern3, replacement3, content)
        print("✅ Parche 3: Campos 4 horas en actualización de registro agregados")
    else:
        print("⚠️  Parche 3: Patrón no encontrado, verificar manualmente")

    # Guardar cambios
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Archivo app.py actualizado exitosamente")
    print("📁 Backup guardado en: app.py.backup_4horas")

if __name__ == '__main__':
    patch_app_py()
