/**
 * Módulo JavaScript para análisis de aceite
 * Gestiona la funcionalidad de la pestaña de resultados
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando módulo de análisis de aceite...');
    
    // Verificar si estamos en la página correcta
    const resultadosTab = document.getElementById('resultados-tab');
    
    if (!resultadosTab) {
        console.log('❌ No se encontraron elementos de la pestaña de resultados');
        return;
    }
    
    // Variables para almacenar los gráficos
    let graficos = {
        ovChart: null,
        aglChart: null,
        comparacionChart: null
    };
    
    // Referencias a elementos DOM
    const elementos = {
        filtroProducto: document.getElementById('filtro-producto'),
        filtroTurno: document.getElementById('filtro-turno'),
        filtroPeriodo: document.getElementById('filtro-periodo'),
        btnActualizar: document.getElementById('aplicar-filtros'),
        totalRegistros: document.getElementById('total-registros'),
        ovPromedio: document.getElementById('ov-promedio'),
        aglPromedio: document.getElementById('agl-promedio'),
        ultimoRegistro: document.getElementById('ultimo-registro')
    };
    
    // Obtener categoría desde el elemento del DOM (más confiable)
    let categoria = null;
    const categoryElement = document.querySelector('[data-category]');
    if (categoryElement) {
        categoria = categoryElement.getAttribute('data-category');
    }

    // Fallback: intentar obtener de la URL
    if (!categoria) {
        const pathParts = window.location.pathname.split('/');
        // Buscar EXTRUIDOS, TORTILLA o PAPA en la URL
        categoria = pathParts.find(part => ['EXTRUIDOS', 'TORTILLA', 'PAPA'].includes(part));
    }

    // Si aún no se encuentra, usar default
    if (!categoria) {
        console.warn('⚠️ No se pudo detectar la categoría, usando EXTRUIDOS por defecto');
        categoria = 'EXTRUIDOS';
    }

    console.log(`📊 Categoría detectada: ${categoria}`);
    
    // Datos de registros (se cargan desde Flask)
    let registros = [];
    let registrosFiltrados = [];
    
    // Función para cargar datos iniciales
    function cargarDatosIniciales() {
        // Los datos se cargan desde Flask en el template
        if (typeof window.aceiteRegistros !== 'undefined') {
            registros = window.aceiteRegistros;
            console.log(`📈 Datos cargados: ${registros.length} registros`);
        } else {
            console.log('⚠️ No se encontraron datos de aceite');
            registros = [];
        }
    }
    
    // Función para aplicar filtros
    function aplicarFiltros() {
        const filtroProducto = elementos.filtroProducto ? elementos.filtroProducto.value : 'todos';
        const filtroTurno = elementos.filtroTurno ? elementos.filtroTurno.value : 'todos';
        const filtroPeriodo = elementos.filtroPeriodo ? elementos.filtroPeriodo.value : 'mes';
        
        let registrosFiltradosTemp = [...registros];
        
        // Filtrar por producto
        if (filtroProducto !== 'todos') {
            registrosFiltradosTemp = registrosFiltradosTemp.filter(r => r.producto === filtroProducto);
        }
        
        // Filtrar por turno
        if (filtroTurno !== 'todos') {
            registrosFiltradosTemp = registrosFiltradosTemp.filter(r => r.turno === filtroTurno);
        }
        
        // Filtrar por período
        if (filtroPeriodo !== 'todo') {
            const hoy = new Date();
            let fechaLimite = new Date();
            
            switch(filtroPeriodo) {
                case 'semana':
                    fechaLimite.setDate(hoy.getDate() - 7);
                    break;
                case 'mes':
                    fechaLimite.setMonth(hoy.getMonth() - 1);
                    break;
                case 'trimestre':
                    fechaLimite.setMonth(hoy.getMonth() - 3);
                    break;
            }
            
            registrosFiltradosTemp = registrosFiltradosTemp.filter(r => {
                const fechaRegistro = new Date(r.fecha);
                return fechaRegistro >= fechaLimite;
            });
        }
        
        // Ordenar por fecha
        registrosFiltrados = registrosFiltradosTemp.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        console.log(`📋 Filtros aplicados: ${registrosFiltrados.length} registros filtrados`);
    }
    
    // Función para actualizar estadísticas
    function actualizarEstadisticas() {
        if (registrosFiltrados.length === 0) {
            if (elementos.totalRegistros) elementos.totalRegistros.textContent = '0';
            if (elementos.ovPromedio) elementos.ovPromedio.textContent = '0.00%';
            if (elementos.aglPromedio) elementos.aglPromedio.textContent = '0.00%';
            if (elementos.ultimoRegistro) elementos.ultimoRegistro.textContent = '-';
            return;
        }
        
        const ovValues = registrosFiltrados.map(r => r.ov);
        const aglValues = registrosFiltrados.map(r => r.agl);
        
        // Calcular promedios
        const ovPromedio = ovValues.reduce((a, b) => a + b, 0) / ovValues.length;
        const aglPromedio = aglValues.reduce((a, b) => a + b, 0) / aglValues.length;
        
        // Obtener último registro
        const ultimoRegistro = registrosFiltrados[registrosFiltrados.length - 1];
        const fechaUltimo = new Date(ultimoRegistro.fecha).toLocaleDateString('es-ES');
        
        // Actualizar elementos
        if (elementos.totalRegistros) elementos.totalRegistros.textContent = registrosFiltrados.length;
        if (elementos.ovPromedio) elementos.ovPromedio.textContent = `${ovPromedio.toFixed(2)}%`;
        if (elementos.aglPromedio) elementos.aglPromedio.textContent = `${aglPromedio.toFixed(2)}%`;
        if (elementos.ultimoRegistro) elementos.ultimoRegistro.textContent = fechaUltimo;
        
        console.log('📊 Estadísticas actualizadas');
    }
    
    // Función para preparar etiquetas con fecha y hora
    function prepararEtiquetas() {
        return registrosFiltrados.map(r => {
            const fecha = new Date(r.fecha);
            const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}`;
            const horaStr = r.horario || '';
            return horaStr ? `${fechaStr} ${horaStr}` : fechaStr;
        });
    }
    
    // Función para destruir gráficos existentes
    function destruirGraficos() {
        Object.keys(graficos).forEach(key => {
            if (graficos[key]) {
                graficos[key].destroy();
                graficos[key] = null;
            }
        });
    }
    
    // Función para crear gráfico de OV
    function crearGraficoOV() {
        const ctx = document.getElementById('ovChart');
        if (!ctx) return;

        if (graficos.ovChart) {
            graficos.ovChart.destroy();
        }

        const etiquetas = prepararEtiquetas();
        const ovValues = registrosFiltrados.map(r => r.ov);

        // Calcular rango dinámico: min y max de los datos + margen de 2
        let minOV = Math.min(...ovValues);
        let maxOV = Math.max(...ovValues);

        // Agregar margen de 2 unidades arriba y abajo
        const margen = 2;
        minOV = Math.max(0, minOV - margen); // No bajar de 0
        maxOV = maxOV + margen;

        console.log(`📊 Rango OV calculado: min=${minOV.toFixed(2)}, max=${maxOV.toFixed(2)}`);

        graficos.ovChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'OV (%)',
                    data: ovValues,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: ovValues.map(v => {
                        if (categoria === 'PAPA') {
                                if (v <= 15) return '#28a745'; // Verde
                                if (v <= 25) return '#ffc107'; // Amarillo
                                return '#dc3545'; // Rojo
                            } else {
                                return v <= 50 ? '#28a745' : '#dc3545';
                            }
                        }),
                        pointBorderColor: ovValues.map(v => {
                            if (categoria === 'PAPA') {
                                if (v <= 15) return '#28a745'; // Verde
                                if (v <= 25) return '#ffc107'; // Amarillo
                                return '#dc3545'; // Rojo
                            } else {
                                return v <= 50 ? '#28a745' : '#dc3545';
                            }
                        }),
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                    callbacks: {
                    label: function(context) {
                    const valor = context.parsed.y;
                    let status;
                    if (categoria === 'PAPA') {
                            if (valor <= 15) {
                                    status = '✅ Óptimo (Verde)';
                                    } else if (valor <= 25) {
                                            status = '🟡 Aceptable (Amarillo)';
                                        } else {
                                            status = '❌ Fuera del rango (Rojo)';
                                        }
                                        return [`VO: ${valor.toFixed(2)} ppm`, status];
                                    } else {
                                        status = valor <= 50 ? '✅ Dentro del rango' : '❌ Fuera del rango';
                                        return [`OV: ${valor.toFixed(2)}%`, status];
                                    }
                                }
                            }
                        }
                },
                scales: {
                    y: {
                        // Rango dinámico basado en los datos con margen de 2
                        min: minOV,
                        max: maxOV,
                        title: {
                            display: true,
                            text: categoria === 'PAPA' ? 'Valor de Oxidación (ppm)' : 'Valor de Oxidación (%)'
                        },
                        grid: {
                            color: function(context) {
                                if (categoria === 'PAPA') {
                                    if (context.tick.value === 15 || context.tick.value === 25) {
                                        return '#ffc107';
                                    }
                                } else if (context.tick.value === 50) {
                                    return '#ffc107';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Función para crear gráfico de AGL
    function crearGraficoAGL() {
        const ctx = document.getElementById('aglChart');
        if (!ctx) return;

        if (graficos.aglChart) {
            graficos.aglChart.destroy();
        }

        const etiquetas = prepararEtiquetas();
        const aglValues = registrosFiltrados.map(r => r.agl);

        // Calcular rango dinámico: min y max de los datos + margen de 2
        let minAGL = Math.min(...aglValues);
        let maxAGL = Math.max(...aglValues);

        // Agregar margen de 2 unidades arriba y abajo
        const margen = 2;
        minAGL = Math.max(0, minAGL - margen); // No bajar de 0
        maxAGL = maxAGL + margen;

        console.log(`📊 Rango AGL calculado: min=${minAGL.toFixed(2)}, max=${maxAGL.toFixed(2)}`);

        graficos.aglChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'AGL (%)',
                    data: aglValues,
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: aglValues.map(v => {
                        if (categoria === 'PAPA') {
                            if (v <= 0.25) return '#28a745'; // Verde
                            if (v <= 0.35) return '#ffc107'; // Amarillo
                            return '#dc3545'; // Rojo
                        } else {
                            return v <= 5 ? '#28a745' : '#dc3545';
                        }
                    }),
                    pointBorderColor: aglValues.map(v => {
                        if (categoria === 'PAPA') {
                            if (v <= 0.25) return '#28a745'; // Verde
                            if (v <= 0.35) return '#ffc107'; // Amarillo
                            return '#dc3545'; // Rojo
                        } else {
                            return v <= 5 ? '#28a745' : '#dc3545';
                        }
                    }),
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                let status;
                                if (categoria === 'PAPA') {
                                    if (valor <= 0.25) {
                                        status = '✅ Óptimo (Verde)';
                                    } else if (valor <= 0.35) {
                                        status = '🟡 Aceptable (Amarillo)';
                                    } else {
                                        status = '❌ Fuera del rango (Rojo)';
                                    }
                                } else {
                                    status = valor <= 5 ? '✅ Dentro del rango' : '❌ Fuera del rango';
                                }
                                return [`AGL: ${valor.toFixed(2)}%`, status];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        // Rango dinámico basado en los datos con margen de 2
                        min: minAGL,
                        max: maxAGL,
                        title: {
                            display: true,
                            text: 'Ácidos Grasos Libres (%)'
                        },
                        grid: {
                            color: function(context) {
                                if (categoria === 'PAPA') {
                                    if (context.tick.value === 0.25 || context.tick.value === 0.35) {
                                        return '#ffc107';
                                    }
                                } else if (context.tick.value === 5) {
                                    return '#ffc107';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Función para crear gráfico de comparación
    function crearGraficoComparacion() {
        const ctx = document.getElementById('comparacionChart');
        if (!ctx) return;
        
        if (graficos.comparacionChart) {
            graficos.comparacionChart.destroy();
        }
        
        const etiquetas = prepararEtiquetas();
        const ovValues = registrosFiltrados.map(r => r.ov);
        const aglValues = registrosFiltrados.map(r => r.agl);
        
        graficos.comparacionChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [
                    {
                        label: 'OV (%)',
                        data: ovValues,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        label: 'AGL (%)',
                        data: aglValues,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                    display: true,
                    text: categoria === 'PAPA' ? 'VO (ppm)' : 'OV (%)'
                    },
                    beginAtZero: true,
                    // Auto-ajuste con sugerencias
                    suggestedMin: 0,
                    suggestedMax: categoria === 'PAPA' ? 30 : 60,
                    grid: {
                    borderDash: [2, 2]
                    }
                    },
                    y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                    display: true,
                    text: 'AGL (%)'
                    },
                    beginAtZero: true,
                    // Auto-ajuste con sugerencias
                    suggestedMin: 0,
                    suggestedMax: categoria === 'PAPA' ? 0.5 : 10,
                    grid: {
                    drawOnChartArea: false
                    }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Función principal para actualizar gráficos
    function actualizarGraficos() {
        console.log('🔄 Actualizando gráficos de aceite...');
        
        // Aplicar filtros
        aplicarFiltros();
        
        // Actualizar estadísticas
        actualizarEstadisticas();
        
        // Verificar si hay datos
        if (registrosFiltrados.length === 0) {
            console.log('⚠️ No hay datos para mostrar gráficos');
            destruirGraficos();
            return;
        }
        
        // Crear gráficos
        crearGraficoOV();
        crearGraficoAGL();
        crearGraficoComparacion();
        
        console.log('✅ Gráficos actualizados correctamente');
    }
    
    // Configurar eventos
    if (elementos.btnActualizar) {
        elementos.btnActualizar.addEventListener('click', actualizarGraficos);
    }
    
    // Auto-actualizar cuando cambien los filtros
    if (elementos.filtroProducto) {
        elementos.filtroProducto.addEventListener('change', actualizarGraficos);
    }
    
    if (elementos.filtroTurno) {
        elementos.filtroTurno.addEventListener('change', actualizarGraficos);
    }
    
    if (elementos.filtroPeriodo) {
        elementos.filtroPeriodo.addEventListener('change', actualizarGraficos);
    }
    
    // Configurar evento para mostrar gráficos cuando se active la pestaña
    resultadosTab.addEventListener('shown.bs.tab', function() {
        console.log('👁️ Pestaña de resultados activada - cargando gráficos');
        setTimeout(actualizarGraficos, 200);
    });
    
    // Limpiar gráficos al salir
    window.addEventListener('beforeunload', function() {
        destruirGraficos();
    });
    
    // Inicializar
    cargarDatosIniciales();
    
    // Si ya estamos en la pestaña de resultados, inicializar gráficos
    if (resultadosTab.classList.contains('active')) {
        console.log('🚀 Pestaña ya activa, iniciando carga inicial...');
        setTimeout(actualizarGraficos, 500);
    }
    
    console.log('✅ Módulo de análisis de aceite inicializado correctamente');
});
