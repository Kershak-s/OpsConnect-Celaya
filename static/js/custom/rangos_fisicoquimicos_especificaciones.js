/**
 * SISTEMA UNIFICADO DE COLORES PARA ANÁLISIS FISICOQUÍMICOS
 * 
 * Rangos corregidos por categoría y producto específico
 * ESTE ES EL ÚNICO ARCHIVO QUE DEBE MANEJAR LA LÓGICA DE COLORES
 */

// CONFIGURACIÓN CONSOLIDADA DE RANGOS POR CATEGORÍA Y PRODUCTO
const RANGOS_FISICOQUIMICOS = {
    'EXTRUIDOS': {
        'default': {
            humedad_base: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 },
            aceite_base: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 },
            aceite_pt: { min: 32.46, max: 38.46, warning_low: 31.46, warning_high: 39.46 },
            humedad_pt: { min: 0.5, max: 1.9, warning_low: 0.499999999999, warning_high: 2.1 },
            sal_pt: { min: 0.95, max: 1.55, warning_low: 0.85, warning_high: 1.65 }
        },
        'CHEETOS XTRA FLAMIN HOT': {
            humedad_base: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 },
            aceite_base: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 },
            aceite_pt: { min: 29.52, max: 35.52, warning_low: 28.51, warning_high: 36.01 },
            humedad_pt: { min: 0.47, max: 1.67, warning_low: 0.47, warning_high: 2.07 },
            sal_pt: { min: 1.4, max: 1.8, warning_low: 1.19, warning_high: 2.01 }
        },
        'CHEETOS JALAQUEÑO': {
            humedad_base: { min: 0.7, max: 1.7, warning_low: 0.60, warning_high: 1.80 },
            aceite_base: { min: 21.7, max: 27.7, warning_low: 20.70, warning_high: 28.70 },
            aceite_pt: { 
                verde: { min: 31.64, max: 37.64 },
                amarillo: [{ min: 29.64, max: 31.63 }, { min: 37.65, max: 39.64 }]
            },
            humedad_pt: { 
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }]
            },
            sal_pt: { 
                verde: { min: 1.06, max: 1.66 },
                amarillo: [{ min: 0.95, max: 1.05 }, { min: 1.67, max: 1.77 }]
            }
        },
        'CHEETOS XTRA FH NUEVO': {
            humedad_base: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 },
            aceite_base: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 },
            aceite_pt: { min: 29.35, max: 35.35, warning_low: 27.35, warning_high: 37.35 },
            humedad_pt: { min: 0.5, max: 1.9},
            sal_pt: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
        }

    },
    'TORTILLA': {
        'default': {
            humedad_base: { min: 1, max: 1.2, warning_low: 0.8, warning_high: 1.3 },
            aceite_base: { min: 20, max: 23, warning_low: 21, warning_high: 24 },
            aceite_pt: { min: 23.14, max: 26.14, warning_low: 22.14, warning_high: 27.14 },
            humedad_pt: { min: 0.78, max: 1.58, warning_low: 0.68, warning_high: 1.68 },
            sal_pt: { min: 0.9, max: 1.5, warning_low: 0.8, warning_high: 1.6 }
        },
        'TOSTITOS SALSA VERDE': {
            humedad_base: { min: 0.9, max: 1.3, warning_low: 0.8, warning_high: 1.4 },
            aceite_base: { min: 22, max: 24, warning_low: 21, warning_high: 25 },
            aceite_pt: { min: 23.14, max: 26.14, warning_low: 22.14, warning_high: 27.14 },
            humedad_pt: { min: 1.03, max: 1.63, warning_low: 0.93, warning_high: 1.73 },
            sal_pt: { min: 0.97, max: 1.57, warning_low: 0.67, warning_high: 1.87 }
        },
        'TOSTITOS FH': {
            humedad_base: { min: 0.9, max: 1.3, warning_low: 0.8, warning_high: 1.4 },
            aceite_base: { min: 22, max: 24, warning_low: 21, warning_high: 25 },
            aceite_pt: { min: 22.98, max: 25.98, warning_low: 21.98, warning_high: 26.98 },
            humedad_pt: { min: 0.94, max: 1.44, warning_low: 0.84, warning_high: 1.54 },
            sal_pt: { min: 1.38, max: 1.98, warning_low: 1.18, warning_high: 2.18 }
        },
        'DORITOS': 
            {
            humedad_base: { min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3 },
            aceite_base: { min: 20, max: 23, warning_low: 19, warning_high: 24 },
            aceite_pt: { min: 23.45, max: 26.45, warning_low: 22.45, warning_high: 27.45 },
            humedad_pt: { min: 0.78, max: 1.58, warning_low: 0.63, warning_high: 1.73 },
            sal_pt: { min: 0.9, max: 1.5, warning_low: 0.7, warning_high: 1.7 }
        },
        'DORITOS PIZZEROLA':
            {
            humedad_base: { min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3 },
            aceite_base: { min: 20, max: 23, warning_low: 19, warning_high: 24 },
            aceite_pt: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
            humedad_pt: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
            sal_pt: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
        },

        'DORITOS FH': {
            humedad_base: {min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3},
            aceite_base: {min: 20, max: 23, warning_low: 19.0, warning_high: 24},
            aceite_pt: {min: 22.71, max: 25.71, warning_low: 21.71, warning_high: 26.71},
            humedad_pt: {min: 1.12, max: 1.72, warning_low: 1.07, warning_high: 1.77},
            sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
                        },

        'RANCHERITOS': {
                humedad_base: {min: 0.8, max: 1.40, warning_low: 0.6, warning_high: 1.6},
                aceite_base: {min: 21.35, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                aceite_pt: {min: 22.01, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                humedad_pt: {min: 0.94, max: 1.44, warning_low: 0.84, warning_high: 1.54},
                sal_pt: {min: 1.38, max: 1.98, warning_low: 1.18, warning_high: 2.18}
                        },

        'DORITOS INCÓGNITA': {
            humedad_base: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
            aceite_base: { min: 20.00, max: 23.00, warning_low: 19.00, warning_high: 24.00 },
            aceite_pt: { 
                verde: { min: 22.35, max: 25.35 },
                amarillo: [{ min: 21.35, max: 22.34 }, { min: 25.36, max: 26.35 }]
            },
            humedad_pt: { 
                verde: { min: 1.02, max: 1.62 },
                amarillo: [{ min: 0.97, max: 1.01 }, { min: 1.63, max: 1.67 }]
            },
            sal_pt: { 
                verde: { min: 0.72, max: 1.32 },
                amarillo: [{ min: 0.52, max: 0.71 }, { min: 1.33, max: 1.52 }]
            }
        }
    },
    'PAPA': {
        'default': {
            humedad_base: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.80 },
            aceite_base: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
            aceite_pt: { min: -1, max: -1, warning_low: -1, warning_high: -1 }, // Sin valores para Papa
            humedad_pt: { min: 1.35, max: 1.8, warning_low: 1.20, warning_high: 2.0 },
            sal_pt: { min: 0.55, max: 0.85, warning_low: 0.45, warning_high: 0.95 },
            cloruros_base: { min: 0, max: 1, warning_low: null, warning_high: null } // Solo verde 0-1, rojo fuera
        },
        'PAPA SAL': {
            humedad_base: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.80 },
            aceite_base: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
            aceite_pt: { min: -1, max: -1, warning_low: -1, warning_high: -1 }, // Papa Sal sin Aceite PT
            humedad_pt: { min: 1.35, max: 1.8, warning_low: 1.20, warning_high: 2.0 },
            sal_pt: { min: 0.55, max: 0.85, warning_low: 0.45, warning_high: 0.95 },
            cloruros_base: { min: 0, max: 1, warning_low: null, warning_high: null } // Solo verde 0-1, rojo fuera
        },
        'RUFFLES QUESO': {
            humedad_base: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.80 },
            aceite_base: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
            aceite_pt: { min: -1, max: -1, warning_low: -1, warning_high: -1 }, // Ruffles Queso sin Aceite PT
            humedad_pt: { min: 1.35, max: 1.8, warning_low: 1.20, warning_high: 2.0 },
            sal_pt: { min: 0.55, max: 0.85, warning_low: 0.45, warning_high: 0.95 },
            cloruros_base: { min: 0, max: 1, warning_low: null, warning_high: null } // Solo verde 0-1, rojo fuera
        },
        'SABRITAS XTRA FH': {
            humedad_base: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.80 },
            aceite_base: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
            aceite_pt: { min: 32.21, max: 32.51, warning_low: 32.1, warning_high: 32.71 }, // Sabritas Xtra FH sin Aceite PT
            humedad_pt: { min: 1.41, max: 1.71, warning_low: 1.21, warning_high: 1.91 },
            sal_pt: { min: 1.58, max: 1.88, warning_low: 1.38, warning_high: 2.08 },
            cloruros_base: { min: 0, max: 1, warning_low: null, warning_high: null } // Solo verde 0-1, rojo fuera
        }
    }
};

