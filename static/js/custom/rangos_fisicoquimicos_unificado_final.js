/**
 * SISTEMA UNIFICADO DE RANGOS FISICOQUÍMICOS - VERSIÓN FINAL
 * Este es el único archivo que debe usarse para la lógica de colores
 * Última actualización: 2025-08-25
 */

// =====================================================
// CONFIGURACIÓN DE RANGOS POR CATEGORÍA Y PRODUCTO
// =====================================================

const RANGOS_FISICOQUIMICOS_FINAL = {
    'EXTRUIDOS': {
        'default': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                aim: 1.20
            },
            aceite_pt: {
                verde: { min: 32.46, max: 38.46 },
                amarillo: [{ min: 31.46, max: 32.45 }, { min: 38.47, max: 39.46 }],
                aim: 35.46
            },
            sal_pt: {
                verde: { min: 0.95, max: 1.55 },
                amarillo: [{ min: 0.85, max: 0.94 }, { min: 1.56, max: 1.65 }],
                aim: 1.25
            }
        },
        'CHEETOS EXTRA FH NUEVO': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
               
                aim: 1.20
            },
            aceite_pt: {
                verde: { min: 29.35, max: 35.35 },
                amarillo: [{ min: 27.35, max: 29.34 }, { min: 35.36, max: 37.35 }],
                aim: 32.35
            },
            sal_pt: {
                verde: { min: 1.16, max: 1.76 },
                amarillo: [{ min: 0.86, max: 1.15 }, { min: 1.77, max: 2.07 }],
                aim: 1.46
            }
        },
        
        'CHEETOS TORCIDITOS': {
            // Usa los rangos default de EXTRUIDOS
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                aim: 1.20
            },
            aceite_pt: {
                verde: { min: 32.46, max: 38.46 },
                amarillo: [{ min: 31.46, max: 32.45 }, { min: 38.47, max: 39.46 }],
                aim: 35.46
            },
            sal_pt: {
                verde: { min: 0.95, max: 1.55 },
                amarillo: [{ min: 0.85, max: 0.94 }, { min: 1.56, max: 1.65 }],
                aim: 1.25
            }
        },
        'CHEETOS XTRA FLAMIN HOT': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.47, max: 1.67 },
                amarillo: [{ min: 1.68, max: 2.07 }],
                aim: 1.07
            },
            aceite_pt: {
                verde: { min: 29.52, max: 35.52 },
                amarillo: [{ min: 28.51, max: 29.51 }, { min: 35.53, max: 36.01 }],
                aim: 32.52
            },
            sal_pt: {
                verde: { min: 1.40, max: 1.80 },
                amarillo: [{ min: 1.19, max: 1.39 }, { min: 1.81, max: 2.01 }],
                aim: 1.60
            }
        },
        'CHEETOS JALAQUEÑO': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.70, max: 21.69 }, { min: 27.71, max: 28.70 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                aim: 1.20
            },
            aceite_pt: {
                verde: { min: 31.64, max: 37.64 },
                amarillo: [{ min: 29.64, max: 31.63 }, { min: 37.65, max: 39.64 }],
                aim: 34.64
            },
            sal_pt: {
                verde: { min: 1.06, max: 1.66 },
                amarillo: [{ min: 0.95, max: 1.05 }, { min: 1.67, max: 1.77 }],
                aim: 1.36
            }
        },
        'CHEETOS XTRA FH NUEVO': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                aim: 1.20
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                aim: 24.70
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                aim: 1.20
            },
            aceite_pt: {
                verde: { min: 29.35, max: 35.35 },
                amarillo: [{ min: 27.35, max: 29.34 }, { min: 35.36, max: 37.35 }],
                aim: 32.35
            },
            sal_pt: {
                verde: { min: 1.16, max: 1.76 },
                amarillo: [{ min: 0.86, max: 1.15 }, { min: 1.77, max: 2.07 }],
                aim: 1.46
            }
        }
    },
    'TORTILLA': {
        'default': {
            humedad_base: {
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.80, max: 0.99 }, { min: 1.21, max: 1.30 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 21.00, max: 21.99 }, { min: 23.01, max: 24.00 }],
                aim: 21.50
            },
            humedad_pt: {
                verde: { min: 0.78, max: 1.58 },
                amarillo: [{ min: 0.68, max: 0.77 }, { min: 1.59, max: 1.68 }],
                aim: 1.18
            },
            aceite_pt: {
                verde: { min: 23.45, max: 26.45 },
                amarillo: [{ min: 22.45, max: 23.44 }, { min: 26.46, max: 27.45 }],
                aim: 24.95
            },
            sal_pt: {
                verde: { min: 0.90, max: 1.50 },
                amarillo: [{ min: 0.80, max: 0.89 }, { min: 1.51, max: 1.60 }],
                aim: 1.20
            }
        },
        'DORITOS': {
            humedad_base: {
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.90, max: 0.99 }, { min: 1.21, max: 1.30 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 19.00, max: 19.99 }, { min: 23.01, max: 24.00 }],
                aim: 21.50
            },
            humedad_pt: {
                verde: { min: 0.78, max: 1.58 },
                amarillo: [{ min: 0.63, max: 0.77 }, { min: 1.59, max: 1.73 }],
                aim: 1.18
            },
            aceite_pt: {
                verde: { min: 23.45, max: 26.45 },
                amarillo: [{ min: 22.45, max: 23.44 }, { min: 26.46, max: 27.45 }],
                aim: 24.95
            },
            sal_pt: {
                verde: { min: 0.90, max: 1.50 },
                amarillo: [{ min: 0.70, max: 0.89 }, { min: 1.51, max: 1.70 }],
                aim: 1.20
            }
        },
        'DORITOS INCÓGNITA': {
            humedad_base: {
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.90, max: 0.99 }, { min: 1.21, max: 1.30 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 19.00, max: 19.99 }, { min: 23.01, max: 24.00 }],
                aim: 21.50
            },
            humedad_pt: {
                verde: { min: 1.02, max: 1.62 },
                amarillo: [{ min: 0.97, max: 1.01 }, { min: 1.63, max: 1.67 }],
                aim: 1.32
            },
            aceite_pt: {
                verde: { min: 22.35, max: 25.36 },
                amarillo: [{ min: 21.35, max: 22.34 }, { min: 25.36, max: 26.35 }],
                aim: 23.86
            },
            sal_pt: {
                verde: { min: 0.72, max: 1.32 },
                amarillo: [{ min: 0.52, max: 0.71 }, { min: 1.33, max: 1.52 }],
                aim: 1.11
            }
        },
        'DORITOS PIZZEROLA': {
            humedad_base: {
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.90, max: 0.99 }, { min: 1.21, max: 1.30 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 19, max: 19.99 }, { min: 23.01, max: 24.00 }],
                aim: 21.50
            },
            humedad_pt: {
                verde: { min: 0.99, max: 1.49 },
                amarillo: [{ min: 0.89, max: 0.98 }, { min: 1.50, max: 1.59 }],
                aim: 1.24
            },
            aceite_pt: {
                verde: { min: 22.83, max: 25.83 },
                amarillo: [{ min: 21.83, max: 22.82 }, { min: 25.84, max: 26.83 }],
                aim: 24.33
            },
            sal_pt: {
                verde: { min: 1.10, max: 1.70 },
                amarillo: [{ min: 0.90, max: 1.09 }, { min: 1.71, max: 1.90 }],
                aim: 1.40
            }
        },

        
        'DORITOS FH': {
            humedad_base: { 
                verde: { min: 1.12, max: 1.72 },
                amarillo: [{ min: 1.07, max: 1.11 }, { min: 1.73, max: 1.77 }],
                aim: 1.32
            },
            aceite_base: { 
                verde: { min: 20, max: 23 },
                amarillo: [{ min: 19.0, max: 19.99 }, { min: 23.01, max: 24 }],
                aim: 21.50
            },
            aceite_pt: { 
                verde: { min: 22.71, max: 25.71 },
                amarillo: [{ min: 21.83, max: 22.82 }, { min: 25.84, max: 26.83 }],
                aim: 24.21
            },
            humedad_pt: { 
                verde: { min: 1.12, max: 1.72 },
                amarillo: [{ min: 1.07, max: 1.11 }, { min: 1.73, max: 1.77 }],
                aim: 1.32
            },
            sal_pt: { 
                verde: { min: 1.31, max: 1.91 },
                amarillo: [{ min: 1.11, max: 1.3 }, { min: 1.92, max: 2.11 }],
                aim: 1.60
            }
        },


        'RANCHERITOS': {
            humedad_base: {
                verde: { min: 0.8, max: 1.40 },
                amarillo: [{ min: 0.60, max: 0.79 }, { min: 1.41, max: 1.60 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 21.25, max: 22.75 },
                amarillo: [{ min: 20.25, max: 21.24 }, { min: 22.76, max: 23.75 }],
                aim: 21.50
            },
            humedad_pt: {
                verde: { min: 0.94, max: 1.44 },
                amarillo: [{ min: 0.84, max: 0.93 }, { min: 1.45, max: 1.54 }],
                aim: 1.24
            },
            aceite_pt: {
                verde: { min: 22.01, max: 25.01 },
                amarillo: [{ min: 21.01, max: 22.00 }, { min: 25.02, max: 26.01 }],
                aim: 24.33
            },
            sal_pt: {
                verde: { min: 1.38, max: 1.98 },
                amarillo: [{ min: 1.18, max: 1.37 }, { min: 1.99, max: 2.18 }],
                aim: 1.40
            }
        },
        'TOSTITOS SALSA VERDE': {
            humedad_base: {
                verde: { min: 0.90, max: 1.30 },
                amarillo: [{ min: 0.80, max: 0.89 }, { min: 1.31, max: 1.40 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 22.00, max: 24.00 },
                amarillo: [{ min: 21.00, max: 21.99 }, { min: 24.01, max: 25.00 }],
                aim: 23.00
            },
            humedad_pt: {
                verde: { min: 1.03, max: 1.63 },
                amarillo: [{ min: 0.93, max: 1.02 }, { min: 1.64, max: 1.73 }],
                aim: 1.33
            },
            aceite_pt: {
                verde: { min: 23.14, max: 26.14 },
                amarillo: [{ min: 22.14, max: 23.13 }, { min: 26.15, max: 27.14 }],
                aim: 24.64
            },
            sal_pt: {
                verde: { min: 0.97, max: 1.57 },
                amarillo: [{ min: 0.67, max: 0.96 }, { min: 1.58, max: 1.87 }],
                aim: 1.27
            }
        },
        'TOSTITOS FH': {
            humedad_base: {
                verde: { min: 0.90, max: 1.30 },
                amarillo: [{ min: 0.80, max: 0.89 }, { min: 1.31, max: 1.40 }],
                aim: 1.10
            },
            aceite_base: {
                verde: { min: 22.00, max: 24.00 },
                amarillo: [{ min: 21.00, max: 21.99 }, { min: 24.01, max: 25.00 }],
                aim: 23.00
            },
            humedad_pt: {
                verde: { min: 0.94, max: 1.44 },
                amarillo: [{ min: 0.84, max: 0.93 }, { min: 1.45, max: 1.54 }],
                aim: 1.19
            },
            aceite_pt: {
                verde: { min: 22.98, max: 25.98 },
                amarillo: [{ min: 21.98, max: 22.97 }, { min: 25.99, max: 26.98 }],
                aim: 24.48
            },
            sal_pt: {
                verde: { min: 1.38, max: 1.98 },
                amarillo: [{ min: 1.18, max: 1.37 }, { min: 1.99, max: 2.18 }],
                aim: 1.68
            }
        }
    },
    'PAPA': {
        'default': {
            humedad_base: { 
                verde: { min: 1.35, max: 1.65 },
                amarillo: [{ min: 1.20, max: 1.34 }, { min: 1.66, max: 1.8 }],
                rojo: { menor_que: 1.20, mayor_que: 1.8 }
            },
            aceite_base: { 
                verde: { min: 31, max: 35 },
                amarillo: [{ min: 30, max: 30.9 }, { min: 35.1, max: 36 }],
                rojo: { menor_que: 30, mayor_que: 36 }
            },
            aceite_pt: { 
                verde: { min: 0, max: 0 },
                amarillo: [{ min: 0, max: 0 }, { min: 0, max: 0 }],
                rojo: { menor_que: 0, mayor_que: 0 }
            },
            humedad_pt: { 
                verde: { min: 1.35, max: 1.8 },
                amarillo: [{ min: 1.20, max: 2 }],
                rojo: { menor_que: 0.45, mayor_que: 2 }
            },
            sal_pt: { 
                verde: { min: 0.55, max: 0.85 },
                amarillo: [{ min: 0.45, max: 0.54 }, { min: 0.86, max: 0.95 }],
                rojo: { menor_que: 0.45, mayor_que: 0.95 }
            }
        },

        'PAPA SAL': {
            humedad_base: {
                verde: { min: 1.35, max: 1.65 },
                amarillo: [{ min: 1.20, max: 1.34 }, { min: 1.66, max: 1.80 }],
                rojo: { menor_que: 1.20, mayor_que: 1.80 }
            },
            aceite_base: {
                verde: { min: 31, max: 35 },
                amarillo: [{ min: 30, max: 30.9 }, { min: 35.1, max: 36 }],
                rojo: { menor_que: 30, mayor_que: 36 }
            },
            aceite_pt: {
                verde: { min: 0, max: 0 },
                amarillo: [{ min: 0, max: 0 }, { min: 0, max: 0 }],
                rojo: { menor_que: 0, mayor_que: 0 }
            },
            humedad_pt: {
                verde: { min: 1.35, max: 1.8 },
                amarillo: [{ min: 1.20, max: 2 }],
                rojo: { menor_que: 0.45, mayor_que: 2 }
            },
            sal_pt: {
                verde: { min: 0.55, max: 0.85 },
                amarillo: [{ min: 0.45, max: 0.54 }, { min: 0.86, max: 0.95 }],
                rojo: { menor_que: 0.45, mayor_que: 0.95 }
            }
        },

        'RUFFLES QUESO': {
            humedad_base: {
                verde: { min: 1.20, max: 1.5 },
                amarillo: [{ min: 1.05, max: 1.19 }, { min: 1.51, max: 1.65 }],
                rojo: { menor_que: 1.05, mayor_que: 1.65 },
                aim: 1.35
            },
            aceite_base: {
                verde: { min: 31, max: 35 },
                amarillo: [{ min: 30, max: 30.9 }, { min: 35.1, max: 36 }],
                rojo: { menor_que: 30, mayor_que: 36 },
                aim: 33
            },
            aceite_pt: {
                verde: { min: 0, max: 0 },
                amarillo: [{ min: 0, max: 0 }, { min: 0, max: 0 }],
                rojo: { menor_que: 0, mayor_que: 0 }
            },
            humedad_pt: {
                verde: { min: 1.35, max: 1.8 },
                amarillo: [{ min: 1.20, max: 2 }],
                rojo: { menor_que: 0.45, mayor_que: 2 }
            },
            sal_pt: {
                verde: { min: 1.24, max: 1.54 },
                amarillo: [{ min: 1.19, max: 1.23 }, { min: 1.55, max: 1.59 }],
                rojo: { menor_que: 1.19, mayor_que: 1.59 },
                aim: 1.39
            },
            cloruros_base: {
                verde: { min: 0, max: 1 },
                amarillo: [],
                rojo: { menor_que: 0, mayor_que: 1 },
                aim: 0.5
            }
        },
        'SABRITAS XTRA FH': {
            humedad_base: {
                verde: { min: 1.35, max: 1.65 },
                amarillo: [{ min: 1.20, max: 1.34 }, { min: 1.66, max: 1.80 }],
                rojo: { menor_que: 1.20, mayor_que: 1.80 },
                aim: 1.35
            },
            aceite_base: {
                verde: { min: 31, max: 35 },
                amarillo: [{ min: 30, max: 30.9 }, { min: 35.1, max: 36 }],
                rojo: { menor_que: 30, mayor_que: 36 },
                aim: 33
            },
            aceite_pt: {
                verde: { min: 32.21, max: 32.51 },
                amarillo: [{ min: 32.1, max: 32.2 }, { min: 32.61, max: 32.71 }],
                rojo: { menor_que: 32.1, mayor_que: 32.71 }
            },
            humedad_pt: {
                verde: { min: 1.41, max: 1.71 },
                amarillo: [{ min: 1.21 , max: 1.40 }, { min: 1.70, max: 1.91 }],
                rojo: { menor_que: 1.21, mayor_que: 1.91 }
            },
            sal_pt: {
                verde: { min: 1.58, max: 1.88 },
                amarillo: [{ min: 1.38, max: 1.57 }, { min: 1.89, max: 2.08 }],
                rojo: { menor_que: 1.38, mayor_que: 2.08 },
                aim: 2.23
            }
        }
    }
};

