/**
 * Sistema de Análisis Gráfico Mejorado para PNC Simple
 * Compatible con EXTRUIDOS, TORTILLA y PAPA
 * Incluye gráficas de distribución por status y tendencias
 */

// Configuración global
const PNCAnalysis = {
    charts: {
        status: null,
        origen: null,
        tendencia: null
    },
    
    config: {
        categorias: {
            'EXTRUIDOS': {
                productos: ['TORCIDOS', 'CHEETOS', 'OTROS'],
                origenes: ['EXTRUSIÓN', 'FREIDOR', 'SAZONADO', 'EMPAQUE', 'ALMACÉN']
            },
            'TORTILLA': {
                productos: ['DORITOS', 'TOSTITOS SALSA VERDE', 'CHETOS'],
                origenes: ['COCIMIENTO', 'FREIDOR', 'LIMPIEZA DE MAIZ', 'MOLINO/LAMINADOR', 'SAZONADO', 'EMPAQUE GENERAL']
            },
            'PAPA': {
                productos: ['PAPA SAL', 'OTROS'],
                origenes: ['PELADO', 'REBANADO', 'FREIDOR', 'SAZONADO', 'EMPAQUE']
            }
        },
        
        colores: {
            rechazado: '#dc3545',
            detenido: '#ffc107',
            origen: '#0d6efd',
            tendencia: {
                rechazado: 'rgba(220, 53, 69, 0.8)',
                detenido: 'rgba(255, 193, 7, 0.8)'
            }
        }
    },
    
    data: {
        registros: [],
        filtrados: [],
        analisis: {
            porStatus: { RECHAZADO: 0, DETENIDO: 0 },
            porOrigen: {},
            tendencias: {}
        }
    }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    // Detectar categoría
    const categoria = detectarCategoria();
    if (!categoria) return;
    
    console.log('Inicializando análisis PNC para:', categoria);
    
    // Esperar a que Chart.js esté disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está cargado. Asegúrese de incluir la librería.');
        return;
    }
    
    // Inicializar sistema
    setTimeout(() => {
        inicializarSistema(categoria);
    }, 500);
});

/**
 * Detecta la categoría actual desde la URL
 */
function detectarCategoria() {
    const url = window.location.pathname;
    if (url.includes('EXTRUIDOS')) return 'EXTRUIDOS';
    if (url.includes('TORTILLA')) return 'TORTILLA';
    if (url.includes('PAPA')) return 'PAPA';
    return null;
}

/**
 * Inicializa todo el sistema de análisis
 */
function inicializarSistema(categoria) {
    // Configurar filtros
    configurarFiltros(categoria);
    
    // Inicializar gráficas
    inicializarGraficas(categoria);
    
    // Cargar datos iniciales
    cargarDatos();
    
    // Configurar eventos
    configurarEventos();
    
    // Manejar cambio de pestaña
    const resultadosTab = document.getElementById('resultados-tab');
    if (resultadosTab) {
        resultadosTab.addEventListener('shown.bs.tab', function() {
            console.log('Pestaña de resultados activada');
            cargarDatos();
            actualizarTodasLasGraficas();
        });
    }
}

/**
 * Configura los filtros según la categoría
 */
function configurarFiltros(categoria) {
    const config = PNCAnalysis.config.categorias[categoria];
    if (!config) return;
    
    // Configurar filtro de productos
    const filterProducto = document.getElementById('filterProducto');
    if (filterProducto) {
        filterProducto.innerHTML = '<option value="todos">Todos los productos</option>';
        config.productos.forEach(producto => {
            filterProducto.innerHTML += `<option value="${producto}">${producto}</option>`;
        });
    }
    
    // Configurar filtro de origen
    const filterOrigen = document.getElementById('filterOrigen');
    if (filterOrigen) {
        filterOrigen.innerHTML = '<option value="todos">Todos</option>';
        config.origenes.forEach(origen => {
            filterOrigen.innerHTML += `<option value="${origen}">${origen}</option>`;
        });
    }
    
    // Configurar filtro de período
    const filterPeriodo = document.getElementById('filterPeriodo');
    if (filterPeriodo && filterPeriodo.innerHTML === '') {
        filterPeriodo.innerHTML = `
            <option value="dia">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes" selected>Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="todo">Todo</option>
        `;
    }
}

/**
 * Inicializa las gráficas con Chart.js
 */
