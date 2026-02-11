/**
 * Funcionalidad genérica para la pestaña de resultados en PNC Simple
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
        // Configurar productos según la categoría
        configurarProductosPorCategoria(currentCategory);
        
        // Configurar orígenes según la categoría
        configurarOrigenesPorCategoria(currentCategory);
        
        // Configurar el menú desplegable de período
        configurarMenuPeriodo();
        
        // Configurar los menús desplegables de productos
        configurarMenusProductos();
        
        // Inicializar los datos y la visualización
        calcularResumenCantidades('todos');
        
        // Configurar eventos para los filtros
        configurarEventosFiltros();
        
        // Asegurarse de que la pestaña de resultados muestre datos actualizados
        const resultadosTab = document.getElementById('resultados-tab');
        if (resultadosTab) {
            resultadosTab.addEventListener('shown.bs.tab', function() {
                calcularResumenCantidades(document.getElementById('filtroProductoTabla').value || 'todos');
                actualizarDatos();
            });
        }
    }
});

// Variable global para almacenar la configuración de productos por categoría
let productosConfig = {
    'EXTRUIDOS': ['TORCIDOS', 'CHEETOS', 'OTROS'],
    'TORTILLA': ['DORITOS', 'TOSTITOS SALSA VERDE', 'TOSTITOS FH','DORITOS PIZZEROLA','DORITOS FH', 'RANCHERITOS','CHETOS'],
    'PAPA': ['PAPA SAL', 'RUFFLES QUESO', 'RUFFLES SAL', 'SABRITAS LIMON', 'SABRITAS XTRA FH', 'OTROS']
};

// Variable global para almacenar la configuración de orígenes por categoría
let origenesConfig = {
    'EXTRUIDOS': [
        'EXTRUSIÓN',
        'FREIDOR',
        'SAZONADO',
        'EMPAQUE',
        'ALMACÉN'
    ],
    'TORTILLA': [
        'COCIMIENTO',
        'FREIDOR',
        'LIMPIEZA DE MAIZ',
        'MOLINO/LAMINADOR',
        'SAZONADO',
        'EMPAQUE GENERAL'
    ],
    'PAPA': [
        'PELADO',
        'REBANADO',
        'FREIDOR',
        'SAZONADO',
        'EMPAQUE'
    ]
};

/**
 * Configura los productos disponibles según la categoría
 */
function configurarProductosPorCategoria(categoria) {
    // Si hay productos únicos definidos desde el servidor, usarlos
    if (typeof window.productosUnicos !== 'undefined' && window.productosUnicos.length > 0) {
        productosConfig[categoria] = window.productosUnicos;
    }
}

/**
 * Configura los orígenes disponibles según la categoría
 */
function configurarOrigenesPorCategoria(categoria) {
    const selectOrigen = document.getElementById('filterOrigen');
    const createOrigen = document.getElementById('createOrigen');
    const editOrigen = document.getElementById('editOrigen');
    
    // Función para actualizar las opciones de un select
    function actualizarOpcionesOrigen(select) {
        if (!select) return;
        
        // Limpiar opciones actuales
        select.innerHTML = '<option value="todos">Todos</option>';
        
        // Agregar orígenes según la categoría
        const origenes = origenesConfig[categoria] || [];
        origenes.forEach(origen => {
            const option = document.createElement('option');
            option.value = origen;
            option.textContent = origen;
            select.appendChild(option);
        });
    }
    
    // Actualizar todos los selectores de origen
    actualizarOpcionesOrigen(selectOrigen);
    actualizarOpcionesOrigen(createOrigen);
    actualizarOpcionesOrigen(editOrigen);
}

/**
 * Configura el menú desplegable de período
 */
function configurarMenuPeriodo() {
    const periodoSelect = document.getElementById('filterPeriodo');
    if (!periodoSelect) return;

    // Limpiar opciones actuales
    periodoSelect.innerHTML = '';

    // Añadir las opciones de período
    const opciones = [
        { value: 'dia', text: 'Día' },
        { value: 'semana', text: 'Semana' },
        { value: 'mes', text: 'Mes' },
        { value: 'bimestre', text: 'Bimestre' }
    ];

    opciones.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion.value;
        optionElement.textContent = opcion.text;
        periodoSelect.appendChild(optionElement);
    });
}

