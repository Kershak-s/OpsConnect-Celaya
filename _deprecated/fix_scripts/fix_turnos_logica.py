#!/usr/bin/env python3
"""
Corrige la lógica de turnos en app.py
Turno A: 6:00 AM a 5:59 PM (horas 6-17)
Turno B: 6:00 PM a 5:59 AM (horas 18-23, 0-5)
"""

import re

# Leer archivo
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('app.py.backup_turnos', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: app.py.backup_turnos")

# PARCHE 1: Corregir pae_dashboard
old_dashboard = """        # Determinar el turno actual basado en la hora
        current_hour = datetime.now().hour
        if 7 <= current_hour <= 18:
            current_turno = 'A'  # 7:00 am - 18:00 pm
            horas_turno = list(range(7, 18))  # Horas del turno A
        else:
            current_turno = 'B'  # 19:00 pm - 6:00 am
            horas_turno = list(range(19, 6))  # Horas del turno B
        
        # horas_turno = list(range(0, 24))
        # Obtener registros PAE para las últimas 24 horas (con la fecha del día actual)

        # Fecha y hora actuales
        now = datetime.now()
        today = now.date()
        hace_24h = now - timedelta(hours=24)

        # Filtrar registros de las últimas 24 horas, pero solo del día actual
        pae_registros = PAERegistro.query.filter(
            PAERegistro.categoria == category,
            PAERegistro.fecha == today,
            PAERegistro.created_at >= hace_24h
        ).all()"""

new_dashboard = """        # Determinar el turno actual basado en la hora
        # Turno A: 6:00 AM a 5:59 PM (horas 6-17)
        # Turno B: 6:00 PM a 5:59 AM (horas 18-23, 0-5)
        now = datetime.now()
        today = now.date()
        current_hour = now.hour
        
        if 6 <= current_hour < 18:
            current_turno = 'A'
            horas_turno = list(range(6, 18))  # [6,7,8,9,10,11,12,13,14,15,16,17]
            fecha_inicio = today
            fecha_fin = today
        else:
            current_turno = 'B'
            horas_turno = list(range(18, 24)) + list(range(0, 6))  # [18,19,20,21,22,23,0,1,2,3,4,5]
            # Turno B cruza medianoche
            if current_hour >= 18:
                # Después de las 6 PM - buscar desde hoy hasta mañana
                fecha_inicio = today
                fecha_fin = today + timedelta(days=1)
            else:  # 0 <= current_hour < 6
                # Antes de las 6 AM - buscar desde ayer hasta hoy
                fecha_inicio = today - timedelta(days=1)
                fecha_fin = today

        # Obtener registros PAE del turno actual
        pae_registros = PAERegistro.query.filter(
            PAERegistro.categoria == category,
            PAERegistro.fecha >= fecha_inicio,
            PAERegistro.fecha <= fecha_fin,
            PAERegistro.turno == current_turno
        ).all()"""

if old_dashboard in content:
    content = content.replace(old_dashboard, new_dashboard)
    print("✅ Parche 1: Lógica de turnos en pae_dashboard corregida")
else:
    print("⚠️  Parche 1: No se encontró el patrón exacto")

# PARCHE 2: Corregir pae_registro (determinación de turno)
old_registro = """        # Determinar el turno basado en la hora
        if 7 <= hora <= 18:
            turno = 'A'
        else:
            turno = 'B'"""

new_registro = """        # Determinar el turno basado en la hora
        # Turno A: 6:00 AM a 5:59 PM (horas 6-17)
        # Turno B: 6:00 PM a 5:59 AM (horas 18-23, 0-5)
        if 6 <= hora < 18:
            turno = 'A'
        else:
            turno = 'B'"""

if old_registro in content:
    content = content.replace(old_registro, new_registro)
    print("✅ Parche 2: Lógica de turnos en pae_registro corregida")
else:
    print("⚠️  Parche 2: No se encontró el patrón")

# Guardar
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo app.py actualizado con lógica de turnos corregida")
print("📁 Backup guardado en: app.py.backup_turnos")
