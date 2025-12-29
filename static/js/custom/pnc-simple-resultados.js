/**
 * Funcionalidad para la pestaña de resultados en PNC Simple - TORTILLA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de TORTILLA y en la pestaña de resultados
    if (window.location.href.includes('/pnc_simple/TORTILLA')) {
        // Configurar el menú desplegable de período con las nuevas opciones
        configurarMenuPeriodo();

        // Configurar los menús desplegables de productos con las opciones disponibles
        configurarMenusProductos();

        // Eliminar la tabla de "Resumen de Productos No Conforme"
        eliminarTablaResumenPNC();

        // Inicializar los datos y la visualización
        calcularResumenCantidades('todos');

        // Configurar eventos para los filtros
        document.getElementById('filterPeriodo').addEventListener('change', actualizarDatos);
        document.getElementById('filterProducto').addEventListener('change', actualizarDatos);
        document.getElementById('filtroProductoTabla').addEventListener('change', function() {
            calcularResumenCantidades(this.value);
            actualizarTituloResumen(this.value);
        });

        // Asegurarse de que la pestaña de resultados muestre datos actualizados cuando se active
        document.getElementById('resultados-tab').addEventListener('shown.bs.tab', function() {
            calcularResumenCantidades(document.getElementById('filtroProductoTabla').value);
            actualizarDatos();
        });
        
        // Interceptar los formularios de eliminación para actualizar los datos
        configurarFormulariosEliminacion();
    }
});

/**
 * Configura el menú desplegable de período con las opciones solicitadas
 */
function configurarMenuPeriodo() {
    const periodoSelect = document.getElementById('filterPeriodo');
    if (!periodoSelect) return;

    // Limpiar opciones actuales
    while (periodoSelect.firstChild) {
        periodoSelect.removeChild(periodoSelect.firstChild);
    }

    // Añadir las nuevas opciones
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
 * Configura los menús desplegables de productos con las opciones disponibles
 */
function configurarMenusProductos() {
    const filterProductoSelect = document.getElementById('filterProducto');
    const filtroProductoTablaSelect = document.getElementById('filtroProductoTabla');
    
    if (!filterProductoSelect || !filtroProductoTablaSelect) return;
    
    // Limpiar opciones actuales en ambos selectores
    [filterProductoSelect, filtroProductoTablaSelect].forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        
        // Añadir opción 'Todos'
        const todosOption = document.createElement('option');
        todosOption.value = 'todos';
        todosOption.textContent = 'Todos los productos';
        select.appendChild(todosOption);
    });
    
    // Obtener lista de productos disponibles
    let productos = [ 'DORITOS', 'RANCHERITOS','TOSTITOS SALSA VERDE' , 'TOSTITOS FH','DORITOS PIZZEROLA','DORITOS FH']; // Por defecto
    
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
 * Elimina la tabla de "Resumen de Productos No Conforme"
 */
function eliminarTablaResumenPNC() {
    // Identificar todos los elementos que contengan títulos relacionados con "Resumen de Productos No Conforme"
    const elementos = document.querySelectorAll('h5, .card-title');
    
    elementos.forEach(elemento => {
        if (elemento.textContent.includes('Resumen de Productos No Conforme')) {
            // Encontrar el contenedor padre (probablemente una card o div)
            let contenedor = elemento.closest('.card, .row');
            if (contenedor) {
                contenedor.remove();
            }
        }
    });
}

/**
 * Calcula y muestra el resumen de cantidades para los productos
 * @param {string} filtroProducto - El producto filtrado ('todos' o nombre específico)
 */