/**
 * Configura los menús desplegables de productos
 */
function configurarMenusProductos() {
    const filterProductoSelect = document.getElementById('filterProducto');
    const filtroProductoTablaSelect = document.getElementById('filtroProductoTabla');
    
    if (!filterProductoSelect || !filtroProductoTablaSelect) return;
    
    // Detectar categoría actual
    const currentUrl = window.location.href;
    let categoria = 'TORTILLA'; // Por defecto
    
    if (currentUrl.includes('EXTRUIDOS')) {
        categoria = 'EXTRUIDOS';
    } else if (currentUrl.includes('PAPA')) {
        categoria = 'PAPA';
    }
    
    // Limpiar opciones actuales en ambos selectores
    [filterProductoSelect, filtroProductoTablaSelect].forEach(select => {
        select.innerHTML = '';
        
        // Añadir opción 'Todos'
        const todosOption = document.createElement('option');
        todosOption.value = 'todos';
        todosOption.textContent = 'Todos los productos';
        select.appendChild(todosOption);
    });
    
    // Obtener lista de productos según la categoría
    let productos = productosConfig[categoria] || [];
    
    // Si hay datos disponibles del servidor, usar esos
    if (typeof window.productosUnicos !== 'undefined' && window.productosUnicos.length > 0) {
        productos = window.productosUnicos;
    }
    
    // Añadir opciones de productos a ambos selectores
    productos.forEach(producto => {
        [filterProductoSelect, filtroProductoTablaSelect].forEach(select => {
            const optionElement = document.createElement('option');
            optionElement.value = producto;
            optionElement.textContent = producto;
            select.appendChild(optionElement);
        });
    });
}

/**
 * Configura eventos para los filtros
 */
function configurarEventosFiltros() {
    // Configurar eventos para los filtros principales
    document.getElementById('filterPeriodo')?.addEventListener('change', actualizarDatos);
    document.getElementById('filterProducto')?.addEventListener('change', actualizarDatos);
    document.getElementById('filterStatus')?.addEventListener('change', actualizarDatos);
    document.getElementById('filterOrigen')?.addEventListener('change', actualizarDatos);
    
    // Configurar evento para el filtro de productos en la tabla
    document.getElementById('filtroProductoTabla')?.addEventListener('change', function() {
        calcularResumenCantidades(this.value);
        actualizarTituloResumen(this.value);
    });
}

/**
 * Calcula y muestra el resumen de cantidades para los productos
 */
function calcularResumenCantidades(filtroProducto) {
    // Obtener contenedores para rechazados y detenidos
    const contenedorRechazados = document.getElementById('summaryRechazadosContainer');
    const contenedorDetenidos = document.getElementById('summaryDetenidosContainer');
    
    if (!contenedorRechazados || !contenedorDetenidos) return;
    
    // Limpiar contenedores
    contenedorRechazados.innerHTML = '';
    contenedorDetenidos.innerHTML = '';
    
    // Procesar datos de registros PNC
    const registros = procesarRegistrosPNC(filtroProducto);
    
    // Mostrar resumen de rechazados
    mostrarResumenPorStatus(registros.rechazados, contenedorRechazados, 'RECHAZADO');
    
    // Mostrar resumen de detenidos
    mostrarResumenPorStatus(registros.detenidos, contenedorDetenidos, 'DETENIDO');
}

/**
 * Procesa los registros PNC y los agrupa por status
 */
function procesarRegistrosPNC(filtroProducto) {
    const rechazados = {};
    const detenidos = {};
    
    // Obtener registros desde la tabla o desde window.pncRecords
    const registros = window.pncRecords || [];
    
    registros.forEach(registro => {
        // Filtrar por producto si es necesario
        if (filtroProducto !== 'todos' && registro.producto !== filtroProducto) {
            return;
        }
        
        // Agrupar por status
        const unidad = registro.unidad_cantidad || 'UNIDADES';
        const cantidad = parseFloat(registro.cantidad) || 0;
        
        if (registro.status === 'RECHAZADO') {
            if (!rechazados[unidad]) rechazados[unidad] = 0;
            rechazados[unidad] += cantidad;
        } else if (registro.status === 'DETENIDO') {
            if (!detenidos[unidad]) detenidos[unidad] = 0;
            detenidos[unidad] += cantidad;
        }
    });
    
    return { rechazados, detenidos };
}

