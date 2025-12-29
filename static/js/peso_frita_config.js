/**
 * Configuración para los pesos de la base frita
 */

// Configurar opciones de horario para el turno de base frita
document.addEventListener('DOMContentLoaded', function() {
    const turnoFritaSelect = document.getElementById('turno_frita');
    const horaFritaSelect = document.getElementById('horario_hora_frita');
    
    if (turnoFritaSelect && horaFritaSelect) {
        // Función para poblar las horas disponibles según el turno
        function poblarHorasBaseFrita(turno) {
            horaFritaSelect.innerHTML = ''; // Limpiar opciones existentes
            
            let horasPermitidas = [];
            if (turno === 'A') {
                // Turno A: horas de 6 a 18
                for (let i = 6; i <= 18; i++) {
                    horasPermitidas.push(i);
                }
            } else {
                // Turno B: horas de 19 a 5 (las 12 am sería 00)
                // Primero 19-23
                for (let i = 19; i <= 23; i++) {
                    horasPermitidas.push(i);
                }
                // Luego 0-5
                for (let i = 0; i <= 5; i++) {
                    horasPermitidas.push(i);
                }
            }
            
            // Crear las opciones para el select
            horasPermitidas.forEach(hora => {
                const option = document.createElement('option');
                option.value = hora < 10 ? '0' + hora : hora;
                option.textContent = hora < 10 ? '0' + hora : hora;
                horaFritaSelect.appendChild(option);
            });
        }
        
        // Determinar turno inicial y poblar horas
        const horaActual = new Date().getHours();
        const turnoActual = (horaActual >= 6 && horaActual < 19) ? 'A' : 'B';
        
        turnoFritaSelect.value = turnoActual;
        poblarHorasBaseFrita(turnoActual);
        
        // Seleccionar la hora actual si está en el rango
        const horaOption = Array.from(horaFritaSelect.options).find(option => 
            parseInt(option.value) === horaActual
        );
        
        if (horaOption) {
            horaFritaSelect.value = horaOption.value;
        }
        
        // Configurar evento de cambio para actualizar las horas disponibles
        turnoFritaSelect.addEventListener('change', function() {
            poblarHorasBaseFrita(this.value);
        });
        
        // Validar que los minutos sean numéricos y estén entre 0-59
        const minutosFritaInput = document.getElementById('horario_minutos_frita');
        if (minutosFritaInput) {
            // Establecer los minutos actuales
            const minutosActuales = new Date().getMinutes();
            minutosFritaInput.value = minutosActuales < 10 ? '0' + minutosActuales : minutosActuales;
            
            minutosFritaInput.addEventListener('input', function() {
                const value = this.value;
                // Permitir solo números
                this.value = value.replace(/[^0-9]/g, '');
                // Limitar a 2 dígitos
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
                // Asegurar rango 0-59
                if (parseInt(this.value) > 59) {
                    this.value = '59';
                }
            });
        }
        
        // Proceso del formulario antes de enviar
        const createFritaForm = document.getElementById('createPesoFritaForm');
        if (createFritaForm) {
            createFritaForm.addEventListener('submit', function(e) {
                // Crear horario completo
                const horaValue = document.getElementById('horario_hora_frita').value || '00';
                const minutosValue = document.getElementById('horario_minutos_frita').value || '00';
                document.getElementById('horario_frita').value = `${horaValue}:${minutosValue}`;
                
                // Validar que los valores son números
                const pesoFritaA = parseFloat(document.getElementById('peso_frita_a').value) || 0;
                const pesoFrita = parseFloat(document.getElementById('peso_frita').value) || 0;
                
                if(isNaN(pesoFritaA) || isNaN(pesoFrita)) {
                    e.preventDefault();
                    alert('Por favor, ingrese valores numéricos válidos para los pesos.');
                    return false;
                }
            });
        }
    }
});