// =====================================================
// MAPEO DE CAMPOS A TIPOS DE ANÁLISIS
// =====================================================

const MAPEO_CAMPOS = {
    'humedad_base_frita': 'humedad_base',
    'aceite_base_frita': 'aceite_base',
    'tanque1_aceite_pt': 'aceite_pt',
    'tanque2_aceite_pt': 'aceite_pt',
    'tanque3_aceite_pt': 'aceite_pt',
    'tanque1_humedad_pt': 'humedad_pt',
    'tanque2_humedad_pt': 'humedad_pt',
    'tanque3_humedad_pt': 'humedad_pt',
    'tanque1_sal_pt': 'sal_pt',
    'tanque2_sal_pt': 'sal_pt',
    'tanque3_sal_pt': 'sal_pt',
    'aceite_pt_producto_terminado': 'aceite_pt',
    'humedad_pt_producto_terminado': 'humedad_pt',
    'sal_pt_producto_terminado': 'sal_pt'
};

// =====================================================
// FUNCIONES PRINCIPALES
// =====================================================

/**
 * Obtiene la categoría actual desde la URL
 */
function obtenerCategoriaActual() {
    const path = window.location.pathname;
    if (path.includes('EXTRUIDOS')) return 'EXTRUIDOS';
    if (path.includes('TORTILLA')) return 'TORTILLA';
    if (path.includes('PAPA')) return 'PAPA';
    return 'EXTRUIDOS'; // Default
}

