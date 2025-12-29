#!/usr/bin/env python3
"""
Actualiza graficas_base_frita.js con rangos por producto y líneas de límites
"""

rangos_code = '''
    // Rangos por producto y categoría
    const rangosPorProducto = {
        "EXTRUIDOS": {
            "default": {
                "humedad_base_frita": {"min": 0.7, "max": 1.7, "warning_low": 0.6, "warning_high": 1.8},
                "aceite_base_frita": {"min": 21.7, "max": 27.7, "warning_low": 20.7, "warning_high": 28.7}
            },
            "CHEETOS XTRA FLAMIN HOT": {
                "humedad_base_frita": {"min": 0.7, "max": 1.7, "warning_low": 0.6, "warning_high": 1.8},
                "aceite_base_frita": {"min": 21.7, "max": 27.7, "warning_low": 20.7, "warning_high": 28.7}
            },
            "CHEETOS JALAQUEÑO": {
                "humedad_base_frita": {"min": 0.7, "max": 1.7, "warning_low": 0.6, "warning_high": 1.8},
                "aceite_base_frita": {"min": 21.7, "max": 27.7, "warning_low": 20.7, "warning_high": 28.7}
            },
            "CHEETOS EXTRA FH NUEVO": {
                "humedad_base_frita": {"min": 0.7, "max": 1.7, "warning_low": 0.6, "warning_high": 1.8},
                "aceite_base_frita": {"min": 21.7, "max": 27.7, "warning_low": 20.7, "warning_high": 28.7}
            }
        },
        "TORTILLA": {
            "default": {
                "humedad_base_frita": {"min": 1.0, "max": 1.2, "warning_low": 0.9, "warning_high": 1.3},
                "aceite_base_frita": {"min": 20.0, "max": 23.0, "warning_low": 19.0, "warning_high": 24.0}
            },
            "DORITOS": {
                "humedad_base_frita": {"min": 1.0, "max": 1.2, "warning_low": 0.9, "warning_high": 1.3},
                "aceite_base_frita": {"min": 20.0, "max": 23.0, "warning_low": 19.0, "warning_high": 24.0}
            },
            "TOSTITOS SALSA VERDE": {
                "humedad_base_frita": {"min": 0.9, "max": 1.3, "warning_low": 0.8, "warning_high": 1.4},
                "aceite_base_frita": {"min": 22.0, "max": 24.0, "warning_low": 21.0, "warning_high": 25.0}
            },
            "TOSTITOS FH": {
                "humedad_base_frita": {"min": 0.9, "max": 1.3, "warning_low": 0.8, "warning_high": 1.4},
                "aceite_base_frita": {"min": 22.0, "max": 24.0, "warning_low": 21.0, "warning_high": 25.0}
            },
            "DORITOS INCÓGNITA": {
                "humedad_base_frita": {"min": 1.0, "max": 1.2, "warning_low": 0.9, "warning_high": 1.3},
                "aceite_base_frita": {"min": 20.0, "max": 23.0, "warning_low": 19.0, "warning_high": 24.0}
            },
            "DORITOS PIZZEROLA": {
                "humedad_base_frita": {"min": 1.0, "max": 1.2, "warning_low": 0.9, "warning_high": 1.3},
                "aceite_base_frita": {"min": 20.0, "max": 23.0, "warning_low": 19.0, "warning_high": 24.0}
            },
            "RANCHERITOS": {
                "humedad_base_frita": {"min": 1.0, "max": 1.2, "warning_low": 0.9, "warning_high": 1.3},
                "aceite_base_frita": {"min": 20.0, "max": 23.0, "warning_low": 19.99, "warning_high": 24.0}
            }
        },
        "PAPA": {
            "default": {
                "humedad_base_frita": {"min": 1.35, "max": 1.65, "warning_low": 1.2, "warning_high": 1.8},
                "aceite_base_frita": {"min": 31.0, "max": 35.0, "warning_low": 30.0, "warning_high": 36.0}
            },
            "PAPA SAL": {
                "humedad_base_frita": {"min": 1.35, "max": 1.65, "warning_low": 1.2, "warning_high": 1.8},
                "aceite_base_frita": {"min": 31.0, "max": 35.0, "warning_low": 30.0, "warning_high": 36.0}
            },
            "RUFFLES QUESO": {
                "humedad_base_frita": {"min": 1.2, "max": 1.5, "warning_low": 1.05, "warning_high": 1.65},
                "aceite_base_frita": {"min": 31.0, "max": 35.0, "warning_low": 30.0, "warning_high": 36.0}
            },
            "SABRITAS XTRA FH": {
                "humedad_base_frita": {"min": 1.35, "max": 1.65, "warning_low": 1.2, "warning_high": 1.8},
                "aceite_base_frita": {"min": 31.0, "max": 35.0, "warning_low": 30.0, "warning_high": 36.0}
            }
        }
    };

    /**
     * Obtiene rangos para un producto específico o default
     */
    function obtenerRangos(categoria, producto, campo) {
        if (!rangosPorProducto[categoria]) {
            return null;
        }
        
        // Si hay producto específico seleccionado
        if (producto && producto !== 'todos' && rangosPorProducto[categoria][producto]) {
            return rangosPorProducto[categoria][producto][campo];
        }
        
        // Usar default o null (sin líneas)
        if (rangosPorProducto[categoria]['default']) {
            return rangosPorProducto[categoria]['default'][campo];
        }
        
        return null;
    }
'''

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Insertar rangos después de la declaración de variables iniciales
# Buscar donde están las variables let humedadChart
insert_pos = content.find('let humedadChart = null;')
if insert_pos == -1:
    print("❌ No se encontró la posición para insertar")
    exit(1)

# Insertar después de las variables de Chart
insert_pos = content.find('let aceiteChart = null;', insert_pos) + len('let aceiteChart = null;')

# Eliminar los rangos hardcodeados antiguos si existen
old_rangos_start = content.find('// Rangos ideales (límites generales)')
if old_rangos_start != -1:
    old_rangos_end = content.find('};', old_rangos_start) + 2
    content = content[:old_rangos_start] + content[old_rangos_end:]

content = content[:insert_pos] + '\n' + rangos_code + '\n' + content[insert_pos:]

# Guardar
with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Rangos por producto agregados")
print("✅ Función obtenerRangos() creada")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
