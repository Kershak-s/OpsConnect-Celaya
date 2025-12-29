/**
 * Script para validar y manejar el campo de hora de registro en la página PAE
 */
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos
    const horaRegistroInput = document.getElementById('hora_registro');
    const horaRegistroHidden = document.getElementById('hora_registro_hidden');
    const turnoIndicator = document.querySelector('.pae-form-subtitle');
    const formElement = document.querySelector('form');
    
    if (!horaRegistroInput || !horaRegistroHidden) return;
    
    // Determinar el turno actual
    const turnoActual = turnoIndicator ? 
        (turnoIndicator.textContent.includes('Turno A') ? 'A' : 'B') : 
        null;
    
    // Establecer la hora actual como valor por defecto
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    // Validar si la hora actual está dentro del rango permitido
    let timeIsValid = false;
    
    if (turnoActual === 'A') {
        // Turno A: 6:30 a 18:29
        timeIsValid = isTimeInRange(currentTime, '06:30', '18:29');
    } else if (turnoActual === 'B') {
        // Turno B: 18:30 a 6:29 (cruza medianoche)
        timeIsValid = isTimeInRangeAcrossMidnight(currentTime, '18:30', '06:29');
    }
    
    // Establecer hora válida
    if (timeIsValid) {
        horaRegistroInput.value = currentTime;
    } else {
        // Si la hora actual no es válida, establecer un valor predeterminado según el turno
        horaRegistroInput.value = turnoActual === 'A' ? '06:30' : '18:30';
    }
    
    // Inicializar el campo oculto con el valor inicial
    horaRegistroHidden.value = horaRegistroInput.value;
    
    // Desactivar los mensajes de validación nativa del navegador
    if (horaRegistroInput) {
        // Eliminar los atributos min y max que activan la validación estándar
        horaRegistroInput.removeAttribute('min');
        horaRegistroInput.removeAttribute('max');
        
        // Suprimir la validación por defecto para este campo
        horaRegistroInput.addEventListener('invalid', function(e) {
            e.preventDefault();
            return false;
        }, true);
    }
    
    // Agregar atributo novalidate al formulario
    if (formElement && !formElement.hasAttribute('novalidate')) {
        formElement.setAttribute('novalidate', '');
    }
    
    // Validar el valor cuando cambia
    horaRegistroInput.addEventListener('change', function() {
        validateTimeInput(this, turnoActual);
        // Actualizar el campo oculto cuando cambia el valor visible
        horaRegistroHidden.value = this.value;
    });
    
    // Asegurar que el valor del campo se transfiera al oculto antes de enviar el formulario
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            horaRegistroHidden.value = horaRegistroInput.value;
            // Validar una vez más antes de enviar para asegurarnos
            validateTimeInput(horaRegistroInput, turnoActual);
        });
    }
    
    // Estilizar la visualización para móviles si es necesario
    if (window.innerWidth < 768) {
        const timeDisplay = document.querySelector('.pae-time-display');
        if (timeDisplay) {
            timeDisplay.style.top = 'auto';
            timeDisplay.style.bottom = '1rem';
        }
    }
    
    // Función para validar el input de tiempo
    function validateTimeInput(input, turno) {
        if (!input || !turno) return;
        
        const timeValue = input.value;
        let isValid = false;
        
        if (turno === 'A') {
            isValid = isTimeInRange(timeValue, '06:30', '18:29');
            
            if (!isValid) {
                alert('La hora debe estar entre 6:30 y 18:29 para el Turno A.');
                input.value = '06:30'; // Valor predeterminado para turno A
                horaRegistroHidden.value = input.value; // Actualizar campo oculto
            }
        } else {
            // Turno B: 18:30 a 6:29 (cruza medianoche)
            // Comprobar si la hora está en el rango de la tarde (18:30-23:59) o de la mañana (00:00-06:29)
            isValid = (timeValue >= '18:30' && timeValue <= '23:59') || (timeValue >= '00:00' && timeValue <= '06:29');
            
            if (!isValid) {
                alert('La hora debe estar entre 18:30 y 6:29 para el Turno B.');
                input.value = '18:30'; // Valor predeterminado para turno B
                horaRegistroHidden.value = input.value; // Actualizar campo oculto
            }
        }
    }
    
    // Verificar si una hora está dentro de un rango (sin cruzar medianoche)
    function isTimeInRange(time, minTime, maxTime) {
        return time >= minTime && time <= maxTime;
    }
    
    // Verificar si una hora está dentro de un rango que cruza la medianoche
    function isTimeInRangeAcrossMidnight(time, startTime, endTime) {
        if (startTime <= endTime) {
            return time >= startTime && time <= endTime;
        } else {
            // Corrección para el turno B (18:30 - 06:29)
            return time >= startTime || (time >= '00:00' && time <= endTime);
        }
    }
});
