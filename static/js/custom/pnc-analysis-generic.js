/**
 * Funcionalidad de análisis gráfico genérica mejorada para PNC Simple
 * Funciona para EXTRUIDOS, TORTILLA y PAPA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Detectar la categoría actual desde la URL
    const currentUrl = window.location.href;
    let currentCategory = null;
    
    if (currentUrl.includes('/pnc_simple/EXTRUIDOS')) {
        currentCategory = 'EXTRUIDOS';
    } else if (currentUrl.includes('/pnc_simple/TORTILLA')) {
        currentCategory = 'TORTILLA';
    } else if (currentUrl.includes('/pnc_simple/PAPA')) {
        currentCategory = 'PAPA';
    }
    
    // Si estamos en una página de PNC Simple, inicializar funcionalidad
    if (currentCategory) {
        // Esperar a que se carguen los datos
        setTimeout(() => {
            // Inicializar Chart.js
            initializeCharts();
            
            // Configurar eventos para los filtros
            setupFilterEvents();
        
            // Sincronizar filtro de producto con el filtro principal
            const filterProductoAnalisis = document.getElementById('filterProducto');
            if (filterProductoAnalisis) {
                filterProductoAnalisis.addEventListener('change', function() {
                    const filtroProductoPrincipal = document.getElementById('filtroProductoTabla');
                    if (filtroProductoPrincipal && filtroProductoPrincipal.value !== this.value) {
                        filtroProductoPrincipal.value = this.value;
                        // Actualizar el resumen de cantidades
                        if (typeof calcularResumenCantidades === 'function') {
                            calcularResumenCantidades(this.value);
                        }
                        // Actualizar título del resumen
                        if (typeof actualizarTituloResumen === 'function') {
                            actualizarTituloResumen(this.value);
                        }
                    }
                });
            }
            
            // Configurar evento para el selector de tendencias
            setupTendenciasFilter();
            
            // Cargar datos iniciales
            loadAnalysisData();
            
            // Manejar el cambio de pestaña
            const resultadosTab = document.getElementById('resultados-tab');
            if (resultadosTab) {
                resultadosTab.addEventListener('shown.bs.tab', function(e) {
                    // Recargar datos desde la tabla
                    window.pncRecords = obtenerRegistrosDeTabla();
                    updateCharts();
                });
            }
            
            // Botón para actualizar gráficos
            const btnActualizarGraficos = document.getElementById('btnActualizarGraficos');
            if (btnActualizarGraficos) {
                btnActualizarGraficos.addEventListener('click', function() {
                    // Recargar datos desde la tabla
                    window.pncRecords = obtenerRegistrosDeTabla();
                    loadAnalysisData();
                });
            }
        }, 500);
    }
});

// Variables para almacenar las instancias de los gráficos
let chartStatus = null;
let chartOrigen = null;
let chartTendencia = null;

// Configuración de orígenes por categoría
const origenesConfig = {
    'EXTRUIDOS': ['EXTRUSIÓN', 'FREIDOR', 'SAZONADO', 'EMPAQUE', 'ALMACÉN'],
    'TORTILLA': ['COCIMIENTO', 'FREIDOR', 'LIMPIEZA DE MAIZ', 'MOLINO/LAMINADOR', 'SAZONADO', 'EMPAQUE GENERAL'],
    'PAPA': ['PELADO', 'REBANADO', 'FREIDOR', 'SAZONADO', 'EMPAQUE']
};

/**
 * Objeto para almacenar los datos analizados
 */
let analysisData = {
    totalProductos: 0,
    totalRechazados: 0,
    totalDetenidos: 0,
    porStatus: {},
    porOrigen: {},
    tendenciaMensual: {},
    resumenProductos: []
};

/**
 * Obtiene los registros directamente de la tabla HTML
 */
