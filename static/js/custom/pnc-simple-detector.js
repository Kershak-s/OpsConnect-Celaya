/**
 * Script to detect PNC Simple pages and add a class to the body
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a PNC Simple page
    if (window.location.href.includes('/pnc_simple/')) {
        // Add class to body for CSS targeting
        document.body.classList.add('pnc-simple-page');
        
        // Find and remove any existing horario-info-box elements
        const infoBoxes = document.querySelectorAll('.horario-info-box');
        infoBoxes.forEach(box => {
            box.remove();
        });
        
        console.log('PNC Simple page detected, removed horario-info-box elements');
    }
});
