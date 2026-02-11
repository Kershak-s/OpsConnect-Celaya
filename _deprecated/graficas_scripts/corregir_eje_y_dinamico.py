#!/usr/bin/env python3
"""
Corrige el cálculo del eje Y para que siempre muestre por arriba y debajo de los límites
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar y reemplazar el cálculo de eje Y para HUMEDAD
old_calc_humedad = '''        // Calcular rango dinámico del eje Y
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        const margen = (maxValor - minValor) * 0.1 || 0.5;
        
        let yMin = minValor - margen;
        let yMax = maxValor + margen;
        
        // Si hay rangos, incluirlos en el cálculo
        if (rangos) {
            yMin = Math.min(yMin, rangos.warning_low || rangos.min);
            yMax = Math.max(yMax, rangos.warning_high || rangos.max);
        }'''

new_calc_humedad = '''        // Calcular rango dinámico del eje Y
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        
        let yMin, yMax;
        
        if (rangos) {
            // Si hay rangos, usar los límites amarillos (warning) + margen
            const limiteInferior = rangos.warning_low !== null ? rangos.warning_low : rangos.min;
            const limiteSuperior = rangos.warning_high !== null ? rangos.warning_high : rangos.max;
            
            // Tomar el mínimo entre datos y límite inferior
            yMin = Math.min(minValor, limiteInferior);
            // Tomar el máximo entre datos y límite superior
            yMax = Math.max(maxValor, limiteSuperior);
            
            // Agregar margen adicional (10% del rango total)
            const rango = yMax - yMin;
            const margen = rango * 0.1 || 0.2;
            yMin = yMin - margen;
            yMax = yMax + margen;
        } else {
            // Sin rangos, solo usar datos con margen del 15%
            const margen = (maxValor - minValor) * 0.15 || 0.5;
            yMin = minValor - margen;
            yMax = maxValor + margen;
        }'''

content = content.replace(old_calc_humedad, new_calc_humedad)

# Buscar y reemplazar el cálculo de eje Y para ACEITE (similar pero con margen de 1)
old_calc_aceite = '''        // Calcular rango dinámico del eje Y
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        const margen = (maxValor - minValor) * 0.1 || 1;
        
        let yMin = minValor - margen;
        let yMax = maxValor + margen;
        
        // Si hay rangos, incluirlos en el cálculo
        if (rangos) {
            yMin = Math.min(yMin, rangos.warning_low || rangos.min);
            yMax = Math.max(yMax, rangos.warning_high || rangos.max);
        }'''

new_calc_aceite = '''        // Calcular rango dinámico del eje Y
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        
        let yMin, yMax;
        
        if (rangos) {
            // Si hay rangos, usar los límites amarillos (warning) + margen
            const limiteInferior = rangos.warning_low !== null ? rangos.warning_low : rangos.min;
            const limiteSuperior = rangos.warning_high !== null ? rangos.warning_high : rangos.max;
            
            // Tomar el mínimo entre datos y límite inferior
            yMin = Math.min(minValor, limiteInferior);
            // Tomar el máximo entre datos y límite superior
            yMax = Math.max(maxValor, limiteSuperior);
            
            // Agregar margen adicional (10% del rango total)
            const rango = yMax - yMin;
            const margen = rango * 0.1 || 1;
            yMin = yMin - margen;
            yMax = yMax + margen;
        } else {
            // Sin rangos, solo usar datos con margen del 15%
            const margen = (maxValor - minValor) * 0.15 || 1;
            yMin = minValor - margen;
            yMax = maxValor + margen;
        }'''

content = content.replace(old_calc_aceite, new_calc_aceite)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Cálculo de eje Y corregido")
print("")
print("Comportamiento nuevo:")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("CON PRODUCTO ESPECÍFICO:")
print("  1. Encuentra el límite amarillo inferior (warning_low)")
print("  2. Encuentra el límite amarillo superior (warning_high)")
print("  3. Compara con min/max de los datos")
print("  4. Toma el menor para yMin y el mayor para yMax")
print("  5. Agrega margen del 10% adicional")
print("")
print("Ejemplo: CHEETOS JALAQUEÑO")
print("  - warning_low: 0.6%")
print("  - warning_high: 1.8%")
print("  - Si datos van de 0.9% a 1.5%:")
print("    yMin = 0.6 - (1.8-0.6)*0.1 = 0.48")
print("    yMax = 1.8 + (1.8-0.6)*0.1 = 1.92")
print("  - Resultado: Eje Y de 0.48 a 1.92")
print("  - ✅ Se ven TODAS las líneas y datos")
print("")
print("SIN PRODUCTO (Todos):")
print("  1. Solo usa min/max de datos")
print("  2. Agrega margen del 15%")
print("  - Ejemplo: datos de 1.0 a 1.3")
print("    yMin = 1.0 - 0.045 = 0.955")
print("    yMax = 1.3 + 0.045 = 1.345")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