function calcularResumenCantidades(filtroProducto) {
    // Obtener el contenedor donde se mostrarán los datos
    const contenedor = document.getElementById('resumenUnidadesContainer');
    if (!contenedor) return;

    // Limpiar el contenedor
    contenedor.innerHTML = '';
    
    // Verificar si tenemos datos disponibles del servidor
    let datosDisponibles = false;
    let unidadesPorProducto = {};
    
    // Intentar obtener los datos pasados desde el servidor (en el template)
    try {
        // Estos datos deben estar disponibles como variables JavaScript en la página
        // Si no están disponibles, usará datos de ejemplo
        if (typeof window.unidadesPorProducto !== 'undefined') {
            unidadesPorProducto = window.unidadesPorProducto;
            datosDisponibles = true;
        }
    } catch (e) {
        console.error('Error al acceder a los datos del servidor:', e);
    }
    
    // Si no hay datos del servidor, usar datos de ejemplo
    if (!datosDisponibles) {
        // Datos de ejemplo para demostrar la funcionalidad
        unidadesPorProducto = {
            'CHETOS': { 'TONELADAS': 12.5, 'KILOGRAMOS': 45.2, 'TARIMAS': 3 },
            'DORITOS': { 'TONELADAS': 8.3, 'KILOGRAMOS': 36.7, 'TARIMAS': 2 },
            'TOSTITOS SALSA VERDE': { 'TONELADAS': 5.7, 'KILOGRAMOS': 22.5, 'TARIMAS': 1 },
            'OTROS': { 'KILOGRAMOS': 3.2, 'TARIMAS': 2, 'CAJAS': 1.5 }
        };
    }
    
    // Agrupar por unidad para todos los productos o para un producto específico
    const porUnidad = {};
    
    Object.keys(unidadesPorProducto).forEach(producto => {
        // Si se ha filtrado por un producto específico y no coincide, saltar
        if (filtroProducto !== 'todos' && producto !== filtroProducto) {
            return;
        }
        
        // Acumular cantidades por unidad
        const unidades = unidadesPorProducto[producto];
        Object.keys(unidades).forEach(unidad => {
            if (!porUnidad[unidad]) {
                porUnidad[unidad] = 0;
            }
            porUnidad[unidad] += unidades[unidad];
        });
    });
    
    // Crear las tarjetas para cada unidad estándar primero (Kilogramos, Toneladas, Tarimas)
    const unidadesEstandar = ['KILOGRAMOS', 'TONELADAS', 'TARIMAS'];
    const unidadesOtras = Object.keys(porUnidad).filter(unidad => !unidadesEstandar.includes(unidad));
    
    // Primero mostrar las unidades estándar
    unidadesEstandar.forEach(unidad => {
        if (porUnidad[unidad] !== undefined) {
            crearTarjetaUnidad(unidad, porUnidad[unidad], contenedor);
        } else if (unidad !== 'OTROS') { // Si no hay datos para esta unidad estándar, mostrar 0
            crearTarjetaUnidad(unidad, 0, contenedor);
        }
    });
    
    // Luego mostrar las otras unidades (si hay)
    unidadesOtras.forEach(unidad => {
        crearTarjetaUnidad(unidad, porUnidad[unidad], contenedor);
    });
    
    // Añadir una tarjeta para "OTROS" con un campo de entrada
    const columnaOtros = document.createElement('div');
    columnaOtros.className = 'col-md-3 mb-3';
    
    const tarjetaOtros = document.createElement('div');
    tarjetaOtros.className = 'card h-100 border-primary';
    
    const encabezadoOtros = document.createElement('div');
    encabezadoOtros.className = 'card-header bg-primary text-white';
    encabezadoOtros.innerHTML = `<h5 class="card-title mb-0">OTROS</h5>`;
    
    const cuerpoOtros = document.createElement('div');
    cuerpoOtros.className = 'card-body text-center';
    
    // Campo para ingresar una nueva unidad
    cuerpoOtros.innerHTML = `
        <div class="mb-3">
            <input type="text" id="nuevaUnidad" class="form-control mb-2" placeholder="Nombre de unidad">
            <input type="number" id="cantidadNuevaUnidad" class="form-control mb-2" step="0.01" placeholder="Cantidad">
            <button class="btn btn-sm btn-primary" id="btnAgregarNuevaUnidad">Agregar</button>
        </div>
    `;
    
    // Ensamblar la tarjeta de OTROS
    tarjetaOtros.appendChild(encabezadoOtros);
    tarjetaOtros.appendChild(cuerpoOtros);
    columnaOtros.appendChild(tarjetaOtros);
    
    // Agregar al contenedor
    contenedor.appendChild(columnaOtros);
    
    // Configurar evento para añadir nueva unidad
    document.getElementById('btnAgregarNuevaUnidad').addEventListener('click', function() {
        const nuevaUnidad = document.getElementById('nuevaUnidad').value.trim();
        const cantidad = parseFloat(document.getElementById('cantidadNuevaUnidad').value);
        
        if (nuevaUnidad && !isNaN(cantidad)) {
            // Crear una nueva tarjeta para esta unidad
            crearTarjetaUnidad(nuevaUnidad.toUpperCase(), cantidad, contenedor);
            
            // Limpiar los campos después de agregar
            document.getElementById('nuevaUnidad').value = '';
            document.getElementById('cantidadNuevaUnidad').value = '';
        } else {
            alert('Por favor ingrese un nombre de unidad válido y una cantidad numérica');
        }
    });

    // Si no hay datos, mostrar mensaje
    if (Object.keys(porUnidad).length === 0 && contenedor.childElementCount <= 1) {
        const mensajeNoData = document.createElement('div');
        mensajeNoData.className = 'col-12 text-center';
        mensajeNoData.innerHTML = '<p>No hay datos disponibles para este filtro.</p>';
        contenedor.insertBefore(mensajeNoData, columnaOtros);
    }
}