function obtenerRegistrosDeTabla() {
    const registros = [];
    const filas = document.querySelectorAll('.pnc-simple-table tbody tr');
    
    filas.forEach(fila => {
        // Saltar filas vacías o de mensaje
        if (fila.cells.length <= 1) return;
        
        const cantidadText = fila.cells[5]?.textContent.trim();
        if (!cantidadText || cantidadText === '-') return;
        
        // Parsear cantidad y unidad
        const partes = cantidadText.split(' ');
        const cantidad = parseFloat(partes[0]) || 0;
        const unidad = partes.slice(1).join(' ') || 'UNIDADES';
        
        // Obtener fecha del registro
        const fechaText = fila.cells[1]?.textContent.trim();
        let fecha = null;
        if (fechaText) {
            // Formato esperado: DD/MM/YYYY
            const fechaPartes = fechaText.split('/');
            if (fechaPartes.length === 3) {
                fecha = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0]);
            }
        }
        
        registros.push({
            folio: fila.cells[0]?.textContent.trim(),
            fecha: fecha,
            turno: fila.cells[2]?.textContent.trim(),
            producto: fila.cells[3]?.textContent.trim(),
            cantidad: cantidad,
            unidad_cantidad: unidad,
            origen: fila.cells[6]?.textContent.trim(),
            status: fila.cells[7]?.textContent.trim()
        });
    });
    
    return registros;
}

/**
 * Inicializa los gráficos de Chart.js
 */
function initializeCharts() {
    const categoria = detectarCategoria();
    
    // Gráfico de distribución por Status (Gráfico de Dona)
    const ctxStatus = document.getElementById('chartStatus');
    if (ctxStatus) {
        chartStatus = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['RECHAZADO', 'DETENIDO'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#dc3545', '#ffc107'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de distribución por Origen (Gráfico de Barras)
    const ctxOrigen = document.getElementById('chartOrigen');
    if (ctxOrigen) {
        const origenes = origenesConfig[categoria] || origenesConfig['TORTILLA'];
        
        chartOrigen = new Chart(ctxOrigen, {
            type: 'bar',
            data: {
                labels: origenes,
                datasets: [{
                    label: 'Cantidad Total',
                    data: new Array(origenes.length).fill(0),
                    backgroundColor: '#0d6efd',
                    borderWidth: 0,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad Total'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Origen del Problema'
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Cantidad: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de tendencia (Gráfico de Líneas)
    const ctxTendencia = document.getElementById('chartTendencia');
    if (ctxTendencia) {
        chartTendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    {
                        label: 'Rechazados',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Detenidos',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad Total'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15
                        }
                    }
                }
            }
        });
    }
}

/**
 * Detecta la categoría actual desde la URL
 */
function detectarCategoria() {
    const url = window.location.href;
    if (url.includes('EXTRUIDOS')) return 'EXTRUIDOS';
    if (url.includes('PAPA')) return 'PAPA';
    return 'TORTILLA';
}

/**
 * Configura los eventos para los filtros
 */
function setupFilterEvents() {
    const filterElements = [
        document.getElementById('filterPeriodo'),
        document.getElementById('filterProducto'),
        document.getElementById('filterStatus'),
        document.getElementById('filterOrigen')
    ];
    
    filterElements.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                loadAnalysisData();
            });
        }
    });
}

/**
 * Configura el evento para el selector de tendencias
 */
function setupTendenciasFilter() {
    const filterTendencia = document.getElementById('filterTendencia');
    if (filterTendencia) {
        filterTendencia.addEventListener('change', function() {
            updateTendenciasChart(this.value);
        });
    }
}

/**
 * Actualiza el gráfico de tendencias según el período seleccionado
 */
function updateTendenciasChart(periodo) {
    if (!chartTendencia) return;
    
    // Obtener datos reales de los registros PNC
    const registros = window.pncRecords || obtenerRegistrosDeTabla();
    
    switch(periodo) {
        case 'turno':
            actualizarTendenciaPorTurno(registros);
            break;
        case 'dia':
            actualizarTendenciaPorDia(registros);
            break;
        case 'semana':
            actualizarTendenciaPorSemana(registros);
            break;
        case 'mes':
        default:
            actualizarTendenciaPorMes(registros);
            break;
    }
    
    chartTendencia.update();
}

/**
 * Actualiza la tendencia por turno
 */
function actualizarTendenciaPorTurno(registros) {
    chartTendencia.data.labels = ['Turno A', 'Turno B'];
    
    let rechazadosA = 0, rechazadosB = 0;
    let detenidosA = 0, detenidosB = 0;
    
    // Aplicar filtros actuales
    const filtros = obtenerFiltrosActuales();
    
    registros.forEach(registro => {
        if (!aplicarFiltros(registro, filtros)) return;
        
        const cantidad = parseFloat(registro.cantidad) || 0;
        
        if (registro.turno === 'A') {
            if (registro.status === 'RECHAZADO') rechazadosA += cantidad;
            else if (registro.status === 'DETENIDO') detenidosA += cantidad;
        } else if (registro.turno === 'B') {
            if (registro.status === 'RECHAZADO') rechazadosB += cantidad;
            else if (registro.status === 'DETENIDO') detenidosB += cantidad;
        }
    });
    
    chartTendencia.data.datasets[0].data = [rechazadosA, rechazadosB];
    chartTendencia.data.datasets[1].data = [detenidosA, detenidosB];
}

