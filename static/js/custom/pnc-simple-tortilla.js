/**
 * Personalización para PNC Simple - TORTILLA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de TORTILLA
    const currentUrl = window.location.href;
    if (currentUrl.includes('/pnc_simple/TORTILLA')) {
        // -----------------------------------------------
        // 1. Actualizar las opciones de ORIGEN para TORTILLA
        // -----------------------------------------------
        const origenSelects = document.querySelectorAll('#createOrigen, #editOrigen');
        
        if (origenSelects.length > 0) {
            origenSelects.forEach(select => {
                // Eliminar todas las opciones actuales
                while (select.firstChild) {
                    select.removeChild(select.firstChild);
                }
                
                // Añadir primero la opción con un guión
                const dashOption = document.createElement('option');
                dashOption.value = '';
                dashOption.textContent = '-';
                select.appendChild(dashOption);
                
                // Agregar las nuevas opciones específicas para TORTILLA
                const tortillaOptions = [
                    "COCIMIENTO",
                    "FREIDOR",
                    "LIMPIEZA DE MAIZ",
                    "MOLINO/LAMINADOR",
                    "SAZONADO",
                    "EMPAQUE GENERAL"
                ];
                
                tortillaOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });
            });
        }
        
        // -----------------------------------------------
        // 2. Aplicar restricciones al campo CANTIDAD
        // -----------------------------------------------
        const cantidadInputs = document.querySelectorAll('#createCantidad, #editCantidad');
        cantidadInputs.forEach(input => {
            // Configurar para solo permitir números y 3 decimales
            input.setAttribute('step', '0.001');
            input.setAttribute('min', '0');
            input.style.textAlign = 'center';
            
            // Aplicar el formato
            input.addEventListener('input', function() {
                // Asegurar que solo tenga 3 decimales
                const value = this.value;
                if (value.includes('.')) {
                    const parts = value.split('.');
                    if (parts[1].length > 3) {
                        this.value = parts[0] + '.' + parts[1].substring(0, 3);
                    }
                }
            });
        });

        // -----------------------------------------------
        // 3. Actualizar el menú desplegable de RECHAZO a NO, SÍ
        // -----------------------------------------------
        const rechazoSelects = document.querySelectorAll('#createRechazo, #editRechazo');
        
        if (rechazoSelects.length > 0) {
            rechazoSelects.forEach(select => {
                // Eliminar todas las opciones actuales
                while (select.firstChild) {
                    select.removeChild(select.firstChild);
                }
                
                // Añadir primero la opción con un guión
                const dashOption = document.createElement('option');
                dashOption.value = '';
                dashOption.textContent = '-';
                select.appendChild(dashOption);
                
                // Agregar las nuevas opciones en el orden solicitado
                const options = [
                    { value: "false", text: "NO" },
                    { value: "true", text: "SÍ" }
                ];
                
                options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    select.appendChild(optionElement);
                });
            });
        }

        // -----------------------------------------------
        // 4. Manejar campo de UNIDAD OTRO
        // -----------------------------------------------
        // Configuramos los event listeners para los selects de unidad
        const unidadSelects = document.querySelectorAll('#createUnidadCantidad, #editUnidadCantidad');
        
        unidadSelects.forEach(select => {
            // Agregar opción "OTRO" si no existe
            let otroExists = false;
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === 'OTRO') {
                    otroExists = true;
                    break;
                }
            }
            
            if (!otroExists) {
                const otroOption = document.createElement('option');
                otroOption.value = 'OTRO';
                otroOption.textContent = 'OTRO';
                select.appendChild(otroOption);
            }
            
            // Añadir el event listener para mostrar/ocultar el campo personalizado
            select.addEventListener('change', function() {
                // Determinar qué contenedor y campo usar basado en el ID del select
                const prefix = select.id.includes('create') ? 'create' : 'edit';
                const containerId = `${prefix}OtraUnidadContainer`;
                const inputId = `${prefix}OtraUnidad`;
                
                // Mostrar u ocultar el campo según la selección
                const container = document.getElementById(containerId);
                if (container) {
                    if (this.value === 'OTRO') {
                        container.style.display = 'block';
                        const input = document.getElementById(inputId);
                        if (input) {
                            setTimeout(() => input.focus(), 100);
                        }
                    } else {
                        container.style.display = 'none';
                    }
                }
            });
            
            // Inicializar estado - comprobar si "OTRO" ya está seleccionado
            if (select.value === 'OTRO') {
                const prefix = select.id.includes('create') ? 'create' : 'edit';
                const container = document.getElementById(`${prefix}OtraUnidadContainer`);
                if (container) {
                    container.style.display = 'block';
                }
            }
        });

        // -----------------------------------------------
        // 5. Actualizar el FOLIO con la fecha seleccionada
        // -----------------------------------------------
        // Para el formulario de creación
        const createFechaInput = document.getElementById('createFecha');
        if (createFechaInput) {
            createFechaInput.addEventListener('change', function() {
                generateFolio();
            });
        }
        
        // Para el formulario de edición
        const editFechaInput = document.getElementById('editFecha');
        if (editFechaInput) {
            editFechaInput.addEventListener('change', function() {
                updateEditFolio();
            });
        }

        // -----------------------------------------------
        // 6. Configurar los menús desplegables de horas y minutos
        // -----------------------------------------------
        // Inicializar selectores de hora y minuto
        initializeTimeSelects();
        
        // Configurar los eventos de cambio para actualizar el horario
        setupHorarioUpdates();
        
        // Manejar cambios en el select de turno
        setupTurnoChanges();
    }
});

// -----------------------------------------------
// Inicializar selectores de hora y minuto con opciones
// -----------------------------------------------
function initializeTimeSelects() {
    // Generar opciones para minutos (00-59)
    const minutoSelects = document.querySelectorAll('#createHoraInicioM, #createHoraFinM, #editHoraInicioM, #editHoraFinM');
    minutoSelects.forEach(select => {
        // Limpiar opciones existentes
        while (select.options.length > 0) {
            select.remove(0);
        }
        // Añadir opción placeholder
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '-';
        select.appendChild(placeholderOption);
        // Añadir todas las opciones de minutos (00-59)
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = String(i).padStart(2, '0');
            option.textContent = String(i).padStart(2, '0');
            select.appendChild(option);
        }
    });

    // Para el formulario de creación
    if (document.getElementById('createHoraInicioH')) {
        // Las horas se cargarán según el turno seleccionado
        let turnoSelect = document.getElementById('createTurno') ||
            document.querySelector('#createPNCModal select[name="turno"]');
        let turno = turnoSelect ? turnoSelect.value : '';
        if (turno === 'A' || turno === 'B') {
            updateHoraSelectsBasedOnTurno('create');
        } else {
            // Si no hay turno, llenar con 00-23
            const horaSelects = document.querySelectorAll('#createHoraInicioH, #createHoraFinH');
            horaSelects.forEach(select => {
                while (select.options.length > 0) {
                    select.remove(0);
                }
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = '-';
                select.appendChild(placeholderOption);
                for (let i = 0; i < 24; i++) {
                    const option = document.createElement('option');
                    option.value = String(i).padStart(2, '0');
                    option.textContent = String(i).padStart(2, '0');
                    select.appendChild(option);
                }
            });
        }
        // Establecer valores vacíos por defecto
        document.getElementById('createHoraInicioM').value = '';
        document.getElementById('createHoraFinM').value = '';
        updateHorarioBasedOnTurno('create');
    }

    // Para el formulario de edición
    if (document.getElementById('editHoraInicioH')) {
        let turnoSelect = document.getElementById('editTurno');
        let turno = turnoSelect ? turnoSelect.value : '';
        if (turno === 'A' || turno === 'B') {
            updateHoraSelectsBasedOnTurno('edit');
        } else {
            // Si no hay turno, llenar con 00-23
            const horaSelects = document.querySelectorAll('#editHoraInicioH, #editHoraFinH');
            horaSelects.forEach(select => {
                while (select.options.length > 0) {
                    select.remove(0);
                }
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = '-';
                select.appendChild(placeholderOption);
                for (let i = 0; i < 24; i++) {
                    const option = document.createElement('option');
                    option.value = String(i).padStart(2, '0');
                    option.textContent = String(i).padStart(2, '0');
                    select.appendChild(option);
                }
            });
        }
        // Establecer valores vacíos por defecto
        document.getElementById('editHoraInicioM').value = '';
        document.getElementById('editHoraFinM').value = '';
        updateHorarioBasedOnTurno('edit');
    }
}

// -----------------------------------------------
// Actualiza los selectores de hora según el turno seleccionado
// -----------------------------------------------
function updateHoraSelectsBasedOnTurno(formType) {
    const prefix = formType === 'create' ? 'create' : 'edit';
    const turnoSelect = document.getElementById(`${prefix}Turno`) || 
                        document.querySelector(`#${prefix}PNCModal select[name="turno"]`);
    const turno = turnoSelect ? turnoSelect.value : ''; // Por defecto vacío si no hay selección
    
    // Obtener los selectores de hora
    const horaSelects = document.querySelectorAll(`#${prefix}HoraInicioH, #${prefix}HoraFinH`);
    
    horaSelects.forEach(select => {
        // Limpiar opciones existentes
        while (select.options.length > 0) {
            select.remove(0);
        }
        
        // Añadir opción placeholder/vacía
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '-';
        select.appendChild(placeholderOption);
        
        // Si no hay turno seleccionado, no añadir más opciones
        if (!turno) {
            select.value = '';
            return;
        }
        
        // Determinar rango de horas basado en el turno
        if (turno === 'A') {
        // Turno A: Solo horas de 6 a 18
        for (let i = 6; i <= 18; i++) {
        const option = document.createElement('option');
        option.value = String(i).padStart(2, '0');
        option.textContent = String(i).padStart(2, '0');
        select.appendChild(option);
        }
        
        // Establecer valores predeterminados para turno A
        if (select.id === `${prefix}HoraInicioH`) {
        select.value = '06';
        } else {
        select.value = '18';
        }
        } else if (turno === 'B') { // Turno B
        // Turno B: Orden específico: 18,19,20,21,22,23,24,12,1,2,3,4,5,6
        const horasOrdenadas = [18,19,20,21,22,23,24,12,1,2,3,4,5,6];
        
        horasOrdenadas.forEach(hora => {
        const option = document.createElement('option');
        // Manejo especial para 24 (que en realidad es 0)
        if (hora === 24) {
                option.value = '00';
                option.textContent = '24';
            } else {
                option.value = String(hora).padStart(2, '0');
            option.textContent = String(hora).padStart(2, '0');
        }
        select.appendChild(option);
        });
            
            // Establecer valores predeterminados para turno B
            if (select.id === `${prefix}HoraInicioH`) {
                select.value = '18';
            } else {
                select.value = '06';
            }
        }
    });
}

// -----------------------------------------------
// Manejar cambios en los selectores de hora y minuto
// -----------------------------------------------
function setupHorarioUpdates() {
    // Para el formulario de creación
    const createTimeSelects = document.querySelectorAll('#createHoraInicioH, #createHoraInicioM, #createHoraFinH, #createHoraFinM');
    createTimeSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateCreateHorario();
            validateHorarioRanges('create');
        });
    });
    
    // Para el formulario de edición
    const editTimeSelects = document.querySelectorAll('#editHoraInicioH, #editHoraInicioM, #editHoraFinH, #editHoraFinM');
    editTimeSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateEditHorario();
            validateHorarioRanges('edit');
        });
    });
    
    // Inicializar los campos de horario al cargar
    if (document.getElementById('createHorario')) {
        updateCreateHorario();
    }
}

// -----------------------------------------------
// Actualizar el campo oculto de horario en el formulario de creación
// -----------------------------------------------
function updateCreateHorario() {
    const horaInicioH = document.getElementById('createHoraInicioH').value;
    const horaInicioM = document.getElementById('createHoraInicioM').value;
    const horaFinH = document.getElementById('createHoraFinH').value;
    const horaFinM = document.getElementById('createHoraFinM').value;
    
    if (horaInicioH && horaInicioM && horaFinH && horaFinM) {
        const horarioInicio = `${horaInicioH}:${horaInicioM}`;
        const horarioFin = `${horaFinH}:${horaFinM}`;
        
        // Actualizar el campo oculto de horario
        const horarioInput = document.getElementById('createHorario');
        if (horarioInput) {
            horarioInput.value = `${horarioInicio} - ${horarioFin}`;
        } else {
            // Si no existe, crear el campo oculto
            const newHorarioInput = document.createElement('input');
            newHorarioInput.type = 'hidden';
            newHorarioInput.id = 'createHorario';
            newHorarioInput.name = 'horario';
            newHorarioInput.value = `${horarioInicio} - ${horarioFin}`;
            document.getElementById('createPNCForm').appendChild(newHorarioInput);
        }
    }
}

// -----------------------------------------------
// Actualizar el campo oculto de horario en el formulario de edición
// -----------------------------------------------
function updateEditHorario() {
    const horaInicioH = document.getElementById('editHoraInicioH').value;
    const horaInicioM = document.getElementById('editHoraInicioM').value;
    const horaFinH = document.getElementById('editHoraFinH').value;
    const horaFinM = document.getElementById('editHoraFinM').value;
    
    if (horaInicioH && horaInicioM && horaFinH && horaFinM) {
        const horarioInicio = `${horaInicioH}:${horaInicioM}`;
        const horarioFin = `${horaFinH}:${horaFinM}`;
        
        // Actualizar el campo oculto de horario
        const horarioInput = document.getElementById('editHorario');
        if (horarioInput) {
            horarioInput.value = `${horarioInicio} - ${horarioFin}`;
        }
    }
}

// -----------------------------------------------
// Descomponer un horario en formato "HH:MM - HH:MM" en componentes
// -----------------------------------------------
function parseHorario(horario) {
    const result = {
        inicioHora: '',
        inicioMinuto: '00',
        finHora: '',
        finMinuto: '00'
    };
    
    if (horario) {
        const parts = horario.split(' - ');
        if (parts.length === 2) {
            const inicioTime = parts[0].split(':');
            const finTime = parts[1].split(':');
            
            if (inicioTime.length >= 2) {
                result.inicioHora = inicioTime[0];
                result.inicioMinuto = inicioTime[1];
            }
            
            if (finTime.length >= 2) {
                result.finHora = finTime[0];
                result.finMinuto = finTime[1];
            }
        }
    }
    
    return result;
}



// -----------------------------------------------
// Manejar cambios en el turno seleccionado
// -----------------------------------------------
function setupTurnoChanges() {
    // Para el formulario de creación
    const createTurnoSelect = document.querySelector('#createPNCModal select[name="turno"]');
    if (createTurnoSelect) {
        createTurnoSelect.addEventListener('change', function() {
            // Actualizar opciones de hora basadas en el nuevo turno
            updateHoraSelectsBasedOnTurno('create');
            // Luego actualizar el horario
            updateHorarioBasedOnTurno('create');
        });
    }
    
    // Para el formulario de edición
    const editTurnoSelect = document.getElementById('editTurno');
    if (editTurnoSelect) {
        editTurnoSelect.addEventListener('change', function() {
            // Actualizar opciones de hora basadas en el nuevo turno
            updateHoraSelectsBasedOnTurno('edit');
            // Luego actualizar el horario
            updateHorarioBasedOnTurno('edit');
        });
    }
}

// -----------------------------------------------
// Actualizar los horarios según el turno seleccionado
// -----------------------------------------------
function updateHorarioBasedOnTurno(formType) {
    // Determinar los selectores según el formulario
    const prefix = formType === 'create' ? 'create' : 'edit';
    const turnoSelect = document.getElementById(`${prefix}Turno`) || 
                        document.querySelector(`#${prefix}PNCModal select[name="turno"]`);
    
    const horaInicioH = document.getElementById(`${prefix}HoraInicioH`);
    const horaInicioM = document.getElementById(`${prefix}HoraInicioM`);
    const horaFinH = document.getElementById(`${prefix}HoraFinH`);
    const horaFinM = document.getElementById(`${prefix}HoraFinM`);
    
    // Obtener el turno seleccionado
    const turno = turnoSelect.value;
    
    // Aplicar restricciones según el turno
    if (turno === 'A') {
        // Turno A: De 6:30 am a 18:29 pm
        // Establecer valores por defecto si no están en el rango válido
        const horaInicioActual = parseInt(horaInicioH.value || '0');
        const minInicioActual = parseInt(horaInicioM.value || '0');
        
        const horaFinActual = parseInt(horaFinH.value || '0');
        const minFinActual = parseInt(horaFinM.value || '0');
        
        // Verificar si el horario de inicio está fuera del rango del turno A
        if (horaInicioActual < 6 || horaInicioActual > 18 || 
            (horaInicioActual === 6 && minInicioActual < 30) || 
            (horaInicioActual === 18 && minInicioActual >= 30)) {
            horaInicioH.value = '06';
            horaInicioM.value = '30';
        }
        
        // Verificar si el horario de fin está fuera del rango del turno A
        if (horaFinActual < 6 || horaFinActual > 18 || 
            (horaFinActual === 6 && minFinActual < 30) || 
            (horaFinActual === 18 && minFinActual >= 30)) {
            horaFinH.value = '18';
            horaFinM.value = '29';
        }
    } else if (turno === 'B') { // Turno B
        // Turno B: De 18:30 pm a 6:29 am
        // Establecer valores por defecto si no están en el rango válido
        const horaInicioActual = parseInt(horaInicioH.value || '0');
        const minInicioActual = parseInt(horaInicioM.value || '0');
        
        const horaFinActual = parseInt(horaFinH.value || '0');
        const minFinActual = parseInt(horaFinM.value || '0');
        
        // Verificar si el horario está dentro del rango del turno A
        const isInicioEnTurnoA = (horaInicioActual > 6 && horaInicioActual < 18) || 
                                (horaInicioActual === 6 && minInicioActual >= 30) || 
                                (horaInicioActual === 18 && minInicioActual < 30);
        
        const isFinEnTurnoA = (horaFinActual > 6 && horaFinActual < 18) || 
                            (horaFinActual === 6 && minFinActual >= 30) || 
                            (horaFinActual === 18 && minFinActual < 30);
        
        if (isInicioEnTurnoA) {
            horaInicioH.value = '18';
            horaInicioM.value = '30';
        }
        
        if (isFinEnTurnoA) {
            horaFinH.value = '06';
            horaFinM.value = '29';
        }
    }
    
    // Actualizar el campo oculto de horario
    if (formType === 'create') {
        updateCreateHorario();
    } else {
        updateEditHorario();
    }
    
    // Mostrar un mensaje o destacar los campos que han sido modificados
    validateHorarioRanges(formType);
}

// -----------------------------------------------
// Validar que los horarios estén dentro del rango permitido
// -----------------------------------------------
function validateHorarioRanges(formType) {
    // Determinar los selectores según el formulario
    const prefix = formType === 'create' ? 'create' : 'edit';
    const turnoSelect = document.getElementById(`${prefix}Turno`) || 
                        document.querySelector(`#${prefix}PNCModal select[name="turno"]`);
    
    const horaInicioH = document.getElementById(`${prefix}HoraInicioH`);
    const horaInicioM = document.getElementById(`${prefix}HoraInicioM`);
    const horaFinH = document.getElementById(`${prefix}HoraFinH`);
    const horaFinM = document.getElementById(`${prefix}HoraFinM`);
    
    // Obtener el turno seleccionado
    const turno = turnoSelect.value;
    
    // Obtener los valores actuales
    const horaInicioActual = parseInt(horaInicioH.value || '0');
    const minInicioActual = parseInt(horaInicioM.value || '0');
    
    const horaFinActual = parseInt(horaFinH.value || '0');
    const minFinActual = parseInt(horaFinM.value || '0');
    
    // Validar según el turno
    let inicioDentroDeRango = false;
    let finDentroDeRango = false;
    
    if (turno === 'A') {
        // Turno A: De 6:30 am a 18:29 pm
        inicioDentroDeRango = (horaInicioActual > 6 && horaInicioActual < 18) || 
                            (horaInicioActual === 6 && minInicioActual >= 30) || 
                            (horaInicioActual === 18 && minInicioActual < 30);
        
        finDentroDeRango = (horaFinActual > 6 && horaFinActual < 18) || 
                        (horaFinActual === 6 && minFinActual >= 30) || 
                        (horaFinActual === 18 && minFinActual < 30);
    } else if (turno === 'B') { // Turno B
        // Turno B: De 18:30 pm a 6:29 am
        inicioDentroDeRango = (horaInicioActual >= 19 && horaInicioActual <= 23) || 
                            (horaInicioActual >= 0 && horaInicioActual < 6) || 
                            (horaInicioActual === 6 && minInicioActual < 30) || 
                            (horaInicioActual === 18 && minInicioActual >= 30);
        
        finDentroDeRango = (horaFinActual >= 19 && horaFinActual <= 23) || 
                        (horaFinActual >= 0 && horaFinActual < 6) || 
                        (horaFinActual === 6 && minFinActual < 30) || 
                        (horaFinActual === 18 && minFinActual >= 30);
    }
    
    // Actualizar estilo visual para indicar validez
    // Hora inicio
    if (inicioDentroDeRango) {
        horaInicioH.classList.remove('excel-invalid');
        horaInicioM.classList.remove('excel-invalid');
    } else {
        horaInicioH.classList.add('excel-invalid');
        horaInicioM.classList.add('excel-invalid');
    }
    
    // Hora fin
    if (finDentroDeRango) {
        horaFinH.classList.remove('excel-invalid');
        horaFinM.classList.remove('excel-invalid');
    } else {
        horaFinH.classList.add('excel-invalid');
        horaFinM.classList.add('excel-invalid');
    }
}

// -----------------------------------------------
// Para configurar el modal de edición
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si debemos actualizar los resúmenes después de enviar un formulario
    if (window.pncFormSubmitted) {
        window.pncFormSubmitted = false;
        setTimeout(function() {
            // Actualizar resúmenes
            if (typeof updateSummaryBoxes === 'function') {
                const filtroProducto = document.getElementById('filtroProductoTabla') ? 
                    document.getElementById('filtroProductoTabla').value : 'todos';
                updateSummaryBoxes(filtroProducto);
            }
        }, 500);
    }
    
    // Manejar cierre de modales para actualizar resúmenes
    const createPNCModal = document.getElementById('createPNCModal');
    const editPNCModalClosure = document.getElementById('editPNCModal');
    
    if (createPNCModal) {
        createPNCModal.addEventListener('hidden.bs.modal', function() {
            // Actualizar resúmenes si la función está disponible
            if (typeof updateSummaryBoxes === 'function') {
                const filtroProducto = document.getElementById('filtroProductoTabla') ? 
                    document.getElementById('filtroProductoTabla').value : 'todos';
                updateSummaryBoxes(filtroProducto);
            }
        });
    }
    
    if (editPNCModalClosure) {
        editPNCModalClosure.addEventListener('hidden.bs.modal', function() {
            // Actualizar resúmenes si la función está disponible
            if (typeof updateSummaryBoxes === 'function') {
                const filtroProducto = document.getElementById('filtroProductoTabla') ? 
                    document.getElementById('filtroProductoTabla').value : 'todos';
                updateSummaryBoxes(filtroProducto);
            }
        });
    }
    
    // Configurar el modal de edición para cargar los datos del registro
    const editPNCModal = document.getElementById('editPNCModal');
    if (editPNCModal) {
        editPNCModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const horario = button.getAttribute('data-horario');
            const turno = button.getAttribute('data-turno');
            
            // Primero actualizamos las opciones de horas según el turno
            setTimeout(function() {
                updateHoraSelectsBasedOnTurno('edit');
                
                // Luego descomponemos el horario en sus componentes
                const horarioParts = parseHorario(horario);
                
                // Establecer los valores en los selectores
                if (document.getElementById('editHoraInicioH')) {
                    // Verificamos si la hora está en las opciones disponibles
                    const horaInicioH = document.getElementById('editHoraInicioH');
                    const horaFinH = document.getElementById('editHoraFinH');
                    
                    // Validar que las horas estén dentro de las opciones permitidas
                    setSelectValueIfExists(horaInicioH, horarioParts.inicioHora);
                    setSelectValueIfExists(horaFinH, horarioParts.finHora);
                    
                    document.getElementById('editHoraInicioM').value = horarioParts.inicioMinuto || '';
                    document.getElementById('editHoraFinM').value = horarioParts.finMinuto || '';
                }
                
                // Actualizar el campo oculto de horario
                updateEditHorario();
                
                // Validar según el turno actual
                validateHorarioRanges('edit');
            }, 100);
        });
    }
});

// Función auxiliar para establecer el valor de un select solo si existe la opción
function setSelectValueIfExists(select, value) {
    if (!select || !value) return;
    
    // Verificar si el valor existe como opción
    let optionExists = false;
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value) {
            optionExists = true;
            break;
        }
    }
    
    // Solo establecer el valor si existe como opción
    if (optionExists) {
        select.value = value;
    }
}

// Actualizar formulario antes de enviar
document.addEventListener('DOMContentLoaded', function() {
    // Interceptar el envío del formulario de creación
    const saveCreateBtn = document.getElementById('saveCreateBtn');
    if (saveCreateBtn) {
        saveCreateBtn.addEventListener('click', function(e) {
            // Guardar esta información para actualizar resúmenes después
            window.pncFormSubmitted = true;
            const form = document.getElementById('createPNCForm');
            
            // Validar que los campos requeridos no estén vacíos
            const turnoSelect = form.querySelector('select[name="turno"]');
            const productoSelect = form.querySelector('select[name="producto"]');
            const fechaInput = form.querySelector('input[name="fecha"]');
            const horaInicioH = document.getElementById('createHoraInicioH');
            const horaInicioM = document.getElementById('createHoraInicioM');
            const horaFinH = document.getElementById('createHoraFinH');
            const horaFinM = document.getElementById('createHoraFinM');
            const origenSelect = document.getElementById('createOrigen');
            const statusSelect = document.getElementById('createStatus');
            const unidadSelect = document.getElementById('createUnidadCantidad');
            
            // Verificar campos requeridos (excepto NO CONFORMIDAD y NOMBRE Y PUESTO DE QUIEN DETECTA)
            if (!turnoSelect.value || !productoSelect.value || !fechaInput.value ||
                !horaInicioH.value || !horaInicioM.value || !horaFinH.value || !horaFinM.value ||
                !origenSelect.value || !statusSelect.value || !unidadSelect.value) {
                // Mostrar mensaje de error
                const errorMessage = document.getElementById('createErrorMessage');
                errorMessage.textContent = 'Por favor complete todos los campos marcados como requeridos.';
                errorMessage.classList.remove('d-none');
                
                // Resaltar campos vacíos
                if (!turnoSelect.value) turnoSelect.classList.add('excel-invalid');
                if (!productoSelect.value) productoSelect.classList.add('excel-invalid');
                if (!fechaInput.value) fechaInput.classList.add('excel-invalid');
                if (!horaInicioH.value) horaInicioH.classList.add('excel-invalid');
                if (!horaInicioM.value) horaInicioM.classList.add('excel-invalid');
                if (!horaFinH.value) horaFinH.classList.add('excel-invalid');
                if (!horaFinM.value) horaFinM.classList.add('excel-invalid');
                if (!origenSelect.value) origenSelect.classList.add('excel-invalid');
                if (!statusSelect.value) statusSelect.classList.add('excel-invalid');
                if (!unidadSelect.value) unidadSelect.classList.add('excel-invalid');
                
                // Evitar el envío del formulario
                e.preventDefault();
                return false;
            }
            
            // Nota: Los campos NO CONFORMIDAD y NOMBRE Y PUESTO DE QUIEN DETECTA no son obligatorios
            
            // Asegurarse de que el horario está actualizado
            updateCreateHorario();
            
            // Verificar si se seleccionó "OTRO" para la unidad
            const customUnitInput = document.getElementById('createOtraUnidad');
            
            if (unidadSelect.value === 'OTRO' && customUnitInput) {
                // Validar que el campo de otra unidad no esté vacío
                if (!customUnitInput.value.trim()) {
                    customUnitInput.classList.add('excel-invalid');
                    const errorMessage = document.getElementById('createErrorMessage');
                    errorMessage.textContent = 'Por favor especifique la unidad personalizada.';
                    errorMessage.classList.remove('d-none');
                    e.preventDefault();
                    return false;
                }
                
                // Actualizar el valor de unidad_cantidad con el valor personalizado
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'unidad_cantidad';
                hiddenInput.value = customUnitInput.value.toUpperCase();
                form.appendChild(hiddenInput);
                
                // No enviar el campo original
                unidadSelect.disabled = true;
            }
            
            // Validar el rango de horarios
            if (horaInicioH.classList.contains('excel-invalid') || 
                horaInicioM.classList.contains('excel-invalid') ||
                horaFinH.classList.contains('excel-invalid') || 
                horaFinM.classList.contains('excel-invalid')) {
                // Mostrar mensaje de error
                const errorMessage = document.getElementById('createErrorMessage');
                errorMessage.textContent = 'El horario seleccionado no es válido para el turno elegido.';
                errorMessage.classList.remove('d-none');
                
                // Evitar el envío del formulario
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Interceptar el envío del formulario de edición
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function(e) {
            // Guardar esta información para actualizar resúmenes después
            window.pncFormSubmitted = true;
            const form = document.getElementById('editPNCForm');
            
            // Validar que los campos requeridos no estén vacíos
            const turnoSelect = form.querySelector('select[name="turno"]');
            const productoSelect = form.querySelector('select[name="producto"]');
            const fechaInput = form.querySelector('input[name="fecha"]');
            const horaInicioH = document.getElementById('editHoraInicioH');
            const horaInicioM = document.getElementById('editHoraInicioM');
            const horaFinH = document.getElementById('editHoraFinH');
            const horaFinM = document.getElementById('editHoraFinM');
            const origenSelect = document.getElementById('editOrigen');
            const statusSelect = document.getElementById('editStatus');
            const unidadSelect = document.getElementById('editUnidadCantidad');
            
            // Verificar campos requeridos (excepto NO CONFORMIDAD y NOMBRE Y PUESTO DE QUIEN DETECTA)
            if (!turnoSelect.value || !productoSelect.value || !fechaInput.value ||
                !horaInicioH.value || !horaInicioM.value || !horaFinH.value || !horaFinM.value ||
                !origenSelect.value || !statusSelect.value || !unidadSelect.value) {
                // Mostrar mensaje de error
                const errorMessage = document.getElementById('editErrorMessage');
                errorMessage.textContent = 'Por favor complete todos los campos marcados como requeridos.';
                errorMessage.classList.remove('d-none');
                
                // Resaltar campos vacíos
                if (!turnoSelect.value) turnoSelect.classList.add('excel-invalid');
                if (!productoSelect.value) productoSelect.classList.add('excel-invalid');
                if (!fechaInput.value) fechaInput.classList.add('excel-invalid');
                if (!horaInicioH.value) horaInicioH.classList.add('excel-invalid');
                if (!horaInicioM.value) horaInicioM.classList.add('excel-invalid');
                if (!horaFinH.value) horaFinH.classList.add('excel-invalid');
                if (!horaFinM.value) horaFinM.classList.add('excel-invalid');
                if (!origenSelect.value) origenSelect.classList.add('excel-invalid');
                if (!statusSelect.value) statusSelect.classList.add('excel-invalid');
                if (!unidadSelect.value) unidadSelect.classList.add('excel-invalid');
                
                // Evitar el envío del formulario
                e.preventDefault();
                return false;
            }
            
            // Nota: Los campos NO CONFORMIDAD y NOMBRE Y PUESTO DE QUIEN DETECTA no son obligatorios
            
            // Asegurarse de que el horario está actualizado
            updateEditHorario();
            
            // Verificar si se seleccionó "OTRO" para la unidad
            const customUnitInput = document.getElementById('editOtraUnidad');
            
            if (unidadSelect.value === 'OTRO' && customUnitInput) {
                // Validar que el campo de otra unidad no esté vacío
                if (!customUnitInput.value.trim()) {
                    customUnitInput.classList.add('excel-invalid');
                    const errorMessage = document.getElementById('editErrorMessage');
                    errorMessage.textContent = 'Por favor especifique la unidad personalizada.';
                    errorMessage.classList.remove('d-none');
                    e.preventDefault();
                    return false;
                }
                
                // Actualizar el valor de unidad_cantidad con el valor personalizado
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'unidad_cantidad';
                hiddenInput.value = customUnitInput.value.toUpperCase();
                form.appendChild(hiddenInput);
                
                // No enviar el campo original
                unidadSelect.disabled = true;
            }
            
            // Validar el rango de horarios
            if (horaInicioH.classList.contains('excel-invalid') || 
                horaInicioM.classList.contains('excel-invalid') ||
                horaFinH.classList.contains('excel-invalid') || 
                horaFinM.classList.contains('excel-invalid')) {
                // Mostrar mensaje de error
                const errorMessage = document.getElementById('editErrorMessage');
                errorMessage.textContent = 'El horario seleccionado no es válido para el turno elegido.';
                errorMessage.classList.remove('d-none');
                
                // Evitar el envío del formulario
                e.preventDefault();
                return false;
            }
        });
    }
});

// Función para mostrar/ocultar el campo de otra unidad - Para uso en el HTML
function mostrarCampoOtraUnidad(selectElement, containerId, inputId) {
    const container = document.getElementById(containerId);
    if (selectElement.value === 'OTRO') {
        container.style.display = 'block';
        setTimeout(() => document.getElementById(inputId).focus(), 100);
    } else {
        container.style.display = 'none';
    }
}