/**
 * Obtiene los rangos para un producto específico
 */
function obtenerRangosProducto(categoria, producto) {
    const categoriaRangos = RANGOS_FISICOQUIMICOS_FINAL[categoria];
    if (!categoriaRangos) {
        console.warn(`Categoría no encontrada: ${categoria}`);
        return RANGOS_FISICOQUIMICOS_FINAL['EXTRUIDOS']['default'];
    }

    // Para PAPA, si el producto no existe, usar PAPA SAL como default
    if (categoria === 'PAPA') {
        return categoriaRangos[producto] || categoriaRangos['PAPA SAL'];
    }

    return categoriaRangos[producto] || categoriaRangos['default'];
}

/**
 * Determina el color según el valor y las especificaciones
 */
function determinarColorPorEspecificacion(valor, tipoAnalisis, categoria, producto = 'default') {
    const valorNumerico = parseFloat(valor);

    // Verificar si el valor es válido
    if (isNaN(valorNumerico) || valor === null || valor === undefined || valor === '') {
        return 'text-empty';
    }

    // Obtener rangos para el producto
    const rangos = obtenerRangosProducto(categoria, producto);
    const especificacion = rangos[tipoAnalisis];

    if (!especificacion) {
        console.warn(`Tipo de análisis no reconocido: ${tipoAnalisis} para ${categoria}/${producto}`);
        return 'text-empty';
    }

    // Log para debugging de Sal PT
    if (tipoAnalisis === 'sal_pt') {
        console.log(`[DEBUG COLOR] Tipo: ${tipoAnalisis}, Producto: ${producto}, Valor: ${valorNumerico}`);
        console.log(`[DEBUG COLOR] Rango Verde: ${especificacion.verde.min}-${especificacion.verde.max}`);
        console.log(`[DEBUG COLOR] Rangos Amarillos:`, especificacion.amarillo);
    }

    // Verificar rango VERDE
    if (valorNumerico >= especificacion.verde.min && valorNumerico <= especificacion.verde.max) {
        if (tipoAnalisis === 'sal_pt') console.log(`[DEBUG COLOR] → VERDE`);
        return 'text-success';
    }

    // Verificar rangos AMARILLOS
    if (especificacion.amarillo && Array.isArray(especificacion.amarillo)) {
        for (const rangoAmarillo of especificacion.amarillo) {
            if (valorNumerico >= rangoAmarillo.min && valorNumerico <= rangoAmarillo.max) {
                if (tipoAnalisis === 'sal_pt') console.log(`[DEBUG COLOR] → AMARILLO`);
                return 'text-warning';
            }
        }
    }

    // Si no está en verde ni amarillo, es ROJO
    if (tipoAnalisis === 'sal_pt') console.log(`[DEBUG COLOR] → ROJO`);
    return 'text-danger';
}