/**
 * Actualiza la tendencia por día
 */
function actualizarTendenciaPorDia(registros) {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    chartTendencia.data.labels = dias;
    
    const rechazadosPorDia = new Array(7).fill(0);
    const detenidosPorDia = new Array(7).fill(0);
    
    // Aplicar filtros actuales
    const filtros = obtenerFiltrosActuales();
    
    registros.forEach(registro => {
        if (!aplicarFiltros(registro, filtros)) return;
        if (!registro.fecha) return;
        
        const diaSemana = registro.fecha.getDay();
        const diaIndex = diaSemana === 0 ? 6 : diaSemana - 1; // Ajustar para que Lunes sea 0
        
        const cantidad = parseFloat(registro.cantidad) || 0;
        if (registro.status === 'RECHAZADO') {
            rechazadosPorDia[diaIndex] += cantidad;
        } else if (registro.status === 'DETENIDO') {
            detenidosPorDia[diaIndex] += cantidad;
        }
    });
    
    chartTendencia.data.datasets[0].data = rechazadosPorDia;
    chartTendencia.data.datasets[1].data = detenidosPorDia;
}

/**
 * Actualiza la tendencia por semana
 */
function actualizarTendenciaPorSemana(registros) {
    // Últimas 8 semanas
    const semanasLabels = [];
    const hoy = new Date();
    
    for (let i = 7; i >= 0; i--) {
        semanasLabels.push(`Sem -${i+1}`);
    }
    
    chartTendencia.data.labels = semanasLabels;
    
    const rechazadosPorSemana = new Array(8).fill(0);
    const detenidosPorSemana = new Array(8).fill(0);
    
    // Aplicar filtros actuales
    const filtros = obtenerFiltrosActuales();
    
    registros.forEach(registro => {
        if (!aplicarFiltros(registro, filtros)) return;
        if (!registro.fecha) return;
        
        // Calcular diferencia en semanas
        const diffTime = hoy - registro.fecha;
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        
        if (diffWeeks >= 0 && diffWeeks < 8) {
            const weekIndex = 7 - diffWeeks;
            const cantidad = parseFloat(registro.cantidad) || 0;
            
            if (registro.status === 'RECHAZADO') {
                rechazadosPorSemana[weekIndex] += cantidad;
            } else if (registro.status === 'DETENIDO') {
                detenidosPorSemana[weekIndex] += cantidad;
            }
        }
    });
    
    chartTendencia.data.datasets[0].data = rechazadosPorSemana;
    chartTendencia.data.datasets[1].data = detenidosPorSemana;
}

/**
 * Actualiza la tendencia por mes
 */
function actualizarTendenciaPorMes(registros) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    chartTendencia.data.labels = meses;
    
    const rechazadosPorMes = new Array(12).fill(0);
    const detenidosPorMes = new Array(12).fill(0);
    
    // Aplicar filtros actuales
    const filtros = obtenerFiltrosActuales();
    
    registros.forEach(registro => {
        if (!aplicarFiltros(registro, filtros)) return;
        if (!registro.fecha) return;
        
        const mes = registro.fecha.getMonth();
        const cantidad = parseFloat(registro.cantidad) || 0;
        
        if (registro.status === 'RECHAZADO') {
            rechazadosPorMes[mes] += cantidad;
        } else if (registro.status === 'DETENIDO') {
            detenidosPorMes[mes] += cantidad;
        }
    });
    
    chartTendencia.data.datasets[0].data = rechazadosPorMes;
    chartTendencia.data.datasets[1].data = detenidosPorMes;
}

/**
 * Obtiene los filtros actuales
 */
function obtenerFiltrosActuales() {
    return {
        periodo: document.getElementById('filterPeriodo')?.value || 'mes',
        producto: document.getElementById('filterProducto')?.value || 'todos',
        status: document.getElementById('filterStatus')?.value || 'todos',
        origen: document.getElementById('filterOrigen')?.value || 'todos'
    };
}

/**
 * Aplica los filtros a un registro
 */
