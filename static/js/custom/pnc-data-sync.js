/**
 * Script para la sincronización y actualización de los datos PNC en la interfaz de TORTILLA
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página correcta
    if (window.location.href.includes('/pnc_simple/TORTILLA')) {
        // Configurar los eventos para notificar cambios en los datos
        setupDataChangeNotifications();
    }
});

/**
 * Configura las notificaciones de cambios en los datos
 */
function setupDataChangeNotifications() {
    // Manejar cambios después de enviar formularios
    const formSubmitButtons = document.querySelectorAll('#saveCreateBtn, #saveEditBtn');
    formSubmitButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Programar una notificación para después de que se complete la operación
            setTimeout(notifyDataChanged, 1000);
        });
    });
    
    // Manejar cambios después de eliminar registros
    const deleteButtons = document.querySelectorAll('button[data-bs-target^="#deletePNCSimpleModal"]');
    deleteButtons.forEach(button => {
        const modalId = button.getAttribute('data-bs-target');
        const modal = document.querySelector(modalId);
        
        if (modal) {
            // Obtener el formulario de eliminación dentro del modal
            const deleteForm = modal.querySelector('form[action*="delete_pnc_simple"]');
            
            if (deleteForm) {
                deleteForm.addEventListener('submit', function() {
                    // Programar una notificación para después de que se complete la operación
                    setTimeout(notifyDataChanged, 1000);
                });
            }
        }
    });
    
    // Manejar cambios después de cerrar modales
    const modals = document.querySelectorAll('#createPNCModal, #editPNCModal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            // Verificar si se ha realizado alguna operación (indicado por otros scripts)
            if (window.pncDataChanged) {
                window.pncDataChanged = false;
                notifyDataChanged();
            }
        });
    });
    
    // Observar cambios en la tabla de registros
    setupTableObserver();
}

/**
 * Configura un observador para detectar cambios en la tabla de registros
 */
function setupTableObserver() {
    const table = document.querySelector('.pnc-simple-table tbody');
    
    if (table) {
        // Crear un observador de mutaciones para detectar cambios en la tabla
        const observer = new MutationObserver(function(mutations) {
            // Si hubo cambios en la tabla, notificar
            notifyDataChanged();
        });
        
        // Configurar el observador para vigilar cambios en los hijos del tbody
        observer.observe(table, { childList: true, subtree: true });
    }
}

/**
 * Notifica que los datos han cambiado mediante un evento personalizado
 */
function notifyDataChanged() {
    // Crear y disparar un evento personalizado
    const event = new CustomEvent('pnc_data_changed');
    document.dispatchEvent(event);
    
    // También establecer una variable global para otros scripts
    window.pncDataChanged = true;
    
    // Registrar en consola para depuración
    console.log('PNC data changed - updating summaries');
}