/**
 * Aplica color a un elemento DOM
 */
function aplicarColorElemento(elemento, valor, tipoAnalisis, categoria, producto) {
    const claseColor = determinarColorPorEspecificacion(valor, tipoAnalisis, categoria, producto);
    
    // Remover clases anteriores
    elemento.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
    
    // Aplicar nueva clase
    if (claseColor) {
        elemento.classList.add(claseColor);
        
        // Para celdas de tabla, aplicar fondo también
        if (elemento.tagName === 'TD') {
            elemento.style.backgroundColor = '';
            switch (claseColor) {
                case 'text-success':
                    elemento.style.backgroundColor = '#d4edda';
                    break;
                case 'text-warning':
                    elemento.style.backgroundColor = '#fff3cd';
                    break;
                case 'text-danger':
                    elemento.style.backgroundColor = '#f8d7da';
                    break;
                case 'text-empty':
                    elemento.style.backgroundColor = '#f8f9fa';
                    break;
            }
        }
    }
}

/**
 * Obtiene el producto desde el contexto actual
 */
function obtenerProductoContexto(elemento) {
    // Buscar en modal activo
    const modalActivo = document.querySelector('.modal.show');
    if (modalActivo) {
        const productoSelect = modalActivo.querySelector('select[name="producto"]');
        if (productoSelect && productoSelect.value) {
            return productoSelect.value;
        }
    }
    
    // Buscar en fila de tabla
    const fila = elemento.closest('tr');
    if (fila && fila.cells && fila.cells.length > 2) {
        const celdaProducto = fila.cells[2]; // Columna de producto (índice 2)
        if (celdaProducto) {
            return celdaProducto.textContent.trim();
        }
    }
    
    return 'default';
}

