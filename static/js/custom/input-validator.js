/**
 * Custom Input Validator - Removes browser validation messages and handles custom validation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all input fields that might have browser validation
    const allInputs = document.querySelectorAll('input, select, textarea');
    
    // For each input, add an event listener to prevent the default validation message
    allInputs.forEach(input => {
        // Prevent default validation messages by setting custom validity to empty
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            // Clear the validation message bubble
            this.setCustomValidity('');
            
            // Add a custom error class instead of showing the bubble
            this.classList.add('input-error');
            
            // Add custom error message below the input if it doesn't exist yet
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                
                // Set appropriate error message based on validation type
                if (this.validity.valueMissing) {
                    errorMessage.textContent = 'Este campo es obligatorio.';
                } else if (this.validity.typeMismatch) {
                    errorMessage.textContent = 'Por favor ingrese un valor válido.';
                } else if (this.validity.patternMismatch) {
                    errorMessage.textContent = 'El formato ingresado no es válido.';
                } else if (this.validity.tooLong || this.validity.tooShort) {
                    errorMessage.textContent = 'La longitud del texto no es válida.';
                } else if (this.validity.rangeUnderflow || this.validity.rangeOverflow) {
                    errorMessage.textContent = 'El valor está fuera del rango permitido.';
                } else if (this.validity.badInput) {
                    errorMessage.textContent = 'Por favor ingrese un valor válido.';
                } else if (this.type === 'date' || this.type === 'time') {
                    errorMessage.textContent = 'Debe introducir un valor válido. El campo está incompleto o incluye una fecha no válida.';
                } else {
                    errorMessage.textContent = 'Por favor verifique este campo.';
                }
                
                // Insert error message after the input
                this.parentNode.insertBefore(errorMessage, this.nextSibling);
            }
        });
        
        // Remove error styling when input changes
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            
            // Remove error message if it exists
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                this.nextElementSibling.remove();
            }
        });
    });
    
    // Special handling for date and time inputs to prevent browser validation messages
    const dateTimeInputs = document.querySelectorAll('input[type="date"], input[type="time"]');
    dateTimeInputs.forEach(input => {
        // Apply novalidate to the form
        if (input.form) {
            input.form.setAttribute('novalidate', 'novalidate');
        }
        
        // Handle custom validation on submit
        if (input.form) {
            input.form.addEventListener('submit', function(e) {
                // Custom validation logic
                let isValid = true;
                
                // Check all date/time inputs in the form
                const formDateTimeInputs = this.querySelectorAll('input[type="date"], input[type="time"]');
                formDateTimeInputs.forEach(formInput => {
                    if (formInput.required && !formInput.value) {
                        isValid = false;
                        formInput.classList.add('input-error');
                        
                        // Add error message if it doesn't exist
                        if (!formInput.nextElementSibling || !formInput.nextElementSibling.classList.contains('error-message')) {
                            const errorMessage = document.createElement('div');
                            errorMessage.classList.add('error-message');
                            errorMessage.textContent = 'Este campo es obligatorio.';
                            formInput.parentNode.insertBefore(errorMessage, formInput.nextSibling);
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        }
    });
    
    // Remove the white validation message box that appears in Chrome/Edge/Safari
    // This needs to be added as a style to override browser defaults
    const style = document.createElement('style');
    style.textContent = `
        /* Hide browser validation messages */
        input::-webkit-validation-bubble-message,
        input::-webkit-validation-bubble,
        input::-webkit-validation-bubble-arrow-clipper,
        input::-webkit-validation-bubble-arrow,
        input::-webkit-validation-bubble-icon {
            display: none !important;
        }
        
        /* Custom styling for invalid inputs */
        .input-error {
            border-color: #dc3545 !important;
            background-color: rgba(220, 53, 69, 0.05) !important;
        }
        
        /* Error message styling */
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        /* Hide native browser error tooltips in MS Edge and IE */
        ::-ms-clear {
            display: none;
        }
    `;
    document.head.appendChild(style);
});
