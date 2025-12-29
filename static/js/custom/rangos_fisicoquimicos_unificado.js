/**
 * SISTEMA UNIFICADO DE RANGOS FISICOQUÍMICOS
 * Archivo único que maneja todos los productos y categorías
 */

const rangosEspecificaciones = {
    // EXTRUIDOS
    'CHEETOS TORCIDITOS': {
        humedad_base_frita: {
            aim: 1.20,
            verde: { min: 0.7, max: 1.7 },
            amarillo: [
                { min: 0.60, max: 0.69 },
                { min: 1.71, max: 1.80 }
            ],
            rojo: { menor_que: 0.60, mayor_que: 1.80 }
        },
        aceite_base_frita: {
            aim: 24.70,
            verde: { min: 21.7, max: 27.7 },
            amarillo: [
                { min: 20.70, max: 21.69 },
                { min: 27.71, max: 28.70 }
            ],
            rojo: { menor_que: 20.70, mayor_que: 28.70 }
        },
        humedad_producto_terminado: {
            aim: 1.20,
            verde: { min: 0.5, max: 1.9 },
            amarillo: [
                { min: 1.91, max: 2.10 }
            ],
            rojo: { menor_que: 0.5, mayor_que: 2.10 }
        },
        aceite_producto_terminado: {
            aim: 35.46,
            verde: { min: 32.46, max: 38.46 },
            amarillo: [
                { min: 31.46, max: 32.45 },
                { min: 38.47, max: 39.46 }
            ],
            rojo: { menor_que: 31.46, mayor_que: 39.46 }
        },
        sal_producto_terminado: {
            aim: 1.25,
            verde: { min: 0.95, max: 1.55 },
            amarillo: [
                { min: 0.85, max: 0.94 },
                { min: 1.56, max: 1.65 }
            ],
            rojo: { menor_que: 0.85, mayor_que: 1.65 }
        }
    },

    'CHEETOS XTRA FLAMIN HOT': {
        humedad_base_frita: {
            aim: 1.20,
            verde: { min: 0.7, max: 1.7 },
            amarillo: [
                { min: 0.60, max: 0.69 },
                { min: 1.71, max: 1.80 }
            ],
            rojo: { menor_que: 0.60, mayor_que: 1.80 }
        },
        aceite_base_frita: {
            aim: 24.70,
            verde: { min: 21.7, max: 27.7 },
            amarillo: [
                { min: 20.70, max: 21.69 },
                { min: 27.71, max: 28.70 }
            ],
            rojo: { menor_que: 20.70, mayor_que: 28.70 }
        },
        humedad_producto_terminado: {
            aim: 1.07,
            verde: { min: 0.47, max: 1.67 },
            amarillo: [
                { min: 1.68, max: 2.07 }
            ],
            rojo: { menor_que: 0.47, mayor_que: 2.07 }
        },
        aceite_producto_terminado: {
            aim: 32.52,
            verde: { min: 29.52, max: 35.52 },
            amarillo: [
                { min: 28.51, max: 29.51 },
                { min: 35.53, max: 36.01 }
            ],
            rojo: { menor_que: 28.51, mayor_que: 36.01 }
        },
        sal_producto_terminado: {
            aim: 1.60,
            verde: { min: 1.4, max: 1.8 },
            amarillo: [
                { min: 1.19, max: 1.39 },
                { min: 1.81, max: 2.01 }
            ],
            rojo: { menor_que: 1.19, mayor_que: 2.01 }
        }
    },

    'CHEETOS JALAQUEÑO': {
        humedad_base_frita: {
            aim: 1.20,
            verde: { min: 0.7, max: 1.7 },
            amarillo: [
                { min: 0.60, max: 0.69 },
                { min: 1.71, max: 1.80 }
            ],
            rojo: { menor_que: 0.60, mayor_que: 1.80 }
        },
        aceite_base_frita: {
            aim: 24.70,
            verde: { min: 21.7, max: 27.7 },
            amarillo: [
                { min: 20.70, max: 21.69 },
                { min: 27.71, max: 28.70 }
            ],
            rojo: { menor_que: 20.70, mayor_que: 28.70 }
        },
        humedad_producto_terminado: {
            aim: 1.20,
            verde: { min: 0.5, max: 1.9 },
            amarillo: [
                { min: 1.91, max: 2.10 }
            ],
            rojo: { menor_que: 0.5, mayor_que: 2.10 }
        },
        aceite_producto_terminado: {
            aim: 34.64,
            verde: { min: 31.64, max: 37.64 },
            amarillo: [
                { min: 29.64, max: 31.63 },
                { min: 37.65, max: 39.64 }
            ],
            rojo: { menor_que: 29.64, mayor_que: 39.64 }
        },
        sal_producto_terminado: {
            aim: 1.36,
            verde: { min: 1.06, max: 1.66 },
            amarillo: [
                { min: 0.95, max: 1.05 },
                { min: 1.67, max: 1.77 }
            ],
            rojo: { menor_que: 0.95, mayor_que: 1.77 }
        },
        'CHEETOS XTRA FH NUEVO': {
        humedad_base_frita: {
            aim: 1.20,
            verde: { min: 0.7, max: 1.7 },
            amarillo: [
                { min: 0.60, max: 0.69 },
                { min: 1.71, max: 1.80 }
            ],
            rojo: { menor_que: 0.60, mayor_que: 1.80 }
        },
        aceite_base_frita: {
            aim: 24.70,
            verde: { min: 21.7, max: 27.7 },
           
            rojo: { menor_que: 20.70, mayor_que: 28.70 }
        },
        humedad_producto_terminado: {
            aim: 1.20,
            verde: { min: 0.5, max: 1.9 },
            amarillo: [
                { min: , max: }
            ],
            rojo: { menor_que: 0.5, mayor_que: 1.9 }
        },
        aceite_producto_terminado: {
            aim: 32.35,
            verde: { min: 29.35, max: 35.35 },
            amarillo: [
                { min: 27.35, max: 29.34 },
                { min: 35.36, max: 37.35 }
            ],
            rojo: { menor_que: 27.35, mayor_que: 37.35 }
        },
        sal_producto_terminado: {
            aim: 1.46,
            verde: { min: 1.16, max: 1.76 },
            amarillo: [
                { min: 0.86, max: 1.15 },
                { min: 1.77, max: 2.07 }
            ],
            rojo: { menor_que: 0.86, mayor_que: 2.07 }
        }
    },

    // TORTILLA
    'DORITOS': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 1.0, max: 1.2 },
            amarillo: [
                { min: 0.90, max: 0.99 },
                { min: 1.21, max: 1.30 }
            ],
            rojo: { menor_que: 0.90, mayor_que: 1.30 }
        },
        aceite_base_frita: {
            aim: 21.50,
            verde: { min: 20.0, max: 23.0 },
            amarillo: [
                { min: 19.0, max: 19.99 },
                { min: 23.01, max: 24.0 }
            ],
            rojo: { menor_que: 19.0, mayor_que: 24.0 }
        },
        humedad_producto_terminado: {
            aim: 1.18,
            verde: { min: 0.78, max: 1.58 },
            amarillo: [
                { min: 0.63, max: 0.77 },
                { min: 1.59, max: 1.73 }
            ],
            rojo: { menor_que: 0.63, mayor_que: 1.73 }
        },
        aceite_producto_terminado: {
            aim: 24.95,
            verde: { min: 23.45, max: 26.45 },
            amarillo: [
                { min: 22.45, max: 23.44 },
                { min: 26.46, max: 27.45 }
            ],
            rojo: { menor_que: 22.45, mayor_que: 27.45 }
        },
        sal_producto_terminado: {
            aim: 1.20,
            verde: { min: 0.9, max: 1.5 },
            amarillo: [
                { min: 0.7, max: 0.89 },
                { min: 1.51, max: 1.7 }
            ],
            rojo: { menor_que: 0.7, mayor_que: 1.7 }
        }
    },

    'DORITOS INCÓGNITA': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 1.00, max: 1.20 },
            amarillo: [
                { min: 0.90, max: 0.99 },
                { min: 1.21, max: 1.30 }
            ],
            rojo: { menor_que: 0.90, mayor_que: 1.30 }
        },
        aceite_base_frita: {
            aim: 21.50,
            verde: { min: 20.00, max: 23.00 },
            amarillo: [
                { min: 19.00, max: 19.99 },
                { min: 23.01, max: 24.00 }
            ],
            rojo: { menor_que: 19.00, mayor_que: 24.00 }
        },
        humedad_producto_terminado: {
            aim: 1.32,
            verde: { min: 1.02, max: 1.62 },
            amarillo: [
                { min: 0.97, max: 1.01 },
                { min: 1.63, max: 1.67 }
            ],
            rojo: { menor_que: 0.97, mayor_que: 1.67 }
        },
        aceite_producto_terminado: {
            aim: 23.86,
            verde: { min: 22.35, max: 25.35 },
            amarillo: [
                { min: 21.35, max: 22.34 },
                { min: 25.36, max: 26.35 }
            ],
            rojo: { menor_que: 21.35, mayor_que: 26.35 }
        },
        sal_producto_terminado: {
            aim: 1.11,
            verde: { min: 0.72, max: 1.32 },
            amarillo: [
                { min: 0.52, max: 0.71 },
                { min: 1.33, max: 1.52 }
            ],
            rojo: { menor_que: 0.52, mayor_que: 1.52 }
        }
    },

    'DORITOS PIZZEROLA': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 1.0, max: 1.2 },
            amarillo: [
                { min: 0.90, max: 0.99 },
                { min: 1.21, max: 1.30 }
            ],
            rojo: { menor_que: 0.90, mayor_que: 1.30 }
        },
        aceite_base_frita: {
            aim: 21.50,
            verde: { min: 20.0, max: 23.0 },
            amarillo: [
                { min: 19.00, max: 19.99 },
                { min: 23.01, max: 24.0 }
            ],
            rojo: { menor_que: 19.99, mayor_que: 24.0 }
        },
        humedad_producto_terminado: {
            aim: 1.24,
            verde: { min: 0.99, max: 1.49 },
            amarillo: [
                { min: 0.89, max: 0.98 },
                { min: 1.50, max: 1.59 }
            ],
            rojo: { menor_que: 0.89, mayor_que: 1.59 }
        },
        aceite_producto_terminado: {
            aim: 24.33,
            verde: { min: 22.83, max: 25.83 },
            amarillo: [
                { min: 21.83, max: 22.82 },
                { min: 25.84, max: 26.83 }
            ],
            rojo: { menor_que: 21.83, mayor_que: 26.83 }
        },
        sal_producto_terminado: {
            aim: 1.40,
            verde: { min: 1.10, max: 1.7 },
            amarillo: [
                { min: 0.9, max: 1.09 },
                { min: 1.71, max: 1.9 }
            ],
            rojo: { menor_que: 0.9, mayor_que: 1.9 }
        }
    },

    'DORITOS FH': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 1.00, max: 1.20 },
            amarillo: [
                { min: 0.90, max: 0.99 },
                { min: 1.21, max: 1.30 }
            ],
            rojo: { menor_que: 0.90, mayor_que: 1.30 }
        },
        aceite_base_frita: {
            aim: 21.50,
            verde: { min: 20.00, max: 23.00 },
            amarillo: [
                { min: 19.00, max: 19.99 },
                { min: 23.01, max: 24.00 }
            ],
            rojo: { menor_que: 19.00, mayor_que: 24.00 }
        },
        humedad_producto_terminado: {
            aim: 1.25,
            verde: { min: 1.00, max: 1.50 },
            amarillo: [
                { min: 0.90, max: 0.99 },
                { min: 1.51, max: 1.60 }
            ],
            rojo: { menor_que: 0.90, mayor_que: 1.60 }
        },
        aceite_producto_terminado: {
            aim: 24.50,
            verde: { min: 23.00, max: 26.00 },
            amarillo: [
                { min: 22.00, max: 22.99 },
                { min: 26.01, max: 27.00 }
            ],
            rojo: { menor_que: 22.00, mayor_que: 27.00 }
        },
        sal_producto_terminado: {
            aim: 1.20,
            verde: { min: 0.90, max: 1.50 },
            amarillo: [
                { min: 0.70, max: 0.89 },
                { min: 1.51, max: 1.70 }
            ],
            rojo: { menor_que: 0.70, mayor_que: 1.70 }
        }
    },


    'Rancheritos': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 0.8, max: 1.40 },
            amarillo: [
                { min: 0.60, max: 0.79 },
                { min: 1.41, max: 1.60 }
            ],
            rojo: { menor_que: 0.60 , mayor_que: 1.60 }
        },
        aceite_base_frita: {
            aim: 23.0,
            verde: { min: 21.25, max: 22.75 },
            amarillo: [
                { min: 20.25, max: 21.24 },
                { min: 22.76, max: 23.75 }
            ],
            rojo: { menor_que: 20.25, mayor_que: 23.75 }
        },
        humedad_producto_terminado: {
            aim: 1.33,
            verde: { min: 0.94, max: 1.44 },
            amarillo: [
                { min: 0.84, max: 0.93 },
                { min: 1.45, max: 1.54 }
            ],
            rojo: { menor_que: 0.84, mayor_que: 1.54 }
        },
        aceite_producto_terminado: {
            aim: 24.64,
            verde: { min: 22.01, max: 25.01 },
            amarillo: [
                { min: 21.01, max: 22.00 },
                { min: 25.02, max: 26.01 }
            ],
            rojo: { menor_que: 21.01, mayor_que: 26.01 }
        },
        sal_producto_terminado: {
            aim: 1.27,
            verde: { min: 1.38, max: 1.98 },
            amarillo: [
                { min: 1.18, max: 1.37 },
                { min: 1.99, max: 2.18 }
            ],
            rojo: { menor_que: 1.18, mayor_que: 2.18 }
        }
    },

    'TOSTITOS SALSA VERDE': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 0.9, max: 1.3 },
            amarillo: [
                { min: 0.80, max: 0.89 },
                { min: 1.31, max: 1.40 }
            ],
            rojo: { menor_que: 0.80, mayor_que: 1.40 }
        },
        aceite_base_frita: {
            aim: 23.0,
            verde: { min: 22.0, max: 24.0 },
            amarillo: [
                { min: 21.0, max: 21.99 },
                { min: 24.01, max: 25.0 }
            ],
            rojo: { menor_que: 21.0, mayor_que: 25.0 }
        },
        humedad_producto_terminado: {
            aim: 1.33,
            verde: { min: 1.03, max: 1.63 },
            amarillo: [
                { min: 0.93, max: 1.02 },
                { min: 1.64, max: 1.73 }
            ],
            rojo: { menor_que: 0.93, mayor_que: 1.73 }
        },
        aceite_producto_terminado: {
            aim: 24.64,
            verde: { min: 23.14, max: 26.14 },
            amarillo: [
                { min: 22.14, max: 23.13 },
                { min: 26.15, max: 27.14 }
            ],
            rojo: { menor_que: 22.14, mayor_que: 27.14 }
        },
        sal_producto_terminado: {
            aim: 1.27,
            verde: { min: 0.97, max: 1.57 },
            amarillo: [
                { min: 0.67, max: 0.96 },
                { min: 1.58, max: 1.87 }
            ],
            rojo: { menor_que: 0.67, mayor_que: 1.87 }
        }
    },

    'TOSTITOS FH': {
        humedad_base_frita: {
            aim: 1.10,
            verde: { min: 0.9, max: 1.3 },
            amarillo: [
                { min: 0.80, max: 0.89 },
                { min: 1.31, max: 1.40 }
            ],
            rojo: { menor_que: 0.80, mayor_que: 1.40 }
        },
        aceite_base_frita: {
            aim: 23.0,
            verde: { min: 22.0, max: 24.0 },
            amarillo: [
                { min: 21.0, max: 21.99 },
                { min: 24.01, max: 25.0 }
            ],
            rojo: { menor_que: 21.0, mayor_que: 25.0 }
        },
        humedad_producto_terminado: {
            aim: 1.19,
            verde: { min: 0.94, max: 1.44 },
            amarillo: [
                { min: 0.84, max: 0.93 },
                { min: 1.45, max: 1.54 }
            ],
            rojo: { menor_que: 0.84, mayor_que: 1.54 }
        },
        aceite_producto_terminado: {
            aim: 24.48,
            verde: { min: 22.98, max: 25.98 },
            amarillo: [
                { min: 21.98, max: 22.97 },
                { min: 25.99, max: 26.98 }
            ],
            rojo: { menor_que: 21.98, mayor_que: 26.98 }
        },
        sal_producto_terminado: {
            aim: 1.68,
            verde: { min: 1.38, max: 1.98 },
            amarillo: [
                { min: 1.18, max: 1.37 },
                { min: 1.99, max: 2.18 }
            ],
            rojo: { menor_que: 1.18, mayor_que: 2.18 }
        }
    }
};

