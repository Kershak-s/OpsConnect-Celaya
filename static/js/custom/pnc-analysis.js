/**
 * Funcionalidad de análisis gráfico para la página PNC Simple - TORTILLA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de TORTILLA y en la pestaña de resultados
    const currentUrl = window.location.href;
    if (currentUrl.includes('/pnc_simple/TORTILLA')) {
        // Inicializar Chart.js
        initializeCharts();
        
        // Configurar eventos para los filtros
        setupFilterEvents();
    
    // Sincronizar filtro de producto con el filtro principal
    const filterProductoAnalisis = document.getElementById('filterProducto');
    if (filterProductoAnalisis) {
        filterProductoAnalisis.addEventListener('change', function() {
            // Actualizar el filtro principal cuando cambia el filtro de análisis
            const filtroProductoPrincipal = document.getElementById('filtroProductoTabla');
            if (filtroProductoPrincipal && filtroProductoPrincipal.value !== this.value) {
                filtroProductoPrincipal.value = this.value;
                // Actualizar el resumen de cantidades
                calcularResumenCantidades(this.value);
                // Actualizar título del resumen
                actualizarTituloResumen(this.value);
            }
        });
    }
        
        // Configurar evento para el selector de tendencias
        setupTendenciasFilter();
        
        // Cargar datos iniciales
        loadAnalysisData();
        
        // Manejar el cambio de pestaña para asegurar que los gráficos se rendericen correctamente
        const resultadosTab = document.getElementById('resultados-tab');
        if (resultadosTab) {
            resultadosTab.addEventListener('shown.bs.tab', function(e) {
                // Recargar los gráficos cuando se muestra la pestaña de resultados
                updateCharts();
            });
        }
        
        // Botón para actualizar gráficos
        const btnActualizarGraficos = document.getElementById('btnActualizarGraficos');
        if (btnActualizarGraficos) {
            btnActualizarGraficos.addEventListener('click', function() {
                loadAnalysisData();
            });
        }
    }
});

// Variables para almacenar las instancias de los gráficos
let chartStatus = null;
let chartOrigen = null;
let chartTendencia = null;

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
    resumenProductos: [] // Nuevo array para almacenar datos de productos
};

/**
 * Inicializa los gráficos de Chart.js
 */
function initializeCharts() {
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
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
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
                                return `${label}: ${value.toFixed(2)} tons (${percentage}%)`;
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
        chartOrigen = new Chart(ctxOrigen, {
            type: 'bar',
            data: {
                labels: ['COCIMIENTO', 'FREIDOR', 'LIMPIEZA DE MAIZ', 'MOLINO/LAMINADOR', 'SAZONADO', 'EMPAQUE GENERAL'],
                datasets: [{
                    label: 'Cantidad (Toneladas)',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: '#0d6efd',
                    borderWidth: 1
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
                            text: 'Toneladas'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Origen'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Gráfico de tendencia por mes (Gráfico de Líneas)
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
                            text: 'Toneladas'
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
                        position: 'top'
                    }
                }
            }
        });
    }
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
    
    // Actualizar los datos según el período seleccionado
    switch(periodo) {
        case 'turno':
            // Datos para tendencia por turno
            chartTendencia.data.labels = ['Turno A (Mañana)', 'Turno B (Tarde)'];
            // Generar datos aleatorios para turno
            chartTendencia.data.datasets[0].data = [Math.random() * 15, Math.random() * 15];
            chartTendencia.data.datasets[1].data = [Math.random() * 15, Math.random() * 15];
            break;
            
        case 'dia':
            // Datos para tendencia por día de la semana
            chartTendencia.data.labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            // Generar datos aleatorios para días
            chartTendencia.data.datasets[0].data = Array.from({length: 7}, () => Math.random() * 15);
            chartTendencia.data.datasets[1].data = Array.from({length: 7}, () => Math.random() * 15);
            break;
            
        case 'semana':
            // Datos para tendencia por semana
            // Generar etiquetas para las últimas 12 semanas
            const semanasLabels = [];
            for (let i = 12; i >= 1; i--) {
                semanasLabels.push(`Sem ${i}`);
            }
            semanasLabels.reverse();
            
            chartTendencia.data.labels = semanasLabels;
            // Generar datos aleatorios para semanas
            chartTendencia.data.datasets[0].data = Array.from({length: 12}, () => Math.random() * 15);
            chartTendencia.data.datasets[1].data = Array.from({length: 12}, () => Math.random() * 15);
            break;
            
        case 'mes':
        default:
            // Datos para tendencia por mes
            chartTendencia.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            // Usar datos existentes o generar nuevos
            if (analysisData.tendenciaMensual && 
                analysisData.tendenciaMensual.rechazados && 
                analysisData.tendenciaMensual.detenidos) {
                chartTendencia.data.datasets[0].data = analysisData.tendenciaMensual.rechazados;
                chartTendencia.data.datasets[1].data = analysisData.tendenciaMensual.detenidos;
            } else {
                // Generar datos aleatorios para meses
                chartTendencia.data.datasets[0].data = Array.from({length: 12}, () => Math.random() * 15);
                chartTendencia.data.datasets[1].data = Array.from({length: 12}, () => Math.random() * 15);
            }
            break;
    }
    
    // Actualizar el gráfico
    chartTendencia.update();
}

