// Script simplificado para colores PAPA SAL - embebido en el template
console.log('Script PAPA SAL iniciando...');

// Rangos para PAPA SAL
const RANGOS_PAPA = {
    humedad_base: { ideal: [1.35, 1.65], warning: [1.20, 1.80] },
    aceite_base: { ideal: [31, 35], warning: [30, 36] },
    humedad_pt: { ideal: [1.35, 1.8], warning: [1.20, 2.0] },
    sal_pt: { ideal: [0.55, 0.85], warning: [0.45, 0.95] }
};

function aplicarColorPapa(input, valor, tipo) {
    if (!input || !valor || isNaN(parseFloat(valor))) {
        input.style.backgroundColor = '#f8f9fa';
        return;
    }
    
    const num = parseFloat(valor);
    const rango = RANGOS_PAPA[tipo];
    
    if (!rango) return;
    
    // Verde: rango ideal
    if (num >= rango.ideal[0] && num <= rango.ideal[1]) {
        input.style.backgroundColor = '#d4edda';
        input.style.borderColor = '#28a745';
        input.style.color = '#155724';
    }
    // Amarillo: zona de advertencia
    else if ((num >= rango.warning[0] && num < rango.ideal[0]) || 
             (num > rango.ideal[1] && num <= rango.warning[1])) {
        input.style.backgroundColor = '#fff3cd';
        input.style.borderColor = '#ffc107';
        input.style.color = '#856404';
    }
    // Rojo: fuera de especificación
    else {
        input.style.backgroundColor = '#f8d7da';
        input.style.borderColor = '#dc3545';
        input.style.color = '#721c24';
    }
}

function configurarCamposPapa() {
    console.log('Configurando campos PAPA...');
    
    // Mapear campos específicos
    const campos = {
        'humedad_base_frita': 'humedad_base',
        'edit_humedad_base_frita': 'humedad_base',
        'aceite_base_frita': 'aceite_base',
        'edit_aceite_base_frita': 'aceite_base'
    };
    
    // Campos de tambores (humedad y sal PT)
    for (let i = 1; i <= 3; i++) {
        campos[`tanque${i}_humedad_pt`] = 'humedad_pt';
        campos[`edit_tanque${i}_humedad_pt`] = 'humedad_pt';
        campos[`tanque${i}_sal_pt`] = 'sal_pt';
        campos[`edit_tanque${i}_sal_pt`] = 'sal_pt';
    }
    
    Object.keys(campos).forEach(campoId => {
        const input = document.getElementById(campoId);
        if (input) {
            console.log(`Configurando: ${campoId}`);
            
            // Aplicar color inicial
            aplicarColorPapa(input, input.value, campos[campoId]);
            
            // Escuchar cambios
            ['input', 'keyup', 'blur'].forEach(evento => {
                input.addEventListener(evento, function() {
                    aplicarColorPapa(this, this.value, campos[campoId]);
                });
            });
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configurarCamposPapa);
} else {
    configurarCamposPapa();
}

// También cuando se abran modales
document.addEventListener('shown.bs.modal', function() {
    setTimeout(configurarCamposPapa, 200);
});

console.log('Script PAPA SAL cargado');
