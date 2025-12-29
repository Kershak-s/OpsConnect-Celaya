/**
 * Funcionalidad para las cajas de resumen de cantidades en PNC Simple TORTILLA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de TORTILLA
    if (window.location.href.includes('/pnc_simple/TORTILLA')) {
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

        // NUEVO: Agregar manejador de eventos para calcular totales después de agregar o editar registros
        document.addEventListener('DOMContentLoaded', function() {
            // Escuchar el cierre de modales
            const createModal = document.getElementById('createPNCModal');
            const editModal = document.getElementById('editPNCModal');
            
            if (createModal) {
                createModal.addEventListener('hidden.bs.modal', function() {
                    // Actualizar los resúmenes cuando se cierre el modal de creación
                    const filtroProducto = document.getElementById('filtroProductoTabla').value;
                    updateSummaryBoxes(filtroProducto);
                });
            }
            
            if (editModal) {
                editModal.addEventListener('hidden.bs.modal', function() {
                    // Actualizar los resúmenes cuando se cierre el modal de edición
                    const filtroProducto = document.getElementById('filtroProductoTabla').value;
                    updateSummaryBoxes(filtroProducto);
                });
            }
        });
    }
});

/**
 * Inicializa las cajas de resumen de cantidades
 */
function initSummaryBoxes() {
    // Actualizar las cajas con el filtro actual (todos por defecto)
    updateSummaryBoxes('todos');
}

/**
 * Actualiza las cajas de resumen de cantidades según el filtro de producto
 * @param {string} filtroProducto - El filtro de producto seleccionado
 */
function updateSummaryBoxes(filtroProducto) {
    // MODIFICADO: Obtener datos dinámicamente de los registros visibles en la tabla
    const pncRecords = obtenerRegistrosTabla();
    
    // Separamos los registros por status
    const registrosRechazados = pncRecords.filter(record => record.status === 'RECHAZADO');
    const registrosDetenidos = pncRecords.filter(record => record.status === 'DETENIDO');
    
    // Actualizamos cada contenedor con sus datos filtrados
    updateSummaryContainer('summaryRechazadosContainer', registrosRechazados, filtroProducto, 'rechazados');
    updateSummaryContainer('summaryDetenidosContainer', registrosDetenidos, filtroProducto, 'detenidos');
}

/**
 * Actualiza un contenedor de resumen específico
 * @param {string} containerId - ID del contenedor a actualizar
 * @param {Array} registros - Registros filtrados para este contenedor
 * @param {string} filtroProducto - Filtro de producto aplicado
 * @param {string} tipo - Tipo de resumen (rechazados o detenidos)
 */
function updateSummaryContainer(containerId, registros, filtroProducto, tipo) {
    // Obtener el contenedor de las cajas de resumen
    const summaryContainer = document.getElementById(containerId);
    if (!summaryContainer) return;
    
    // Limpiar el contenedor
    summaryContainer.innerHTML = '';
    
    // Calcular totales por unidad para estos registros
    const totales = calcularTotalesPorUnidad(registros, filtroProducto);
    
    // Verificar si todos los totales son cero
    const hayDatos = Object.values(totales).some(value => value > 0);
    
    // Si no hay datos, mostrar mensaje
    if (!hayDatos) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'alert alert-info text-center my-3';
        noDataMessage.innerHTML = '<strong>NO EXISTEN DATOS REGISTRADOS</strong>';
        summaryContainer.appendChild(noDataMessage);
    } else {
        // Crear las cajas para las unidades estándar
        createSummaryBox(summaryContainer, 'KILOGRAMOS', totales['KILOGRAMOS'], 'kilogramos');
        createSummaryBox(summaryContainer, 'TONELADAS', totales['TONELADAS'], 'toneladas');
        createSummaryBox(summaryContainer, 'TARIMAS', totales['TARIMAS'], 'tarimas');
        
        // Si hay otras unidades, crear cajas adicionales
        const otrasUnidadesKeys = Object.keys(totales).filter(key => 
            !['KILOGRAMOS', 'TONELADAS', 'TARIMAS'].includes(key)
        );
        
        if (otrasUnidadesKeys.length > 0) {
            otrasUnidadesKeys.forEach(unidad => {
                createSummaryBox(summaryContainer, unidad, totales[unidad], 'otro');
            });
        }
    }
    
    // Actualizar el título si es necesario
    updateSummaryTitle(tipo, filtroProducto);
}

/**
 * NUEVO: Obtiene los registros visibles en la tabla de PNC
 */
