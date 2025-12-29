/**
 * Script para activar automáticamente la pestaña de base frita si es necesario
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un parámetro de URL para activar la pestaña de base frita
    const urlParams = new URLSearchParams(window.location.search);
    const baseFritaSuccess = urlParams.get('base_frita_success');
    
    // Si el parámetro existe y es '1', activar la pestaña de base frita
    if (baseFritaSuccess === '1') {
        // Buscar las pestañas
        const baseFritaTab = document.getElementById('peso-frita-tab');
        
        if (baseFritaTab) {
            // Activar la pestaña
            var tab = new bootstrap.Tab(baseFritaTab);
            tab.show();
        }
    }
});
