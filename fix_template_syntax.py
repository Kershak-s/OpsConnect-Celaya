#!/usr/bin/env python3
"""
Arregla el error de sintaxis en dashboard.html - falta {% endif %}
"""

# Leer archivo
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar y reemplazar la sección problemática
old_section = """                        {% endif %}
                    {# Todas las demás horas quedan bloqueadas (disabled) #}

                    <a href="{% if estado == 'completed' %}javascript:void(0){% else %}{{ url_for('pae_registro', category=category, hora=hora) }}{% endif %}"
                       class="hour-box {{ estado }}"""

new_section = """                        {% endif %}
                    {% endif %}
                    {# Todas las demás horas quedan bloqueadas (disabled) #}

                    <a href="{% if estado == 'completed' %}javascript:void(0){% else %}{{ url_for('pae_registro', category=category, hora=hora) }}{% endif %}"
                       class="hour-box {{ estado }}"""

if old_section in content:
    content = content.replace(old_section, new_section)
    print("✅ Agregado {% endif %} faltante")
else:
    print("⚠️  No se encontró el patrón exacto, intentando método alternativo...")
    
    # Método alternativo: buscar justo antes del comentario
    old_alt = """                        {% endif %}
                    {# Todas las demás horas quedan bloqueadas (disabled) #}"""
    
    new_alt = """                        {% endif %}
                    {% endif %}
                    {# Todas las demás horas quedan bloqueadas (disabled) #}"""
    
    if old_alt in content:
        content = content.replace(old_alt, new_alt, 1)  # Solo la primera ocurrencia
        print("✅ Agregado {% endif %} faltante (método alternativo)")
    else:
        print("❌ No se pudo encontrar la ubicación")

# Guardar
with open('templates/pae/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Template corregido")