function aplicarFiltros(registro, filtros) {
    // Filtro de producto
    if (filtros.producto !== 'todos' && registro.producto !== filtros.producto) {
        return false;
    }
    
    // Filtro de status
    if (filtros.status !== 'todos' && registro.status !== filtros.status) {
        return false;
    }
    
    // Filtro de origen
    if (filtros.origen !== 'todos' && registro.origen !== filtros.origen) {
        return false;
    }
    
    // Filtro de período
    if (filtros.periodo !== 'todo' && registro.fecha) {
        const hoy = new Date();
        const diffTime = hoy - registro.fecha;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        switch(filtros.periodo) {
            case 'dia':
                if (diffDays > 0) return false;
                break;
            case 'semana':
                if (diffDays > 7) return false;
                break;
            case 'mes':
                if (diffDays > 30) return false;
                break;
            case 'bimestre':
                if (diffDays > 60) return false;
                break;
        }
    }
    
    return true;
}

/**
 * Carga los datos para el análisis
 */
function loadAnalysisData() {
    // Obtener registros actualizados
    const registros = window.pncRecords || obtenerRegistrosDeTabla();
    
    // Obtener valores de los filtros
    const filtros = obtenerFiltrosActuales();
    
    // Analizar datos reales de los registros
    analizarDatosReales(registros, filtros);
    
    // Actualizar los gráficos con los nuevos datos
    updateCharts();
    
    // Actualizar el gráfico de tendencias
    const tendenciaPeriodo = document.getElementById('filterTendencia')?.value || 'mes';
    updateTendenciasChart(tendenciaPeriodo);
}

/**
 * Analiza los datos reales de los registros PNC
 */
function analizarDatosReales(registros, filtros) {
    const categoria = detectarCategoria();
    
    // Reiniciar datos
    analysisData = {
        totalProductos: 0,
        totalRechazados: 0,
        totalDetenidos: 0,
        porStatus: {
            'RECHAZADO': 0,
            'DETENIDO': 0
        },
        porOrigen: {},
        tendenciaMensual: {
            'rechazados': new Array(12).fill(0),
            'detenidos': new Array(12).fill(0)
        },
        resumenProductos: []
    };
    
    // Inicializar orígenes según la categoría
    const origenes = origenesConfig[categoria] || origenesConfig['TORTILLA'];
    origenes.forEach(origen => {
        analysisData.porOrigen[origen] = 0;
    });
    
    // Procesar cada registro aplicando filtros
    registros.forEach(registro => {
        if (!aplicarFiltros(registro, filtros)) return;
        
        const cantidad = parseFloat(registro.cantidad) || 0;
        
        // Actualizar totales por status
        if (registro.status === 'RECHAZADO') {
            analysisData.porStatus['RECHAZADO'] += cantidad;
            analysisData.totalRechazados += cantidad;
        } else if (registro.status === 'DETENIDO') {
            analysisData.porStatus['DETENIDO'] += cantidad;
            analysisData.totalDetenidos += cantidad;
        }
        
        // Actualizar totales por origen
        if (registro.origen && analysisData.porOrigen.hasOwnProperty(registro.origen)) {
            analysisData.porOrigen[registro.origen] += cantidad;
        }
        
        // Actualizar tendencia mensual
        if (registro.fecha) {
            const mes = registro.fecha.getMonth();
            
            if (registro.status === 'RECHAZADO') {
                analysisData.tendenciaMensual.rechazados[mes] += cantidad;
            } else if (registro.status === 'DETENIDO') {
                analysisData.tendenciaMensual.detenidos[mes] += cantidad;
            }
        }
    });
    
    // Calcular total
    analysisData.totalProductos = analysisData.totalRechazados + analysisData.totalDetenidos;
}

/**
 * Actualiza los gráficos con los datos actuales
 */
function updateCharts() {
    // Actualizar gráfico de Status
    if (chartStatus) {
        chartStatus.data.datasets[0].data = [
            analysisData.porStatus['RECHAZADO'],
            analysisData.porStatus['DETENIDO']
        ];
        chartStatus.update();
    }
    
    // Actualizar gráfico de Origen
    if (chartOrigen) {
        chartOrigen.data.datasets[0].data = Object.values(analysisData.porOrigen);
        chartOrigen.update();
    }
    
    // Actualizar gráfico de Tendencia (será actualizado por updateTendenciasChart)
}

// Hacer las funciones disponibles globalmente
window.updateCharts = updateCharts;
window.loadAnalysisData = loadAnalysisData;
window.obtenerRegistrosDeTabla = obtenerRegistrosDeTabla;