/**
 * Crea una tarjeta para mostrar una unidad y su cantidad
 * @param {string} unidad - Nombre de la unidad
 * @param {number} cantidad - Cantidad de la unidad
 * @param {HTMLElement} contenedor - Contenedor donde se agregará la tarjeta
 */
function crearTarjetaUnidad(unidad, cantidad, contenedor) {
    // Crear la columna
    const columna = document.createElement('div');
    columna.className = 'col-md-3 mb-3';
    
    // Crear la tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'card h-100 border-primary';
    
    // Crear el encabezado
    const encabezado = document.createElement('div');
    encabezado.className = 'card-header bg-primary text-white';
    encabezado.innerHTML = `<h5 class="card-title mb-0">${unidad}</h5>`;
    
    // Crear el cuerpo
    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body text-center';
    cuerpo.innerHTML = `
        <h2 class="display-4">${cantidad.toFixed(2)}</h2>
        <p class="card-text">Total de producto</p>
    `;
    
    // Ensamblar la tarjeta
    tarjeta.appendChild(encabezado);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);
    
    // Agregar al contenedor
    contenedor.appendChild(columna);
}

/**
 * Actualiza el título del resumen según el producto filtrado
 * @param {string} filtroProducto - El producto filtrado ('todos' o nombre específico)
 */
function actualizarTituloResumen(filtroProducto) {
    const titulo = document.getElementById('resumenProductoTitulo');
    if (!titulo) return;
    
    if (filtroProducto === 'todos') {
        titulo.textContent = 'Resumen de cantidades - Todos los productos';
    } else {
        titulo.textContent = `Resumen de cantidades - ${filtroProducto}`;
    }
}

/**
 * Actualiza todos los datos y gráficos basados en los filtros seleccionados
 */