function inicializarGraficas(categoria) {
    // Destruir gráficas existentes si las hay
    Object.values(PNCAnalysis.charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Gráfica de distribución por STATUS
    const ctxStatus = document.getElementById('chartStatus');
    if (ctxStatus) {
        PNCAnalysis.charts.status = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['RECHAZADO', 'DETENIDO'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        PNCAnalysis.config.colores.rechazado,
                        PNCAnalysis.config.colores.detenido
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución por Status',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 14 },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}: ${formatearNumero(value)} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${formatearNumero(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfica de distribución por ORIGEN
    const ctxOrigen = document.getElementById('chartOrigen');
    if (ctxOrigen) {
        const origenes = PNCAnalysis.config.categorias[categoria].origenes;
        
        PNCAnalysis.charts.origen = new Chart(ctxOrigen, {
            type: 'bar',
            data: {
                labels: origenes,
                datasets: [{
                    label: 'Cantidad Total',
                    data: new Array(origenes.length).fill(0),
                    backgroundColor: PNCAnalysis.config.colores.origen,
                    borderWidth: 0,
                    borderRadius: 8
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
                            text: 'Cantidad',
                            font: { size: 14 }
                        },
                        ticks: {
                            callback: function(value) {
                                return formatearNumero(value);
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Origen del Problema',
                            font: { size: 14 }
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis por Origen',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Cantidad: ${formatearNumero(context.parsed.y)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfica de TENDENCIAS
    const ctxTendencia = document.getElementById('chartTendencia');
    if (ctxTendencia) {
        PNCAnalysis.charts.tendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Rechazados',
                        data: [],
                        borderColor: PNCAnalysis.config.colores.tendencia.rechazado,
                        backgroundColor: PNCAnalysis.config.colores.tendencia.rechazado.replace('0.8', '0.2'),
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Detenidos',
                        data: [],
                        borderColor: PNCAnalysis.config.colores.tendencia.detenido,
                        backgroundColor: PNCAnalysis.config.colores.tendencia.detenido.replace('0.8', '0.2'),
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
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
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad',
                            font: { size: 14 }
                        },
                        ticks: {
                            callback: function(value) {
                                return formatearNumero(value);
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período',
                            font: { size: 14 }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis de Tendencias',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatearNumero(context.parsed.y)}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Carga los datos desde la tabla
 */
function cargarDatos() {
    console.log('Cargando datos de la tabla...');
    
    PNCAnalysis.data.registros = [];
    const filas = document.querySelectorAll('.pnc-simple-table tbody tr');
    
    filas.forEach(fila => {
        if (fila.cells.length < 8) return;
        
        // Extraer fecha
        const fechaText = fila.cells[1]?.textContent.trim();
        let fecha = null;
        if (fechaText) {
            const [dia, mes, año] = fechaText.split('/');
            fecha = new Date(año, mes - 1, dia);
        }
        
        // Extraer cantidad y unidad
        const cantidadText = fila.cells[5]?.textContent.trim();
        let cantidad = 0;
        let unidad = '';
        
        if (cantidadText && cantidadText !== '-') {
            const partes = cantidadText.split(' ');
            cantidad = parseFloat(partes[0]) || 0;
            unidad = partes.slice(1).join(' ') || '';
        }
        
        const registro = {
            folio: fila.cells[0]?.textContent.trim(),
            fecha: fecha,
            turno: fila.cells[2]?.textContent.trim(),
            producto: fila.cells[3]?.textContent.trim(),
            horario: fila.cells[4]?.textContent.trim(),
            cantidad: cantidad,
            unidad: unidad,
            origen: fila.cells[6]?.textContent.trim(),
            status: fila.cells[7]?.textContent.trim()
        };
        
        PNCAnalysis.data.registros.push(registro);
    });
    
    console.log(`${PNCAnalysis.data.registros.length} registros cargados`);
    
    // Aplicar filtros y actualizar gráficas
    aplicarFiltros();
}

/**
 * Aplica los filtros seleccionados
 */
function aplicarFiltros() {
    const filtros = {
        periodo: document.getElementById('filterPeriodo')?.value || 'mes',
        producto: document.getElementById('filterProducto')?.value || 'todos',
        status: document.getElementById('filterStatus')?.value || 'todos',
        origen: document.getElementById('filterOrigen')?.value || 'todos'
    };
    
    console.log('Aplicando filtros:', filtros);
    
    // Filtrar registros
    PNCAnalysis.data.filtrados = PNCAnalysis.data.registros.filter(registro => {
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
                case 'trimestre':
                    if (diffDays > 90) return false;
                    break;
            }
        }
        
        return true;
    });
    
    console.log(`${PNCAnalysis.data.filtrados.length} registros después de filtrar`);
    
    // Analizar datos filtrados
    analizarDatos();
    
    // Actualizar gráficas
    actualizarTodasLasGraficas();
}

/**
 * Analiza los datos filtrados
 */
function analizarDatos() {
    const categoria = detectarCategoria();
    const origenes = PNCAnalysis.config.categorias[categoria].origenes;
    
    // Reiniciar análisis
    PNCAnalysis.data.analisis = {
        porStatus: { RECHAZADO: 0, DETENIDO: 0 },
        porOrigen: {},
        tendencias: {}
    };
    
    // Inicializar orígenes
    origenes.forEach(origen => {
        PNCAnalysis.data.analisis.porOrigen[origen] = 0;
    });
    
    // Procesar registros filtrados
    PNCAnalysis.data.filtrados.forEach(registro => {
        // Por status
        if (registro.status === 'RECHAZADO') {
            PNCAnalysis.data.analisis.porStatus.RECHAZADO += registro.cantidad;
        } else if (registro.status === 'DETENIDO') {
            PNCAnalysis.data.analisis.porStatus.DETENIDO += registro.cantidad;
        }
        
        // Por origen
        if (registro.origen && PNCAnalysis.data.analisis.porOrigen.hasOwnProperty(registro.origen)) {
            PNCAnalysis.data.analisis.porOrigen[registro.origen] += registro.cantidad;
        }
    });
}

/**
 * Actualiza todas las gráficas
 */
function actualizarTodasLasGraficas() {
    actualizarGraficaStatus();
    actualizarGraficaOrigen();
    actualizarGraficaTendencia();
}

/**
 * Actualiza la gráfica de status
 */
function actualizarGraficaStatus() {
    if (!PNCAnalysis.charts.status) return;
    
    const datos = PNCAnalysis.data.analisis.porStatus;
    PNCAnalysis.charts.status.data.datasets[0].data = [
        datos.RECHAZADO,
        datos.DETENIDO
    ];
    
    PNCAnalysis.charts.status.update();
}

/**
 * Actualiza la gráfica de origen
 */
function actualizarGraficaOrigen() {
    if (!PNCAnalysis.charts.origen) return;
    
    const datos = Object.values(PNCAnalysis.data.analisis.porOrigen);
    PNCAnalysis.charts.origen.data.datasets[0].data = datos;
    
    PNCAnalysis.charts.origen.update();
}

/**
 * Actualiza la gráfica de tendencia
 */
function actualizarGraficaTendencia() {
    if (!PNCAnalysis.charts.tendencia) return;
    
    const periodo = document.getElementById('filterTendencia')?.value || 'mes';
    
    let labels = [];
    let dataRechazados = [];
    let dataDetenidos = [];
    
    switch(periodo) {
        case 'turno':
            actualizarTendenciaPorTurno(labels, dataRechazados, dataDetenidos);
            break;
        case 'dia':
            actualizarTendenciaPorDia(labels, dataRechazados, dataDetenidos);
            break;
        case 'semana':
            actualizarTendenciaPorSemana(labels, dataRechazados, dataDetenidos);
            break;
        case 'mes':
        default:
            actualizarTendenciaPorMes(labels, dataRechazados, dataDetenidos);
            break;
    }
    
    PNCAnalysis.charts.tendencia.data.labels = labels;
    PNCAnalysis.charts.tendencia.data.datasets[0].data = dataRechazados;
    PNCAnalysis.charts.tendencia.data.datasets[1].data = dataDetenidos;
    
    PNCAnalysis.charts.tendencia.update();
}

/**
 * Actualiza tendencia por mes
 */
function actualizarTendenciaPorMes(labels, dataRechazados, dataDetenidos) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const datosPorMes = {};
    
    // Inicializar meses
    meses.forEach(mes => {
        datosPorMes[mes] = { rechazados: 0, detenidos: 0 };
    });
    
    // Procesar datos
    PNCAnalysis.data.filtrados.forEach(registro => {
        if (!registro.fecha) return;
        
        const mesIndex = registro.fecha.getMonth();
        const mesNombre = meses[mesIndex];
        
        if (registro.status === 'RECHAZADO') {
            datosPorMes[mesNombre].rechazados += registro.cantidad;
        } else if (registro.status === 'DETENIDO') {
            datosPorMes[mesNombre].detenidos += registro.cantidad;
        }
    });
    
    // Llenar arrays
    meses.forEach(mes => {
        labels.push(mes);
        dataRechazados.push(datosPorMes[mes].rechazados);
        dataDetenidos.push(datosPorMes[mes].detenidos);
    });
}

/**
 * Actualiza tendencia por semana
 */
function actualizarTendenciaPorSemana(labels, dataRechazados, dataDetenidos) {
    const semanas = [];
    const hoy = new Date();
    
    // Últimas 8 semanas
    for (let i = 7; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - (i * 7));
        semanas.push({
            label: `Sem ${8 - i}`,
            inicio: new Date(fecha.setDate(fecha.getDate() - fecha.getDay())),
            fin: new Date(fecha.setDate(fecha.getDate() + 6))
        });
    }
    
    // Procesar datos por semana
    semanas.forEach(semana => {
        let rechazados = 0;
        let detenidos = 0;
        
        PNCAnalysis.data.filtrados.forEach(registro => {
            if (!registro.fecha) return;
            
            if (registro.fecha >= semana.inicio && registro.fecha <= semana.fin) {
                if (registro.status === 'RECHAZADO') {
                    rechazados += registro.cantidad;
                } else if (registro.status === 'DETENIDO') {
                    detenidos += registro.cantidad;
                }
            }
        });
        
        labels.push(semana.label);
        dataRechazados.push(rechazados);
        dataDetenidos.push(detenidos);
    });
}

/**
 * Actualiza tendencia por día
 */
function actualizarTendenciaPorDia(labels, dataRechazados, dataDetenidos) {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const datosPorDia = {};
    
    // Inicializar días
    dias.forEach(dia => {
        datosPorDia[dia] = { rechazados: 0, detenidos: 0 };
    });
    
    // Procesar datos
    PNCAnalysis.data.filtrados.forEach(registro => {
        if (!registro.fecha) return;
        
        const diaNombre = dias[registro.fecha.getDay()];
        
        if (registro.status === 'RECHAZADO') {
            datosPorDia[diaNombre].rechazados += registro.cantidad;
        } else if (registro.status === 'DETENIDO') {
            datosPorDia[diaNombre].detenidos += registro.cantidad;
        }
    });
    
    // Reorganizar para empezar en lunes
    const diasOrdenados = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    diasOrdenados.forEach(dia => {
        labels.push(dia);
        dataRechazados.push(datosPorDia[dia].rechazados);
        dataDetenidos.push(datosPorDia[dia].detenidos);
    });
}

/**
 * Actualiza tendencia por turno
 */
function actualizarTendenciaPorTurno(labels, dataRechazados, dataDetenidos) {
    labels.push('Turno A', 'Turno B');
    
    let rechazadosA = 0, rechazadosB = 0;
    let detenidosA = 0, detenidosB = 0;
    
    PNCAnalysis.data.filtrados.forEach(registro => {
        if (registro.turno === 'A') {
            if (registro.status === 'RECHAZADO') rechazadosA += registro.cantidad;
            else if (registro.status === 'DETENIDO') detenidosA += registro.cantidad;
        } else if (registro.turno === 'B') {
            if (registro.status === 'RECHAZADO') rechazadosB += registro.cantidad;
            else if (registro.status === 'DETENIDO') detenidosB += registro.cantidad;
        }
    });
    
    dataRechazados.push(rechazadosA, rechazadosB);
    dataDetenidos.push(detenidosA, detenidosB);
}

/**
 * Configura todos los eventos
 */
function configurarEventos() {
    // Eventos de filtros
    ['filterPeriodo', 'filterProducto', 'filterStatus', 'filterOrigen'].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', aplicarFiltros);
        }
    });
    
    // Evento del selector de tendencias
    const filterTendencia = document.getElementById('filterTendencia');
    if (filterTendencia) {
        filterTendencia.addEventListener('change', actualizarGraficaTendencia);
    }
    
    // Botón actualizar gráficos
    const btnActualizar = document.getElementById('btnActualizarGraficos');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function() {
            cargarDatos();
        });
    }
}

/**
 * Formatea números para mostrar
 */
function formatearNumero(num) {
    if (num === 0) return '0';
    if (num < 1) return num.toFixed(3);
    if (num < 10) return num.toFixed(2);
    if (num < 100) return num.toFixed(1);
    return Math.round(num).toLocaleString();
}

// Exportar funciones para uso global
window.PNCAnalysis = PNCAnalysis;
window.cargarDatosPNC = cargarDatos;
window.actualizarGraficasPNC = actualizarTodasLasGraficas;