/**
 * Configura eventos para inputs en modales
 */
function configurarEventosInputs() {
    const categoria = obtenerCategoriaActual();
    const modales = ['#createAnalisisModal', '#editAnalisisModal'];

    modales.forEach(modalSelector => {
        const modal = document.querySelector(modalSelector);
        if (!modal) {
            console.warn(`Modal no encontrado: ${modalSelector}`);
            return;
        }

        // Función para configurar los listeners de un input específico
        function configurarListenersInput(input) {
            const campo = input.name || input.id.replace('edit_', '');
            const tipoAnalisis = MAPEO_CAMPOS[campo] || campo;

            // Remover listeners previos si existen (para evitar duplicados)
            input.removeEventListener('input', input._inputHandler);
            input.removeEventListener('blur', input._blurHandler);

            // Evento input para colorear en tiempo real
            input._inputHandler = function() {
                if (this.value) {
                    const producto = obtenerProductoContexto(this);

                    // Log para debugging
                    console.log(`[VALIDACIÓN] Campo: ${campo}, Tipo: ${tipoAnalisis}, Producto: ${producto}, Valor: ${this.value}, Categoria: ${categoria}`);

                    aplicarColorElemento(this, this.value, tipoAnalisis, categoria, producto);
                } else {
                    this.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
                }
            };

            // Evento blur para verificar al salir del campo
            input._blurHandler = function() {
                if (this.value) {
                    const producto = obtenerProductoContexto(this);
                    aplicarColorElemento(this, this.value, tipoAnalisis, categoria, producto);
                }
            };

            input.addEventListener('input', input._inputHandler);
            input.addEventListener('blur', input._blurHandler);
        }

        // Configurar listeners para todos los inputs actuales
        const inputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
        console.log(`[CONFIG] Encontrados ${inputs.length} inputs en ${modalSelector}`);
        inputs.forEach(configurarListenersInput);

        // Evento para cambio de producto
        const productoSelect = modal.querySelector('select[name="producto"]');
        if (productoSelect) {
            productoSelect.removeEventListener('change', productoSelect._changeHandler);
            productoSelect._changeHandler = function() {
                console.log(`[PRODUCTO CAMBIADO] Nuevo producto: ${this.value}`);
                // Reaplicar colores a todos los inputs con valores
                const currentInputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
                currentInputs.forEach(input => {
                    if (input.value) {
                        const campo = input.name || input.id.replace('edit_', '');
                        const tipoAnalisis = MAPEO_CAMPOS[campo] || campo;
                        aplicarColorElemento(input, input.value, tipoAnalisis, categoria, this.value);
                    }
                });

                // Actualizar tooltips con rangos del producto
                actualizarTooltipsModal(modalSelector, this.value, categoria);
            };
            productoSelect.addEventListener('change', productoSelect._changeHandler);
        }
    });

    console.log('✅ Event listeners configurados para inputs en modales');
}

