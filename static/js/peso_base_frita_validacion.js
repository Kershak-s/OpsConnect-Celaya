/**
 * Script para manejar la validación de pesos de base frita según el producto
 */

// Rangos de peso válidos por producto para peso de 10 base frita
const RANGOS_PESO_BASE_FRITA = {
    'DORITO': {min: 23.5, max: 26.5},  // Entre 23.5g y 26.5g
    'TSV': {min: 24, max: 27}      // Entre 24g y 27g
};

// Función para validar rangos de peso en tiempo real para base frita
function validarRangosPesoBaseFrita() {
    const producto = document.getElementById('producto_frita').value;
    const pesoFritaA = document.getElementById('peso_frita_a');
    const pesoFrita = document.getElementById('peso_frita');
    const feedbackA = document.getElementById('peso_frita_a_feedback');
    const feedbackB = document.getElementById('peso_frita_feedback');
    
    // Obtener los rangos para el producto seleccionado
    const rango = RANGOS_PESO_BASE_FRITA[producto] || {min: 0, max: 100};
    
    // Mostrar el rango debajo de los campos independientemente de si hay valor
    feedbackA.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
    feedbackA.className = 'form-text text-muted';
    
    feedbackB.textContent = `Rango válido: ${rango.min}g - ${rango.max}g`;
    feedbackB.className = 'form-text text-muted';
    
    // Validar peso frita A
    if (pesoFritaA && pesoFritaA.value) {
        const valorA = parseFloat(pesoFritaA.value);
        if (!isNaN(valorA)) {
            if (valorA < rango.min || valorA > rango.max) {
                // Fuera de rango
                pesoFritaA.classList.add('is-invalid');
                pesoFritaA.classList.remove('is-valid');
                feedbackA.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                feedbackA.className = 'form-text text-danger';
            } else {
                // Dentro de rango
                pesoFritaA.classList.add('is-valid');
                pesoFritaA.classList.remove('is-invalid');
                feedbackA.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                feedbackA.className = 'form-text text-success';
            }
        }
    }
    
    // Validar peso frita B
    if (pesoFrita && pesoFrita.value) {
        const valorB = parseFloat(pesoFrita.value);
        if (!isNaN(valorB)) {
            if (valorB < rango.min || valorB > rango.max) {
                // Fuera de rango
                pesoFrita.classList.add('is-invalid');
                pesoFrita.classList.remove('is-valid');
                feedbackB.textContent = `Fuera de rango (${rango.min}g - ${rango.max}g)`;
                feedbackB.className = 'form-text text-danger';
            } else {
                // Dentro de rango
                pesoFrita.classList.add('is-valid');
                pesoFrita.classList.remove('is-invalid');
                feedbackB.textContent = `Peso válido (${rango.min}g - ${rango.max}g)`;
                feedbackB.className = 'form-text text-success';
            }
        }
    }
}

// Configurar eventos de validación
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM para base frita
    const productoFrita = document.getElementById('producto_frita');
    const pesoFritaA = document.getElementById('peso_frita_a');
    const pesoFrita = document.getElementById('peso_frita');
    
    // Configurar eventos de validación para el formulario de base frita
    if (productoFrita) {
        productoFrita.addEventListener('change', validarRangosPesoBaseFrita);
    }
    
    if (pesoFritaA) {
        pesoFritaA.addEventListener('input', validarRangosPesoBaseFrita);
    }
    
    if (pesoFrita) {
        pesoFrita.addEventListener('input', validarRangosPesoBaseFrita);
    }
});
