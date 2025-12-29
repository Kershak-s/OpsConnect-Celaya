// JavaScript para validación de campos PAE
document.addEventListener('DOMContentLoaded', function() {
    console.log("PAE-validation inicializado");
    
    // 1. Obtener todos los campos con data-type
    let allTypedInputs = document.querySelectorAll('input[data-type]');
    
    // 2. Función para aplicar colores a campos (rojo si > 1, verde si <= 1)
    function colorearInput(input) {
        if (!input) return;
        
        let valor = parseInt(input.value) || 0;
        if (valor > 1) {
            // Rojo para valores mayores a 1
            input.style.backgroundColor = '#f8d7da';
            input.style.borderColor = '#f5c6cb';
            input.style.color = '#721c24';
            input.classList.remove('input-value-ok');
            input.classList.add('input-value-error');
        } else {
            // Verde para valores 0 o 1
            input.style.backgroundColor = '#d4edda';
            input.style.borderColor = '#c3e6cb';
            input.style.color = '#155724';
            input.classList.remove('input-value-error');
            input.classList.add('input-value-ok');
        }
    }

    // 3. Agregar eventos a todos los campos con data-type
    allTypedInputs.forEach(input => {
        // Aplicar color inicial si ya tiene un valor
        if (input.value) {
            colorearInput(input);
        }
        
        // Agregar evento para cambios en tiempo real
        input.addEventListener('input', function() { 
            colorearInput(this);
        });
        
        // Agregar evento para cuando se pierde el foco
        input.addEventListener('blur', function() {
            colorearInput(this);
        });
    });
    
    // 4. Hacer lo mismo con cualquier campo de tipo number sin data-type
    let otherNumberInputs = document.querySelectorAll('input[type="number"]:not([data-type])');
    otherNumberInputs.forEach(input => {
        // Aplicar color inicial si ya tiene un valor
        if (input.value) {
            colorearInput(input);
        }
        
        // Agregar evento para cambios en tiempo real
        input.addEventListener('input', function() { 
            colorearInput(this);
        });
        
        // Agregar evento para cuando se pierde el foco
        input.addEventListener('blur', function() {
            colorearInput(this);
        });
    });
    
    // 5. Verificar todos los campos cuando se carga la página
    setTimeout(function() {
        console.log("Verificando todos los campos inicialmente");
        allTypedInputs.forEach(input => {
            colorearInput(input);
        });
    }, 500);
});