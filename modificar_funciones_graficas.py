#!/usr/bin/env python3
"""
Modifica las funciones de creación de gráficas para usar rangos dinámicos
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Modificar procesarYMostrarGraficas para pasar producto
old_procesar = '''    function procesarYMostrarGraficas(datos) {'''

new_procesar = '''    function procesarYMostrarGraficas(datos, producto) {'''

content = content.replace(old_procesar, new_procesar)

# Modificar llamadas a crear gráficas
content = content.replace(
    'crearGraficaHumedad(datosHumedad);',
    'crearGraficaHumedad(datosHumedad, producto);'
)

content = content.replace(
    'crearGraficaAceite(datosAceite);',
    'crearGraficaAceite(datosAceite, producto);'
)

# Modificar llamada a procesarYMostrarGraficas
content = content.replace(
    'procesarYMostrarGraficas(data.datos);',
    'procesarYMostrarGraficas(data.datos, producto);'
)

# Modificar función crearGraficaHumedad
old_crear_humedad_sig = '''    function crearGraficaHumedad(datos) {
        const ctx = humedadCanvas.getContext('2d');

        if (humedadChart) {
            humedadChart.destroy();
        }

        const limiteInf = Array(datos.length).fill(rangosHumedad.min);
        const limiteSup = Array(datos.length).fill(rangosHumedad.max);'''

new_crear_humedad = '''    function crearGraficaHumedad(datos, productoSeleccionado) {
        const ctx = humedadCanvas.getContext('2d');

        if (humedadChart) {
            humedadChart.destroy();
        }

        // Obtener rangos del producto seleccionado
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'humedad_base_frita');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Humedad Base Frita (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(54, 162, 235)',
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
        const margen = (maxValor - minValor) * 0.1 || 0.5;
        
        let yMin = minValor - margen;
        let yMax = maxValor + margen;
        
        // Si hay rangos, incluirlos en el cálculo
        if (rangos) {
            yMin = Math.min(yMin, rangos.warning_low || rangos.min);
            yMax = Math.max(yMax, rangos.warning_high || rangos.max);
        }'''

content = content.replace(old_crear_humedad_sig, new_crear_humedad)

# Modificar la configuración de Chart para humedad
old_chart_config_hum = '''        humedadChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: [
                    {
                        label: 'Humedad Base Frita (%)',
                        data: datos.map(d => d.y),
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: 'rgb(54, 162, 235)',
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

new_chart_config_hum = '''        humedadChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },'''

content = content.replace(old_chart_config_hum, new_chart_config_hum)

# Modificar eje Y de humedad
old_y_scale_hum = '''                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Humedad (%)'
                        },
                        min: rangosHumedad.warning_low - 0.2,
                        max: rangosHumedad.warning_high + 0.2
                    },'''

new_y_scale_hum = '''                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Humedad (%)'
                        },
                        min: yMin,
                        max: yMax
                    },'''

content = content.replace(old_y_scale_hum, new_y_scale_hum)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Función crearGraficaHumedad modificada con rangos dinámicos")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