// MAPEO DE CAMPOS A TIPOS DE ANÁLISIS
const CAMPO_TIPO_MAP = {
    'humedad_base_frita': 'humedad_base',
    'aceite_base_frita': 'aceite_base',
    'cloruros_base': 'cloruros_base',
    'tanque1_aceite_pt': 'aceite_pt',
    'tanque2_aceite_pt': 'aceite_pt',
    'tanque3_aceite_pt': 'aceite_pt',
    'tanque1_humedad_pt': 'humedad_pt',
    'tanque2_humedad_pt': 'humedad_pt',
    'tanque3_humedad_pt': 'humedad_pt',
    'tanque1_sal_pt': 'sal_pt',
    'tanque2_sal_pt': 'sal_pt',
    'tanque3_sal_pt': 'sal_pt',
    // CAMPOS PT PRODUCTO TERMINADO - USAN MISMOS RANGOS QUE PT
    'aceite_pt_producto_terminado': 'aceite_pt',
    'humedad_pt_producto_terminado': 'humedad_pt',
    'sal_pt_producto_terminado': 'sal_pt'
};

/**
 * Obtiene la categoría actual de la URL
 */
function obtenerCategoriaActual() {
    const path = window.location.pathname;
    if (path.includes('EXTRUIDOS')) return 'EXTRUIDOS';
    if (path.includes('TORTILLA')) return 'TORTILLA';
    if (path.includes('PAPA')) return 'PAPA'; // PAPA tiene rangos específicos
    return 'EXTRUIDOS'; // Default
}