/**
 * Muestra el resumen de cantidades por status
 */
function mostrarResumenPorStatus(datos, contenedor, status) {
    // Si no hay datos, mostrar mensaje
    if (Object.keys(datos).length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center text-muted">No hay productos ' + 
                               status.toLowerCase() + 's en este período</div>';
        return;
    }
    
    // Crear cajas de resumen para cada unidad
    Object.entries(datos).forEach(([unidad, cantidad]) => {
        const caja = crearCajaResumen(unidad, cantidad, status);
        contenedor.appendChild(caja);
    });
}

/**
 * Crea una caja de resumen para mostrar cantidades
 */
function crearCajaResumen(unidad, cantidad, status) {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-3';
    
    const card = document.createElement('div');
    card.className = 'summary-box ' + (status === 'RECHAZADO' ? 'summary-box-red' : 'summary-box-yellow');
    
    const icon = document.createElement('div');
    icon.className = 'summary-icon';
    icon.innerHTML = status === 'RECHAZADO' ? 
        '<i class="fas fa-ban"></i>' : 
        '<i class="fas fa-pause-circle"></i>';
    
    const content = document.createElement('div');
    content.className = 'summary-content';
    
    const value = document.createElement('div');
    value.className = 'summary-value';
    value.textContent = formatearCantidad(cantidad);
    
    const label = document.createElement('div');
    label.className = 'summary-label';
    label.textContent = unidad;
    
    content.appendChild(value);
    content.appendChild(label);
    
    card.appendChild(icon);
    card.appendChild(content);
    col.appendChild(card);
    
    return col;
}

/**
 * Formatea una cantidad para mostrar
 */
function formatearCantidad(cantidad) {
    // Si es un número entero, no mostrar decimales
    if (cantidad % 1 === 0) {
        return cantidad.toString();
    }
    // Si tiene decimales, mostrar máximo 3
    return cantidad.toFixed(3).replace(/\.?0+$/, '');
}

/**
 * Actualiza el título del resumen según el producto filtrado
 */
function actualizarTituloResumen(filtroProducto) {
    const tituloRechazados = document.getElementById('resumenRechazadosTitulo');
    const tituloDetenidos = document.getElementById('resumenDetenidosTitulo');
    
    if (filtroProducto === 'todos') {
        if (tituloRechazados) tituloRechazados.innerHTML = '<i class="fas fa-ban me-2"></i>Resumen de Productos Rechazados';
        if (tituloDetenidos) tituloDetenidos.innerHTML = '<i class="fas fa-pause-circle me-2"></i>Resumen de Productos Detenidos';
    } else {
        if (tituloRechazados) tituloRechazados.innerHTML = `<i class="fas fa-ban me-2"></i>Resumen de ${filtroProducto} - Rechazados`;
        if (tituloDetenidos) tituloDetenidos.innerHTML = `<i class="fas fa-pause-circle me-2"></i>Resumen de ${filtroProducto} - Detenidos`;
    }
}

/**
 * Actualiza todos los datos y gráficos basados en los filtros seleccionados
 */
function actualizarDatos() {
    const filtroProducto = document.getElementById('filtroProductoTabla')?.value || 'todos';
    
    // Actualizar resumen de cantidades
    calcularResumenCantidades(filtroProducto);
    
    // Actualizar título del resumen
    actualizarTituloResumen(filtroProducto);
    
    // Si existen funciones de gráficos, actualizarlas
    if (typeof updateCharts === 'function') {
        updateCharts();
    }
}

// Hacer las funciones disponibles globalmente para compatibilidad
window.calcularResumenCantidades = calcularResumenCantidades;
window.actualizarTituloResumen = actualizarTituloResumen;
window.actualizarDatos = actualizarDatos;
