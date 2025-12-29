/**
 * Selector de horas personalizado para PNC Simple
 * Reemplaza los inputs de hora por selectores separados para horas y minutos
 * Restricciones:
 * - Turno A: Solo horas de 6 a 18 (6:30 a 18:29)
 * - Turno B: Solo horas de 18 a 6 (18:30 a 6:29)
 * - Minutos: Siempre de 00 a 59
 */

document.addEventListener('DOMContentLoaded', function() {
    // Solo aplicar en la página de PNC Simple
    if (!window.location.href.includes('/pnc_simple')) return;
    
    console.log('PNC Hora Selector inicializado');
    
    // Procesar el modal de creación
    setupHoraSelectors('createPNCModal');
    
    // Procesar el modal de edición
    setupHoraSelectors('editPNCModal');
    
    /**
     * Configura los selectores de hora en un modal específico
     */
    function setupHoraSelectors(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.log(`Modal ${modalId} no encontrado`);
            return;
        }
        
        // Obtener referencias a elementos clave
        const turnoSelect = modal.querySelector('select[name="turno"]');
        const horaInicioInput = modal.querySelector('input[name="hora_inicio"]');
        const horaFinInput = modal.querySelector('input[name="hora_fin"]');
        
        if (!turnoSelect || !horaInicioInput || !horaFinInput) {
            console.log('Elementos no encontrados en el modal', {
                turnoSelect: !!turnoSelect,
                horaInicioInput: !!horaInicioInput,
                horaFinInput: !!horaFinInput
            });
            return;
        }
        
        console.log(`Configurando selectores en ${modalId}`);
        
        // Obtener los contenedores para aplicar estilos
        const horaInicioContainer = horaInicioInput.closest('.time-picker');
        const horaFinContainer = horaFinInput.closest('.time-picker');
        
        // Crear y reemplazar el selector de hora de inicio
        const inicioContainer = createTimeContainer(horaInicioInput, 'inicio', modalId);
        if (horaInicioContainer) {
            horaInicioContainer.insertBefore(inicioContainer, horaInicioInput);
            horaInicioInput.style.display = 'none';
        } else {
            console.log('Contenedor de hora inicio no encontrado');
            // Intentar insertarlo directamente junto al input
            horaInicioInput.parentNode.insertBefore(inicioContainer, horaInicioInput);
            horaInicioInput.style.display = 'none';
        }
        
        // Crear y reemplazar el selector de hora de fin
        const finContainer = createTimeContainer(horaFinInput, 'fin', modalId);
        if (horaFinContainer) {
            horaFinContainer.insertBefore(finContainer, horaFinInput);
            horaFinInput.style.display = 'none';
        } else {
            console.log('Contenedor de hora fin no encontrado');
            // Intentar insertarlo directamente junto al input
            horaFinInput.parentNode.insertBefore(finContainer, horaFinInput);
            horaFinInput.style.display = 'none';
        }
        
        // Obtener referencias a los nuevos selectores
        const horaInicioHSelect = document.getElementById(`${modalId}_hora_inicio_h`);
        const horaInicioMSelect = document.getElementById(`${modalId}_hora_inicio_m`);
        const horaFinHSelect = document.getElementById(`${modalId}_hora_fin_h`);
        const horaFinMSelect = document.getElementById(`${modalId}_hora_fin_m`);
        
        console.log('Nuevos selectores creados', {
            horaInicioHSelect: !!horaInicioHSelect,
            horaInicioMSelect: !!horaInicioMSelect,
            horaFinHSelect: !!horaFinHSelect,
            horaFinMSelect: !!horaFinMSelect
        });
        
        // Manejar cambios en el turno
        turnoSelect.addEventListener('change', function() {
            console.log(`Turno cambiado a: ${this.value}`);
            // Actualizar las opciones de hora según el turno seleccionado
            updateHoraOptions(
                this.value,
                horaInicioHSelect,
                horaInicioMSelect,
                horaFinHSelect,
                horaFinMSelect,
                inicioContainer,
                finContainer
            );
        });
        
        // Configurar manejar el envío del formulario
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(event) {
                console.log('Formulario enviado, actualizando inputs originales');
                // Actualizar los inputs originales con los valores seleccionados
                updateOriginalInputs(
                    horaInicioInput,
                    horaFinInput,
                    horaInicioHSelect,
                    horaInicioMSelect,
                    horaFinHSelect,
                    horaFinMSelect
                );
            });
        }
        
        // Botón de guardar (para casos donde el form no se envía directamente)
        const saveBtn = modal.querySelector('#saveCreateBtn, #saveEditBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                console.log('Botón guardar presionado, actualizando inputs originales');
                // Actualizar los inputs originales con los valores seleccionados
                updateOriginalInputs(
                    horaInicioInput,
                    horaFinInput,
                    horaInicioHSelect,
                    horaInicioMSelect,
                    horaFinHSelect,
                    horaFinMSelect
                );
            });
        }
        
        // Actualizar las opciones iniciales según el turno seleccionado
        modal.addEventListener('shown.bs.modal', function() {
            console.log(`Modal ${modalId} mostrado, actualizando selectores`);
            
            // Extraer valores actuales de los inputs originales
            const horaInicioValue = horaInicioInput.value;
            const horaFinValue = horaFinInput.value;
            
            console.log('Valores actuales', { horaInicioValue, horaFinValue });
            
            // Actualizar las opciones según el turno
            updateHoraOptions(
                turnoSelect.value,
                horaInicioHSelect,
                horaInicioMSelect,
                horaFinHSelect,
                horaFinMSelect,
                inicioContainer,
                finContainer
            );
            
            // Si hay valores previos, intentar establecerlos
            if (horaInicioValue) {
                setTimeValues(
                    horaInicioValue,
                    horaInicioHSelect,
                    horaInicioMSelect
                );
            }
            
            if (horaFinValue) {
                setTimeValues(
                    horaFinValue,
                    horaFinHSelect,
                    horaFinMSelect
                );
            }
        });
        
        // Inicializar las opciones de hora
        updateHoraOptions(
            turnoSelect.value,
            horaInicioHSelect,
            horaInicioMSelect,
            horaFinHSelect,
            horaFinMSelect,
            inicioContainer,
            finContainer
        );
    }
    
    /**
     * Crea un contenedor con selectores para hora y minutos
     */
    function createTimeContainer(input, tipo, modalId) {
        // Crear los nuevos selectores
        const horaSelect = document.createElement('select');
        horaSelect.className = 'pnc-hora-select hora-select';
        horaSelect.id = `${modalId}_hora_${tipo}_h`;
        horaSelect.name = `hora_${tipo}_h`;
        horaSelect.required = true;
        
        const minSelect = document.createElement('select');
        minSelect.className = 'pnc-hora-select min-select';
        minSelect.id = `${modalId}_hora_${tipo}_m`;
        minSelect.name = `hora_${tipo}_m`;
        minSelect.required = true;
        
        // Crear el contenedor para los nuevos selectores
        const container = document.createElement('div');
        container.className = 'pnc-hora-container';
        container.id = `${modalId}_${tipo}_container`;
        
        // Añadir etiquetas y selectores
        const horaLabel = document.createElement('span');
        horaLabel.className = 'pnc-hora-label';
        horaLabel.textContent = 'Hora:';
        
        const separator = document.createElement('span');
        separator.className = 'pnc-hora-separator';
        separator.textContent = ':';
        
        // Añadir todo al contenedor
        container.appendChild(horaSelect);
        container.appendChild(separator);
        container.appendChild(minSelect);
        
        return container;
    }
    
    /**
     * Actualiza las opciones de hora según el turno seleccionado
     */
    function updateHoraOptions(turno, horaInicioHSelect, horaInicioMSelect, horaFinHSelect, horaFinMSelect, inicioContainer, finContainer) {
        // Actualizar clases de los contenedores según el turno
        if (inicioContainer && finContainer) {
            // Eliminar clases previas
            inicioContainer.classList.remove('pnc-hora-turno-a', 'pnc-hora-turno-b');
            finContainer.classList.remove('pnc-hora-turno-a', 'pnc-hora-turno-b');
            
            // Añadir clase según el turno
            if (turno === 'A') {
                inicioContainer.classList.add('pnc-hora-turno-a');
                finContainer.classList.add('pnc-hora-turno-a');
            } else {
                inicioContainer.classList.add('pnc-hora-turno-b');
                finContainer.classList.add('pnc-hora-turno-b');
            }
        }
        
        // Determinar rango de horas según el turno
        let horasPermitidas = [];
        
        if (turno === 'A') {
            // Turno A: 6:30 am a 18:29 pm
            for (let h = 6; h <= 18; h++) {
                horasPermitidas.push(h.toString().padStart(2, '0'));
            }
        } else {
            // Turno B: 18:30 pm a 6:29 am
            for (let h = 18; h <= 23; h++) {
                horasPermitidas.push(h.toString().padStart(2, '0'));
            }
            for (let h = 0; h <= 6; h++) {
                horasPermitidas.push(h.toString().padStart(2, '0'));
            }
        }
        
        console.log(`Horas permitidas para turno ${turno}:`, horasPermitidas);
        
        // Actualizar selectores de hora con valores predeterminados para cada turno
        updateHoraSelect(horaInicioHSelect, horasPermitidas, turno === 'A' ? '06' : '18');
        updateHoraSelect(horaFinHSelect, horasPermitidas, turno === 'A' ? '18' : '06');
        
        // Actualizar selectores de minutos con valores predeterminados para cada turno
        updateMinutosSelect(horaInicioMSelect, turno === 'A' ? '30' : '30');
        updateMinutosSelect(horaFinMSelect, turno === 'A' ? '29' : '29');
    }
    
    /**
     * Actualiza un selector de horas con las opciones permitidas
     */
    function updateHoraSelect(select, horasPermitidas, defaultValue) {
        if (!select) return;
        
        // Guardar el valor seleccionado actualmente
        const currentValue = select.value;
        
        // Limpiar opciones existentes
        select.innerHTML = '';
        
        // Añadir opciones de hora permitidas
        horasPermitidas.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            select.appendChild(option);
        });
        
        // Intentar restaurar el valor previo si está dentro de las opciones permitidas
        if (currentValue && horasPermitidas.includes(currentValue)) {
            select.value = currentValue;
        } else {
            // Si el valor previo no es válido, seleccionar el valor predeterminado
            select.value = defaultValue;
        }
    }
    
    /**
     * Actualiza un selector de minutos con opciones del 00 al 59
     */
    function updateMinutosSelect(select, defaultValue = '00') {
        if (!select) return;
        
        // Guardar el valor seleccionado actualmente
        const currentValue = select.value;
        
        // Limpiar opciones existentes
        select.innerHTML = '';
        
        // Añadir opciones de minutos (00-59)
        for (let m = 0; m < 60; m++) {
            const option = document.createElement('option');
            option.value = m.toString().padStart(2, '0');
            option.textContent = m.toString().padStart(2, '0');
            select.appendChild(option);
        }
        
        // Restaurar el valor previo o seleccionar el valor predeterminado
        if (currentValue && currentValue >= '00' && currentValue <= '59') {
            select.value = currentValue;
        } else {
            select.value = defaultValue;
        }
    }
    
    /**
     * Actualiza los inputs originales antes de enviar el formulario
     */
    function updateOriginalInputs(horaInicioInput, horaFinInput, horaInicioHSelect, horaInicioMSelect, horaFinHSelect, horaFinMSelect) {
        if (!horaInicioInput || !horaFinInput) return;
        
        // Formatear la hora de inicio
        if (horaInicioHSelect.value && horaInicioMSelect.value) {
            horaInicioInput.value = `${horaInicioHSelect.value}:${horaInicioMSelect.value}`;
        }
        
        // Formatear la hora de fin
        if (horaFinHSelect.value && horaFinMSelect.value) {
            horaFinInput.value = `${horaFinHSelect.value}:${horaFinMSelect.value}`;
        }
        
        console.log('Inputs originales actualizados', {
            horaInicio: horaInicioInput.value,
            horaFin: horaFinInput.value
        });
    }
    
    /**
     * Establece los valores de los selectores basados en un valor de hora
     */
    function setTimeValues(timeValue, horaSelect, minSelect) {
        if (!timeValue || !horaSelect || !minSelect) return;
        
        console.log(`Estableciendo valores de tiempo: ${timeValue}`);
        
        // Dividir el valor de tiempo (formato: HH:MM)
        const parts = timeValue.split(':');
        if (parts.length !== 2) {
            console.log('Formato de hora inválido', timeValue);
            return;
        }
        
        // Establecer hora y minutos si están disponibles en los selectores
        const hora = parts[0].padStart(2, '0');
        const min = parts[1].padStart(2, '0');
        
        console.log('Partes de tiempo', { hora, min });
        
        // Verificar si la opción existe en el selector antes de asignarla
        if (horaOptionExists(horaSelect, hora)) {
            horaSelect.value = hora;
            console.log(`Hora establecida: ${hora}`);
        } else {
            console.log(`Hora no disponible en selector: ${hora}`);
        }
        
        if (min >= '00' && min <= '59') {
            minSelect.value = min;
            console.log(`Minutos establecidos: ${min}`);
        }
    }
    
    /**
     * Verifica si una opción de hora existe en el selector
     */
    function horaOptionExists(select, value) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === value) {
                return true;
            }
        }
        return false;
    }
    
    // Si el botón "Nuevo Registro" existe, escuchar eventos
    const newButton = document.querySelector('button[data-bs-target="#createPNCModal"]');
    if (newButton) {
        newButton.addEventListener('click', function() {
            // Esperar a que el modal se muestre
            setTimeout(function() {
                const createTurnoSelect = document.querySelector('#createPNCModal select[name="turno"]');
                if (createTurnoSelect) {
                    // Disparar el evento change para actualizar las opciones
                    createTurnoSelect.dispatchEvent(new Event('change'));
                }
            }, 300);
        });
    }
    
    // Si hay botones de edición, configurarlos también
    const editButtons = document.querySelectorAll('.edit-pnc-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Esperar a que el modal se muestre
            setTimeout(function() {
                const editTurnoSelect = document.querySelector('#editPNCModal select[name="turno"]');
                if (editTurnoSelect) {
                    // Disparar el evento change para actualizar las opciones
                    editTurnoSelect.dispatchEvent(new Event('change'));
                }
            }, 300);
        });
    });
});
