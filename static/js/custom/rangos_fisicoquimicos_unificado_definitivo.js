/**
 * SISTEMA UNIFICADO DE RANGOS FISICOQUÍMICOS - VERSIÓN DEFINITIVA
 * Soporte completo para todos los productos con lógica optimizada
 * Actualizado con todos los productos y rangos correctos
 */

// CONFIGURACIÓN CONSOLIDADA DE RANGOS POR CATEGORÍA Y PRODUCTO
const RANGOS_FISICOQUIMICOS_DEFINITIVOS = {
    'EXTRUIDOS': {
        'default': {
            humedad_base: { 
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.6, max: 0.69 }, { min: 1.71, max: 1.8 }],
                rojo: { menor_que: 0.6, mayor_que: 1.8 }
            },
            aceite_base: { 
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                rojo: { menor_que: 20.7, mayor_que: 28.7 }
            },
            aceite_pt: { 
                verde: { min: 32.46, max: 38.46 },
                amarillo: [{ min: 31.46, max: 32.45 }, { min: 38.47, max: 39.46 }],
                rojo: { menor_que: 31.46, mayor_que: 39.46 }
            },
            humedad_pt: { 
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.1 }],
                rojo: { menor_que: 0.5, mayor_que: 2.1 }
            },
            sal_pt: { 
                verde: { min: 0.95, max: 1.55 },
                amarillo: [{ min: 0.85, max: 0.94 }, { min: 1.56, max: 1.65 }],
                rojo: { menor_que: 0.85, mayor_que: 1.65 }
            }
        },
        'CHEETOS XTRA FLAMIN HOT': {
            humedad_base: { 
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.6, max: 0.69 }, { min: 1.71, max: 1.8 }],
                rojo: { menor_que: 0.6, mayor_que: 1.8 }
            },
            aceite_base: { 
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.7, max: 21.69 }, { min: 27.71, max: 28.7 }],
                rojo: { menor_que: 20.7, mayor_que: 28.7 }
            },
            aceite_pt: { 
                verde: { min: 29.52, max: 35.52 },
                amarillo: [{ min: 28.51, max: 29.51 }, { min: 35.53, max: 36.01 }],
                rojo: { menor_que: 28.51, mayor_que: 36.01 }
            },
            humedad_pt: { 
                verde: { min: 0.47, max: 1.67 },
                amarillo: [{ min: 1.68, max: 2.07 }],
                rojo: { menor_que: 0.47, mayor_que: 2.07 }
            },
            sal_pt: { 
                verde: { min: 1.4, max: 1.8 },
                amarillo: [{ min: 1.19, max: 1.39 }, { min: 1.81, max: 2.01 }],
                rojo: { menor_que: 1.19, mayor_que: 2.01 }
            }
        },
        'CHEETOS JALAQUEÑO': {
            humedad_base: { 
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                rojo: { menor_que: 0.60, mayor_que: 1.80 }
            },
            aceite_base: { 
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.70, max: 21.69 }, { min: 27.71, max: 28.70 }],
                rojo: { menor_que: 20.70, mayor_que: 28.70 }
            },
            aceite_pt: { 
                verde: { min: 31.64, max: 37.64 },
                amarillo: [{ min: 29.64, max: 31.63 }, { min: 37.65, max: 39.64 }],
                rojo: { menor_que: 29.64, mayor_que: 39.64 }
            },
            humedad_pt: { 
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                rojo: { menor_que: 0.5, mayor_que: 2.10 }
            },
            sal_pt: { 
                verde: { min: 1.06, max: 1.66 },
                amarillo: [{ min: 0.95, max: 1.05 }, { min: 1.67, max: 1.77 }],
                rojo: { menor_que: 0.95, mayor_que: 1.77 }
            }
        },
        'CHEETOS EXTRA FH NUEVO': {
            humedad_base: {
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                rojo: { menor_que: 0.60, mayor_que: 1.80 }
            },
            aceite_base: {
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.70, max: 21.69 }, { min: 27.71, max: 28.70 }],
                rojo: { menor_que: 20.70, mayor_que: 28.70 }
            },
            aceite_pt: {
                verde: { min: 29.35, max: 35.35 },
                amarillo: [{ min: 27.35, max: 29.34 }, { min: 35.36, max: 37.35 }],
                rojo: { menor_que: 27.35, mayor_que: 37.35 }
            },
            humedad_pt: {
                verde: { min: 0.5, max: 1.9 },
                rojo: { menor_que: 0.5, mayor_que: 2.10 }

            },
            sal_pt: {
                verde: { min: 1.16, max: 1.76 },
                amarillo: [{ min: 0.86, max: 1.15 }, { min: 1.77, max: 2.07 }],
                rojo: { menor_que: 0.86, mayor_que: 2.07 }
            }
        },


        'CHEETOS JALAPENO': { // Alias para compatibilidad
            humedad_base: { 
                verde: { min: 0.7, max: 1.7 },
                amarillo: [{ min: 0.60, max: 0.69 }, { min: 1.71, max: 1.80 }],
                rojo: { menor_que: 0.60, mayor_que: 1.80 }
            },
            aceite_base: { 
                verde: { min: 21.7, max: 27.7 },
                amarillo: [{ min: 20.70, max: 21.69 }, { min: 27.71, max: 28.70 }],
                rojo: { menor_que: 20.70, mayor_que: 28.70 }
            },
            aceite_pt: { 
                verde: { min: 31.64, max: 37.64 },
                amarillo: [{ min: 29.64, max: 31.63 }, { min: 37.65, max: 39.64 }],
                rojo: { menor_que: 29.64, mayor_que: 39.64 }
            },
            humedad_pt: { 
                verde: { min: 0.5, max: 1.9 },
                amarillo: [{ min: 1.91, max: 2.10 }],
                rojo: { menor_que: 0.5, mayor_que: 2.10 }
            },
            sal_pt: { 
                verde: { min: 1.06, max: 1.66 },
                amarillo: [{ min: 0.95, max: 1.05 }, { min: 1.67, max: 1.77 }],
                rojo: { menor_que: 0.95, mayor_que: 1.77 }
            }
        }
    },
    'TORTILLA': {
        'default': {
            humedad_base: { 
                verde: { min: 1, max: 1.2 },
                amarillo: [{ min: 0.8, max: 0.99 }, { min: 1.21, max: 1.3 }],
                rojo: { menor_que: 0.8, mayor_que: 1.3 }
            },
            aceite_base: { 
                verde: { min: 20, max: 23 },
                amarillo: [{ min: 19, max: 19.99 }, { min: 23.01, max: 24 }],
                rojo: { menor_que: 19, mayor_que: 24 }
            },
            aceite_pt: { 
                verde: { min: 23.14, max: 26.14 },
                amarillo: [{ min: 22.14, max: 23.13 }, { min: 26.15, max: 27.14 }],
                rojo: { menor_que: 22.14, mayor_que: 27.14 }
            },
            humedad_pt: { 
                verde: { min: 0.78, max: 1.58 },
                amarillo: [{ min: 0.68, max: 0.77 }, { min: 1.59, max: 1.68 }],
                rojo: { menor_que: 0.68, mayor_que: 1.68 }
            },
            sal_pt: { 
                verde: { min: 0.9, max: 1.5 },
                amarillo: [{ min: 0.8, max: 0.89 }, { min: 1.51, max: 1.6 }],
                rojo: { menor_que: 0.8, mayor_que: 1.6 }
            }
        },
        'TOSTITOS SALSA VERDE': {
            humedad_base: { 
                verde: { min: 0.9, max: 1.3 },
                amarillo: [{ min: 0.8, max: 0.89 }, { min: 1.31, max: 1.4 }],
                rojo: { menor_que: 0.8, mayor_que: 1.4 }
            },
            aceite_base: { 
                verde: { min: 22, max: 24 },
                amarillo: [{ min: 21, max: 21.99 }, { min: 24.01, max: 25 }],
                rojo: { menor_que: 21, mayor_que: 25 }
            },
            aceite_pt: { 
                verde: { min: 23.14, max: 26.14 },
                amarillo: [{ min: 22.14, max: 23.13 }, { min: 26.15, max: 27.14 }],
                rojo: { menor_que: 22.14, mayor_que: 27.14 }
            },
            humedad_pt: { 
                verde: { min: 1.03, max: 1.63 },
                amarillo: [{ min: 0.93, max: 1.02 }, { min: 1.64, max: 1.73 }],
                rojo: { menor_que: 0.93, mayor_que: 1.73 }
            },
            sal_pt: { 
                verde: { min: 0.97, max: 1.57 },
                amarillo: [{ min: 0.67, max: 0.96 }, { min: 1.58, max: 1.87 }],
                rojo: { menor_que: 0.67, mayor_que: 1.87 }
            }
        },
        'TOSTITOS FH': {
            humedad_base: { 
                verde: { min: 0.9, max: 1.3 },
                amarillo: [{ min: 0.8, max: 0.89 }, { min: 1.31, max: 1.4 }],
                rojo: { menor_que: 0.8, mayor_que: 1.4 }
            },
            aceite_base: { 
                verde: { min: 22, max: 24 },
                amarillo: [{ min: 21, max: 21.99 }, { min: 24.01, max: 25 }],
                rojo: { menor_que: 21, mayor_que: 25 }
            },
            aceite_pt: { 
                verde: { min: 22.98, max: 25.98 },
                amarillo: [{ min: 21.98, max: 22.97 }, { min: 25.99, max: 26.98 }],
                rojo: { menor_que: 21.98, mayor_que: 26.98 }
            },
            humedad_pt: { 
                verde: { min: 0.94, max: 1.44 },
                amarillo: [{ min: 0.84, max: 0.93 }, { min: 1.45, max: 1.54 }],
                rojo: { menor_que: 0.84, mayor_que: 1.54 }
            },
            sal_pt: { 
                verde: { min: 1.38, max: 1.98 },
                amarillo: [{ min: 1.18, max: 1.37 }, { min: 1.99, max: 2.18 }],
                rojo: { menor_que: 1.18, mayor_que: 2.18 }
            }
        },
        'DORITOS': {
            humedad_base: { 
                verde: { min: 1, max: 1.2 },
                amarillo: [{ min: 0.9, max: 0.99 }, { min: 1.21, max: 1.3 }],
                rojo: { menor_que: 0.9, mayor_que: 1.3 }
            },
            aceite_base: { 
                verde: { min: 20, max: 23 },
                amarillo: [{ min: 19, max: 19.99 }, { min: 23.01, max: 24 }],
                rojo: { menor_que: 19, mayor_que: 24 }
            },
            aceite_pt: { 
                verde: { min: 23.45, max: 26.45 },
                amarillo: [{ min: 22.45, max: 23.44 }, { min: 26.46, max: 27.45 }],
                rojo: { menor_que: 22.45, mayor_que: 27.45 }
            },
            humedad_pt: { 
                verde: { min: 0.78, max: 1.58 },
                amarillo: [{ min: 0.63, max: 0.77 }, { min: 1.59, max: 1.73 }],
                rojo: { menor_que: 0.63, mayor_que: 1.73 }
            },
            sal_pt: { 
                verde: { min: 0.9, max: 1.5 },
                amarillo: [{ min: 0.7, max: 0.89 }, { min: 1.51, max: 1.7 }],
                rojo: { menor_que: 0.7, mayor_que: 1.7 }
            }
        },
        'DORITOS PIZZEROLA': {
            humedad_base: { 
                verde: { min: 1, max: 1.2 },
                amarillo: [{ min: 0.9, max: 0.99 }, { min: 1.21, max: 1.3 }],
                rojo: { menor_que: 0.9, mayor_que: 1.3 }
            },
            aceite_base: { 
                verde: { min: 20, max: 23 },
                amarillo: [{ min: 19, max: 19.99 }, { min: 23.01, max: 24 }],
                rojo: { menor_que: 19, mayor_que: 24 }
            },
            aceite_pt: { 
                verde: { min: 22.83, max: 25.83 },
                amarillo: [{ min: 21.83, max: 22.82 }, { min: 25.84, max: 26.83 }],
                rojo: { menor_que: 21.83, mayor_que: 26.83 }
            },
            humedad_pt: { 
                verde: { min: 0.99, max: 1.49 },
                amarillo: [{ min: 0.89, max: 0.98 }, { min: 1.50, max: 1.59 }],
                rojo: { menor_que: 0.89, mayor_que: 1.59 }
            },
            sal_pt: { 
                verde: { min: 1.10, max: 1.7 },
                amarillo: [{ min: 0.9, max: 1.09 }, { min: 1.71, max: 1.9 }],
                rojo: { menor_que: 0.9, mayor_que: 1.9 }
            }
        },

        'DORITOS FH': {
            humedad_base: { 
                verde: { min: 1.12, max: 1.72 },
                amarillo: [{ min: 1.07, max: 1.11 }, { min: 1.73, max: 1.77 }],
                rojo: { menor_que: 1.07, mayor_que: 1.77 }
            },
            aceite_base: { 
                verde: { min: 20, max: 23 },
                amarillo: [{ min: 19.0, max: 19.99 }, { min: 23.01, max: 24 }],
                rojo: { menor_que: 19.0, mayor_que: 24 }
            },
            aceite_pt: { 
                verde: { min: 22.71, max: 25.71 },
                amarillo: [{ min: 21.83, max: 22.82 }, { min: 25.84, max: 26.83 }],
                rojo: { menor_que: 21.83, mayor_que: 26.83 }
            },
            humedad_pt: { 
                verde: { min: 1.12, max: 1.72 },
                amarillo: [{ min: 1.07, max: 1.11 }, { min: 1.73, max: 1.77 }],
                rojo: { menor_que: 1.07, mayor_que: 1.77 }
            },
            sal_pt: { 
                verde: { min: 1.31, max: 1.91 },
                amarillo: [{ min: 1.11, max: 1.3 }, { min: 1.92, max: 2.11 }],
                rojo: { menor_que: 1.11, mayor_que: 2.11 }
            }
        },


        'RANCHERITOS': {
            humedad_base: { 
                verde: { min: 0.8, max: 1.40 },
                amarillo: [{ min: 0.6, max: 0.79 }, { min: 1.41, max: 1.6 }],
                rojo: { menor_que: 0.6, mayor_que: 1.6 }
            },
            aceite_base: { 
                verde: { min: 21.35, max: 22.75 },
                amarillo: [{ min: 20.25, max: 21.34 }, { min: 22.76, max: 23.75 }],
                rojo: { menor_que: 20.25, mayor_que: 23.75 }
            },
            aceite_pt: { 
                verde: { min: 22.01, max: 22.75 },
                amarillo: [{ min: 20.25, max: 22.00 }, { min: 22.76, max: 23.75 }],
                rojo: { menor_que: 20.25, mayor_que: 23.75 }
            },
            humedad_pt: { 
                verde: { min: 0.94, max: 1.44 },
                amarillo: [{ min: 0.84, max: 0.93 }, { min: 1.45, max: 1.54 }],
                rojo: { menor_que: 0.84, mayor_que: 1.54 }
            },
            sal_pt: { 
                verde: { min: 1.38, max: 1.98 },
                amarillo: [{ min: 1.18, max: 1.37 }, { min: 1.99, max: 2.18 }],
                rojo: { menor_que: 1.18, mayor_que: 2.18 }
            }
        },
        'DORITOS INCOGNITA': {
            humedad_base: { 
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.90, max: 0.99 }, { min: 1.21, max: 1.30 }],
                rojo: { menor_que: 0.90, mayor_que: 1.30 }
            },
            aceite_base: { 
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 19.00, max: 19.99 }, { min: 23.01, max: 24.00 }],
                rojo: { menor_que: 19.00, mayor_que: 24.00 }
            },
            aceite_pt: { 
                verde: { min: 22.36, max: 25.36 },
                amarillo: [{ min: 21.36, max: 22.35 }, { min: 25.37, max: 26.36 }],
                rojo: { menor_que: 21.36, mayor_que: 26.36 }
            },
            humedad_pt: { 
                verde: { min: 1.02, max: 1.62 },
                amarillo: [{ min: 0.97, max: 1.01 }, { min: 1.63, max: 1.67 }],
                rojo: { menor_que: 0.97, mayor_que: 1.67 }
            },
            sal_pt: { 
                verde: { min: 0.72, max: 1.32 },
                amarillo: [{ min: 0.52, max: 0.71 }, { min: 1.33, max: 1.52 }],
                rojo: { menor_que: 0.52, mayor_que: 1.52 }
            }
        },
        'DORITOS INCÓGNITA': {
            humedad_base: { 
                verde: { min: 1.00, max: 1.20 },
                amarillo: [{ min: 0.90, max: 0.99 }, { min: 1.21, max: 1.30 }],
                rojo: { menor_que: 0.90, mayor_que: 1.30 }
            },
            aceite_base: { 
                verde: { min: 20.00, max: 23.00 },
                amarillo: [{ min: 19.00, max: 19.99 }, { min: 23.01, max: 24.00 }],
                rojo: { menor_que: 19.00, mayor_que: 24.00 }
            },
            aceite_pt: { 
                verde: { min: 22.35, max: 25.35 },
                amarillo: [{ min: 21.35, max: 22.34 }, { min: 25.36, max: 26.35 }],
                rojo: { menor_que: 21.35, mayor_que: 26.35 }
            },
            humedad_pt: { 
                verde: { min: 1.02, max: 1.62 },
                amarillo: [{ min: 0.97, max: 1.01 }, { min: 1.63, max: 1.67 }],
                rojo: { menor_que: 0.97, mayor_que: 1.67 }
            },
            sal_pt: { 
                verde: { min: 0.72, max: 1.32 },
                amarillo: [{ min: 0.52, max: 0.71 }, { min: 1.33, max: 1.52 }],
                rojo: { menor_que: 0.52, mayor_que: 1.52 }
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
        'SABRITAS XTRA FH': {
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
                verde: { min: 32.21, max: 32.51 },
                amarillo: [{ min: 32.1, max: 32.2 }, { min: 32.61, max: 32.71 }],
                rojo: { menor_que: 32.1, mayor_que: 32.71 }
            },
            humedad_pt: { 
                verde: { min: 1.41, max: 1.71 },
                amarillo: [{ min: 1.21, max: 1.40 }, { min: 1.70, max: 1.91 }],      
                rojo: { menor_que: 1.21, mayor_que: 1.91 }
            },
            sal_pt: {
                verde: { min: 1.58, max: 1.88 },
                amarillo: [{ min: 1.38, max: 1.57 }, { min: 1.89, max: 2.08 }],
                rojo: { menor_que: 1.38, mayor_que: 2.08 }
            }
        }


    },
    

    
};