/**
 * Obtiene rangos según categoría y producto
 */
function obtenerRangos(categoria, producto = 'default') {
    const categoriaRangos = RANGOS_FISICOQUIMICOS[categoria] || RANGOS_FISICOQUIMICOS['EXTRUIDOS'];
    return categoriaRangos[producto] || categoriaRangos['default'];
}

/**
 * Función principal para determinar el color según valor, categoría y producto
 * @param {number} valor - Valor a evaluar
 * @param {string} tipoAnalisis - Tipo de análisis
 * @param {string} categoria - Categoría del producto
 * @param {string} producto - Producto específico
 * @returns {string} Clase CSS del color correspondiente
 */
function determinarColorPorEspecificacion(valor, tipoAnalisis, categoria, producto = 'default') {
    const valorNumerico = parseFloat(valor);
    
    // Validar que el valor sea numérico
    if (isNaN(valorNumerico) || valor === null || valor === undefined || valor === '') {
        return 'text-empty'; // Gris para valores vacíos
    }
    
    const rangos = obtenerRangos(categoria, producto);
    const rango = rangos[tipoAnalisis];
    
    if (!rango) {
        console.warn(`Tipo de análisis no reconocido: ${tipoAnalisis}`);
        return 'text-empty';
    }
    
    // Verificar si tiene rangos discontinuos (JALAPEÑO, DORITOS INCÓGNITA)
    if (rango.verde && rango.amarillo) {
        // Verificar rango verde
        if (valorNumerico >= rango.verde.min && valorNumerico <= rango.verde.max) {
            return 'text-success';
        }
        
        // Verificar rangos amarillos
        for (const rangoAmarillo of rango.amarillo) {
            if (valorNumerico >= rangoAmarillo.min && valorNumerico <= rangoAmarillo.max) {
                return 'text-warning';
            }
        }
        
        // Si no está en verde ni amarillo = rojo
        return 'text-danger';
    } else {
        // Lógica estándar para otros productos
        if (valorNumerico >= rango.min && valorNumerico <= rango.max) {
            return 'text-success';
        } else if (rango.warning_low !== null && rango.warning_high !== null &&
                   ((valorNumerico >= rango.warning_low && valorNumerico < rango.min) ||
                    (valorNumerico > rango.max && valorNumerico <= rango.warning_high))) {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
    }
}

/**
 * Aplica color a un elemento (input o celda)
 */
function aplicarColor(elemento, valor, tipoAnalisis, categoria, producto) {
    const claseColor = determinarColorPorEspecificacion(valor, tipoAnalisis, categoria, producto);
    
    // Remover clases anteriores Y estilos
    elemento.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
    elemento.style.backgroundColor = '';
    elemento.style.color = '';
    
    // Aplicar nueva clase
    if (claseColor) {
        elemento.classList.add(claseColor);
        
        // Para celdas de tabla, agregar fondo Y color de texto
        if (elemento.tagName === 'TD') {
            if (claseColor === 'text-success') {
                elemento.style.backgroundColor = '#d4edda !important';
                elemento.style.color = '#155724 !important';
            } else if (claseColor === 'text-warning') {
                elemento.style.backgroundColor = '#fff3cd !important';
                elemento.style.color = '#856404 !important';
            } else if (claseColor === 'text-danger') {
                elemento.style.backgroundColor = '#f8d7da !important';
                elemento.style.color = '#721c24 !important';
            } else if (claseColor === 'text-empty') {
                elemento.style.backgroundColor = '#f8f9fa !important';
                elemento.style.color = '#6c757d !important';
            }
        }
    }
}

/**
 * Obtiene el producto desde el contexto (modal o tabla)
 */
function obtenerProductoContexto(elemento) {
    // Buscar en modal activo
    const modalActivo = document.querySelector('.modal.show');
    if (modalActivo) {
        const productoSelect = modalActivo.querySelector('select[name="producto"]');
        return productoSelect ? productoSelect.value : 'default';
    }
    
    // Buscar en fila de tabla
    const fila = elemento.closest('tr');
    if (fila) {
        const celdaProducto = fila.cells[2]; // Columna de producto (índice 2)
        return celdaProducto ? celdaProducto.textContent.trim() : 'default';
    }
    
    return 'default';
}

/**
 * Mapea campo a tipo de análisis
 */
function mapearCampoATipoAnalisis(campo) {
    return CAMPO_TIPO_MAP[campo] || campo;
}

/**
 * Configura eventos para inputs en modales
 */
function configurarEventosInputs() {
    const modales = ['#createAnalisisModal', '#editAnalisisModal'];
    const categoria = obtenerCategoriaActual();
    
    modales.forEach(modalSelector => {
        const modal = document.querySelector(modalSelector);
        if (!modal) return;
        
        const inputs = modal.querySelectorAll('input[type="text"]');
        
        inputs.forEach(input => {
            const campo = input.name || input.id.replace('edit_', '');
            const tipoAnalisis = mapearCampoATipoAnalisis(campo);
            
            input.addEventListener('input', function() {
                const producto = obtenerProductoContexto(this);
                aplicarColor(this, this.value, tipoAnalisis, categoria, producto);
            });
        });
        
        // Evento para cambio de producto
        const productoSelect = modal.querySelector('select[name="producto"]');
        if (productoSelect) {
            productoSelect.addEventListener('change', function() {
                inputs.forEach(input => {
                    if (input.value) {
                        const campo = input.name || input.id.replace('edit_', '');
                        const tipoAnalisis = mapearCampoATipoAnalisis(campo);
                        aplicarColor(input, input.value, tipoAnalisis, categoria, this.value);
                    }
                });
                
                // Actualizar tooltips
                actualizarTooltips(modalSelector, this.value, categoria);
            });
        }
    });
}

/**
 * Aplica colores a tabla existente
 */
function aplicarColoresTabla() {
    const tabla = document.querySelector('.table tbody');
    if (!tabla) return;
    
    const categoria = obtenerCategoriaActual();
    const headers = Array.from(document.querySelectorAll('.table thead th')).map(th => th.textContent.toLowerCase());
    
    // Mapeo de headers a campos
    const headerCampoMap = {
        'humedad base': 'humedad_base_frita',
        'aceite base': 'aceite_base_frita',
        'producto aceite': 'aceite_pt_producto_terminado',
        'producto humedad': 'humedad_pt_producto_terminado', 
        'producto sal': 'sal_pt_producto_terminado',
        'aceite pt t1': 'tanque1_aceite_pt',
        'humedad pt t1': 'tanque1_humedad_pt',
        'sal pt t1': 'tanque1_sal_pt',
        'aceite pt t2': 'tanque2_aceite_pt',
        'humedad pt t2': 'tanque2_humedad_pt',
        'sal pt t2': 'tanque2_sal_pt',
        'aceite pt t3': 'tanque3_aceite_pt',
        'humedad pt t3': 'tanque3_humedad_pt',
        'sal pt t3': 'tanque3_sal_pt'
    };
    
    tabla.querySelectorAll('tr').forEach(fila => {
        const producto = fila.cells[2] ? fila.cells[2].textContent.trim() : 'default';
        
        fila.querySelectorAll('td').forEach((celda, index) => {
            const header = headers[index];
            const campo = headerCampoMap[header];
            
            if (campo) {
                const valor = celda.textContent.trim();
                const tipoAnalisis = mapearCampoATipoAnalisis(campo);
                aplicarColor(celda, valor, tipoAnalisis, categoria, producto);
            }
        });
    });
}

/**
 * Actualiza tooltips según producto
 */
function actualizarTooltips(modalSelector, producto, categoria) {
    const modal = document.querySelector(modalSelector);
    if (!modal) return;
    
    const rangos = obtenerRangos(categoria, producto);
    const isEdit = modalSelector.includes('edit');
    const prefix = isEdit ? 'edit_' : '';
    
    // Actualizar tooltips para cada campo
    const camposTooltip = {
        [`${prefix}humedad_base_frita`]: rangos.humedad_base,
        [`${prefix}aceite_base_frita`]: rangos.aceite_base,
        [`${prefix}tanque1_aceite_pt`]: rangos.aceite_pt,
        [`${prefix}tanque2_aceite_pt`]: rangos.aceite_pt,
        [`${prefix}tanque3_aceite_pt`]: rangos.aceite_pt,
        [`${prefix}tanque1_humedad_pt`]: rangos.humedad_pt,
        [`${prefix}tanque2_humedad_pt`]: rangos.humedad_pt,
        [`${prefix}tanque3_humedad_pt`]: rangos.humedad_pt,
        [`${prefix}tanque1_sal_pt`]: rangos.sal_pt,
        [`${prefix}tanque2_sal_pt`]: rangos.sal_pt,
        [`${prefix}tanque3_sal_pt`]: rangos.sal_pt,
        // CAMPOS PT PRODUCTO TERMINADO - MISMOS RANGOS QUE PT
        [`${prefix}aceite_pt_producto_terminado`]: rangos.aceite_pt,
        [`${prefix}humedad_pt_producto_terminado`]: rangos.humedad_pt,
        [`${prefix}sal_pt_producto_terminado`]: rangos.sal_pt
    };
    
    Object.keys(camposTooltip).forEach(campoId => {
        const campo = modal.querySelector(`#${campoId}`);
        if (campo) {
            const span = campo.closest('.input-group')?.querySelector('.input-group-text');
            if (span) {
                const rango = camposTooltip[campoId];
                if (campoId.includes('aceite_pt') && categoria === 'PAPA') {
                    span.textContent = 'N/A';
                } else if (rango.verde) {
                    span.textContent = `${rango.verde.min} - ${rango.verde.max}`;
                } else {
                    span.textContent = `${rango.min} - ${rango.max}`;
                }
            }
        }
    });
    
    // ACTUALIZAR LABELS DE CAMPOS PT PRODUCTO TERMINADO
    actualizarLabelsProductoTerminado(modal, rangos, prefix);
}

/**
 * Actualiza labels de campos PT Producto Terminado con rangos
 */
function actualizarLabelsProductoTerminado(modal, rangos, prefix = '') {
    const campos = {
        [`${prefix}aceite_pt_producto_terminado`]: { rango: rangos.aceite_pt, nombre: 'Producto Aceite' },
        [`${prefix}humedad_pt_producto_terminado`]: { rango: rangos.humedad_pt, nombre: 'Producto Humedad' },
        [`${prefix}sal_pt_producto_terminado`]: { rango: rangos.sal_pt, nombre: 'Producto Sal' }
    };
    
    Object.keys(campos).forEach(campoId => {
        const campo = modal.querySelector(`#${campoId}`);
        if (campo) {
            const label = modal.querySelector(`label[for="${campoId}"]`);
            if (label) {
                const { rango, nombre } = campos[campoId];
                let rangoTexto;
                if (campoId.includes('aceite_pt') && modal.closest('.modal').querySelector('select[name="producto"]')?.value === 'PAPA SAL') {
                    rangoTexto = 'N/A';
                } else if (rango.verde) {
                    rangoTexto = `${rango.verde.min} - ${rango.verde.max}`;
                } else {
                    rangoTexto = `${rango.min} - ${rango.max}`;
                }
                label.textContent = `${nombre} (${rangoTexto})`;
            }
        }
    });
}

/**
 * Inicialización del sistema
 */
function inicializarSistemaColores() {
    console.log('🎨 Iniciando Sistema Unificado de Colores Fisicoquímicos...');
    
    // Configurar eventos para inputs
    configurarEventosInputs();
    
    // Aplicar colores a tabla existente - FORZAR RECALCULO
    setTimeout(() => {
        aplicarColoresTabla();
        console.log('🔄 Colores de tabla recalculados');
    }, 100);
    
    // Configurar eventos para modales
    const createModal = document.getElementById('createAnalisisModal');
    const editModal = document.getElementById('editAnalisisModal');
    
    if (createModal) {
        createModal.addEventListener('shown.bs.modal', function() {
            const categoria = obtenerCategoriaActual();
            const productoSelect = this.querySelector('select[name="producto"]');
            const producto = productoSelect ? productoSelect.value : 'default';
            actualizarTooltips('#createAnalisisModal', producto, categoria);
        });
    }
    
    if (editModal) {
        editModal.addEventListener('shown.bs.modal', function() {
            const categoria = obtenerCategoriaActual();
            const productoSelect = this.querySelector('select[name="producto"]');
            const producto = productoSelect ? productoSelect.value : 'default';
            actualizarTooltips('#editAnalisisModal', producto, categoria);
        });
    }
    
    console.log('✅ Sistema Unificado de Colores inicializado correctamente');
}



// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaColores);
} else {
    inicializarSistemaColores();
}

// EXPORTAR FUNCIONES PARA USO GLOBAL
window.SistemaColoresFisicoquimicos = {
    determinarColor: determinarColorPorEspecificacion,
    aplicarColor: aplicarColor,
    obtenerRangos: obtenerRangos,
    obtenerCategoriaActual: obtenerCategoriaActual,
    rangos: RANGOS_FISICOQUIMICOS
};