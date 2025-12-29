#!/usr/bin/env python3
"""
Corrige la lógica de horas pendientes (missed) en dashboard.html
Para que cuando estás en hora 00-05, las horas 18-23 aparezcan como pendientes
"""

# Leer archivo
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('templates/pae/dashboard.html.backup_pending', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: templates/pae/dashboard.html.backup_pending")

# Encontrar y reemplazar la lógica de horas pendientes
old_logic = """                    {# Si la hora es menor que la actual, mostrar como pendiente (missed) SOLO si es del mismo día/turno #}
                    {% elif current_turno == 'A' and hora < current_hour and hora >= 6 and hora < 18 %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}
                    {% elif current_turno == 'B' and (
                        (current_hour >= 18 and hora < current_hour and hora >= 18) or
                        (current_hour < 6 and hora < current_hour and hora < 6)
                    ) %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}"""

new_logic = """                    {# Si la hora es menor que la actual, mostrar como pendiente (missed) SOLO si es del mismo día/turno #}
                    {% elif current_turno == 'A' and hora < current_hour and hora >= 6 and hora < 18 %}
                        {% set estado = 'missed' %}
                        {% set status_text = 'Pendiente' %}
                    {% elif current_turno == 'B' %}
                        {% if current_hour >= 18 %}
                            {# Estamos en la primera parte del turno (18-23) #}
                            {# Las horas 18 hasta current_hour son pendientes #}
                            {% if hora >= 18 and hora < current_hour %}
                                {% set estado = 'missed' %}
                                {% set status_text = 'Pendiente' %}
                            {% endif %}
                        {% elif current_hour < 6 %}
                            {# Estamos en la segunda parte del turno (0-5) #}
                            {# Las horas 18-23 del día anterior son pendientes #}
                            {# Las horas 0 hasta current_hour son pendientes #}
                            {% if hora >= 18 or (hora >= 0 and hora < current_hour) %}
                                {% set estado = 'missed' %}
                                {% set status_text = 'Pendiente' %}
                            {% endif %}
                        {% endif %}
                    {% endif %}"""

# Nota: Agregamos un {% endif %} extra porque la nueva lógica tiene más niveles de if

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    print("✅ Lógica de horas pendientes corregida")
    
    # Ahora necesitamos remover un {% endif %} sobrante que queda después
    # Buscar el patrón donde termina la lógica
    old_end = """                    {% endif %}
                    {# Todas las demás horas quedan bloqueadas (disabled) #}
                    {% endif %}"""
    
    new_end = """                    {# Todas las demás horas quedan bloqueadas (disabled) #}"""
    
    if old_end in content:
        content = content.replace(old_end, new_end, 1)
        print("✅ Estructura de endif corregida")
else:
    print("⚠️  No se encontró el patrón exacto")

# Guardar
with open('templates/pae/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Template dashboard.html actualizado")
print("📁 Backup guardado en: templates/pae/dashboard.html.backup_pending")
