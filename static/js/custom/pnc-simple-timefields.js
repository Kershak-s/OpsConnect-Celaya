/**
 * PNC Simple Time Field Enhancer
 * This script enhances the time field displays for better centering and formatting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on PNC Simple pages
    if (!window.location.href.includes('/pnc_simple/')) return;
    
    console.log('PNC Simple Time Field Enhancer initialized');
    
    // Function to enhance the time fields in a modal
    function enhanceTimeFields(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Get time containers
        const inicioContainer = modal.querySelector(`#${modalId}_inicio_container`);
        const finContainer = modal.querySelector(`#${modalId}_fin_container`);
        
        if (!inicioContainer || !finContainer) return;
        
        // Get time pickers
        const inicioTimePicker = inicioContainer.closest('.time-picker') || inicioContainer.closest('.form-group');
        const finTimePicker = finContainer.closest('.time-picker') || finContainer.closest('.form-group');
        
        if (!inicioTimePicker || !finTimePicker) return;
        
        // Get label elements
        let inicioLabel = inicioTimePicker.querySelector('label');
        let finLabel = finTimePicker.querySelector('label');
        
        // Create wrappers if they don't exist
        if (!inicioTimePicker.querySelector('.time-field-container')) {
            // Wrap the content in a container for styling
            const inicioWrapper = document.createElement('div');
            inicioWrapper.className = 'time-field-container';
            
            // Create a label if none exists
            if (!inicioLabel) {
                inicioLabel = document.createElement('label');
                inicioLabel.textContent = 'Hora inicio';
                inicioLabel.className = 'time-field-label';
            } else {
                // If label exists, ensure it has the right class
                inicioLabel.className = 'time-field-label';
            }
            
            // Move the container into the wrapper
            inicioWrapper.appendChild(inicioLabel);
            inicioWrapper.appendChild(inicioContainer);
            
            // Replace the original content
            inicioTimePicker.innerHTML = '';
            inicioTimePicker.appendChild(inicioWrapper);
        }
        
        // Same for fin container
        if (!finTimePicker.querySelector('.time-field-container')) {
            const finWrapper = document.createElement('div');
            finWrapper.className = 'time-field-container';
            
            if (!finLabel) {
                finLabel = document.createElement('label');
                finLabel.textContent = 'Hora fin';
                finLabel.className = 'time-field-label';
            } else {
                finLabel.className = 'time-field-label';
            }
            
            finWrapper.appendChild(finLabel);
            finWrapper.appendChild(finContainer);
            
            finTimePicker.innerHTML = '';
            finTimePicker.appendChild(finWrapper);
        }
        
        // Add "a" text between selectors 
        const spacer = document.createElement('div');
        spacer.className = 'time-spacer';
        spacer.textContent = 'a';
        
        // Create a header for the time section
        const header = document.createElement('div');
        header.className = 'time-header';
        header.textContent = 'HORARIOS';
        
        // Create a container for both time fields
        const timeSection = document.createElement('div');
        timeSection.className = 'time-section';
        
        // Get parent container that holds both time fields
        const parent = inicioTimePicker.parentNode;
        
        // Create a row for "Hora inicio"
        const inicioRow = document.createElement('div');
        inicioRow.className = 'hora-row';
        inicioRow.appendChild(inicioTimePicker);
        
        // Create a row for "Hora fin"
        const finRow = document.createElement('div');
        finRow.className = 'hora-row';
        finRow.appendChild(finTimePicker);
        
        // Structure the time section
        timeSection.appendChild(inicioRow);
        timeSection.appendChild(spacer);
        timeSection.appendChild(finRow);
        
        // Insert the header and section before the original parent
        parent.insertBefore(header, inicioTimePicker);
        parent.insertBefore(timeSection, inicioTimePicker);
    }
    
    // Wait a moment for other scripts to initialize the time pickers
    setTimeout(function() {
        enhanceTimeFields('createPNCModal');
        enhanceTimeFields('editPNCModal');
    }, 500);
});
