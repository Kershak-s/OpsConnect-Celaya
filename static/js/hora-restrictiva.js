/**
 * Hora Restrictiva - Controlador para selectores de tiempo basados en turnos
 * Este script restringe los valores de hora según el turno seleccionado:
 * - Turno A: 6:30 am a 18:29 pm
 * - Turno B: 18:30 pm a 6:29 am
 */

document.addEventListener('DOMContentLoaded', function() {
    // Aplicar validación de horas a todos los inputs de tipo "time" en la página
    initHoraRestrictiva();
    
    // Función para inicializar la restricción de horarios
    function initHoraRestrictiva() {
        // Verificar si estamos en la página de PNC Simple
        const isPNCSimplePage = window.location.href.includes('/pnc_simple');
        if (!isPNCSimplePage) return;
        
        // Selectores para el modal de creación
        const createTurnoSelect = document.querySelector('#createPNCModal select[name="turno"]');
        const createHoraInicio = document.querySelector('#createPNCModal input[name="hora_inicio"]');
        const createHoraFin = document.querySelector('#createPNCModal input[name="hora_fin"]');
        
        // Selectores para el modal de edición
        const editTurnoSelect = document.querySelector('#editPNCModal select[name="turno"]');
        const editHoraInicio = document.querySelector('#editPNCModal input[name="hora_inicio"]');
        const editHoraFin = document.querySelector('#editPNCModal input[name="hora_fin"]');
        
        // Añadir tooltips informativos a los inputs de hora
        addTooltips(createHoraInicio, createHoraFin, createTurnoSelect);
        addTooltips(editHoraInicio, editHoraFin, editTurnoSelect);
        
        // Aplicar restricciones al cambiar el turno o al validar los campos de hora
        if (createTurnoSelect && createHoraInicio && createHoraFin) {
            // Establecer valores iniciales
            applyHoraRestrictions(createTurnoSelect.value, createHoraInicio, createHoraFin);
            
            // Escuchar cambios en el turno
            createTurnoSelect.addEventListener('change', function() {
                applyHoraRestrictions(this.value, createHoraInicio, createHoraFin);
                updateTooltips(createHoraInicio, createHoraFin, this.value);
            });
            
            // Validar al cambiar los valores de hora
            createHoraInicio.addEventListener('change', function() {
                validateHoraValue(this, createTurnoSelect.value, 'inicio');
            });
            
            createHoraFin.addEventListener('change', function() {
                validateHoraValue(this, createTurnoSelect.value, 'fin');
            });
        }
        
        // Aplicar las mismas restricciones al modal de edición
        if (editTurnoSelect && editHoraInicio && editHoraFin) {
            // Establecer valores iniciales (se llamará cuando se abra el modal)
            editTurnoSelect.addEventListener('change', function() {
                applyHoraRestrictions(this.value, editHoraInicio, editHoraFin);
                updateTooltips(editHoraInicio, editHoraFin, this.value);
            });
            
            // Validar al cambiar los valores de hora
            editHoraInicio.addEventListener('change', function() {
                validateHoraValue(this, editTurnoSelect.value, 'inicio');
            });
            
            editHoraFin.addEventListener('change', function() {
                validateHoraValue(this, editTurnoSelect.value, 'fin');
            });
            
            // Aplicar restricciones cuando se abra el modal de edición
            const editModal = document.getElementById('editPNCModal');
            if (editModal) {
                editModal.addEventListener('shown.bs.modal', function() {
                    applyHoraRestrictions(editTurnoSelect.value, editHoraInicio, editHoraFin);
                    updateTooltips(editHoraInicio, editHoraFin, editTurnoSelect.value);
                });
            }
        }
    }
    
    // Función para añadir tooltips informativos a los campos de hora
    function addTooltips(horaInicioInput, horaFinInput, turnoSelect) {
        // Desactivamos la creación de tooltips
        return;
    }
    
    // Función para actualizar el texto de los tooltips según el turno
    function updateTooltips(horaInicioInput, horaFinInput, turno) {
        // Desactivamos la actualización de tooltips
        return;
    }
    
    // Función para aplicar restricciones de horario según el turno
    function applyHoraRestrictions(turno, horaInicioInput, horaFinInput) {
        // Definir los rangos de horas según el turno
        let minHora, maxHora;
        
        if (turno === 'A') {
            // Turno A: 6:30 a 18:29
            minHora = '06:30';
            maxHora = '18:29';
            
            // Establecer valores predeterminados si están fuera de rango
            if (!isHoraInRange(horaInicioInput.value, minHora, maxHora)) {
                horaInicioInput.value = '06:30';
            }
            if (!isHoraInRange(horaFinInput.value, minHora, maxHora)) {
                horaFinInput.value = '18:29';
            }
        } else {
            // Turno B: 18:30 a 6:29
            // Nota: Este caso es especial porque cruza la medianoche
            
            // Establecer valores predeterminados si están fuera de rango
            if (!isHoraInTurnoB(horaInicioInput.value)) {
                horaInicioInput.value = '18:30';
            }
            if (!isHoraInTurnoB(horaFinInput.value)) {
                horaFinInput.value = '06:29';
            }
        }
        
        // Aplicar clases de validación visual
        validateHoraVisually(horaInicioInput, turno);
        validateHoraVisually(horaFinInput, turno);
    }
    
    // Función para validar visualmente un campo de hora
    function validateHoraVisually(input, turno) {
        if (!input) return;
        
        // Eliminar clases previas
        input.classList.remove('time-input-valid', 'time-input-invalid');
        
        // Validar según el turno
        let isValid = false;
        
        if (turno === 'A') {
            isValid = isHoraInRange(input.value, '06:30', '18:29');
        } else {
            isValid = isHoraInTurnoB(input.value);
        }
        
        // Aplicar clase según validación
        if (isValid) {
            input.classList.add('time-input-valid');
        } else {
            input.classList.add('time-input-invalid');
        }
    }
    
    // Función para validar que una hora esté dentro del rango especificado
    function isHoraInRange(horaValue, minHora, maxHora) {
        if (!horaValue) return false;
        
        return horaValue >= minHora && horaValue <= maxHora;
    }
    
    // Función especial para validar horas en el turno B (que cruza la medianoche)
    function isHoraInTurnoB(horaValue) {
        if (!horaValue) return false;
        
        // Turno B: 18:30 a 6:29
        return (horaValue >= '18:30' && horaValue <= '23:59') || 
               (horaValue >= '00:00' && horaValue <= '06:29');
    }
    
    // Función para validar y corregir un valor de hora según el turno
    function validateHoraValue(input, turno, tipo) {
        if (!input) return;
        
        let isValid = false;
        let correctedValue = '';
        
        if (turno === 'A') {
            // Turno A: 6:30 a 18:29
            isValid = isHoraInRange(input.value, '06:30', '18:29');
            correctedValue = tipo === 'inicio' ? '06:30' : '18:29';
        } else {
            // Turno B: 18:30 a 6:29
            isValid = isHoraInTurnoB(input.value);
            correctedValue = tipo === 'inicio' ? '18:30' : '06:29';
        }
        
        // Si no es válido, corregir y mostrar alerta
        if (!isValid) {
            input.value = correctedValue;
            
            const turnoText = turno === 'A' ? 'Turno A (6:30 am - 18:29 pm)' : 'Turno B (18:30 pm - 6:29 am)';
            alert(`El horario seleccionado no es válido para el ${turnoText}. Se ha ajustado automáticamente.`);
        }
        
        // Aplicar validación visual
        validateHoraVisually(input, turno);
    }
});
