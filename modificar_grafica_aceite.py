#!/usr/bin/env python3
"""
Modifica la función de Aceite para usar rangos dinámicos
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Modificar función crearGraficaAceite
old_crear_aceite_sig = '''    function crearGraficaAceite(datos) {
        const ctx = aceiteCanvas.getContext('2d');

        if (aceiteChart) {
            aceiteChart.destroy();
        }

        const limiteInf = Array(datos.length).fill(rangosAceite.min);
        const limiteSup = Array(datos.length).fill(rangosAceite.max);'''

new_crear_aceite = '''    function crearGraficaAceite(datos, productoSeleccionado) {
        const ctx = aceiteCanvas.getContext('2d');

        if (aceiteChart) {
            aceiteChart.destroy();
        }

        // Obtener rangos del producto seleccionado
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
        }

        // Calcular rango dinámico del eje Y
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

content = content.replace(old_crear_aceite_sig, new_crear_aceite)

# Modificar la configuración de Chart para aceite
old_chart_config_ace = '''        aceiteChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: [
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
                    },
                    {
                        label: 'Límite Inferior',
                        data: limiteInf,
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: 'Límite Superior',
                        data: limiteSup,
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },'''

new_chart_config_ace = '''        aceiteChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },'''

content = content.replace(old_chart_config_ace, new_chart_config_ace)

# Modificar eje Y de aceite
old_y_scale_ace = '''                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Aceite (%)'
                        },
                        min: rangosAceite.warning_low - 2,
                        max: rangosAceite.warning_high + 2
                    },'''

new_y_scale_ace = '''                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Aceite (%)'
                        },
                        min: yMin,
                        max: yMax
                    },'''

content = content.replace(old_y_scale_ace, new_y_scale_ace)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Función crearGraficaAceite modificada con rangos dinámicos")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
