#!/usr/bin/env python3
"""
Agrega filtro por producto y por fecha personalizada en PAE dashboard
"""

# Leer archivo app.py
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('app.py.backup_filters', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: app.py.backup_filters")

# 1. Agregar parámetro producto en api_pae_datos
old_params = """            # Obtener parámetros de filtro
            periodo = request.args.get('periodo', 'turno')
            turno = request.args.get('turno', 'all')
            linea = request.args.get('linea', 'all')"""

new_params = """            # Obtener parámetros de filtro
            periodo = request.args.get('periodo', 'turno')
            turno = request.args.get('turno', 'all')
            linea = request.args.get('linea', 'all')
            producto = request.args.get('producto', 'all')
            fecha_inicio_param = request.args.get('fecha_inicio')
            fecha_fin_param = request.args.get('fecha_fin')"""

if old_params in content:
    content = content.replace(old_params, new_params)
    print("✅ Parámetros de filtro actualizados")
else:
    print("⚠️  No se encontró sección de parámetros")

# 2. Actualizar lógica de fechas para incluir personalizado
old_dates = """            # Calcular rango de fechas
            now = datetime.now()
            today = now.date()
            
            if periodo == 'hoy':
                fecha_inicio = today
                fecha_fin = today
            elif periodo == 'ayer':
                fecha_inicio = today - timedelta(days=1)
                fecha_fin = today - timedelta(days=1)
            elif periodo == 'semana':
                fecha_inicio = today - timedelta(days=6)
                fecha_fin = today
            else:  # 'turno' por defecto
                fecha_inicio = today
                fecha_fin = today"""

new_dates = """            # Calcular rango de fechas
            now = datetime.now()
            today = now.date()
            
            if periodo == 'personalizado' and fecha_inicio_param and fecha_fin_param:
                # Usar fechas proporcionadas por el usuario
                try:
                    from datetime import datetime as dt
                    fecha_inicio = dt.strptime(fecha_inicio_param, '%Y-%m-%d').date()
                    fecha_fin = dt.strptime(fecha_fin_param, '%Y-%m-%d').date()
                except ValueError:
                    fecha_inicio = today
                    fecha_fin = today
            elif periodo == 'hoy':
                fecha_inicio = today
                fecha_fin = today
            elif periodo == 'ayer':
                fecha_inicio = today - timedelta(days=1)
                fecha_fin = today - timedelta(days=1)
            elif periodo == 'semana':
                fecha_inicio = today - timedelta(days=6)
                fecha_fin = today
            else:  # 'turno' por defecto
                fecha_inicio = today
                fecha_fin = today"""

if old_dates in content:
    content = content.replace(old_dates, new_dates)
    print("✅ Lógica de fechas actualizada para incluir personalizado")
else:
    print("⚠️  No se encontró sección de fechas")

# 3. Agregar filtro por producto en la consulta
old_query = """            # Filtrar por turno si se especifica
            if turno != 'all':
                query = query.filter(PAERegistro.turno == turno)
            
            # Ordenar por fecha y hora"""

new_query = """            # Filtrar por turno si se especifica
            if turno != 'all':
                query = query.filter(PAERegistro.turno == turno)
            
            # Filtrar por producto si se especifica
            if producto != 'all':
                query = query.filter(PAERegistro.producto == producto)
            
            # Ordenar por fecha y hora"""

if old_query in content:
    content = content.replace(old_query, new_query)
    print("✅ Filtro por producto agregado a la consulta")
else:
    print("⚠️  No se encontró sección de consulta")

# Guardar cambios
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo app.py actualizado con soporte para filtro de producto y fechas personalizadas")
print("📁 Backup guardado en: app.py.backup_filters")
