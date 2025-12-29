/**
 * Modificador de horarios para turnos A y B
 * Este script agrega un mensaje informativo sobre los horarios permitidos según el turno
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en una página que necesita la validación de horarios
    const hasTurnoSelect = document.querySelector('select[name="turno"]');
    if (!hasTurnoSelect) return;
    
    // No mostrar el mensaje en la página de PNC Simple
    if (window.location.href.includes('/pnc_simple')) {
        console.log('Omitiendo mensaje de horario en PNC Simple');
        return;
    }
    
    // Crear el elemento para mostrar el horario válido
    const horarioInfoBox = document.createElement('div');
    horarioInfoBox.className = 'horario-info-box';
    
    // Insertar después del selector de turno
    const turnoFormGroup = hasTurnoSelect.closest('.form-group') || hasTurnoSelect.closest('.mb-3');
    if (turnoFormGroup) {
        turnoFormGroup.after(horarioInfoBox);
    } else {
        // Si no encontramos el grupo del formulario, intentar insertarlo después del selector directamente
        hasTurnoSelect.parentNode.appendChild(horarioInfoBox);
    }
    
    // Función para actualizar el mensaje según el turno seleccionado
    function updateHorarioMessage(turno) {
        if (turno === 'A') {
            horarioInfoBox.textContent = 'Turno Válido: 6:30 am - 18:29 pm';
            horarioInfoBox.className = 'horario-info-box horario-info-turno-a';
        } else {
            horarioInfoBox.textContent = 'Turno Válido: 18:30 pm - 6:29 am';
            horarioInfoBox.className = 'horario-info-box horario-info-turno-b';
        }
    }
    
    // Establecer mensaje inicial basado en el turno seleccionado
    updateHorarioMessage(hasTurnoSelect.value);
    
    // Actualizar el mensaje cuando cambie el turno
    hasTurnoSelect.addEventListener('change', function() {
        updateHorarioMessage(this.value);
    });
});
