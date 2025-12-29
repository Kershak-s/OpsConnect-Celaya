/**
 * Script to remove turno validation messages from PNC Simple pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only run on PNC Simple pages
    if (!window.location.href.includes('/pnc_simple')) return;
    
    console.log('PNC Simple Message Remover initialized');
    
    // Initial check to remove any existing message boxes
    removeValidationMessages();
    
    // Set up a recurring check to catch dynamically added messages
    const observer = new MutationObserver(function(mutations) {
        removeValidationMessages();
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Function to remove all validation message boxes
    function removeValidationMessages() {
        // Remove horario-info-box elements
        const infoBoxes = document.querySelectorAll('.horario-info-box');
        infoBoxes.forEach(box => {
            box.remove();
        });
        
        // Remove time-validation-message elements
        const validationBoxes = document.querySelectorAll('.time-validation-message');
        validationBoxes.forEach(box => {
            box.remove();
        });
        
        // Remove any element with text containing "Turno Válido"
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.textContent && 
                (element.textContent.includes('Turno Válido') || 
                 element.textContent.includes('Horario válido'))) {
                
                // Skip if it's inside a tooltip or dropdown
                if (element.classList.contains('dropdown-menu') || 
                    element.classList.contains('tooltip') ||
                    element.parentElement.classList.contains('dropdown-menu') ||
                    element.parentElement.classList.contains('tooltip')) {
                    return;
                }
                
                // Remove the element
                element.remove();
            }
        });
    }
    
    // Also run the check when modals are shown
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            setTimeout(removeValidationMessages, 100);
        });
    });
});