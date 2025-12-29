/**
 * horario-selector.js
 * Script para manejar los selectores de horario según el turno seleccionado.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Convertir los campos de horario de inputs a selectores
    convertirCamposHorario();
    
    // Función principal para transformar campos de horario
    function convertirCamposHorario() {
        // Detectar formularios PNC
        const formsPNC = document.querySelectorAll('.pnc-form');
        const formsAnalisis = document.querySelectorAll('.analisis-form');
        
        // Procesar formularios PNC
        formsPNC.forEach(form => {
            procesarFormulario(form, 'horario', 'turno');
        });
        
        // Procesar formularios de Análisis
        formsAnalisis.forEach(form => {
            procesarFormulario(form, 'analisis_horario', 'turno-0');
        });
    }
    
    // Función para procesar cada formulario y transformar sus campos de horario
    function procesarFormulario(form, horarioId, turnoId) {
        if (!form) return;
        
        // Obtener elementos clave
        const horarioInput = form.querySelector(`#${horarioId}`);
        const turnoSelect = form.querySelector(`#${turnoId}`);
        
        if (!horarioInput || !turnoSelect) return;
        
        // Obtener o crear el contenedor del campo de horario
        const horarioContainer = horarioInput.closest('.input-group');
        if (!horarioContainer) return;
        
        // Valor original para restaurar después
        const valorOriginal = horarioInput.value;
        
        // Limpiar el contenedor
        horarioContainer.innerHTML = '';
        
        // Crear los nuevos selectores
        const horaInicioH = document.createElement('select');
        horaInicioH.id = `${horarioId}_inicio_h`;
        horaInicioH.className = 'form-select';
        horaInicioH.required = true;
        
        const horaInicioM = document.createElement('select');
        horaInicioM.id = `${horarioId}_inicio_m`;
        horaInicioM.className = 'form-select';
        horaInicioM.required = true;
        
        const separador = document.createElement('span');
        separador.className = 'input-group-text';
        separador.textContent = 'a';
        
        const horaFinH = document.createElement('select');
        horaFinH.id = `${horarioId}_fin_h`;
        horaFinH.className = 'form-select';
        horaFinH.required = true;
        
        const horaFinM = document.createElement('select');
        horaFinM.id = `${horarioId}_fin_m`;
        horaFinM.className = 'form-select';
        horaFinM.required = true;
        
        // Agregar opción por defecto a cada selector
        agregarOpcionPorDefecto(horaInicioH, 'Hora');
        agregarOpcionPorDefecto(horaInicioM, 'Min');
        agregarOpcionPorDefecto(horaFinH, 'Hora');
        agregarOpcionPorDefecto(horaFinM, 'Min');
        
        // Agregar los nuevos elementos al contenedor
        horarioContainer.appendChild(horaInicioH);
        horarioContainer.appendChild(horaInicioM);
        horarioContainer.appendChild(separador);
        horarioContainer.appendChild(horaFinH);
        horarioContainer.appendChild(horaFinM);
        
        // Ocultar el input original y mantenerlo en el DOM
        horarioInput.style.display = 'none';
        horarioContainer.appendChild(horarioInput);
        
        // Poblar minutos (igual para todos los turnos)
        poblarMinutos(horaInicioM);
        poblarMinutos(horaFinM);
        
        // Manejar cambio de turno
        turnoSelect.addEventListener('change', function() {
            const turnoValue = this.value;
            poblarHoras(horaInicioH, turnoValue);
            poblarHoras(horaFinH, turnoValue);
        });
        
        // Inicializar con el valor actual del turno
        if (turnoSelect.value) {
            poblarHoras(horaInicioH, turnoSelect.value);
            poblarHoras(horaFinH, turnoSelect.value);
            
            // Si hay un valor existente, inicializar los selectores
            if (valorOriginal) {
                inicializarSelectores(horaInicioH, horaInicioM, horaFinH, horaFinM, valorOriginal);
            }
        }
        
        // Manejar envío del formulario
        form.addEventListener('submit', function(e) {
            if (!validarSelectores(horaInicioH, horaInicioM, horaFinH, horaFinM)) {
                e.preventDefault();
                alert('Por favor, complete todos los campos de horario');
                return false;
            }
            
            // Formatear el horario como: "HH:MM - HH:MM"
            horarioInput.value = formatearHorario(horaInicioH, horaInicioM, horaFinH, horaFinM);
        });
    }
    
    // Función para agregar opción por defecto a un selector
    function agregarOpcionPorDefecto(select, texto) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = texto;
        option.disabled = true;
        option.selected = true;
        select.appendChild(option);
    }
    
    // Función para poblar minutos (00-59)
    function poblarMinutos(select) {
        if (!select) return;
        
        // Limpiar opciones actuales excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Agregar minutos del 00 al 59
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString().padStart(2, '0');
            select.appendChild(option);
        }
    }
    
    // Función para poblar horas según el turno
    function poblarHoras(select, turnoValue) {
        if (!select) return;
        
        // Limpiar opciones actuales excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        let startHour, endHour;
        
        // Definir rango de horas según el turno
        if (turnoValue === 'A') {
            startHour = 6;
            endHour = 17;
        } else if (turnoValue === 'B') {
            startHour = 18;
            endHour = 5;
        } else {
            // Si no hay turno seleccionado, no mostrar horas
            return;
        }
        
        // Si el rango cruza la medianoche (como en el turno B)
        if (endHour < startHour) {
            // Primero agregar desde la hora de inicio hasta medianoche
            for (let i = startHour; i <= 23; i++) {
                const option = document.createElement('option');
                option.value = i.toString().padStart(2, '0');
                option.textContent = i.toString().padStart(2, '0');
                select.appendChild(option);
            }
            
            // Luego agregar desde medianoche hasta la hora de fin
            for (let i = 0; i <= endHour; i++) {
                const option = document.createElement('option');
                option.value = i.toString().padStart(2, '0');
                option.textContent = i.toString().padStart(2, '0');
                select.appendChild(option);
            }
        } else {
            // Rango normal (como en el turno A)
            for (let i = startHour; i <= endHour; i++) {
                const option = document.createElement('option');
                option.value = i.toString().padStart(2, '0');
                option.textContent = i.toString().padStart(2, '0');
                select.appendChild(option);
            }
        }
    }
    
    // Función para inicializar selectores según un valor de horario existente
    function inicializarSelectores(horaInicioH, horaInicioM, horaFinH, horaFinM, valorHorario) {
        if (!valorHorario) return;
        
        try {
            const horarioParts = valorHorario.split('-');
            if (horarioParts.length === 2) {
                let horaInicio = horarioParts[0].trim();
                let horaFin = horarioParts[1].trim();
                
                // Extraer horas y minutos
                const inicioMatch = horaInicio.match(/(\d+):(\d+)/);
                const finMatch = horaFin.match(/(\d+):(\d+)/);
                
                if (inicioMatch && inicioMatch.length === 3) {
                    const h = inicioMatch[1].padStart(2, '0');
                    const m = inicioMatch[2].padStart(2, '0');
                    
                    // Buscar y seleccionar la opción correcta
                    seleccionarOpcion(horaInicioH, h);
                    seleccionarOpcion(horaInicioM, m);
                }
                
                if (finMatch && finMatch.length === 3) {
                    const h = finMatch[1].padStart(2, '0');
                    const m = finMatch[2].padStart(2, '0');
                    
                    // Buscar y seleccionar la opción correcta
                    seleccionarOpcion(horaFinH, h);
                    seleccionarOpcion(horaFinM, m);
                }
            }
        } catch(e) {
            console.error('Error al dividir el horario:', e);
        }
    }
    
    // Función para seleccionar una opción en un select
    function seleccionarOpcion(select, valor) {
        if (!select) return;
        
        // Buscar opción por valor
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === valor) {
                select.selectedIndex = i;
                return;
            }
        }
        
        // Si no existe la opción, agregar y seleccionar
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = valor;
        select.appendChild(option);
        select.value = valor;
    }
    
    // Función para validar que todos los selectores tengan un valor
    function validarSelectores(horaInicioH, horaInicioM, horaFinH, horaFinM) {
        return horaInicioH.value && horaInicioM.value && horaFinH.value && horaFinM.value;
    }
    
    // Función para formatear el horario en el formato requerido
    function formatearHorario(horaInicioH, horaInicioM, horaFinH, horaFinM) {
        const horaInicio = `${horaInicioH.value}:${horaInicioM.value}`;
        const horaFin = `${horaFinH.value}:${horaFinM.value}`;
        return `${horaInicio} - ${horaFin}`;
    }
});