function actualizarDatos() {
    // Actualizar las cajas de resumen también
    if (typeof updateSummaryBoxes === 'function') {
        const filtroProducto = document.getElementById('filtroProductoTabla') ? 
            document.getElementById('filtroProductoTabla').value : 'todos';
        updateSummaryBoxes(filtroProducto);
    }
    const periodo = document.getElementById('filterPeriodo').value;
    const producto = document.getElementById('filterProducto').value;
    const status = document.getElementById('filterStatus').value;
    const origen = document.getElementById('filterOrigen').value;
    
    // Actualizar el resumen de cantidades
    calcularResumenCantidades(producto);
    
    // Actualizar título del resumen
    actualizarTituloResumen(producto);
    
    // En un entorno real, aquí se realizaría una llamada AJAX para obtener datos actualizados
    // Pero en este ejemplo, solo actualizamos los contadores con valores simulados
    actualizarContadores(periodo, producto, status, origen);
    
    // Actualizar gráficos (función existente en el código original)
    if (typeof updateCharts === 'function') {
        updateCharts();
    }
}

/**
 * Actualiza los contadores de productos, rechazados y detenidos
 */
function actualizarContadores(periodo, producto, status, origen) {
    // Simular datos según los filtros
    let totalProductos = 25;
    let totalRechazados = 15;
    let totalDetenidos = 10;
    
    // Aplicar filtros
    if (producto !== 'todos') {
        totalProductos *= 0.4;  // Reducir si se filtra por producto
        totalRechazados *= 0.4;
        totalDetenidos *= 0.4;
    }
    
    // Aplicar factor por período
    const factoresPeriodo = {
        'dia_todos': 0.3,
        'dia_a': 0.15,
        'dia_b': 0.15,
        'semana': 1,
        'mes': 4,
        'bimestre': 8
    };
    
    const factor = factoresPeriodo[periodo] || 1;
    totalProductos *= factor;
    totalRechazados *= factor;
    totalDetenidos *= factor;
    
    // Actualizar contadores en la UI
    document.getElementById('totalProductos').textContent = totalProductos.toFixed(2);
    document.getElementById('totalRechazados').textContent = totalRechazados.toFixed(2);
    document.getElementById('totalDetenidos').textContent = totalDetenidos.toFixed(2);
}

/**
 * Configura los formularios de eliminación para actualizar los datos
 */
function configurarFormulariosEliminacion() {
    // Escuchar eventos de cambio en la tabla (eliminación, edición o creación de registros)
    // Este evento personalizado se disparará desde otros scripts cuando se modifiquen los datos
    document.addEventListener('pnc_data_changed', function() {
        // Actualizar los resúmenes
        if (typeof updateSummaryBoxes === 'function') {
            const filtroProducto = document.getElementById('filtroProductoTabla') ? 
                document.getElementById('filtroProductoTabla').value : 'todos';
            updateSummaryBoxes(filtroProducto);
            
            // También actualizar otros datos como contadores y gráficos
            actualizarDatos();
        }
    });
    
    // Obtener todos los formularios de eliminación
    const formulariosEliminacion = document.querySelectorAll('form[action*="delete_pnc_simple"]');
    
    formulariosEliminacion.forEach(formulario => {
        formulario.addEventListener('submit', function(event) {
            // No interceptar la acción normal del formulario, solo agregar comportamiento adicional
            const recordId = this.action.split('/').pop();
            
            // Almacenar en sessionStorage que se debe actualizar la pestaña de resultados
            // cuando se recargue la página después de eliminar
            sessionStorage.setItem('actualizarResultados', 'true');
        });
    });
    
    // Verificar si debemos actualizar la pestaña de resultados (después de eliminar un registro)
    if (sessionStorage.getItem('actualizarResultados') === 'true') {
        // Limpiar el flag
        sessionStorage.removeItem('actualizarResultados');
        
        // Cambiar a la pestaña de resultados para mostrar los datos actualizados
        setTimeout(function() {
            // Solo si estamos en la pestaña de registros
            if (document.getElementById('registros-tab').classList.contains('active')) {
                // Actualizar los datos
                calcularResumenCantidades('todos');
                actualizarDatos();
            }
        }, 500); // Pequeño retraso para asegurar que la página esté completamente cargada
    }
}
