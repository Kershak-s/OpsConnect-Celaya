/**
 * SISTEMA DE RANGOS DINÁMICOS PARA PRODUCTO TERMINADO
 * 
 * Implementa rangos dinámicos que se actualizan según el producto seleccionado
 * Campos PT Producto Terminado usan los mismos rangos que campos PT de tambores
 */

// Función para actualizar rangos dinámicos en los labels
function actualizarRangosProductoTerminado(producto, categoria) {
    console.log(`🎯 Actualizando rangos para: ${producto} en categoría: ${categoria}`);
    
    // Obtener rangos del sistema unificado
    let rangos;
    
    if (typeof window.SistemaColoresFisicoquimicos !== 'undefined') {
        rangos = window.SistemaColoresFisicoquimicos.obtenerRangos(categoria, producto);
    } else {
        console.warn('⚠️ Sistema unificado no disponible, usando rangos por defecto');
        // Rangos por defecto en caso de que el sistema principal no esté disponible
        rangos = categoria === 'TORTILLA' ? {
            aceite_pt: { min: 23.45, max: 26.45 },
            humedad_pt: { min: 0.78, max: 1.58 },
            sal_pt: { min: 0.9, max: 1.5 }
        } : {
            aceite_pt: { min: 32.46, max: 38.46 },
            humedad_pt: { min: 0.5, max: 1.9 },
            sal_pt: { min: 0.95, max: 1.55 }
        };
    }
    
    // Actualizar labels en MODAL DE CREAR
    actualizarLabelConRango('aceite_pt_producto_terminado', 'Producto Aceite', rangos.aceite_pt);
    actualizarLabelConRango('humedad_pt_producto_terminado', 'Producto Humedad', rangos.humedad_pt);
    actualizarLabelConRango('sal_pt_producto_terminado', 'Producto Sal', rangos.sal_pt);
    
    // Actualizar labels en MODAL DE EDITAR
    actualizarLabelConRango('edit_aceite_pt_producto_terminado', 'Producto Aceite', rangos.aceite_pt);
    actualizarLabelConRango('edit_humedad_pt_producto_terminado', 'Producto Humedad', rangos.humedad_pt);
    actualizarLabelConRango('edit_sal_pt_producto_terminado', 'Producto Sal', rangos.sal_pt);
    
    // Actualizar tooltips/spans en input-group si existen
    actualizarInputGroupText('aceite_pt_producto_terminado', rangos.aceite_pt);
    actualizarInputGroupText('humedad_pt_producto_terminado', rangos.humedad_pt);
    actualizarInputGroupText('sal_pt_producto_terminado', rangos.sal_pt);
    
    actualizarInputGroupText('edit_aceite_pt_producto_terminado', rangos.aceite_pt);
    actualizarInputGroupText('edit_humedad_pt_producto_terminado', rangos.humedad_pt);
    actualizarInputGroupText('edit_sal_pt_producto_terminado', rangos.sal_pt);
    
    console.log('✅ Rangos actualizados correctamente');
}

// Actualizar label con rango dinámico
function actualizarLabelConRango(inputId, labelBase, rangoObj) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (!label) return;
    
    let rangoTexto = '';
    
    // Manejar rangos discontinuos (JALAQUEÑO)
    if (rangoObj.verde && rangoObj.amarillo) {
        rangoTexto = `(${rangoObj.verde.min} - ${rangoObj.verde.max})`;
    } else if (rangoObj.min !== undefined && rangoObj.max !== undefined) {
        rangoTexto = `(${rangoObj.min} - ${rangoObj.max})`;
    } else {
        rangoTexto = '(Rango no definido)';
    }
    
    // Actualizar texto del label
    label.textContent = `${labelBase} ${rangoTexto}`;
}

// Actualizar input-group-text si existe
function actualizarInputGroupText(inputId, rangoObj) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const inputGroup = input.closest('.input-group');
    if (!inputGroup) return;
    
    let span = inputGroup.querySelector('.input-group-text');
    if (!span) {
        // Crear span si no existe
        span = document.createElement('span');
        span.className = 'input-group-text';
        inputGroup.appendChild(span);
    }
    
    // Actualizar contenido del span
    if (rangoObj.verde && rangoObj.amarillo) {
        span.textContent = `${rangoObj.verde.min} - ${rangoObj.verde.max}`;
    } else if (rangoObj.min !== undefined && rangoObj.max !== undefined) {
        span.textContent = `${rangoObj.min} - ${rangoObj.max}`;
    } else {
        span.textContent = 'N/D';
    }
}

// Convertir inputs simples a input-group con rangos
function convertirAInputGroup(inputId, rangoObj) {
    const input = document.getElementById(inputId);
    if (!input || input.closest('.input-group')) return; // Ya es input-group
    
    // Crear wrapper input-group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    // Mover el input al grupo
    input.parentNode.insertBefore(inputGroup, input);
    inputGroup.appendChild(input);
    
    // Crear span con rango
    const span = document.createElement('span');
    span.className = 'input-group-text';
    
    if (rangoObj.verde && rangoObj.amarillo) {
        span.textContent = `${rangoObj.verde.min} - ${rangoObj.verde.max}`;
    } else if (rangoObj.min !== undefined && rangoObj.max !== undefined) {
        span.textContent = `${rangoObj.min} - ${rangoObj.max}`;
    } else {
        span.textContent = 'N/D';
    }
    
    inputGroup.appendChild(span);
}

// Agregar validación de colores en tiempo real
function aplicarValidacionColores() {
    const campos = [
        'aceite_pt_producto_terminado',
        'humedad_pt_producto_terminado', 
        'sal_pt_producto_terminado',
        'edit_aceite_pt_producto_terminado',
        'edit_humedad_pt_producto_terminado',
        'edit_sal_pt_producto_terminado'
    ];
    
    campos.forEach(campoId => {
        const input = document.getElementById(campoId);
        if (!input) return;
        
        input.addEventListener('input', function() {
            const valor = this.value;
            const categoria = window.SistemaColoresFisicoquimicos ? 
                window.SistemaColoresFisicoquimicos.obtenerCategoriaActual() : 'EXTRUIDOS';
            
            // Obtener producto del modal actual
            const esEdit = campoId.includes('edit_');
            const productoSelect = document.getElementById(esEdit ? 'edit_producto' : 'producto');
            const producto = productoSelect ? productoSelect.value : 'default';
            
            // Mapear campo a tipo de análisis
            let tipoAnalisis;
            if (campoId.includes('aceite')) tipoAnalisis = 'aceite_pt';
            else if (campoId.includes('humedad')) tipoAnalisis = 'humedad_pt';
            else if (campoId.includes('sal')) tipoAnalisis = 'sal_pt';
            
            // Aplicar color
            if (valor && window.SistemaColoresFisicoquimicos) {
                const claseColor = window.SistemaColoresFisicoquimicos