/**
 * Validación PAE PAPA - Versión Final Optimizada v2
 * Rangos corregidos y sincronizados con backend (papa_excel_routes.py)
 *
 * Sistema de validación con 3 estados:
 * - Verde (ok): Dentro de especificación
 * - Amarillo (warning): Acción correctiva necesaria
 * - Rojo (error): Fuera de especificación - Parámetro abierto
 */

(function() {
    'use strict';

    console.log('🥔 PAPA Validation Final v2 - Iniciando...');

    // Evitar múltiples ejecuciones
    if (window.papaValidationLoaded) {
        console.log('⚠️ Validación PAPA ya cargada, saliendo...');
        return;
    }
    window.papaValidationLoaded = true;

    // Rangos de validación PAPA (sincronizados con backend)
    const RANGOS_PAPA = {
        'A': { verde: [0, 4], amarillo: [4.1, 10], descripcion: 'Defectos de color' },
        'B': { verde: [0, 4], amarillo: [4.1, 10], descripcion: 'Daño seco' },
        'C': { verde: [0, 4], amarillo: [4.1, 10], descripcion: 'Color indeseable' },
        'D': { verde: [0, 10], amarillo: [10.1, 20], descripcion: 'Defectos internos papa' },
        'E': { verde: [0, 10], amarillo: [10.1, 20], descripcion: 'Defectos externos papa' },
        'F': { verde: [0, 10], amarillo: [10.1, 20], descripcion: 'Defectos totales de papa' },
        'G': { verde: [0, 1], amarillo: [1.1, 2], descripcion: 'Centros suaves + clusters' },
        'H': { verde: [0, 6], amarillo: [6.1, 20], descripcion: 'Exceso de cáscara' },
        'I': { verde: [0, 6], amarillo: [6.1, 20], descripcion: 'Hojuelas aceitosas' },
        'J': { verde: [0, 6], amarillo: [6.1, 20], descripcion: 'Ampulas' },
        'K': { verde: [0, 6], amarillo: [6.1, 20], descripcion: 'Puntos obscuros' },
        'L': { verde: [0, 20], amarillo: [20.1, 40], descripcion: 'Defectos totales de proceso' },
        'M': { verde: [0, 30], amarillo: [30.1, 35], descripcion: 'Hojuelas dobladas' },
        'N': { verde: [75, 100], amarillo: null, descripcion: 'Hojuela Entera (%)' },
        'O': { verde: [100, 100], amarillo: [73, 99.99], descripcion: 'Hojuela Entera FIESTA (%)' },
        'P': { verde: [0, 12], amarillo: [12.1, 15], descripcion: 'Pedacera/scrap (%)' },
        'Q': { verde: [61, 100], amarillo: [58, 60.9], descripcion: 'Color de la Base L' },
        'R': { verde: [-3, 2.5], amarillo: [2.51, 10], descripcion: 'Color de la base a' }
    };

    /**
     * Inyecta los estilos CSS necesarios para la validación
     */
    function inyectarEstilos() {
        const styleId = 'papa-validation-styles';
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Estilos de validación PAPA con máxima especificidad */
            input[data-type].form-control.input-value-ok,
            input.form-control[data-type].input-value-ok {
                background-color: #d4edda !important;
                border-color: #c3e6cb !important;
                color: #155724 !important;
                box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
            }

            input[data-type].form-control.input-value-warning,
            input.form-control[data-type].input-value-warning {
                background-color: #fff3cd !important;
                border-color: #ffeaa7 !important;
                color: #856404 !important;
                box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25) !important;
            }

            input[data-type].form-control.input-value-error,
            input.form-control[data-type].input-value-error {
                background-color: #f8d7da !important;
                border-color: #f5c6cb !important;
                color: #721c24 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }

            /* Estilos para el display de porcentaje */
            .percentage-display {
                font-weight: bold;
                color: #0d6efd;
                min-width: 80px;
                padding: 0.5rem;
                background-color: #e7f3ff;
                border-radius: 6px;
                text-align: center;
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ CSS inyectado correctamente');
    }

    /**
     * Determina el estado de validación según el valor y el tipo de campo
     */
    function determinarEstado(valor, tipo) {
        if (!RANGOS_PAPA[tipo]) {
            console.warn(`⚠️ Tipo de campo desconocido: ${tipo}`);
            return 'ok';
        }

        const rango = RANGOS_PAPA[tipo];
        const [verdeMin, verdeMax] = rango.verde;
        const amarillo = rango.amarillo;
        const [amarilloMin, amarilloMax] = amarillo || [null, null];

        // Caso especial campo N: Hojuela Entera
        // Verde: 75-100%, Rojo: <75%, Sin amarillo
        if (tipo === 'N') {
            if (valor >= 75 && valor <= 100) return 'ok';    // Verde: 75-100%
            return 'error';                                   // Rojo: <75%
        }

        if (tipo === 'O') {
            if (valor === 100) return 'ok';           // Verde: exactamente 100%
            if (valor >= 73 && valor < 100) return 'warning';  // Amarillo: 73-99.99%
            return 'error';                           // Rojo: <73%
        }

        // Caso especial para campo R (puede ser negativo)
        if (tipo === 'R') {
            if (valor >= verdeMin && valor <= verdeMax) return 'ok';
            if ((valor >= amarilloMin && valor <= amarilloMax) || valor < -3) return 'warning';
            return 'error';
        }

        // Lógica estándar para campos A-M y P
        // Verde: si está en rango verde
        if (valor >= verdeMin && valor <= verdeMax) {
            return 'ok';
        }

        // Amarillo: si está en rango amarillo
        if (valor >= amarilloMin && valor <= amarilloMax) {
            return 'warning';
        }

        // Rojo: si está fuera de ambos rangos
        return 'error';
    }

    /**
     * Valida un campo individual
     */
    function validatePapaField(input) {
        const tipo = input.getAttribute('data-type');
        const valorStr = input.value.trim();

        console.log(`🔍 Validando campo ${tipo}: "${valorStr}"`);

        // Limpiar clases previas
        input.classList.remove('input-value-ok', 'input-value-warning', 'input-value-error');

        // Si el campo está vacío, no validar (pero 0 es un valor válido)
        if (valorStr === '' || valorStr === null || valorStr === undefined) {
            console.log(`  → Campo vacío, sin validación`);
            return;
        }

        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            console.warn(`  → ⚠️ Valor no numérico "${valorStr}"`);
            return;
        }

        const estado = determinarEstado(valor, tipo);
        const claseEstado = `input-value-${estado}`;
        input.classList.add(claseEstado);

        console.log(`  → ✓ Estado: ${estado} (clase: ${claseEstado})`);

        // Forzar repaint del navegador
        void input.offsetHeight;
    }

    /**
     * Calcula y muestra el porcentaje
     * NOTA: Campos N, O, P ya son porcentajes, no se calculan
     */
    function calcularPorcentaje(input) {
        const tipo = input.getAttribute('data-type');
        const valor = parseFloat(input.value);
        const container = input.parentElement;
        let display = container.querySelector('.percentage-display');

        // Campos N, O, P: el valor ingresado YA ES el porcentaje
        const camposPorcentajeDirecto = ['N', 'O', 'P'];

        if (!display) {
            // Crear display de porcentaje si no existe
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '10px';
            wrapper.style.alignItems = 'center';
            wrapper.style.width = '100%';

            // Mover input al wrapper
            container.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            input.style.flex = '1';

            // Crear span para porcentaje
            display = document.createElement('span');
            display.className = 'percentage-display';
            display.textContent = '0.00%';
            wrapper.appendChild(display);
        }

        if (!isNaN(valor)) {
            let porcentaje;

            if (camposPorcentajeDirecto.includes(tipo)) {
                // N, O, P: el valor YA ES el porcentaje, solo mostrar
                porcentaje = valor.toFixed(2);
            } else {
                // A-M: calcular porcentaje (valor/200*100)
                porcentaje = ((valor / 200) * 100).toFixed(2);
            }

            display.textContent = `${porcentaje}%`;
        } else {
            display.textContent = '0.00%';
        }
    }

    /**
     * Configura los event listeners para todos los campos
     */
    function setupFieldListeners() {
        const campos = document.querySelectorAll('input[data-type]');
        console.log(`🔍 Configurando ${campos.length} campos PAPA`);

        if (campos.length === 0) {
            console.warn('❌ No se encontraron campos con data-type');
            return;
        }

        campos.forEach((input, index) => {
            const tipo = input.getAttribute('data-type');
            console.log(`🔧 Campo ${index + 1}: ${tipo}`);

            // Remover listeners anteriores si existen
            if (input._papaValidator) {
                input.removeEventListener('input', input._papaValidator);
                input.removeEventListener('change', input._papaValidator);
                input.removeEventListener('blur', input._papaValidator);
            }

            // Crear función validadora
            const validator = () => {
                validatePapaField(input);
                calcularPorcentaje(input);
            };

            // Guardar referencia
            input._papaValidator = validator;

            // Agregar eventos
            input.addEventListener('input', validator);
            input.addEventListener('change', validator);
            input.addEventListener('blur', validator);

            // Validar inmediatamente si tiene valor
            if (input.value && input.value.trim() !== '') {
                console.log(`  → Validando valor inicial: ${input.value}`);
                setTimeout(() => validator(), 100);
            }
        });

        console.log('🎉 Validación PAPA configurada completamente');
    }

    /**
     * Inicializa todo el sistema de validación
     */
    function inicializar() {
        console.log('✅ Inicializando validación PAPA');

        // Inyectar estilos CSS
        inyectarEstilos();

        // Configurar event listeners
        setupFieldListeners();
    }

    // Ejecutar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        // DOM ya está listo, ejecutar inmediatamente
        inicializar();
    }

    // También intentar ejecutar después de un pequeño delay por si acaso
    setTimeout(inicializar, 500);

})();
