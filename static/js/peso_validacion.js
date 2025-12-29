/**
 * Script para manejar la validación de pesos según el producto seleccionado
 */

// Rangos de peso válidos por producto para peso de 10 crudo
const RANGOS_PESO_CRUDO = {
    'DORITO': {min: 40, max: 42},  // Entre 40g y 42g
    'DORITOS': {minA: 40, maxA: 42, minB: 41, maxB: 43},  // Entre 40-42g lado A, 41-43g lado B
    'TSV': {min: 41, max: 43}     // Entre 41g y 43g
};

// Función para validar rangos de peso en tiempo real
function validarRangosPeso() {
    const producto = document.getElementById('create_producto').value;
    const pesoLadoA = document.getElementById('peso_lado_a');
    const pesoLadoB = document.getElementById('peso_lado_b');
    const feedbackA = document.getElementById('peso_lado_a_feedback');
    const feedbackB = document.getElementById('peso_lado_b_feedback');
    
    // Obtener los rangos para el producto seleccionado
    const rango = RANGOS_PESO_CRUDO[producto] || {min: 0, max: 100};
    
    // Manejar rangos especiales para DORITOS (diferentes en cada lado)
    if (producto === 'DORITOS') {
        // Mostrar rangos específicos para cada lado
        feedbackA.textContent = `Rango válido: ${rango.minA}g - ${rango.maxA}g`;
        feedbackA.className = 'form-text text-muted';
        
        feedbackB.textContent = `Rango válido: ${rango.minB}g - ${rango.maxB}g`;
        feedbackB.className = 'form-text text-muted';
        
        // Validar lado A con su rango específico
        if (pesoLadoA && pesoLadoA.value) {
            const valorA = parseFloat(pesoLadoA.value);
            if (!isNaN(valorA)) {
                if (valorA < rango.minA || valorA > rango.maxA) {
                    // Fuera de rango
                    pesoLadoA.classList.add('is-invalid');
                    pesoLadoA.classList.remove('is-valid');
                    feedbackA.textContent = `Fuera de rango (${rango.minA}g - ${rango.maxA}g)`;
                    feedbackA.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoA.classList.add('is-valid');
                    pesoLadoA.classList.remove('is-invalid');
                    feedbackA.textContent = `Peso válido (${rango.minA}g - ${rango.maxA}g)`;
                    feedbackA.className = 'form-text text-success';
                }
            }
        }
        
        // Validar lado B con su rango específico
        if (pesoLadoB && pesoLadoB.value) {
            const valorB = parseFloat(pesoLadoB.value);
            if (!isNaN(valorB)) {
                if (valorB < rango.minB || valorB > rango.maxB) {
                    // Fuera de rango
                    pesoLadoB.classList.add('is-invalid');
                    pesoLadoB.classList.remove('is-valid');
                    feedbackB.textContent = `Fuera de rango (${rango.minB}g - ${rango.maxB}g)`;
                    feedbackB.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoB.classList.add('is-valid');
                    pesoLadoB.classList.remove('is-invalid');
                    feedbackB.textContent = `Peso válido (${rango.minB}g - ${rango.maxB}g)`;
                    feedbackB.className = 'form-text text-success';
                }
            }
        }
    } else {
        // Para otros productos con rangos normales (mismo rango para ambos lados)
        // Mostrar el rango debajo de los campos independientemente de si hay valor
        feedbackA.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
        feedbackA.className = 'form-text text-muted';
        
        feedbackB.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
        feedbackB.className = 'form-text text-muted';
        
        // Validar lado A
        if (pesoLadoA && pesoLadoA.value) {
            const valorA = parseFloat(pesoLadoA.value);
            if (!isNaN(valorA)) {
                if (valorA < rango.min || valorA > rango.max) {
                    // Fuera de rango
                    pesoLadoA.classList.add('is-invalid');
                    pesoLadoA.classList.remove('is-valid');
                    feedbackA.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                    feedbackA.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoA.classList.add('is-valid');
                    pesoLadoA.classList.remove('is-invalid');
                    feedbackA.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                    feedbackA.className = 'form-text text-success';
                }
            }
        }
        
        // Validar lado B
        if (pesoLadoB && pesoLadoB.value) {
            const valorB = parseFloat(pesoLadoB.value);
            if (!isNaN(valorB)) {
                if (valorB < rango.min || valorB > rango.max) {
                    // Fuera de rango
                    pesoLadoB.classList.add('is-invalid');
                    pesoLadoB.classList.remove('is-valid');
                    feedbackB.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                    feedbackB.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoB.classList.add('is-valid');
                    pesoLadoB.classList.remove('is-invalid');
                    feedbackB.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                    feedbackB.className = 'form-text text-success';
                }
            }
        }
    }
}

