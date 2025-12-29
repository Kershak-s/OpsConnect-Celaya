// Prueba directa de colores PAPA SAL
console.log('=== INICIO SCRIPT PAPA ===');

// Ejecutar inmediatamente
(function() {
    console.log('Función inmediata ejecutándose...');
    
    const rangos = {
        humedad_base: [1.35, 1.65, 1.20, 1.80],
        aceite_base: [31, 35, 30, 36],
        humedad_pt: [1.35, 1.8, 1.20, 2.0],
        sal_pt: [0.55, 0.85, 0.45, 0.95]
    };
    
    function aplicarColor(input, valor, tipo) {
        if (!input || !valor) return;
        
        const num = parseFloat(valor);
        const [min, max, warnMin, warnMax] = rangos[tipo] || [0, 0, 0, 0];
        
        if (num >= min && num <= max) {
            input.style.backgroundColor = '#d4edda';
            input.style.borderColor = '#28a745';
            input.style.color = '#155724';
        } else if ((num >= warnMin && num < min) || (num > max && num <= warnMax)) {
            input.style.backgroundColor = '#fff3cd';
            input.style.borderColor = '#ffc107';
            input.style.color = '#856404';
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.borderColor = '#dc3545';
            input.style.color = '#721c24';
        }
        console.log(`Color aplicado a ${input.id}: ${valor}`);
    }
    
    function configurar() {
        console.log('Configurando campos...');
        
        const campos = [
            ['humedad_base_frita', 'humedad_base'],
            ['aceite_base_frita', 'aceite_base'],
            ['edit_humedad_base_frita', 'humedad_base'],
            ['edit_aceite_base_frita', 'aceite_base'],
            ['tanque1_humedad_pt', 'humedad_pt'],
            ['tanque1_sal_pt', 'sal_pt'],
            ['tanque2_humedad_pt', 'humedad_pt'],
            ['tanque2_sal_pt', 'sal_pt'],
            ['tanque3_humedad_pt', 'humedad_pt'],
            ['tanque3_sal_pt', 'sal_pt'],
            ['edit_tanque1_humedad_pt', 'humedad_pt'],
            ['edit_tanque1_sal_pt', 'sal_pt'],
            ['edit_tanque2_humedad_pt', 'humedad_pt'],
            ['edit_tanque2_sal_pt', 'sal_pt'],
            ['edit_tanque3_humedad_pt', 'humedad_pt'],
            ['edit_tanque3_sal_pt', 'sal_pt']
        ];
        
        campos.forEach(([id, tipo]) => {
            const input = document.getElementById(id);
            if (input) {
                console.log(`Campo encontrado: ${id}`);
                
                input.addEventListener('input', function() {
                    aplicarColor(this, this.value, tipo);
                });
                
                // Aplicar color inicial
                if (input.value) {
                    aplicarColor(input, input.value, tipo);
                }
            }
        });
    }
    
    // Ejecutar ahora y después
    configurar();
    
    setTimeout(configurar, 1000);
    setTimeout(configurar, 3000);
    
    console.log('=== SCRIPT PAPA COMPLETADO ===');
})();
