/**
 * PAE Percentage Calculator
 * Calcula automáticamente el porcentaje dividiendo el valor entre 200
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 PAE Percentage Calculator - Iniciando...');
    
    // Función para calcular y mostrar el porcentaje
    function calcularPorcentaje(input) {
        const valor = parseFloat(input.value);
        const container = input.parentElement;
        let percentageSpan = container.querySelector('.percentage-display');
        
        if (percentageSpan) {
            if (!input.value || isNaN(valor)) {
                percentageSpan.textContent = '0.00%';
            } else {
                const porcentaje = (valor / 200) * 100;
                percentageSpan.textContent = porcentaje.toFixed(2) + '%';
            }
        }
    }
    
    // Procesar todos los campos numéricos con data-type
    const inputsCantidad = document.querySelectorAll('.attribute-table input[type="number"][data-type]');
    
    console.log(`🔍 Campos encontrados: ${inputsCantidad.length}`);
    
    inputsCantidad.forEach((input, index) => {
        // Verificar si ya tiene el span de porcentaje
        const parentTd = input.closest('td');
        
        if (!parentTd.querySelector('.percentage-display')) {
            // Crear contenedor flex si no existe
            if (input.parentElement.tagName === 'TD') {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.gap = '10px';
                container.style.alignItems = 'center';
                container.style.width = '100%';
                
                // Mover el input al contenedor
                input.parentElement.insertBefore(container, input);
                container.appendChild(input);
                
                // Ajustar ancho del input
                input.style.flex = '1';
                input.style.minWidth = '150px';
                
                // Crear span para mostrar el porcentaje
                const percentageSpan = document.createElement('span');
                percentageSpan.className = 'percentage-display';
                percentageSpan.textContent = '0.00%';
                
                container.appendChild(percentageSpan);
                
                console.log(`✅ Campo ${index + 1} configurado`);
            }
        }
        
        // Agregar event listeners
        input.addEventListener('input', () => calcularPorcentaje(input));
        input.addEventListener('change', () => calcularPorcentaje(input));
        
        // Calcular porcentaje inicial si hay valor
        if (input.value) {
            calcularPorcentaje(input);
        }
    });
    
    console.log(`✅ ${inputsCantidad.length} campos configurados con cálculo de porcentaje`);
});