/**
 * Aplica colores a tabla existente
 */
function aplicarColoresTabla() {
    const tabla = document.querySelector('.table tbody');
    if (!tabla) return;
    
    const categoria = obtenerCategoriaActual();
    const headers = Array.from(document.querySelectorAll('.table thead th')).map(th => 
        th.textContent.toLowerCase().trim()
    );
    
    // Mapeo de headers a campos
    const headerCampoMap = {
        'humedad base': 'humedad_base_frita',
        'humedad base frita': 'humedad_base_frita',
        'aceite base': 'aceite_base_frita',
        'aceite base frita': 'aceite_base_frita',
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
        if (fila.cells.length <= 2) return; // Skip si no tiene suficientes celdas
        
        const producto = fila.cells[2] ? fila.cells[2].textContent.trim() : 'default';
        
        fila.querySelectorAll('td').forEach((celda, index) => {
            const header = headers[index];
            const campo = headerCampoMap[header];
            
            if (campo) {
                const valor = celda.textContent.trim();
                const tipoAnalisis = MAPEO_CAMPOS[campo] || campo;
                
                if (valor && valor !== '' && valor !== '-') {
                    aplicarColorElemento(celda, valor, tipoAnalisis, categoria, producto);
                }
            }
        });
    });
}

/**
 * Actualiza tooltips y rangos en modales según producto seleccionado
 */
