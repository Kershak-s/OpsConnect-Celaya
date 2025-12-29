/**
 * Script principal para la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Configurar alertas para que desaparezcan automáticamente
    var alertList = document.querySelectorAll('.alert');
    alertList.forEach(function(alert) {
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000); // Desaparece después de 5 segundos
    });
    
    // Funcionalidad para confirmar eliminación
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('¿Está seguro de que desea eliminar este elemento?')) {
                e.preventDefault();
            }
        });
    });
    
    // Verificar contraseñas en formularios
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const password = document.getElementById('new_password');
            const confirmPassword = document.getElementById('new_password2');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                e.preventDefault();
                alert('Las contraseñas no coinciden');
            }
        });
    }
    
    // Validar extensiones de archivos para carga de imágenes
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Formato de archivo no válido. Por favor, seleccione una imagen en formato JPG, PNG o GIF.');
                    this.value = '';
                } else if (file.size > 16 * 1024 * 1024) {
                    alert('La imagen excede el tamaño máximo permitido de 16MB.');
                    this.value = '';
                }
            }
        });
    });
    
    // Animación de entrada para elementos principales
    const mainContent = document.querySelector('main .container');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

/**
 * Función para previsualizar imágenes antes de subirlas
 * @param {HTMLElement} input - El elemento input file
 * @param {string} previewId - El ID del elemento img para la vista previa
 */
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0] && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}