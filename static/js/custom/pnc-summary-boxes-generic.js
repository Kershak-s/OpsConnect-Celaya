/**
 * Funcionalidad genérica mejorada para las cajas de resumen de cantidades en PNC Simple
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
        // Inicializar los resúmenes de cantidades
        initSummaryBoxes();
        
        // Configurar el evento para actualizar los resúmenes cuando cambie el filtro de producto
        const filtroProducto = document.getElementById('filtroProductoTabla');
        if (filtroProducto) {
            filtroProducto.addEventListener('change', function() {
                updateSummaryBoxes(this.value);
            });
        }
        
        // Configurar el botón de actualizar gráficos para que también actualice los resúmenes
        const btnActualizarGraficos = document.getElementById('btnActualizarGraficos');
        if (btnActualizarGraficos) {
            btnActualizarGraficos.addEventListener('click', function() {
                const filtroProducto = document.getElementById('filtroProductoTabla').value;
                updateSummaryBoxes(filtroProducto);
            });
        }

        // Agregar manejador de eventos para calcular totales después de agregar o editar registros
        const createModal = document.getElementById('createPNCModal');
        const editModal = document.getElementById('editPNCModal');
        
        if (createModal) {
            createModal.addEventListener('hidden.bs.modal', function() {
                // Recargar los datos desde la tabla después de un pequeño delay
                setTimeout(() => {
                    // Recargar los registros desde la tabla
                    window.pncRecords = obtenerRegistrosDeTabla();
                    // Actualizar los resúmenes
                    const filtroProducto = document.getElementById('filtroProductoTabla').value;
                    updateSummaryBoxes(filtroProducto);
                }, 500);
            });
        }
        
        if (editModal) {
            editModal.addEventListener('hidden.bs.modal', function() {
                // Recargar los datos desde la tabla después de un pequeño delay
                setTimeout(() => {
                    // Recargar los registros desde la tabla
                    window.pncRecords = obtenerRegistrosDeTabla();
                    // Actualizar los resúmenes
                    const filtroProducto = document.getElementById('filtroProductoTabla').value;
                    updateSummaryBoxes(filtroProducto);
                }, 500);
            });
        }
    }
});

/**
 * Inicializa las cajas de resumen de cantidades
 */
