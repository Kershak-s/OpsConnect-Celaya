/**
 * Script to add clock icons to the time selectors in PNC Simple
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only run on PNC Simple pages
    if (!window.location.href.includes('/pnc_simple')) return;
    
    console.log('PNC Simple Clock Icons Adder initialized');
    
    // Add a small delay to ensure other scripts have run
    setTimeout(function() {
        addClockIcons('createPNCModal');
        addClockIcons('editPNCModal');
    }, 600);
    
    /**
     * Add clock icons to time fields in a specific modal
     */
    function addClockIcons(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.log(`Modal ${modalId} not found`);
            return;
        }
        
        // Find the time header
        const timeHeader = modal.querySelector('.time-header');
        if (timeHeader) {
            // Add clock icon to the header
            if (!timeHeader.querySelector('.fa-clock')) {
                const clockIcon = document.createElement('i');
                clockIcon.className = 'fas fa-clock me-2';
                timeHeader.prepend(clockIcon);
            }
        }
        
        // Find the time field containers
        const inicioContainer = modal.querySelector(`#${modalId}_inicio_container`);
        const finContainer = modal.querySelector(`#${modalId}_fin_container`);
        
        if (inicioContainer && !inicioContainer.querySelector('.clock-icon-wrapper')) {
            addClockToContainer(inicioContainer);
        }
        
        if (finContainer && !finContainer.querySelector('.clock-icon-wrapper')) {
            addClockToContainer(finContainer);
        }
        
        // Add custom styles for the clock icons
        addClockStyles();
    }
    
    /**
     * Add a clock icon to a time container
     */
    function addClockToContainer(container) {
        // Create a wrapper for the clock icon
        const clockWrapper = document.createElement('div');
        clockWrapper.className = 'clock-icon-wrapper';
        
        // Create the clock icon
        const clockIcon = document.createElement('i');
        clockIcon.className = 'fas fa-clock clock-icon';
        
        // Add the icon to the wrapper
        clockWrapper.appendChild(clockIcon);
        
        // Insert the wrapper at the beginning of the container
        container.prepend(clockWrapper);
        
        // Adjust the container style to accommodate the icon
        container.classList.add('with-clock-icon');
    }
    
    /**
     * Add custom styles for the clock icons
     */
    function addClockStyles() {
        // Check if styles already exist
        if (document.getElementById('pnc-clock-styles')) return;
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'pnc-clock-styles';
        style.textContent = `
            /* Clock icon styles */
            .clock-icon-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 5px;
                color: #0d6efd;
            }
            
            .clock-icon {
                font-size: 18px;
            }
            
            /* Adjust container layout with icons */
            .pnc-hora-container.with-clock-icon {
                display: flex;
                align-items: center;
            }
            
            /* Ensure consistent spacing */
            .time-header {
                display: flex;
                align-items: center;
                font-weight: bold;
                margin-bottom: 10px;
                color: #0d6efd;
                background-color: #f8f9fa;
                padding: 8px 12px;
                border-radius: 4px;
            }
            
            /* Make selectors a little smaller to fit with clock */
            .with-clock-icon .pnc-hora-select {
                width: 60px;
            }
        `;
        
        // Add the styles to the document
        document.head.appendChild(style);
    }
    
    // Also add clock icons when modals are shown
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const modalId = this.id;
            setTimeout(() => {
                addClockIcons(modalId);
            }, 100);
        });
    });
});