/**
 * Mapeo de campos a tipos de análisis
 */
const CAMPO_TIPO_MAP = {
    'humedad_base_frita': 'humedad_base_frita',
    'aceite_base_frita': 'aceite_base_frita',
    'tanque1_humedad_pt': 'humedad_producto_terminado',
    'tanque2_humedad_pt': 'humedad_producto_terminado',
    'tanque3_humedad_pt': 'humedad_producto_terminado',
    'tanque1_aceite_pt': 'aceite_producto_terminado',
    'tanque2_aceite_pt': 'aceite_producto_terminado',
    'tanque3_aceite_pt': 'aceite_producto_terminado',
    'tanque1_sal_pt': 'sal_producto_terminado',
    'tanque2_sal_pt': 'sal_producto_terminado',
    'tanque3_sal_pt': 'sal_producto_terminado',
    'aceite_pt_producto_terminado': 'aceite_producto_terminado',
    'humedad_pt_producto_terminado': 'humedad_producto_terminado',
    'sal_pt_producto_terminado': 'sal_producto_terminado'
};

/**
 * Determina el color según valor, producto y especificación
 */
function determinarColorPorEspecificacion(valor, producto, tipoAnalisis) {
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valor === null || valor === undefined || valor === '') {
        return 'text-empty';
    }
    
    const productSpecs = rangosEspecificaciones[producto];
    if (!productSpecs) {
        console.warn(`Producto no reconocido: ${producto}`);
        return 'text-empty';
    }
    
    const spec = productSpecs[tipoAnalisis];
    if (!spec) {
        console.warn(`Tipo de análisis no reconocido: ${tipoAnalisis} para producto: ${producto}`);
        return 'text-empty';
    }
    
    // Verificar VERDE
    if (valorNumerico >= spec.verde.min && valorNumerico <= spec.verde.max) {
        return 'text-success';
    }
    
    // Verificar AMARILLO
    if (spec.amarillo && spec.amarillo.length > 0) {
        for (const rangoAmarillo of spec.amarillo) {
            if (valorNumerico >= rangoAmarillo.min && valorNumerico <= rangoAmarillo.max) {
                return 'text-warning';
            }
        }
    }
    
    // ROJO por defecto
    return 'text-danger';
}

