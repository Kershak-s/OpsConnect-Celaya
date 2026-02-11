# Leer archivo
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar y reemplazar ambas apariciones
old_code = """            # Agregar columnas específicas de EXTRUIDOS (Registro cada 4 Horas)
            if categoria == 'EXTRUIDOS':
                row['Registro 4H Aplica'] = 'Sí' if registro.registro_4horas_aplica else 'No'
                row['Humedad Cereal Trompo (%)'] = registro.extrusor_humedad_cereal if registro.extrusor_humedad_cereal else ''
                row['Tiempo Residencia Freidor (seg)'] = registro.freidor_tiempo_residencia if registro.freidor_tiempo_residencia else ''
                row['Temperatura Freidor (°C)'] = registro.freidor_temperatura if registro.freidor_temperatura else ''
                row['Temperatura Slurry Marmitas (°C)'] = registro.sazonado_temp_slurry if registro.sazonado_temp_slurry else ''"""

new_code = """            # Agregar columnas específicas de EXTRUIDOS (Registro cada 4 Horas)
            if categoria == 'EXTRUIDOS':
                row['Registro 4H Aplica'] = 'Sí' if (hasattr(registro, 'registro_4horas_aplica') and registro.registro_4horas_aplica) else 'No'
                row['Humedad Cereal Trompo (%)'] = registro.extrusor_humedad_cereal if (hasattr(registro, 'extrusor_humedad_cereal') and registro.extrusor_humedad_cereal) else ''
                row['Tiempo Residencia Freidor (seg)'] = registro.freidor_tiempo_residencia if (hasattr(registro, 'freidor_tiempo_residencia') and registro.freidor_tiempo_residencia) else ''
                row['Temperatura Freidor (°C)'] = registro.freidor_temperatura if (hasattr(registro, 'freidor_temperatura') and registro.freidor_temperatura) else ''
                row['Temperatura Slurry Marmitas (°C)'] = registro.sazonado_temp_slurry if (hasattr(registro, 'sazonado_temp_slurry') and registro.sazonado_temp_slurry) else ''"""

# Reemplazar todas las apariciones
count = content.count(old_code)
content = content.replace(old_code, new_code)

print(f"✅ Reemplazadas {count} apariciones con hasattr")

# Guardar
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Archivo actualizado con validaciones hasattr")