function initSummaryBoxes() {
    // Primero, obtener los registros desde la tabla
    window.pncRecords = obtenerRegistrosDeTabla();
    
    // Actualizar las cajas con el filtro actual (todos por defecto)
    updateSummaryBoxes('todos');
}

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
        
        registros.push({
            folio: fila.cells[0]?.textContent.trim(),
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
 * Actualiza las cajas de resumen de cantidades según el filtro de producto
 * @param {string} filtroProducto - El filtro de producto seleccionado
 */
function updateSummaryBoxes(filtroProducto) {
    // Obtener datos dinámicamente de los registros
    const pncRecords = window.pncRecords || obtenerRegistrosDeTabla();
    
    // Separamos los registros por status
    const registrosRechazados = pncRecords.filter(record => record.status === 'RECHAZADO');
    const registrosDetenidos = pncRecords.filter(record => record.status === 'DETENIDO');
    
    // Actualizamos cada contenedor con sus datos filtrados
    updateSummaryContainer('summaryRechazadosContainer', registrosRechazados, filtroProducto, 'rechazados');
    updateSummaryContainer('summaryDetenidosContainer', registrosDetenidos, filtroProducto, 'detenidos');
}

/**
 * Actualiza un contenedor de resumen específico
 */
function updateSummaryContainer(containerId, registros, filtroProducto, tipo) {
    // Obtener el contenedor de las cajas de resumen
    const summaryContainer = document.getElementById(containerId);
    if (!summaryContainer) return;
    
    // Limpiar el contenedor
    summaryContainer.innerHTML = '';
    
    // Crear un contenedor flex centrado
    const flexContainer = document.createElement('div');
    flexContainer.className = 'summary-boxes-wrapper';
    
    // Calcular totales por unidad para estos registros
    const totales = calcularTotalesPorUnidad(registros, filtroProducto);
    
    // IMPORTANTE: Siempre mostrar las unidades estándar, aunque sean 0
    const unidadesEstandar = ['KILOGRAMOS', 'TONELADAS', 'TARIMAS'];
    const todasLasUnidades = Object.keys(totales);
    
    // Asegurar que las unidades estándar siempre estén presentes
    unidadesEstandar.forEach(unidad => {
        if (totales[unidad] === undefined) {
            totales[unidad] = 0;
        }
    });
    
    // Contador para el índice de colores
    let colorIndex = 0;
    
    // Mostrar primero las unidades estándar (incluyendo las que son 0)
    unidadesEstandar.forEach(unidad => {
        createSummaryBox(flexContainer, unidad, totales[unidad] || 0, tipo, colorIndex);
        colorIndex++;
    });
    
    // Luego mostrar las otras unidades que tengan valores mayores a 0
    todasLasUnidades.forEach(unidad => {
        if (!unidadesEstandar.includes(unidad) && totales[unidad] > 0) {
            createSummaryBox(flexContainer, unidad, totales[unidad], tipo, colorIndex);
            colorIndex++;
        }
    });
    
    summaryContainer.appendChild(flexContainer);
    
    // Actualizar el título si es necesario
    updateSummaryTitle(tipo, filtroProducto);
}

/**
 * Calcula totales por unidad a partir de los registros
 */
function calcularTotalesPorUnidad(registros, filtroProducto) {
    const totales = {};
    
    // Inicializar las unidades estándar en 0
    totales['KILOGRAMOS'] = 0;
    totales['TONELADAS'] = 0;
    totales['TARIMAS'] = 0;
    
    registros.forEach(registro => {
        // Aplicar filtro de producto si no es "todos"
        if (filtroProducto !== 'todos' && registro.producto !== filtroProducto) {
            return;
        }
        
        // Normalizar la unidad a mayúsculas
        const unidad = (registro.unidad_cantidad || 'KILOGRAMOS').toUpperCase();
        
        // Verificar si existe la unidad en el objeto de totales
        if (totales[unidad] === undefined) {
            totales[unidad] = 0;
        }
        
        // Sumar la cantidad al total correspondiente
        const cantidad = parseFloat(registro.cantidad) || 0;
        totales[unidad] += cantidad;
    });
    
    return totales;
}

/**
 * Define los colores e iconos para diferentes unidades y tipos
 * Colores más sólidos y vibrantes con fondos diferenciados
 */
function getUnitStyle(unidad, tipo, index) {
    // Definir iconos según la unidad
    const iconosUnidad = {
        'KILOGRAMOS': 'fa-weight',
        'TONELADAS': 'fa-weight-hanging',
        'TARIMAS': 'fa-pallet',
        'CAJAS': 'fa-box',
        'PIEZAS': 'fa-cubes',
        'UNIDADES': 'fa-th',
        'LITROS': 'fa-tint',
        'METROS': 'fa-ruler'
    };
    
    // Colores sólidos para rechazados con fondos diferenciados
    const coloresRechazados = [
        { bg: '#ff0000', hover: '#cc0000', light: '#ffcccc', bgCard: '#fff0f0' },
        { bg: '#ff3333', hover: '#cc0000', light: '#ffe6e6', bgCard: '#ffe6e6' },
        { bg: '#ff6600', hover: '#cc5200', light: '#fff0e6', bgCard: '#fff5eb' },
        { bg: '#ff3366', hover: '#cc0044', light: '#ffe6ee', bgCard: '#ffebf0' },
        { bg: '#cc0033', hover: '#990022', light: '#ffddee', bgCard: '#ffe6f0' }
    ];
    
    // Colores sólidos para detenidos con fondos diferenciados
    const coloresDetenidos = [
        { bg: '#ffcc00', hover: '#ff9900', light: '#fff9e6', bgCard: '#fffdf0' },
        { bg: '#00cc00', hover: '#009900', light: '#e6ffe6', bgCard: '#f0fff0' },
        { bg: '#00cccc', hover: '#009999', light: '#e6ffff', bgCard: '#f0ffff' },
        { bg: '#9933ff', hover: '#6600cc', light: '#f2e6ff', bgCard: '#f8f0ff' },
        { bg: '#0099cc', hover: '#006699', light: '#e6f5ff', bgCard: '#f0f8ff' }
    ];
    
    // Seleccionar el conjunto de colores según el tipo
    const colores = tipo === 'rechazados' ? coloresRechazados : coloresDetenidos;
    
    // Obtener el color basado en el índice (con ciclo si hay más unidades que colores)
    const color = colores[index % colores.length];
    
    // Obtener el icono
    const icono = iconosUnidad[unidad] || 'fa-cube';
    
    return { color, icono };
}

/**
 * Crea una caja de resumen para una unidad específica
 */
function createSummaryBox(container, unidad, valor, tipo, colorIndex) {
    // Obtener estilo para esta unidad
    const estilo = getUnitStyle(unidad, tipo, colorIndex);
    
    // Crear la estructura de la caja
    const boxWrapper = document.createElement('div');
    boxWrapper.className = 'summary-box-wrapper';
    
    const box = document.createElement('div');
    box.className = 'summary-box';
    // Agregar clase especial para valores cero
    if (valor === 0) {
        box.className += ' summary-box-zero';
    }
    box.style.setProperty('--box-color', estilo.color.bg);
    box.style.setProperty('--box-hover-color', estilo.color.hover);
    box.style.setProperty('--box-light-color', estilo.color.light);
    box.style.setProperty('--box-bg-color', estilo.color.bgCard);
    
    // Crear el icono
    const iconDiv = document.createElement('div');
    iconDiv.className = 'summary-icon';
    iconDiv.innerHTML = `<i class="fas ${estilo.icono}"></i>`;
    
    // Crear el contenido
    const content = document.createElement('div');
    content.className = 'summary-content';
    
    // Crear el valor
    const valueElement = document.createElement('div');
    valueElement.className = 'summary-value';
    valueElement.textContent = formatearValor(valor);
    
    // Crear la etiqueta
    const label = document.createElement('div');
    label.className = 'summary-label';
    label.textContent = unidad;
    
    // Crear el indicador de tipo (rechazado/detenido)
    const badge = document.createElement('div');
    badge.className = 'summary-badge';
    badge.textContent = tipo === 'rechazados' ? 'RECHAZADO' : 'DETENIDO';
    
    // Ensamblar la caja
    content.appendChild(valueElement);
    content.appendChild(label);
    content.appendChild(badge);
    box.appendChild(iconDiv);
    box.appendChild(content);
    boxWrapper.appendChild(box);
    
    // Agregar al contenedor
    container.appendChild(boxWrapper);
}

/**
 * Formatea un valor numérico para mostrar
 */
function formatearValor(valor) {
    if (valor === 0) return '0';
    
    // Si es entero, mostrar sin decimales
    if (Number.isInteger(valor)) {
        return valor.toString();
    }
    
    // Si tiene decimales, mostrar con máximo 3 decimales, eliminando ceros al final
    return valor.toFixed(3).replace(/\.?0+$/, '');
}

/**
 * Actualiza los títulos de los resúmenes según el filtro de producto
 */
function updateSummaryTitle(tipo, filtroProducto) {
    let tituloId = 'resumenRechazadosTitulo';
    let nombreBase = 'Resumen de Productos Rechazados';
    let icono = '<i class="fas fa-ban me-2"></i>';
    
    if (tipo === 'detenidos') {
        tituloId = 'resumenDetenidosTitulo';
        nombreBase = 'Resumen de Productos Detenidos';
        icono = '<i class="fas fa-pause-circle me-2"></i>';
    }
    
    const titulo = document.getElementById(tituloId);
    if (!titulo) return;
    
    if (filtroProducto !== 'todos' && filtroProducto) {
        titulo.innerHTML = `${icono}${filtroProducto} - ${tipo === 'rechazados' ? 'Rechazados' : 'Detenidos'}`;
    } else {
        titulo.innerHTML = `${icono}${nombreBase}`;
    }
}

// Hacer las funciones disponibles globalmente
window.updateSummaryBoxes = updateSummaryBoxes;
window.obtenerRegistrosDeTabla = obtenerRegistrosDeTabla;