// Función para validar rangos de peso en el formulario de edición
function validarRangosPesoEdicion() {
    const producto = document.getElementById('edit_producto').value;
    const pesoLadoA = document.getElementById('edit_peso_lado_a');
    const pesoLadoB = document.getElementById('edit_peso_lado_b');
    const feedbackA = document.getElementById('edit_peso_lado_a_feedback');
    const feedbackB = document.getElementById('edit_peso_lado_b_feedback');
    
    // Obtener los rangos para el producto seleccionado
    const rango = RANGOS_PESO_CRUDO[producto] || {min: 0, max: 100};  // Valor predeterminado si no está definido
    
    // Manejar rangos especiales para DORITOS (diferentes en cada lado)
    if (producto === 'DORITOS') {
        // Mostrar rangos específicos para cada lado
        feedbackA.textContent = `Rango válido: ${rango.minA}g - ${rango.maxA}g`;
        feedbackA.className = 'form-text text-muted';
        
        feedbackB.textContent = `Rango válido: ${rango.minB}g - ${rango.maxB}g`;
        feedbackB.className = 'form-text text-muted';
        
        // Validar lado A con su rango específico
        if (pesoLadoA && pesoLadoA.value) {
            const valorA = parseFloat(pesoLadoA.value);
            if (!isNaN(valorA)) {
                if (valorA < rango.minA || valorA > rango.maxA) {
                    // Fuera de rango
                    pesoLadoA.classList.add('is-invalid');
                    pesoLadoA.classList.remove('is-valid');
                    feedbackA.textContent = `Fuera de rango (${rango.minA}g - ${rango.maxA}g)`;
                    feedbackA.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoA.classList.add('is-valid');
                    pesoLadoA.classList.remove('is-invalid');
                    feedbackA.textContent = `Peso válido (${rango.minA}g - ${rango.maxA}g)`;
                    feedbackA.className = 'form-text text-success';
                }
            }
        }
        
        // Validar lado B con su rango específico
        if (pesoLadoB && pesoLadoB.value) {
            const valorB = parseFloat(pesoLadoB.value);
            if (!isNaN(valorB)) {
                if (valorB < rango.minB || valorB > rango.maxB) {
                    // Fuera de rango
                    pesoLadoB.classList.add('is-invalid');
                    pesoLadoB.classList.remove('is-valid');
                    feedbackB.textContent = `Fuera de rango (${rango.minB}g - ${rango.maxB}g)`;
                    feedbackB.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoB.classList.add('is-valid');
                    pesoLadoB.classList.remove('is-invalid');
                    feedbackB.textContent = `Peso válido (${rango.minB}g - ${rango.maxB}g)`;
                    feedbackB.className = 'form-text text-success';
                }
            }
        }
    } else {
        // Para otros productos con rangos normales (mismo rango para ambos lados)
        // Mostrar el rango debajo de los campos independientemente de si hay valor
        feedbackA.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
        feedbackA.className = 'form-text text-muted';
        
        feedbackB.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
        feedbackB.className = 'form-text text-muted';
        
        // Validar lado A
        if (pesoLadoA && pesoLadoA.value) {
            const valorA = parseFloat(pesoLadoA.value);
            if (!isNaN(valorA)) {
                if (valorA < rango.min || valorA > rango.max) {
                    // Fuera de rango
                    pesoLadoA.classList.add('is-invalid');
                    pesoLadoA.classList.remove('is-valid');
                    feedbackA.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                    feedbackA.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoA.classList.add('is-valid');
                    pesoLadoA.classList.remove('is-invalid');
                    feedbackA.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                    feedbackA.className = 'form-text text-success';
                }
            }
        }
        
        // Validar lado B
        if (pesoLadoB && pesoLadoB.value) {
            const valorB = parseFloat(pesoLadoB.value);
            if (!isNaN(valorB)) {
                if (valorB < rango.min || valorB > rango.max) {
                    // Fuera de rango
                    pesoLadoB.classList.add('is-invalid');
                    pesoLadoB.classList.remove('is-valid');
                    feedbackB.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                    feedbackB.className = 'form-text text-danger';
                } else {
                    // Dentro de rango
                    pesoLadoB.classList.add('is-valid');
                    pesoLadoB.classList.remove('is-invalid');
                    feedbackB.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                    feedbackB.className = 'form-text text-success';
                }
            }
        }
    }
}

// Configurar eventos de validación
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const producto = document.getElementById('create_producto');
    const pesoLadoA = document.getElementById('peso_lado_a');
    const pesoLadoB = document.getElementById('peso_lado_b');
    
    // Configurar eventos de validación para el formulario de creación
    if (producto) {
        producto.addEventListener('change', validarRangosPeso);
    }
    
    if (pesoLadoA) {
        pesoLadoA.addEventListener('input', validarRangosPeso);
    }
    
    if (pesoLadoB) {
        pesoLadoB.addEventListener('input', validarRangosPeso);
    }
    
    // Configurar eventos de validación para el formulario de edición
    const editProducto = document.getElementById('edit_producto');
    const editPesoLadoA = document.getElementById('edit_peso_lado_a');
    const editPesoLadoB = document.getElementById('edit_peso_lado_b');
    
    if (editProducto) {
        editProducto.addEventListener('change', validarRangosPesoEdicion);
    }
    
    if (editPesoLadoA) {
        editPesoLadoA.addEventListener('input', validarRangosPesoEdicion);
    }
    
    if (editPesoLadoB) {
        editPesoLadoB.addEventListener('input', validarRangosPesoEdicion);
    }
});
