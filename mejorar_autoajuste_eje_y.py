#!/usr/bin/env python3
"""
Mejora el auto-ajuste del eje Y para que siempre muestre todos los datos
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar el cálculo de eje Y para HUMEDAD
old_calc_humedad = '''        // Calcular rango dinámico del eje Y
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

new_calc_humedad = '''        // Calcular rango dinámico del eje Y - AUTO-AJUSTE COMPLETO
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        
        // Recopilar todos los valores que deben ser visibles
        let todosLosValores = [...valores];
        
        if (rangos) {
            // Incluir límites en el cálculo
            todosLosValores.push(rangos.min, rangos.max);
            if (rangos.warning_low !== null) todosLosValores.push(rangos.warning_low);
            if (rangos.warning_high !== null) todosLosValores.push(rangos.warning_high);
        }
        
        // Encontrar min y max absolutos
        const minAbsoluto = Math.min(...todosLosValores);
        const maxAbsoluto = Math.max(...todosLosValores);
        
        // Calcular margen proporcional (15% del rango)
        const rangoTotal = maxAbsoluto - minAbsoluto;
        const margen = rangoTotal * 0.15 || 0.3;
        
        // Eje Y final con margen
        const yMin = minAbsoluto - margen;
        const yMax = maxAbsoluto + margen;
        
        console.log('📏 Humedad - Eje Y auto-ajustado:', yMin.toFixed(2), 'a', yMax.toFixed(2));'''

content = content.replace(old_calc_humedad, new_calc_humedad)

# Reemplazar el cálculo de eje Y para ACEITE
old_calc_aceite = '''        // Calcular rango dinámico del eje Y
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

new_calc_aceite = '''        // Calcular rango dinámico del eje Y - AUTO-AJUSTE COMPLETO
        const valores = datos.map(d => d.y);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        
        // Recopilar todos los valores que deben ser visibles
        let todosLosValores = [...valores];
        
        if (rangos) {
            // Incluir límites en el cálculo
            todosLosValores.push(rangos.min, rangos.max);
            if (rangos.warning_low !== null) todosLosValores.push(rangos.warning_low);
            if (rangos.warning_high !== null) todosLosValores.push(rangos.warning_high);
        }
        
        // Encontrar min y max absolutos
        const minAbsoluto = Math.min(...todosLosValores);
        const maxAbsoluto = Math.max(...todosLosValores);
        
        // Calcular margen proporcional (15% del rango)
        const rangoTotal = maxAbsoluto - minAbsoluto;
        const margen = rangoTotal * 0.15 || 2;
        
        // Eje Y final con margen
        const yMin = minAbsoluto - margen;
        const yMax = maxAbsoluto + margen;
        
        console.log('📏 Aceite - Eje Y auto-ajustado:', yMin.toFixed(2), 'a', yMax.toFixed(2));'''

content = content.replace(old_calc_aceite, new_calc_aceite)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Auto-ajuste de eje Y mejorado")
print("")
print("Comportamiento:")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("1. Recopila TODOS los valores a mostrar:")
print("   - Todos los puntos de datos")
print("   - Límites verdes (min, max)")
print("   - Límites amarillos (warning_low, warning_high)")
print("")
print("2. Calcula min/max absolutos de todos esos valores")
print("")
print("3. Agrega margen del 15% del rango total")
print("")
print("4. Resultado: Eje Y que SIEMPRE muestra todo")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
