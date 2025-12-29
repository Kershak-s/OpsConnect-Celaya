#!/usr/bin/env python3
"""
Corrige las horas hardcodeadas en el template dashboard.html
"""

# Leer archivo
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('templates/pae/dashboard.html.backup_turnos', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: templates/pae/dashboard.html.backup_turnos")

# PARCHE 1: Corregir horas hardcodeadas del turno
old_horas = """                {# Mostrar las horas según el turno seleccionado #}
                {% if current_turno == 'A' %}
                    {% set horas_turno = [7,8,9,10,11,12,13,14,15,16,17,18] %}
                {% elif current_turno == 'B' %}
                    {% set horas_turno = [19,20,21,22,23,0,1,2,3,4,5,6] %}
                {% else %}
                    {# Si no se detecta turno, mostrar todas las horas #}
                    {% set horas_turno = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6] %}
                {% endif %}"""

new_horas = """                {# Mostrar las horas según el turno seleccionado #}
                {# Turno A: 6 AM - 5:59 PM (horas 6-17) #}
                {# Turno B: 6 PM - 5:59 AM (horas 18-23, 0-5) #}
                {% if current_turno == 'A' %}
                    {% set horas_turno = [6,7,8,9,10,11,12,13,14,15,16,17] %}
                {% elif current_turno == 'B' %}
                    {% set horas_turno = [18,19,20,21,22,23,0,1,2,3,4,5] %}
                {% else %}
                    {# Si no se detecta turno, mostrar todas las horas #}
                    {% set horas_turno = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5] %}
                {% endif %}"""

if old_horas in content:
    content = content.replace(old_horas, new_horas)
    print("✅ Parche 1: Horas del turno corregidas en template")
else:
    print("⚠️  Parche 1: No se encontró el patrón")

# PARCHE 2: Corregir lógica de horas "missed" (pendientes)
old_missed = """                    {# Si la hora es menor que la actual, mostrar como pendiente (missed) SOLO si es del mismo día/turno #}
                    {% elif current_turno == 'A' and hora < current_hour and hora >= 7 and hora <= 18 %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}
                    {% elif current_turno == 'B' and (
                        (current_hour >= 19 and hora < current_hour and hora >= 19) or
                        (current_hour < 7 and hora < current_hour and hora <= 6)
                    ) %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}"""

new_missed = """                    {# Si la hora es menor que la actual, mostrar como pendiente (missed) SOLO si es del mismo día/turno #}
                    {% elif current_turno == 'A' and hora < current_hour and hora >= 6 and hora < 18 %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}
                    {% elif current_turno == 'B' and (
                        (current_hour >= 18 and hora < current_hour and hora >= 18) or
                        (current_hour < 6 and hora < current_hour and hora < 6)
                    ) %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}"""

if old_missed in content:
    content = content.replace(old_missed, new_missed)
    print("✅ Parche 2: Lógica de horas pendientes corregida")
else:
    print("⚠️  Parche 2: No se encontró el patrón")

# Guardar
with open('templates/pae/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Template dashboard.html actualizado")
print("📁 Backup guardado en: templates/pae/dashboard.html.backup_turnos")