/**
 * Mapea campo a tipo de análisis
 */
function mapearCampoATipoAnalisis(campo) {
    return CAMPO_TIPO_MAP[campo] || campo;
}

/**
 * Aplica color a un input según producto
 */
function aplicarColorInput(input, campo, producto) {
    const valor = input.value;
    const tipoAnalisis = mapearCampoATipoAnalisis(campo);
    const claseColor = determinarColorPorEspecificacion(valor, producto, tipoAnalisis);
    
    // Remover clases anteriores
    input.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
    
    // Aplicar nueva clase
    if (claseColor) {
        input.classList.add(claseColor);
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
        const celdaProducto = fila.cells[2];
        return celdaProducto ? celdaProducto.textContent.trim() : 'default';
    }
    
    return 'default';
}

/**
 * Configura eventos para inputs en modales
 */
function configurarEventosInputs() {
    const modales = ['#createAnalisisModal', '#editAnalisisModal'];
    
    modales.forEach(modalSelector => {
        const modal = document.querySelector(modalSelector);
        if (!modal) return;
        
        const inputs = modal.querySelectorAll('input[type="text"]');
        
        inputs.forEach(input => {
            const campo = input.name || input.id.replace('edit_', '');
            
            input.addEventListener('input', function() {
                const producto = obtenerProductoContexto(this);
                aplicarColorInput(this, campo, producto);
            });
        });
        
        // Evento para cambio de producto
        const productoSelect = modal.querySelector('select[name="producto"]');
        if (productoSelect) {
            productoSelect.addEventListener('change', function() {
                inputs.forEach(input => {
                    if (input.value) {
                        const campo = input.name || input.id.replace('edit_', '');
                        aplicarColorInput(input, campo, this.value);
                    }
                });
            });
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
    
    console.log('✅ Sistema Unificado inicializado correctamente');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaColores);
} else {
    inicializarSistemaColores();
}

// EXPORTAR para uso global
window.SistemaFisicoquimicos = {
    determinarColor: determinarColorPorEspecificacion,
    aplicarColorInput: aplicarColorInput,
    mapearCampo: mapearCampoATipoAnalisis,
    rangos: rangosEspecificaciones
};