function actualizarTooltipsModal(modalSelector, producto, categoria) {
    const modal = document.querySelector(modalSelector);
    if (!modal) return;

    const rangos = obtenerRangosProducto(categoria, producto);
    const isEdit = modalSelector.includes('edit');
    const prefix = isEdit ? 'edit_' : '';

    // Actualizar tooltips para cada campo
    const camposTooltip = {
        [`${prefix}humedad_base_frita`]: { rango: rangos.humedad_base, tipo: 'humedad_base' },
        [`${prefix}aceite_base_frita`]: { rango: rangos.aceite_base, tipo: 'aceite_base' },
        [`${prefix}tanque1_aceite_pt`]: { rango: rangos.aceite_pt, tipo: 'aceite_pt' },
        [`${prefix}tanque2_aceite_pt`]: { rango: rangos.aceite_pt, tipo: 'aceite_pt' },
        [`${prefix}tanque3_aceite_pt`]: { rango: rangos.aceite_pt, tipo: 'aceite_pt' },
        [`${prefix}tanque1_humedad_pt`]: { rango: rangos.humedad_pt, tipo: 'humedad_pt' },
        [`${prefix}tanque2_humedad_pt`]: { rango: rangos.humedad_pt, tipo: 'humedad_pt' },
        [`${prefix}tanque3_humedad_pt`]: { rango: rangos.humedad_pt, tipo: 'humedad_pt' },
        [`${prefix}tanque1_sal_pt`]: { rango: rangos.sal_pt, tipo: 'sal_pt' },
        [`${prefix}tanque2_sal_pt`]: { rango: rangos.sal_pt, tipo: 'sal_pt' },
        [`${prefix}tanque3_sal_pt`]: { rango: rangos.sal_pt, tipo: 'sal_pt' },
        [`${prefix}aceite_pt_producto_terminado`]: { rango: rangos.aceite_pt, tipo: 'aceite_pt' },
        [`${prefix}humedad_pt_producto_terminado`]: { rango: rangos.humedad_pt, tipo: 'humedad_pt' },
        [`${prefix}sal_pt_producto_terminado`]: { rango: rangos.sal_pt, tipo: 'sal_pt' }
    };

    Object.keys(camposTooltip).forEach(campoId => {
        const campo = modal.querySelector(`#${campoId}`);
        if (campo) {
            const config = camposTooltip[campoId];
            const rango = config.rango;

            if (rango && rango.verde) {
                // Actualizar el span con el rango verde
                const inputGroup = campo.closest('.input-group');
                const tooltip = inputGroup ? inputGroup.querySelector('.input-group-text') : null;

                if (tooltip) {
                    tooltip.textContent = `${rango.verde.min} - ${rango.verde.max}`;
                    tooltip.title = `AIM: ${rango.aim || 'N/A'}`;
                }

                // Actualizar el atributo data-rango con información completa
                if (categoria === 'PAPA') {
                    let dataRango = `${rango.verde.min}-${rango.verde.max} (ideal)`;

                    // Agregar rangos amarillos si existen
                    if (rango.amarillo && Array.isArray(rango.amarillo) && rango.amarillo.length > 0) {
                        const amarilloRangos = rango.amarillo.map(r => `${r.min}-${r.max}`).join(', ');
                        dataRango += ` / ${amarilloRangos} (aceptable)`;
                    }

                    campo.setAttribute('data-tipo', config.tipo);
                    campo.setAttribute('data-rango', dataRango);
                }
            }
        }
    });

    console.log(`✅ Rangos actualizados para producto: ${producto}`);
}

