/**
 * Script to enhance the FOLIO field in PNC Simple pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only run on PNC Simple pages
    if (!window.location.href.includes('/pnc_simple')) return;
    
    console.log('PNC Simple FOLIO Enhancer initialized');
    
    // Function to enhance the FOLIO field in a specific modal
    function enhanceFolioField(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.log(`Modal ${modalId} not found`);
            return;
        }
        
        // Find the FOLIO input field
        const folioInput = modal.querySelector('input[name="folio"]');
        if (!folioInput) {
            console.log('FOLIO input not found');
            return;
        }
        
        // Add center text class to the FOLIO input
        folioInput.style.textAlign = 'center';
        
        // Get the FOLIO form group
        const folioFormGroup = folioInput.closest('.form-group') || folioInput.closest('.mb-3');
        if (!folioFormGroup) {
            console.log('FOLIO form group not found');
            return;
        }
        
        // Get the label
        const folioLabel = folioFormGroup.querySelector('label');
        
        // Create a custom FOLIO header
        const header = document.createElement('div');
        header.className = 'folio-header';
        header.textContent = folioLabel ? folioLabel.textContent : 'FOLIO';
        
        // Create a container for the FOLIO value
        const valueContainer = document.createElement('div');
        valueContainer.className = 'folio-value-container';
        
        // Clone the input element and its attributes
        const newInput = document.createElement('input');
        Array.from(folioInput.attributes).forEach(attr => {
            newInput.setAttribute(attr.name, attr.value);
        });
        newInput.style.textAlign = 'center';
        newInput.style.border = 'none';
        newInput.style.backgroundColor = 'transparent';
        newInput.style.width = '100%';
        newInput.style.fontWeight = '500';
        
        // Add an "auto-generated" message if it's a creation form
        if (modalId === 'createPNCModal') {
            const autoGenText = document.createElement('div');
            autoGenText.className = 'folio-generated-text';
            autoGenText.textContent = 'Generado automáticamente';
            valueContainer.appendChild(newInput);
            valueContainer.appendChild(autoGenText);
        } else {
            valueContainer.appendChild(newInput);
        }
        
        // Replace the original form group content
        folioFormGroup.innerHTML = '';
        folioFormGroup.appendChild(header);
        folioFormGroup.appendChild(valueContainer);
        
        // Sync the new input with the original one
        newInput.addEventListener('input', function() {
            folioInput.value = this.value;
        });
        
        // If FOLIO is read-only or auto-generated, make it look special
        if (folioInput.readOnly || modalId === 'createPNCModal') {
            newInput.style.fontWeight = 'bold';
            newInput.style.color = '#0d6efd';
            
            // If it's edit mode, ensure the text is centered
            if (modalId === 'editPNCModal') {
                // Make sure the value is centered
                newInput.classList.add('text-center');
                
                // Make the input larger and more prominent
                newInput.style.fontSize = '1.1rem';
                valueContainer.style.padding = '12px 15px';
            }
        }
    }
    
    // Wait a moment for other scripts to initialize
    setTimeout(function() {
        enhanceFolioField('createPNCModal');
        enhanceFolioField('editPNCModal');
    }, 600);
    
    // Also enhance FOLIO when modals are shown
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const modalId = this.id;
            setTimeout(() => {
                enhanceFolioField(modalId);
            }, 100);
        });
    });
});
