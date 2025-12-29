#!/usr/bin/env python3
"""
Reemplaza los valores hardcodeados del eje Y con los valores dinámicos calculados
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar en gráfica de Humedad
old_humedad_scales = '''                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Humedad (%)' },
                        min: rangosHumedad.warning_low - 0.2,
                        max: rangosHumedad.warning_high + 0.2
                    },'''

new_humedad_scales = '''                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Humedad (%)' },
                        min: yMin,
                        max: yMax
                    },'''

content = content.replace(old_humedad_scales, new_humedad_scales)

# Reemplazar en gráfica de Aceite
old_aceite_scales = '''                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Aceite (%)' },
                        min: rangosAceite.warning_low - 2,
                        max: rangosAceite.warning_high + 2
                    },'''

new_aceite_scales = '''                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Aceite (%)' },
                        min: yMin,
                        max: yMax
                    },'''

content = content.replace(old_aceite_scales, new_aceite_scales)

# También eliminar las variables antiguas si existen
old_vars = '''    // Rangos ideales
    const rangosHumedad = { min: 0.8, max: 1.4, warning_low: 0.7, warning_high: 1.5 };
    const rangosAceite = { min: 28, max: 35, warning_low: 27, warning_high: 36 };'''

content = content.replace(old_vars, '    // Rangos se obtienen dinámicamente de RANGOS_FISICOQUIMICOS_FINAL')

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Eje Y ahora usa valores DINÁMICOS (yMin, yMax)")
print("")
print("Cambios:")
print("  - Humedad: min: yMin, max: yMax (antes: rangosHumedad.warning_low)")
print("  - Aceite: min: yMin, max: yMax (antes: rangosAceite.warning_low)")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
