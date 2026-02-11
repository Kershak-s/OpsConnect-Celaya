/**
 * LÓGICA DE RANGOS FISICOQUÍMICOS CORREGIDA
 * Soporte completo para CHEETOS JALAQUEÑO y otros productos
 */

const rangosEspecificaciones = {
    // DORITOS INCÓGNITA (mantener existente)
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
            rojo: { menor_que: 0.61, mayor_que: 1.61 }
        }
    },
    
    // CHEETOS JALAQUEÑO (Nuevos rangos según tabla oficial)
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
        }
    }
};

/**
 * Función principal para determinar el color según valor, producto y especificación
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
    for (const rangoAmarillo of spec.amarillo) {
        if (valorNumerico >= rangoAmarillo.min && valorNumerico <= rangoAmarillo.max) {
            return 'text-warning';
        }
    }
    
    // ROJO por defecto
    return 'text-danger';
}

/**
 * Mapeo de campos a tipos de análisis
 */
function mapearCampoATipoAnalisis(campo) {
    const mapeo = {
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
        'tanque3_sal_pt': 'sal_producto_terminado'
    };
    return mapeo[campo] || campo;
}

/**
 * Aplicar colores dinámicamente según producto
 */
function aplicarColorInput(input, campo, producto) {
    const valor = input.value;
    const tipoAnalisis = mapearCampoATipoAnalisis(campo);
    const claseColor = determinarColorPorEspecificacion(valor, producto, tipoAnalisis);
    
    input.classList.remove('text-success', 'text-warning', 'text-danger', 'text-empty');
    if (claseColor) {
        input.classList.add(claseColor);
    }
}

// EXPORTAR
window.FisicoquimicosRangosCorregidos = {
    determinarColor: determinarColorPorEspecificacion,
    aplicarColorInput: aplicarColorInput,
    mapearCampo: mapearCampoATipoAnalisis,
    rangos: rangosEspecificaciones
};