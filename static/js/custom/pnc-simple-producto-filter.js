/**
 * Funcionalidad para filtrar productos y calcular resúmenes de cantidades en PNC Simple
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de PNC Simple TORTILLA
    if (window.location.href.includes('/pnc_simple/TORTILLA')) {
        // Inicializar filtro de productos
        initProductoFilter();
        
        // Calcular resumen inicial con todos los productos
        calcularResumenCantidades('todos');

        // Asegurarse de que se recalculen los totales cuando se cambie a la pestaña de Resultados
        const resultadosTab = document.getElementById('resultados-tab');
        if (resultadosTab) {
            resultadosTab.addEventListener('shown.bs.tab', function() {
                // Obtener el producto seleccionado actualmente
                const filtroProducto = document.getElementById('filtroProductoTabla');
                const productoSeleccionado = filtroProducto ? filtroProducto.value : 'todos';
                
                // Recalcular los resúmenes
                calcularResumenCantidades(productoSeleccionado);
            });
        }
    }
});

/**
 * Inicializa el filtro de productos para la tabla
 */
function initProductoFilter() {
    const filtroProducto = document.getElementById('filtroProductoTabla');
    if (!filtroProducto) return;
    
    // Manejar cambio en el filtro
    filtroProducto.addEventListener('change', function() {
        const productoSeleccionado = this.value;
        
        // Calcular y mostrar resumen de cantidades
        calcularResumenCantidades(productoSeleccionado);
        
        // Actualizar título del resumen
        actualizarTituloResumen(productoSeleccionado);
        
        // Actualizar los gráficos con el nuevo filtro
        if (typeof loadAnalysisData === 'function') {
            // Sincronizar el filtro de producto en el panel de análisis
            const filterProductoAnalisis = document.getElementById('filterProducto');
            if (filterProductoAnalisis) {
                filterProductoAnalisis.value = productoSeleccionado;
            }
            
            // Recargar datos de análisis
            loadAnalysisData();
        }
    });
}

/**
 * Calcula y muestra el resumen de cantidades por unidad
 */
function calcularResumenCantidades(producto) {
    // Obtener todas las filas de la tabla
    const tabla = document.querySelector('.pnc-simple-table');
    if (!tabla) return;
    
    const filas = tabla.querySelectorAll('tbody tr');
    
    // Crear un objeto para almacenar los totales por unidad
    let totalesPorUnidad = {};
    
    // Recorrer las filas y recopilar todas las unidades y sus totales
    filas.forEach(fila => {
        // Solo procesar filas que correspondan al producto filtrado
        const celdaProducto = fila.querySelector('td:nth-child(4)');
        if (!celdaProducto) return;
        
        const nombreProducto = celdaProducto.textContent.trim();
        
        // Si no coincide con el filtro, ignorar esta fila
        if (producto !== 'todos' && nombreProducto !== producto) return;
        
        // Obtener la celda de cantidad
        const celdaCantidad = fila.querySelector('td:nth-child(6)');
        if (!celdaCantidad || celdaCantidad.textContent.trim() === '-') return;
        
        // Extraer la cantidad y la unidad
        const contenidoCelda = celdaCantidad.textContent.trim();
        const match = contenidoCelda.match(/([0-9,.]+)\s*([A-Za-z]+)?/);
        
        if (match) {
            const cantidad = parseFloat(match[1].replace(',', '.')) || 0;
            let unidad = match[2] ? match[2].trim().toUpperCase() : 'SIN UNIDAD';
            
            // Si no hay unidad, marcarla como 'SIN UNIDAD'
            if (!unidad) {
                unidad = 'SIN UNIDAD';
            }
            
            // Sumar al contador correspondiente
            if (!totalesPorUnidad[unidad]) {
                totalesPorUnidad[unidad] = 0;
            }
            totalesPorUnidad[unidad] += cantidad;
        }
    });
    
    // Generar dinámicamente las tarjetas para cada unidad
    generarTarjetasUnidades(totalesPorUnidad);
}

/**
 * Genera tarjetas para cada unidad encontrada
 */
function generarTarjetasUnidades(totalesPorUnidad) {
    const container = document.getElementById('resumenUnidadesContainer');
    if (!container) return;
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Si no hay datos, mostrar mensaje
    if (Object.keys(totalesPorUnidad).length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay datos disponibles para el producto seleccionado</p>
            </div>
        `;
        return;
    }
    
    // Ordenar las unidades (poner TONELADAS, KILOS y TARIMAS primero, luego el resto alfabéticamente)
    const unidadesOrdenadas = Object.keys(totalesPorUnidad).sort((a, b) => {
        const orden = {'TONELADAS': 1, 'KILOS': 2, 'TARIMAS': 3};
        const ordenA = orden[a] || 99;
        const ordenB = orden[b] || 99;
        
        if (ordenA !== ordenB) {
            return ordenA - ordenB;
        }
        
        return a.localeCompare(b);
    });
    
    // Determinar el tamaño de las columnas según la cantidad de unidades
    const totalUnidades = unidadesOrdenadas.length;
    let columnWidth;
    
    if (totalUnidades === 1) {
        columnWidth = 12; // 1 columna de ancho completo
    } else if (totalUnidades === 2) {
        columnWidth = 6;  // 2 columnas de ancho 6
    } else if (totalUnidades === 3) {
        columnWidth = 4;  // 3 columnas de ancho 4
    } else if (totalUnidades === 4) {
        columnWidth = 3;  // 4 columnas de ancho 3
    } else {
        columnWidth = 3;  // Para 5 o más, usar ancho 3 (4 por fila)
    }
    
    // Crear tarjetas para cada unidad
    unidadesOrdenadas.forEach(unidad => {
        const total = totalesPorUnidad[unidad];
        
        // Crear tarjeta para esta unidad
        const tarjeta = document.createElement('div');
        tarjeta.className = `col-md-${columnWidth} mb-3`;
        tarjeta.innerHTML = `
            <div class="card bg-light h-100">
                <div class="card-body text-center">
                    <h6 class="card-subtitle mb-2 text-muted">${unidad}</h6>
                    <h3 class="card-title">${total.toFixed(2)}</h3>
                </div>
            </div>
        `;
        
        // Agregar al contenedor
        container.appendChild(tarjeta);
    });
}

/**
 * Actualiza el título del resumen según el producto seleccionado
 */
function actualizarTituloResumen(producto) {
    const titulo = document.getElementById('resumenProductoTitulo');
    if (!titulo) return;
    
    if (producto === 'todos') {
        titulo.textContent = 'Resumen de cantidades - Todos los productos';
    } else {
        titulo.textContent = `Resumen de cantidades - ${producto}`;
    }
}