/**
 * Inicialización del sistema
 */
function inicializarSistemaColoresFisicoquimicos() {
    console.log('🎨 Iniciando Sistema Unificado de Colores Fisicoquímicos Final...');
    
    // Configurar eventos para inputs
    configurarEventosInputs();
    
    // Aplicar colores a tabla existente
    setTimeout(() => {
        aplicarColoresTabla();
    }, 100);
    
    // Configurar eventos para modales
    ['#createAnalisisModal', '#editAnalisisModal'].forEach(modalId => {
        const modal = document.getElementById(modalId.replace('#', ''));
        if (modal) {
            modal.addEventListener('shown.bs.modal', function() {
                const categoria = obtenerCategoriaActual();
                const productoSelect = this.querySelector('select[name="producto"]');
                const producto = productoSelect ? productoSelect.value || 'default' : 'default';
                
                actualizarTooltipsModal(modalId, producto, categoria);
                
                // Aplicar colores a inputs que ya tienen valores
                const inputs = this.querySelectorAll('input[type="text"], input[type="number"]');
                inputs.forEach(input => {
                    if (input.value) {
                        const campo = input.name || input.id.replace('edit_', '');
                        const tipoAnalisis = MAPEO_CAMPOS[campo] || campo;
                        aplicarColorElemento(input, input.value, tipoAnalisis, categoria, producto);
                    }
                });
            });
        }
    });
    
    console.log('✅ Sistema Unificado de Colores Fisicoquímicos inicializado correctamente');
}

// =====================================================
// AUTO-INICIALIZACIÓN
// =====================================================

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaColoresFisicoquimicos);
} else {
    inicializarSistemaColoresFisicoquimicos();
}

// =====================================================
// EXPORTAR API GLOBAL
// =====================================================

window.SistemaColoresFisicoquimicosUnificado = {
    determinarColor: determinarColorPorEspecificacion,
    aplicarColor: aplicarColorElemento,
    obtenerRangos: obtenerRangosProducto,
    obtenerCategoria: obtenerCategoriaActual,
    obtenerProducto: obtenerProductoContexto,
    rangos: RANGOS_FISICOQUIMICOS_FINAL,
    mapeo: MAPEO_CAMPOS,
    inicializar: inicializarSistemaColoresFisicoquimicos
};

console.log('📦 Sistema Unificado de Colores Fisicoquímicos cargado globalmente');
