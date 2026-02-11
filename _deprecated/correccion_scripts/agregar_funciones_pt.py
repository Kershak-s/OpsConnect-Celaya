#!/usr/bin/env python3
"""
Agrega las funciones crearGraficaAceitePT, crearGraficaHumedadPT y crearGraficaSalPT
"""

funciones_pt = '''

    /**
     * Crea la gráfica de Aceite Producto Terminado (PT)
     */
    function crearGraficaAceitePT(datos, productoSeleccionado) {
        if (!aceitePTCanvas) return;
        const ctx = aceitePTCanvas.getContext('2d');

        if (aceitePTChart) {
            aceitePTChart.destroy();
        }

        // Obtener rangos del producto (aceite_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'aceite_pt');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Aceite PT (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Verde min (' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Verde max (' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.min + ')',
                            data: Array(datos.length).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.max + ')',
                            data: Array(datos.length).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Aceite PT - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        aceitePTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Aceite PT',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Aceite PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Aceite PT creada');
    }

    /**
     * Crea la gráfica de Humedad Producto Terminado (PT)
     */
    function crearGraficaHumedadPT(datos, productoSeleccionado) {
        if (!humedadPTCanvas) return;
        const ctx = humedadPTCanvas.getContext('2d');

        if (humedadPTChart) {
            humedadPTChart.destroy();
        }

        // Obtener rangos del producto (humedad_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'humedad_pt');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Humedad PT (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Verde min (' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Verde max (' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.min + ')',
                            data: Array(datos.length).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.max + ')',
                            data: Array(datos.length).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Humedad PT - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        humedadPTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Humedad PT',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Humedad PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Humedad PT creada');
    }

    /**
     * Crea la gráfica de Sal Producto Terminado (PT)
     */
    function crearGraficaSalPT(datos, productoSeleccionado) {
        if (!salPTCanvas) return;
        const ctx = salPTCanvas.getContext('2d');

        if (salPTChart) {
            salPTChart.destroy();
        }

        // Obtener rangos del producto (sal_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'sal_pt');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Sal PT (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(153, 102, 255)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Verde min (' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Verde max (' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.min + ')',
                            data: Array(datos.length).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.max + ')',
                            data: Array(datos.length).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Sal PT - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        salPTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Sal PT',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Sal PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Sal PT creada');
    }
'''

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Insertar las funciones antes del event listener del botón
insert_marker = "    // Event listener para el botón de actualizar"
insert_pos = content.find(insert_marker)

if insert_pos != -1:
    content = content[:insert_pos] + funciones_pt + '\n' + content[insert_pos:]
else:
    # Si no encuentra el marker, agregar al final antes del cierre
    content = content.rstrip()
    if content.endswith('});'):
        content = content[:-3] + funciones_pt + '\n});'

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Funciones de PT agregadas:")
print("   - crearGraficaAceitePT (color rojo)")
print("   - crearGraficaHumedadPT (color cyan)")
print("   - crearGraficaSalPT (color púrpura)")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
