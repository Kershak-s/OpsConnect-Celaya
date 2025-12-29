#!/usr/bin/env python3
"""
Script para actualizar app.py con los campos de 4 horas en la exportación Excel
"""

import re

def patch_excel():
    with open('app.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Backup
    with open('app.py.backup_excel_4horas', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Backup creado: app.py.backup_excel_4horas")

    # PARCHE 1: Actualizar atributos_map para EXTRUIDOS en crear_detallado_pae_excel
    # Buscar la primera aparición (línea ~2730)
    search_pattern1 = r"(if categoria == 'EXTRUIDOS':\s*\n\s*atributos_map = \{[^}]+)'G': 'Cobertura'\s*\}"
    
    replacement1 = r"""\1'G': 'Cobertura',
                # Campos de Registro cada 4 Horas
                'EXT-HUMEDAD': 'Humedad Cereal Trompo (%)',
                'EXT-TIEMPO': 'Tiempo Residencia Freidor (seg)',
                'EXT-TEMP': 'Temperatura Freidor (°C)',
                'EXT-SLURRY': 'Temperatura Slurry Marmitas (°C)'
            }"""

    matches = re.findall(search_pattern1, content)
    if matches:
        content = re.sub(search_pattern1, replacement1, content, count=1)
        print("✅ Parche 1: Campos 4 horas agregados a atributos_map (primera función)")
    else:
        print("⚠️  Parche 1: Patrón no encontrado")

    # PARCHE 2: Buscar y actualizar la segunda aparición de crear_detallado_pae_excel (línea ~3730)
    # Contar las apariciones y reemplazar la segunda
    pattern_all = r"if categoria == 'EXTRUIDOS':\s*\n\s*atributos_map = \{[^}]+'G': 'Cobertura'\s*\}"
    matches_all = list(re.finditer(pattern_all, content))
    
    if len(matches_all) >= 2:
        # Reemplazar la segunda aparición
        start_pos = matches_all[1].start()
        end_pos = matches_all[1].end()
        
        old_block = content[start_pos:end_pos]
        new_block = old_block.replace(
            "'G': 'Cobertura'\n            }",
            """'G': 'Cobertura',
                # Campos de Registro cada 4 Horas
                'EXT-HUMEDAD': 'Humedad Cereal Trompo (%)',
                'EXT-TIEMPO': 'Tiempo Residencia Freidor (seg)',
                'EXT-TEMP': 'Temperatura Freidor (°C)',
                'EXT-SLURRY': 'Temperatura Slurry Marmitas (°C)'
            }"""
        )
        
        content = content[:start_pos] + new_block + content[end_pos:]
        print("✅ Parche 2: Campos 4 horas agregados a atributos_map (segunda función)")
    else:
        print(f"⚠️  Parche 2: Solo se encontraron {len(matches_all)} apariciones (se esperaban 2+)")

    # PARCHE 3: Agregar columnas adicionales específicas después del JSON
    search_pattern3 = r"(# Agregar datos de atributos\s*\n\s*if registro\.data:.*?for codigo, nombre in atributos_map\.items\(\):\s*\n\s*row\[f'\{nombre\} \(\{codigo\}\)'\] = 0\s*\n\s*)(data_rows\.append\(row\))"

    replacement3 = r"""\1
            # Agregar columnas específicas de EXTRUIDOS (Registro cada 4 Horas)
            if categoria == 'EXTRUIDOS':
                row['Registro 4H Aplica'] = 'Sí' if registro.registro_4horas_aplica else 'No'
                row['Humedad Cereal Trompo (%)'] = registro.extrusor_humedad_cereal if registro.extrusor_humedad_cereal else ''
                row['Tiempo Residencia Freidor (seg)'] = registro.freidor_tiempo_residencia if registro.freidor_tiempo_residencia else ''
                row['Temperatura Freidor (°C)'] = registro.freidor_temperatura if registro.freidor_temperatura else ''
                row['Temperatura Slurry Marmitas (°C)'] = registro.sazonado_temp_slurry if registro.sazonado_temp_slurry else ''
            
            \2"""

    if re.search(search_pattern3, content, re.DOTALL):
        content = re.sub(search_pattern3, replacement3, content, flags=re.DOTALL, count=2)
        print("✅ Parche 3: Columnas específicas de 4 horas agregadas al detalle Excel")
    else:
        print("⚠️  Parche 3: Patrón no encontrado")

    # Guardar cambios
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Función de Excel actualizada exitosamente")
    print("📁 Backup guardado en: app.py.backup_excel_4horas")

if __name__ == '__main__':
    patch_excel()
