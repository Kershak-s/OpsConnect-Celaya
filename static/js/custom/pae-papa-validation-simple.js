/**
 * PAE PAPA - Validación Simple y Directa
 * Versión ultra simplificada para depuración
 */

console.log('🥔 INICIANDO VALIDACIÓN PAPA - Versión Simple');

// RANGOS DE VALIDACIÓN
const RANGOS = {
    'A': { verde: [0, 4], amarillo: [4.1, 10] },
    'B': { verde: [0, 4], amarillo: [4.1, 10] },
    'C': { verde: [0, 4], amarillo: [4.1, 10] },
    'D': { verde: [0, 10], amarillo: [10.1, 20] },
    'E': { verde: [0, 10], amarillo: [10.1, 20] },
    'F': { verde: [0, 10], amarillo: [10.1, 20] },
    'G': { verde: [0, 1], amarillo: [1.1, 2] },
    'H': { verde: [0, 6], amarillo: [6.1, 20] },
    'I': { verde: [0, 6], amarillo: [6.1, 20] },
    'J': { verde: [0, 6], amarillo: [6.1, 20] },
    'K': { verde: [0, 6], amarillo: [6.1, 20] },
    'L': { verde: [0, 20], amarillo: [20.1, 40] },
    'M': { verde: [0, 30], amarillo: [30.1, 35] },
    'N': { verde: [75, 100], amarillo: null },
    'O': { verde: [100, 100], amarillo: [73, 99.99] },
    'P': { verde: [0, 12], amarillo: [12.1, 15] },
    'Q': { verde: [61, 100], amarillo: [58, 60.9] },
    'R': { verde: [-3, 2.5], amarillo: [2.51, 10] }
};

// INYECTAR CSS DIRECTAMENTE
const css = `
    input[data-type].input-value-ok {
        background-color: #d4edda !important;
        border-color: #c3e6cb !important;
        color: #155724 !important;
    }
    input[data-type].input-value-warning {
        background-color: #fff3cd !important;
        border-color: #ffeaa7 !important;
        color: #856404 !important;
    }
    input[data-type].input-value-error {
        background-color: #f8d7da !important;
        border-color: #f5c6cb !important;
        color: #721c24 !important;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = css;
document.head.appendChild(styleElement);
console.log('✅ CSS inyectado');

// FUNCIÓN DE VALIDACIÓN
function validar(input) {
    const tipo = input.getAttribute('data-type');
    const valorStr = input.value.trim();

    console.log(`Validando ${tipo} = "${valorStr}"`);

    // Limpiar clases
    input.classList.remove('input-value-ok', 'input-value-warning', 'input-value-error');

    // Si el campo está vacío, no validar (pero 0 es un valor válido)
    if (valorStr === '' || valorStr === null || valorStr === undefined) {
        console.log('  → Valor vacío');
        return;
    }

    const valor = parseFloat(valorStr);
    if (isNaN(valor)) {
        console.log('  → Valor inválido (no numérico)');
        return;
    }

    if (!RANGOS[tipo]) {
        console.log('  → Tipo desconocido');
        return;
    }

    const rango = RANGOS[tipo];
    let estado = 'error';

    // Casos especiales
    if (tipo === 'N') {
        // Verde: 75-100%, Rojo: <75%, Sin amarillo
        if (valor >= 75 && valor <= 100) estado = 'ok';
        else estado = 'error';
    } else if (tipo === 'O') {
        if (valor === 100) estado = 'ok';
        else if (valor >= 73) estado = 'warning';
        else estado = 'error';
    } else if (tipo === 'R') {
        if (valor >= rango.verde[0] && valor <= rango.verde[1]) estado = 'ok';
        else if (rango.amarillo && ((valor >= rango.amarillo[0] && valor <= rango.amarillo[1]) || valor < -3)) estado = 'warning';
        else estado = 'error';
    } else {
        // Lógica estándar
        if (valor >= rango.verde[0] && valor <= rango.verde[1]) {
            estado = 'ok';
        } else if (rango.amarillo && valor >= rango.amarillo[0] && valor <= rango.amarillo[1]) {
            estado = 'warning';
        } else {
            estado = 'error';
        }
    }

    const clase = `input-value-${estado}`;
    input.classList.add(clase);
    console.log(`  → Estado: ${estado}, Clase: ${clase}`);
    console.log(`  → Clases finales: ${input.className}`);
}

// CONFIGURAR CAMPOS
function configurar() {
    const campos = document.querySelectorAll('input[data-type]');
    console.log(`📋 Encontrados ${campos.length} campos`);

    campos.forEach((input, i) => {
        const tipo = input.getAttribute('data-type');
        console.log(`  ${i+1}. Campo ${tipo}`);

        // Agregar eventos
        input.addEventListener('input', () => validar(input));
        input.addEventListener('change', () => validar(input));
        input.addEventListener('blur', () => validar(input));

        // Validar si tiene valor inicial
        if (input.value) {
            validar(input);
        }
    });

    console.log('🎉 Configuración completada');
}

// EJECUTAR
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configurar);
} else {
    configurar();
}

// También ejecutar después de delay
setTimeout(configurar, 500);