// MAPEO DE CAMPOS A TIPOS DE ANÁLISIS
const CAMPO_TIPO_MAP_DEFINITIVO = {
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
    // CAMPOS PT PRODUCTO TERMINADO
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
    if (path.includes('PAPA')) return 'PAPA';
    return 'EXTRUIDOS'; // Default
}

/**
 * Obtiene rangos según categoría y producto
 */
function obtenerRangosDefinitivos(categoria, producto = 'default') {
    const categoriaRangos = RANGOS_FISICOQUIMICOS_DEFINITIVOS[categoria] || RANGOS_FISICOQUIMICOS_DEFINITIVOS['EXTRUIDOS'];
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
function determinarColorPorEspecificacionDefinitivo(valor, tipoAnalisis, categoria, producto = 'default') {
    const valorNumerico = parseFloat(valor);
    
    // Validar que el valor sea numérico
    if (isNaN(valorNumerico) || valor === null || valor === undefined || valor === '') {
        return 'text-empty'; // Gris para valores vacíos
    }
    
    const rangos = obtenerRangosDefinitivos(categoria, producto);
    const rango = rangos[tipoAnalisis];
    
    if (!rango) {
        console.warn(`Tipo de análisis no reconocido: ${tipoAnalisis} para producto: ${producto}`);
        return 'text-empty';
    }
    
    // Verificar rango verde
    if (rango.verde && valorNumerico >= rango.verde.min && valorNumerico <= rango.verde.max) {
        return 'text-success';
    }
    
    // Verificar rangos amarillos
    if (rango.amarillo) {
        for (const rangoAmarillo of rango.amarillo) {
            if (valorNumerico >= rangoAmarillo.min && valorNumerico <= rangoAmarillo.max) {
                return 'text-warning';
            }
        }
    }
    
    // Si no está en verde ni amarillo = rojo
    return 'text-danger';
}

/**
 * Aplica color a un elemento (input o celda)
 */
function aplicarColorDefinitivo(elemento, valor, tipoAnalisis, categoria, producto) {
    const claseColor = determinarColorPorEspecificacionDefinitivo(valor, tipoAnalisis, categoria, producto);
    
    // Remover clases anteriores
    elemento.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
    
    // Aplicar nueva clase
    if (claseColor) {
        elemento.classList.add(claseColor);
        
        // Para celdas de tabla, agregar fondo
        if (elemento.tagName === 'TD') {
            elemento.style.backgroundColor = '';
            if (claseColor === 'text-success') {
                elemento.style.backgroundColor = '#d4edda';
                elemento.style.color = '#155724';
            } else if (claseColor === 'text-warning') {
                elemento.style.backgroundColor = '#fff3cd';
                elemento.style.color = '#856404';
            } else if (claseColor === 'text-danger') {
                elemento.style.backgroundColor = '#f8d7da';
                elemento.style.color = '#721c24';
            } else if (claseColor === 'text-empty') {
                elemento.style.backgroundColor = '#f8f9fa';
                elemento.style.color = '#6c757d';
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
function mapearCampoATipoAnalisisDefinitivo(campo) {
    return CAMPO_TIPO_MAP_DEFINITIVO[campo] || campo;
}

/**
 * Configura eventos para inputs en modales
 */
function configurarEventosInputsDefinitivos() {
    const modales = ['#createAnalisisModal', '#editAnalisisModal'];
    const categoria = obtenerCategoriaActual();
    
    modales.forEach(modalSelector => {
        const modal = document.querySelector(modalSelector);
        if (!modal) return;
        
        const inputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
        
        inputs.forEach(input => {
            const campo = input.name || input.id.replace('edit_', '');
            const tipoAnalisis = mapearCampoATipoAnalisisDefinitivo(campo);
            
            input.addEventListener('input', function() {
                const producto = obtenerProductoContexto(this);
                aplicarColorDefinitivo(this, this.value, tipoAnalisis, categoria, producto);
            });
        });
        
        // Evento para cambio de producto
        const productoSelect = modal.querySelector('select[name="producto"]');
        if (productoSelect) {
            productoSelect.addEventListener('change', function() {
                inputs.forEach(input => {
                    if (input.value) {
                        const campo = input.name || input.id.replace('edit_', '');
                        const tipoAnalisis = mapearCampoATipoAnalisisDefinitivo(campo);
                        aplicarColorDefinitivo(input, input.value, tipoAnalisis, categoria, this.value);
                    }
                });
                
                // Actualizar tooltips
                actualizarTooltipsDefinitivos(modalSelector, this.value, categoria);
            });
        }
    });
}

/**
 * Aplica colores a tabla existente
 */
function aplicarColoresTablaDefinitiva() {
    const tabla = document.querySelector('.table tbody');
    if (!tabla) return;
    
    const categoria = obtenerCategoriaActual();
    const headers = Array.from(document.querySelectorAll('.table thead th')).map(th => th.textContent.toLowerCase());
    
    // Mapeo de headers a campos (actualizado con campos PT)
    const headerCampoMap = {
        'humedad base frita': 'humedad_base_frita',
        'aceite base frita': 'aceite_base_frita',
        'aceite pt t1': 'tanque1_aceite_pt',
        'humedad pt t1': 'tanque1_humedad_pt',
        'sal pt t1': 'tanque1_sal_pt',
        'aceite pt t2': 'tanque2_aceite_pt',
        'humedad pt t2': 'tanque2_humedad_pt',
        'sal pt t2': 'tanque2_sal_pt',
        'aceite pt t3': 'tanque3_aceite_pt',
        'humedad pt t3': 'tanque3_humedad_pt',
        'sal pt t3': 'tanque3_sal_pt',
        // CAMPOS PT GENERALES
        'aceite pt general': 'aceite_pt_producto_terminado',
        'humedad pt general': 'humedad_pt_producto_terminado',
        'sal pt general': 'sal_pt_producto_terminado'
    };
    
    tabla.querySelectorAll('tr').forEach(fila => {
        const producto = fila.cells[2] ? fila.cells[2].textContent.trim() : 'default';
        
        fila.querySelectorAll('td').forEach((celda, index) => {
            const header = headers[index];
            const campo = headerCampoMap[header];
            
            if (campo) {
                const valor = celda.textContent.trim();
                const tipoAnalisis = mapearCampoATipoAnalisisDefinitivo(campo);
                aplicarColorDefinitivo(celda, valor, tipoAnalisis, categoria, producto);
            }
        });
    });
}

/**
 * Actualiza tooltips según producto
 */
function actualizarTooltipsDefinitivos(modalSelector, producto, categoria) {
    const modal = document.querySelector(modalSelector);
    if (!modal) return;
    
    const rangos = obtenerRangosDefinitivos(categoria, producto);
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
        // CAMPOS PT PRODUCTO TERMINADO
        [`${prefix}aceite_pt_producto_terminado`]: rangos.aceite_pt,
        [`${prefix}humedad_pt_producto_terminado`]: rangos.humedad_pt,
        [`${prefix}sal_pt_producto_terminado`]: rangos.sal_pt
    };
    
    Object.keys(camposTooltip).forEach(campoId => {
        const campo = modal.querySelector(`#${campoId}`);
        if (campo) {
            const span = campo.closest('.input-group')?.querySelector('.input-group-text');
            if (span && camposTooltip[campoId] && camposTooltip[campoId].verde) {
                const rango = camposTooltip[campoId];
                span.textContent = `${rango.verde.min} - ${rango.verde.max}`;
                span.title = `Verde: ${rango.verde.min} - ${rango.verde.max}`;
            }
        }
    });
}

/**
 * Inicialización del sistema
 */
function inicializarSistemaColoresDefinitivo() {
    console.log('🎨 Iniciando Sistema Unificado de Colores Fisicoquímicos DEFINITIVO...');
    
    // Configurar eventos para inputs
    configurarEventosInputsDefinitivos();
    
    // Aplicar colores a tabla existente
    aplicarColoresTablaDefinitiva();
    
    // Configurar eventos para modales
    const createModal = document.getElementById('createAnalisisModal');
    const editModal = document.getElementById('editAnalisisModal');
    
    if (createModal) {
        createModal.addEventListener('shown.bs.modal', function() {
            const categoria = obtenerCategoriaActual();
            const productoSelect = this.querySelector('select[name="producto"]');
            const producto = productoSelect ? productoSelect.value : 'default';
            actualizarTooltipsDefinitivos('#createAnalisisModal', producto, categoria);
        });
    }
    
    if (editModal) {
        editModal.addEventListener('shown.bs.modal', function() {
            const categoria = obtenerCategoriaActual();
            const productoSelect = this.querySelector('select[name="producto"]');
            const producto = productoSelect ? productoSelect.value : 'default';
            actualizarTooltipsDefinitivos('#editAnalisisModal', producto, categoria);
        });
    }
    
    console.log('✅ Sistema Unificado de Colores DEFINITIVO inicializado correctamente');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaColoresDefinitivo);
} else {
    inicializarSistemaColoresDefinitivo();
}

// EXPORTAR FUNCIONES PARA USO GLOBAL
window.SistemaColoresFisicoquimicosDefinitivo = {
    determinarColor: determinarColorPorEspecificacionDefinitivo,
    aplicarColor: aplicarColorDefinitivo,
    obtenerRangos: obtenerRangosDefinitivos,
    obtenerCategoriaActual: obtenerCategoriaActual,
    rangos: RANGOS_FISICOQUIMICOS_DEFINITIVOS,
    mapearCampo: mapearCampoATipoAnalisisDefinitivo,
    inicializar: inicializarSistemaColoresDefinitivo
};