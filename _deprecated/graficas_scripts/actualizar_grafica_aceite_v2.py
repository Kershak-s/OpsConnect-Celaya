#!/usr/bin/env python3
"""
Actualiza crearGraficaAceite para usar nueva estructura de rangos
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Actualizar crearGraficaAceite - parte de datasets
old_datasets_aceite = '''        // Obtener rangos del producto seleccionado
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'aceite_base_frita');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Aceite Base Frita (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 159, 64)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites solo si hay producto específico
        if (rangos) {
            datasets.push({
                label: 'Límite Verde (min)',
                data: Array(datos.length).fill(rangos.min),
                borderColor: 'rgba(76, 175, 80, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Límite Verde (max)',
                data: Array(datos.length).fill(rangos.max),
                borderColor: 'rgba(76, 175, 80, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.warning_low !== null) {
                datasets.push({
                    label: 'Límite Amarillo (bajo)',
                    data: Array(datos.length).fill(rangos.warning_low),
                    borderColor: 'rgba(255, 193, 7, 0.8)',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0
                });
            }
            
            if (rangos.warning_high !== null) {
                datasets.push({
                    label: 'Límite Amarillo (alto)',
                    data: Array(datos.length).fill(rangos.warning_high),
                    borderColor: 'rgba(255, 193, 7, 0.8)',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0
                });
            }
        }'''

new_datasets_aceite = '''        // Obtener rangos del producto seleccionado (usa RANGOS_FISICOQUIMICOS_FINAL)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'aceite_base');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Aceite Base Frita (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 159, 64)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites solo si hay producto específico con rangos
        if (rangos && rangos.verde) {
            // Líneas verdes (límites ideales)
            datasets.push({
                label: 'Límite Verde (min: ' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Límite Verde (max: ' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            // Líneas amarillas (límites de advertencia)
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((rangoAmarillo, idx) => {
                    if (rangoAmarillo.min !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (min: ' + rangoAmarillo.min + ')',
                            data: Array(datos.length).fill(rangoAmarillo.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (rangoAmarillo.max !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (max: ' + rangoAmarillo.max + ')',
                            data: Array(datos.length).fill(rangoAmarillo.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }'''

content = content.replace(old_datasets_aceite, new_datasets_aceite)

# Actualizar cálculo eje Y para aceite
old_calc_y_aceite = '''        // Calcular rango dinámico del eje Y - AUTO-AJUSTE COMPLETO
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

new_calc_y_aceite = '''        // Calcular rango dinámico del eje Y usando la función calcularEjeY
        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Aceite - Eje Y auto-ajustado:', yMin.toFixed(2), 'a', yMax.toFixed(2));'''

content = content.replace(old_calc_y_aceite, new_calc_y_aceite)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ crearGraficaAceite actualizada")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