/**
 * Carga los datos para el análisis
 */
function loadAnalysisData() {
    // En un entorno real, aquí haríamos una petición AJAX al servidor
    // para obtener los datos filtrados. En este ejemplo, generaremos datos de muestra.
    
    // Obtener valores de los filtros
    const periodo = document.getElementById('filterPeriodo')?.value || 'mes';
    const producto = document.getElementById('filterProducto')?.value || 'todos';
    const status = document.getElementById('filterStatus')?.value || 'todos';
    const origen = document.getElementById('filterOrigen')?.value || 'todos';
    
    // Generar datos de muestra basados en los filtros
    generateSampleData(periodo, producto, status, origen);
    
    // Actualizar los gráficos con los nuevos datos
    updateCharts();
    
    // Actualizar los contadores
    updateCounters();
    
    // Actualizar el gráfico de tendencias según el período seleccionado
    const tendenciaPeriodo = document.getElementById('filterTendencia')?.value || 'mes';
    updateTendenciasChart(tendenciaPeriodo);
}

/**
 * Genera datos de muestra para el análisis
 */
function generateSampleData(periodo, producto, status, origen) {
    // Reiniciar datos
    analysisData = {
        totalProductos: 0,
        totalRechazados: 0,
        totalDetenidos: 0,
        porStatus: {
            'RECHAZADO': 0,
            'DETENIDO': 0
        },
        porOrigen: {
            'COCIMIENTO': 0,
            'FREIDOR': 0,
            'LIMPIEZA DE MAIZ': 0,
            'MOLINO/LAMINADOR': 0,
            'SAZONADO': 0,
            'EMPAQUE GENERAL': 0
        },
        tendenciaMensual: {
            'rechazados': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            'detenidos': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        resumenProductos: []
    };
    
    // Factores de ajuste según filtros
    let factorPeriodo = 1;
    switch (periodo) {
        case 'mes': factorPeriodo = 1; break;
        case 'trimestre': factorPeriodo = 3; break;
        case 'anio': factorPeriodo = 12; break;
        case 'todo': factorPeriodo = 24; break;
    }
    
    let factorProducto = 1;
    if (producto !== 'todos') {
        factorProducto = 0.33; // Si se selecciona un producto específico, menos cantidad total
    }
    
    // Generar datos por Status
    if (status === 'todos' || status === 'RECHAZADO') {
        analysisData.porStatus['RECHAZADO'] = Math.random() * 30 * factorPeriodo * factorProducto;
        analysisData.totalRechazados = analysisData.porStatus['RECHAZADO'];
    }
    
    if (status === 'todos' || status === 'DETENIDO') {
        analysisData.porStatus['DETENIDO'] = Math.random() * 20 * factorPeriodo * factorProducto;
        analysisData.totalDetenidos = analysisData.porStatus['DETENIDO'];
    }
    
    // Calcular total
    analysisData.totalProductos = analysisData.totalRechazados + analysisData.totalDetenidos;
    
    // Generar datos por Origen
    const origenes = Object.keys(analysisData.porOrigen);
    origenes.forEach(key => {
        if (origen === 'todos' || origen === key) {
            // Distribuir el total entre los diferentes orígenes
            let porcentaje = Math.random();
            if (origen !== 'todos' && origen === key) {
                porcentaje = 1; // Si se seleccionó específicamente este origen, asignar todo
            }
            
            analysisData.porOrigen[key] = (analysisData.totalProductos / origenes.length) * porcentaje;
        }
    });
    
    // Generar datos de tendencia mensual
    const mesActual = new Date().getMonth();
    
    for (let i = 0; i < 12; i++) {
        // Generar datos más altos para los meses más recientes
        const factorReciente = i <= mesActual ? (1 + (i / mesActual)) : (1 - ((i - mesActual) / 12));
        
        if (status === 'todos' || status === 'RECHAZADO') {
            analysisData.tendenciaMensual.rechazados[i] = Math.random() * 10 * factorReciente * factorProducto;
        }
        
        if (status === 'todos' || status === 'DETENIDO') {
            analysisData.tendenciaMensual.detenidos[i] = Math.random() * 8 * factorReciente * factorProducto;
        }
    }
    
    // Generar datos para la tabla de productos
    const productos = ['CHETOS', 'DORITOS', 'TOSTITOS SALSA VERDE', 'TOSTITOS FH', 'DORITOS INCÓGNITA','DORITOS PIZZEROLA','DORITOS FH','RANCHERITOS', 'CHEETOS TORCIDITOS', 'CHEETOS XTRA FH NUEVO','CHEETOS XTRA FLAMIN HOT', 'CHEETOS JALAPENO'];
    const unidades = ['TONELADAS', 'KILOS', 'TARIMAS'];
    
    // Limpiar array de productos
    analysisData.resumenProductos = [];
    
    // Si se filtró por un producto específico, mostrar solo ese producto
    if (producto !== 'todos') {
        const cantidad = (Math.random() * 50 * factorPeriodo).toFixed(2);
        const unidad = unidades[Math.floor(Math.random() * unidades.length)];
        
        analysisData.resumenProductos.push({
            nombre: producto,
            cantidad: cantidad,
            unidad: unidad
        });
    } else {
        // Mostrar todos los productos
        productos.forEach(prod => {
            const cantidad = (Math.random() * 50 * factorPeriodo).toFixed(2);
            const unidad = unidades[Math.floor(Math.random() * unidades.length)];
            
            analysisData.resumenProductos.push({
                nombre: prod,
                cantidad: cantidad,
                unidad: unidad
            });
        });
    }
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
    
    // Actualizar gráfico de Tendencia
    if (chartTendencia) {
        chartTendencia.data.datasets[0].data = analysisData.tendenciaMensual.rechazados;
        chartTendencia.data.datasets[1].data = analysisData.tendenciaMensual.detenidos;
        chartTendencia.update();
    }
    
    // Actualizar tabla de productos
    updateProductosTable();
}

/**
 * Actualiza los contadores en la interfaz
 */
function updateCounters() {
    // Función mantenida por compatibilidad pero sin actualizar elementos eliminados
    // Los elementos de contador han sido eliminados del HTML
}

/**
 * Actualiza la tabla de productos con los datos actuales
 */
function updateProductosTable() {
    const tablaCuerpo = document.getElementById('tablaPncResumen');
    if (!tablaCuerpo) return;
    
    // Limpiar la tabla
    tablaCuerpo.innerHTML = '';
    
    // Si no hay datos, mostrar mensaje
    if (analysisData.resumenProductos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" class="text-center">No hay datos disponibles</td>`;
        tablaCuerpo.appendChild(row);
        return;
    }
    
    // Llenar la tabla con los datos de productos
    analysisData.resumenProductos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.unidad}</td>
        `;
        tablaCuerpo.appendChild(row);
    });
}