function obtenerRegistrosTabla() {
    const registros = [];
    
    // Obtener todas las filas de la tabla de registros PNC
    const filas = document.querySelectorAll('.pnc-simple-table tbody tr');
    
    filas.forEach(fila => {
        // Saltar filas vacías o mensajes de "no hay registros"
        if (fila.cells.length <= 1 || fila.classList.contains('empty-row')) {
            return;
        }
        
        // Extraer datos de las celdas
        const producto = fila.cells[3]?.textContent.trim();
        const origen = fila.cells[6]?.textContent.trim();
        const status = fila.cells[7]?.textContent.trim();
        
        // Obtener cantidad y unidad (pueden estar en el mismo campo)
        let cantidadText = fila.cells[5]?.textContent.trim();
        let cantidad = 0;
        let unidad = '';
        
        if (cantidadText && cantidadText !== '-') {
            // Separar cantidad y unidad
            const cantidadMatch = cantidadText.match(/^([\d.,]+)\s*([A-Za-z]+)?$/);
            if (cantidadMatch) {
                // Convertir a número limpiando posibles formatos
                cantidad = parseFloat(cantidadMatch[1].replace(',', '.'));
                unidad = cantidadMatch[2] ? cantidadMatch[2].trim().toUpperCase() : '';
            }
            
            // Si no hay unidad explícita, usar el atributo data si existe
            if (!unidad) {
                unidad = fila.cells[5].getAttribute('data-unidad') || 'KILOGRAMOS';
            }
        }
        
        // Asegurarse de que tenemos una unidad válida
        if (!unidad) {
            unidad = 'KILOGRAMOS'; // Valor por defecto
        }
        
        // Añadir el registro procesado
        registros.push({
            producto: producto,
            cantidad: cantidad,
            unidad: unidad,
            origen: origen,
            status: status
        });
    });
    
    return registros;
}

/**
 * NUEVO: Calcula totales por unidad a partir de los registros de la tabla
 * @param {Array} registros - Lista de registros extraídos de la tabla
 * @param {string} filtroProducto - Filtro de producto seleccionado
 */
function calcularTotalesPorUnidad(registros, filtroProducto) {
    const totales = {
        'KILOGRAMOS': 0,
        'TONELADAS': 0,
        'TARIMAS': 0
    };
    
    registros.forEach(registro => {
        // Aplicar filtro de producto si no es "todos"
        if (filtroProducto !== 'todos' && registro.producto !== filtroProducto) {
            return;
        }
        
        // Normalizar la unidad a mayúsculas
        const unidad = registro.unidad.toUpperCase();
        
        // Verificar si existe la unidad en el objeto de totales
        if (totales[unidad] === undefined) {
            totales[unidad] = 0;
        }
        
        // Sumar la cantidad al total correspondiente
        totales[unidad] += registro.cantidad;
    });
    
    // También podemos intentar usar los datos pasados desde el servidor como respaldo
    if (Object.values(totales).every(val => val === 0) && typeof window.unidadesPorProducto !== 'undefined') {
        try {
            // Usar los datos del servidor como respaldo si no se encontraron registros en la tabla
            Object.keys(window.unidadesPorProducto).forEach(producto => {
                // Si se ha filtrado por un producto específico y no coincide, saltar
                if (filtroProducto !== 'todos' && producto !== filtroProducto) {
                    return;
                }
                
                // Acumular cantidades por unidad
                const unidades = window.unidadesPorProducto[producto];
                Object.keys(unidades).forEach(unidad => {
                    if (!totales[unidad]) {
                        totales[unidad] = 0;
                    }
                    totales[unidad] += unidades[unidad];
                });
            });
        } catch (e) {
            console.error('Error al acceder a los datos del servidor:', e);
        }
    }
    
    return totales;
}

/**
 * Crea una caja de resumen para una unidad específica
 * @param {HTMLElement} container - El contenedor donde se agregará la caja
 * @param {string} unidad - El nombre de la unidad
 * @param {number} valor - El valor a mostrar
 * @param {string} tipo - El tipo de unidad para aplicar estilos específicos
 */
function createSummaryBox(container, unidad, valor, tipo) {
    // Crear la caja
    const box = document.createElement('div');
    box.className = `summary-box ${tipo}`;
    
    // Crear el encabezado
    const header = document.createElement('div');
    header.className = 'summary-header';
    header.textContent = unidad;
    
    // Crear el contenido
    const content = document.createElement('div');
    content.className = 'summary-content';
    
    // Crear el valor
    const valueElement = document.createElement('div');
    valueElement.className = 'summary-value';
    // Formatear el valor: si es entero, mostrar sin decimales; si tiene decimales, mostrar con 2 decimales
    const formattedValue = Number.isInteger(valor) ? valor.toString() : valor.toFixed(2);
    valueElement.textContent = formattedValue;
    
    // Crear la etiqueta
    const label = document.createElement('div');
    label.className = 'summary-label';
    label.textContent = 'Total de producto';
    
    // Ensamblar la caja
    content.appendChild(valueElement);
    content.appendChild(label);
    box.appendChild(header);
    box.appendChild(content);
    
    // Agregar al contenedor
    container.appendChild(box);
}

/**
 * Actualiza los títulos de los resúmenes según el filtro de producto
 * @param {string} tipo - Tipo de resumen (rechazados o detenidos)
 * @param {string} filtroProducto - El filtro de producto seleccionado
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
    
    if (filtroProducto !== 'todos') {
        // Caso especial para Doritos y TOSTITOS SALSA VERDE según lo solicitado
        if (filtroProducto === 'DORITOS' && tipo === 'detenidos') {
            titulo.innerHTML = `${icono}${nombreBase} - TOSTITOS SALSA VERDE`;
        } else {
            titulo.innerHTML = `${icono}${nombreBase} - ${filtroProducto}`;
        }
    } else {
        titulo.innerHTML = `${icono}${nombreBase}`;
    }
}


