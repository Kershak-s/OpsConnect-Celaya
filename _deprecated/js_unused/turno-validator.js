/**
 * Turno-Validator - Custom validator for shift-based time restrictions
 * This script displays custom validation messages based on the selected shift:
 * - Turno A: 6:30 am - 18:29 pm
 * - Turno B: 18:30 pm - 6:29 am
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Turno-Validator initialized');
    
    // Skip on PNC Simple pages and WeakLink pages
    if (window.location.href.includes('/pnc_simple/') || window.location.href.includes('/weaklink/')) {
        console.log('Skipping validation box on PNC Simple or WeakLink page');
        
        // Buscar y eliminar cualquier elemento con la clase horario-info-box si existe
        const infoBoxes = document.querySelectorAll('.horario-info-box, .horario-info-turno-a, .horario-info-turno-b');
        infoBoxes.forEach(box => {
            console.log('Removing existing info box:', box);
            box.remove();
        });
        
        return;
    }
    
    // Find the black box element that displays the valid time range
    const validationBox = document.querySelector('.time-validation-message');
    
    // If we can't find the specific element, let's try to identify it by its content
    if (!validationBox) {
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
            if (element.textContent && element.textContent.includes('Horario válido:')) {
                console.log('Found validation box by content:', element);
                updateValidationMessage(element);
                
                // Monitor for turno changes
                monitorTurnoChanges(element);
                return;
            }
        }
        
        // If we still can't find it, create our own element
        createValidationBox();
    } else {
        updateValidationMessage(validationBox);
        
        // Monitor for turno changes
        monitorTurnoChanges(validationBox);
    }
    
    /**
     * Updates the validation message based on the selected shift
     */
    function updateValidationMessage(element) {
        // Find the current selected turno
        const turnoSelects = document.querySelectorAll('select[name="turno"]');
        let currentTurno = 'A'; // Default to Turno A if not found
        
        turnoSelects.forEach(select => {
            if (select.offsetParent !== null) { // Check if the select is visible
                currentTurno = select.value;
            }
        });
        
        console.log('Current turno:', currentTurno);
        
        // Set the appropriate message based on the turno
        if (currentTurno === 'A') {
            element.textContent = 'Turno Válido: 6:30 am - 18:29 pm';
        } else {
            // No mostrar mensaje para el turno B (eliminado según solicitud)
            element.textContent = '';
            element.style.display = 'none';
        }
        
        // Make sure the element has the right styling
        element.style.backgroundColor = '#212529';
        element.style.color = 'white';
        element.style.padding = '8px 12px';
        element.style.borderRadius = '4px';
        element.style.fontWeight = '500';
        element.style.margin = '10px 0';
        element.style.display = 'inline-block';
        element.style.fontSize = '14px';
    }
    
    /**
     * Monitors changes to turno selects and updates the message accordingly
     */
    function monitorTurnoChanges(validationElement) {
        const turnoSelects = document.querySelectorAll('select[name="turno"]');
        
        turnoSelects.forEach(select => {
            select.addEventListener('change', function() {
                updateValidationMessage(validationElement);
            });
        });
        
        // Also monitor modal show events
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', function() {
                setTimeout(() => {
                    updateValidationMessage(validationElement);
                }, 100);
            });
        });
    }
    
    /**
     * Creates a new validation box if one doesn't exist
     */
    function createValidationBox() {
        console.log('Creating new validation box');
        
        // Find time-related input containers
        const timeContainers = document.querySelectorAll('.time-picker, .pnc-hora-container');
        
        if (timeContainers.length === 0) {
            console.log('No time containers found');
            return;
        }
        
        // Create the validation message element
        const validationElement = document.createElement('div');
        validationElement.className = 'time-validation-message';
        
        // Set initial message and styling
        updateValidationMessage(validationElement);
        
        // Insert after the first time container
        const firstContainer = timeContainers[0];
        firstContainer.parentNode.insertBefore(validationElement, firstContainer.nextSibling);
        
        // Monitor for turno changes
        monitorTurnoChanges(validationElement);
    }
});
