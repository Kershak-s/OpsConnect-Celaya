/**
 * Gráficas de Tendencia - Humedad Base Frita y Aceite Base Frita
 * Para la sección de Resultados en Análisis Fisicoquímicos
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Módulo de gráficas Base Frita cargado');

    // Detectar categoría desde data-attribute del HTML o URL
    const contenedor = document.querySelector('[data-categoria]');
    const urlParams = new URLSearchParams(window.location.search);
    
    // Prioridad: 1) data-categoria del HTML, 2) URL param, 3) EXTRUIDOS por defecto
    const categoria = contenedor?.dataset.categoria || urlParams.get('categoria') || 'EXTRUIDOS';
    console.log('📊 Categoría detectada:', categoria);
    console.log('   (Fuente:', contenedor?.dataset.categoria ? 'data-categoria' : 'URL/default', ')');

    // Referencias a canvas - BASE FRITA
    const humedadCanvas = document.getElementById('humedad-base-chart');
    const aceiteCanvas = document.getElementById('aceite-base-chart');
    
    // Referencias a canvas - PRODUCTO TERMINADO (PT)
    const aceitePTCanvas = document.getElementById('aceite-pt-chart');
    const humedadPTCanvas = document.getElementById('humedad-pt-chart');
    const salPTCanvas = document.getElementById('sal-pt-chart');

    if (!humedadCanvas || !aceiteCanvas) {
        console.warn('⚠️ Canvas de Base Frita no encontrados');
    }
    
    if (!aceitePTCanvas || !humedadPTCanvas || !salPTCanvas) {
        console.warn('⚠️ Canvas de PT no encontrados (puede ser normal si no están en esta vista)');
    }

    // Variables para Chart.js - BASE FRITA
    let humedadChart = null;
    let aceiteChart = null;
    
    // Variables para Chart.js - PRODUCTO TERMINADO (PT)
    let aceitePTChart = null;
    let humedadPTChart = null;
    let salPTChart = null;

    /**
     * Obtiene rangos del producto desde RANGOS_FISICOQUIMICOS_FINAL
     * @param {string} categoria - EXTRUIDOS, TORTILLA, PAPA
     * @param {string} producto - nombre del producto o 'todos'
     * @param {string} campo - 'humedad_base' o 'aceite_base'
     * @returns {object|null} - { verde: {min, max}, amarillo: [{min,max},...] } o null
     */
    function obtenerRangos(categoria, producto, campo) {
        // Verificar que existe RANGOS_FISICOQUIMICOS_FINAL (del archivo rangos_fisicoquimicos_unificado_final.js)
        if (typeof RANGOS_FISICOQUIMICOS_FINAL === 'undefined') {
            console.warn('⚠️ RANGOS_FISICOQUIMICOS_FINAL no está definido');
            return null;
        }
        
        // Si no hay categoría o no existe en rangos
        if (!categoria || !RANGOS_FISICOQUIMICOS_FINAL[categoria]) {
            console.warn('⚠️ Categoría no encontrada:', categoria);
            return null;
        }
        
        const rangosCategoria = RANGOS_FISICOQUIMICOS_FINAL[categoria];
        
        // Si producto es 'todos' o vacío, no mostrar líneas de límites
        if (!producto || producto === 'todos') {
            console.log('📊 Sin producto específico - no se mostrarán líneas de límites');
            return null;
        }
        
        // Buscar rangos del producto específico
        let rangosProducto = rangosCategoria[producto];
        
        // Si no existe el producto, usar default
        if (!rangosProducto) {
            console.log('📊 Producto no encontrado, usando default:', producto);
            rangosProducto = rangosCategoria['default'];
        }
        
        if (!rangosProducto || !rangosProducto[campo]) {
            console.warn('⚠️ Campo no encontrado:', campo);
            return null;
        }
        
        console.log('✅ Rangos encontrados para', producto, '-', campo);
        return rangosProducto[campo];
    }
    
    /**
     * Calcula los límites del eje Y CENTRADO EN LOS DATOS
     * Los datos quedan en el centro, los límites se muestran si caben
     * @param {array} datos - array de valores de datos
     * @param {object} rangos - { verde: {min, max}, amarillo: [{min,max},...] }
     * @returns {object} - { yMin, yMax }
     */
    function calcularEjeY(datos, rangos) {
        const valores = datos.map(d => d.y);
        const minDatos = Math.min(...valores);
        const maxDatos = Math.max(...valores);
        const rangoDatos = maxDatos - minDatos;
        const centroDatos = (maxDatos + minDatos) / 2;
        
        console.log('📊 Datos - min:', minDatos.toFixed(2), 'max:', maxDatos.toFixed(2), 'centro:', centroDatos.toFixed(2));
        
        if (!rangos) {
            // Sin rangos: centrar en datos con 40% de margen a cada lado
            const margen = rangoDatos * 0.4 || 0.5;
            return {
                yMin: minDatos - margen,
                yMax: maxDatos + margen
            };
        }
        
        // Obtener todos los límites
        let limiteMasBajo = Infinity;
        let limiteMasAlto = -Infinity;
        
        if (rangos.verde) {
            limiteMasBajo = Math.min(limiteMasBajo, rangos.verde.min);
            limiteMasAlto = Math.max(limiteMasAlto, rangos.verde.max);
        }
        
        if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
            rangos.amarillo.forEach(r => {
                if (r.min !== undefined) limiteMasBajo = Math.min(limiteMasBajo, r.min);
                if (r.max !== undefined) limiteMasAlto = Math.max(limiteMasAlto, r.max);
            });
        }
        
        console.log('📏 Límites - bajo:', limiteMasBajo.toFixed(2), 'alto:', limiteMasAlto.toFixed(2));
        
        // Calcular el rango necesario para mostrar datos Y límites
        const minTotal = Math.min(minDatos, limiteMasBajo);
        const maxTotal = Math.max(maxDatos, limiteMasAlto);
        const rangoTotal = maxTotal - minTotal;
        
        // Agregar margen del 20% arriba y abajo para que nada quede pegado al borde
        const margen = rangoTotal * 0.20 || 0.3;
        
        return {
            yMin: minTotal - margen,
            yMax: maxTotal + margen
        };
    }



    // Rangos se obtienen dinámicamente de RANGOS_FISICOQUIMICOS_FINAL

    /**
     * Actualizar gráficas según filtros
     */
    async function actualizarGraficas() {
        console.log('🔄 Actualizando gráficas...');

        // Obtener valores de filtros
        const periodo = document.getElementById('periodo-selector')?.value || 'hoy';
        const producto = document.getElementById('producto-selector')?.value || 'todos';
        const fechaInicio = document.getElementById('fecha-inicio-filtro')?.value || '';
        const fechaFin = document.getElementById('fecha-fin-filtro')?.value || '';

        // Construir URL de API
        let apiUrl = '/api/analisis_fisicoquimicos/' + categoria + '?periodo=' + periodo;

        if (producto && producto !== 'todos') {
            apiUrl += '&producto=' + encodeURIComponent(producto);
        }

        if (periodo === 'personalizado' && fechaInicio && fechaFin) {
            apiUrl += '&fecha_inicio=' + fechaInicio + '&fecha_fin=' + fechaFin;
        }

        console.log('📡 API:', apiUrl);

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('HTTP ' + response.status);

            const data = await response.json();
            console.log('✅ Datos recibidos:', data.datos.length, 'registros');

            if (data.datos.length === 0) {
                console.warn('⚠️ Sin datos');
                alert('No hay datos para el periodo seleccionado');
                return;
            }

            procesarYMostrarGraficas(data.datos, producto);

        } catch (error) {
            console.error('❌ Error:', error);
            alert('Error al cargar datos. Revisa la consola.');
        }
    }

    /**
     * Procesar datos y crear gráficas
     */
    function procesarYMostrarGraficas(datos, producto) {
        console.log('📊 Procesando datos...');

        // Datos de Humedad Base Frita
        const datosHumedad = datos
            .filter(r => r.humedad_base_frita !== null && r.humedad_base_frita !== undefined)
            .map(r => ({
                x: (r.fecha + ' ' + (r.hora || '')).trim(),
                y: parseFloat(r.humedad_base_frita),
                producto: r.producto,
                tambor: r.tambor
            }))
            .sort((a, b) => new Date(a.x) - new Date(b.x));

        // Datos de Aceite Base Frita
        const datosAceite = datos
            .filter(r => r.aceite_base_frita !== null && r.aceite_base_frita !== undefined)
            .map(r => ({
                x: (r.fecha + ' ' + (r.hora || '')).trim(),
                y: parseFloat(r.aceite_base_frita),
                producto: r.producto,
                tambor: r.tambor
            }))
            .sort((a, b) => new Date(a.x) - new Date(b.x));

        console.log('📈 Base - Humedad:', datosHumedad.length, '| Aceite:', datosAceite.length);

        crearGraficaHumedad(datosHumedad, producto);
        crearGraficaAceite(datosAceite, producto);
        
        // Datos de Producto Terminado (PT) - Combina datos de los 3 tanques
        const datosAceitePT = [];
        const datosHumedadPT = [];
        const datosSalPT = [];

        // Datos separados de Sal PT por tanque
        const datosSalPTT1 = [];
        const datosSalPTT2 = [];
        
        datos.forEach(r => {
            const fechaBase = (r.fecha + ' ' + (r.hora || '')).trim();
            
            // Tanque 1
            if (r.tanque1_aceite_pt !== null && r.tanque1_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            if (r.tanque1_humedad_pt !== null && r.tanque1_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            if (r.tanque1_sal_pt !== null && r.tanque1_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
                // Datos separados para Tanque 1
                datosSalPTT1.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            
            // Tanque 2
            if (r.tanque2_aceite_pt !== null && r.tanque2_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            if (r.tanque2_humedad_pt !== null && r.tanque2_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            if (r.tanque2_sal_pt !== null && r.tanque2_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
                // Datos separados para Tanque 2
                datosSalPTT2.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            
            // Tanque 3
            if (r.tanque3_aceite_pt !== null && r.tanque3_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
            if (r.tanque3_humedad_pt !== null && r.tanque3_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
            if (r.tanque3_sal_pt !== null && r.tanque3_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
        });
        
        // Ordenar por fecha
        datosAceitePT.sort((a, b) => new Date(a.x) - new Date(b.x));
        datosHumedadPT.sort((a, b) => new Date(a.x) - new Date(b.x));
        datosSalPT.sort((a, b) => new Date(a.x) - new Date(b.x));

        // Ordenar datos separados de Sal PT por tanque
        datosSalPTT1.sort((a, b) => new Date(a.x) - new Date(b.x));
        datosSalPTT2.sort((a, b) => new Date(a.x) - new Date(b.x));

        console.log('📈 PT - Aceite:', datosAceitePT.length, '| Humedad:', datosHumedadPT.length, '| Sal:', datosSalPT.length);
        console.log('📈 Sal PT separado - T1:', datosSalPTT1.length, '| T2:', datosSalPTT2.length);

        // Debug: mostrar algunos datos de ejemplo
        if (datosAceitePT.length > 0) {
            console.log('   Ejemplo Aceite PT:', datosAceitePT[0]);
        }
        if (datosHumedadPT.length > 0) {
            console.log('   Ejemplo Humedad PT:', datosHumedadPT[0]);
        }
        if (datosSalPT.length > 0) {
            console.log('   Ejemplo Sal PT:', datosSalPT[0]);
        }

        // Crear gráficas de PT solo si hay canvas y datos
        if (aceitePTCanvas) {
            if (datosAceitePT.length > 0) {
                console.log('🎨 Creando gráfica Aceite PT...');
                crearGraficaAceitePT(datosAceitePT, producto);
            } else {
                console.warn('⚠️ No hay datos de Aceite PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas aceite-pt-chart no disponible');
        }
        
        if (humedadPTCanvas) {
            if (datosHumedadPT.length > 0) {
                console.log('🎨 Creando gráfica Humedad PT...');
                crearGraficaHumedadPT(datosHumedadPT, producto);
            } else {
                console.warn('⚠️ No hay datos de Humedad PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas humedad-pt-chart no disponible');
        }
        
        if (salPTCanvas) {
            if (datosSalPTT1.length > 0 || datosSalPTT2.length > 0) {
                console.log('🎨 Creando gráfica Sal PT con T1 y T2...');
                crearGraficaSalPT(datosSalPTT1, datosSalPTT2, producto);
            } else {
                console.warn('⚠️ No hay datos de Sal PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas sal-pt-chart no disponible');
        }
    }

    /**
     * Crear gráfica de Humedad Base Frita
     */
    function crearGraficaHumedad(datos, productoSeleccionado) {
        const ctx = humedadCanvas.getContext('2d');

        if (humedadChart) {
            humedadChart.destroy();
        }

        // Obtener rangos del producto seleccionado (usa RANGOS_FISICOQUIMICOS_FINAL)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'humedad_base');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Humedad Base Frita (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites solo si hay producto específico con rangos
        if (rangos && rangos.verde) {
            // Líneas verdes (límites ideales)
            datasets.push({
                label: 'Límite Verde (min: ' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Límite Verde (max: ' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            // Líneas amarillas (límites de advertencia)
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((rangoAmarillo, idx) => {
                    if (rangoAmarillo.min !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (min: ' + rangoAmarillo.min + ')',
                            data: Array(datos.length).fill(rangoAmarillo.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (rangoAmarillo.max !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (max: ' + rangoAmarillo.max + ')',
                            data: Array(datos.length).fill(rangoAmarillo.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        // Calcular rango dinámico del eje Y usando la función calcularEjeY
        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Humedad - Eje Y auto-ajustado:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        humedadChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Humedad Base Frita',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Humedad (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Humedad creada');
    }

    /**
     * Crear gráfica de Aceite Base Frita
     */
    function crearGraficaAceite(datos, productoSeleccionado) {
        const ctx = aceiteCanvas.getContext('2d');

        if (aceiteChart) {
            aceiteChart.destroy();
        }

        // Obtener rangos del producto seleccionado (usa RANGOS_FISICOQUIMICOS_FINAL)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'aceite_base');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Aceite Base Frita (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 159, 64)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites solo si hay producto específico con rangos
        if (rangos && rangos.verde) {
            // Líneas verdes (límites ideales)
            datasets.push({
                label: 'Límite Verde (min: ' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Límite Verde (max: ' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            // Líneas amarillas (límites de advertencia)
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((rangoAmarillo, idx) => {
                    if (rangoAmarillo.min !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (min: ' + rangoAmarillo.min + ')',
                            data: Array(datos.length).fill(rangoAmarillo.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (rangoAmarillo.max !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (max: ' + rangoAmarillo.max + ')',
                            data: Array(datos.length).fill(rangoAmarillo.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        // Calcular rango dinámico del eje Y usando la función calcularEjeY
        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Aceite - Eje Y auto-ajustado:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        aceiteChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Aceite Base Frita',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Aceite (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Aceite creada');
    }

    // Listener para botón actualizar
    const btnActualizar = document.getElementById('actualizar-graficos-btn');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Botón clickeado');
            actualizarGraficas();
        });
        console.log('✅ Listener agregado');
    } else {
        console.warn('⚠️ Botón no encontrado');
    }

    // Cargar datos iniciales
    setTimeout(() => {
        console.log('⏰ Cargando datos iniciales...');
        actualizarGraficas();
    }, 500);


    /**
     * Crea la gráfica de Aceite Producto Terminado (PT)
     */
    function crearGraficaAceitePT(datos, productoSeleccionado) {
        if (!aceitePTCanvas) return;
        const ctx = aceitePTCanvas.getContext('2d');

        if (aceitePTChart) {
            aceitePTChart.destroy();
        }

        // Obtener rangos del producto (aceite_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'aceite_pt');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Aceite PT (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Verde min (' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Verde max (' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.min + ')',
                            data: Array(datos.length).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.max + ')',
                            data: Array(datos.length).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Aceite PT - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        aceitePTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Aceite PT',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Aceite PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Aceite PT creada');
    }

    /**
     * Crea la gráfica de Humedad Producto Terminado (PT)
     */
    function crearGraficaHumedadPT(datos, productoSeleccionado) {
        if (!humedadPTCanvas) return;
        const ctx = humedadPTCanvas.getContext('2d');

        if (humedadPTChart) {
            humedadPTChart.destroy();
        }

        // Obtener rangos del producto (humedad_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'humedad_pt');
        
        // Preparar datasets
        const datasets = [
            {
                label: 'Humedad PT (%)',
                data: datos.map(d => d.y),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ];

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Verde min (' + rangos.verde.min + ')',
                data: Array(datos.length).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Verde max (' + rangos.verde.max + ')',
                data: Array(datos.length).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            
            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.min + ')',
                            data: Array(datos.length).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Amarillo (' + r.max + ')',
                            data: Array(datos.length).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        const { yMin, yMax } = calcularEjeY(datos, rangos);
        console.log('📏 Humedad PT - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        humedadPTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.x),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Humedad PT',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0 && datos[context.dataIndex]) {
                                    const p = datos[context.dataIndex];
                                    return 'Producto: ' + p.producto + '\nTambor: ' + (p.tambor || 'N/A');
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Humedad PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Humedad PT creada');
    }

    /**
     * Crea la gráfica de Sal Producto Terminado (PT) con Tanque 1 y Tanque 2
     */
    function crearGraficaSalPT(datosT1, datosT2, productoSeleccionado) {
        if (!salPTCanvas) return;
        const ctx = salPTCanvas.getContext('2d');

        if (salPTChart) {
            salPTChart.destroy();
        }

        // Obtener rangos del producto (sal_pt)
        const rangos = obtenerRangos(categoria, productoSeleccionado, 'sal_pt');

        // Combinar todas las etiquetas únicas de ambos tanques y ordenarlas
        const todasLasEtiquetas = [...new Set([...datosT1.map(d => d.x), ...datosT2.map(d => d.x)])];
        todasLasEtiquetas.sort((a, b) => new Date(a) - new Date(b));

        // Crear mapas para acceso rápido
        const mapaT1 = new Map(datosT1.map(d => [d.x, d]));
        const mapaT2 = new Map(datosT2.map(d => [d.x, d]));

        // Preparar datos alineados con las etiquetas
        const valoresT1 = todasLasEtiquetas.map(etiqueta => {
            const dato = mapaT1.get(etiqueta);
            return dato ? dato.y : null;
        });

        const valoresT2 = todasLasEtiquetas.map(etiqueta => {
            const dato = mapaT2.get(etiqueta);
            return dato ? dato.y : null;
        });

        // Preparar datasets con las dos líneas de tendencia
        const datasets = [
            {
                label: 'Tanque 1',
                data: valoresT1,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                spanGaps: true
            },
            {
                label: 'Tanque 2',
                data: valoresT2,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(255, 159, 64)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                spanGaps: true
            }
        ];

        // Calcular longitud máxima para las líneas de límites
        const maxLength = todasLasEtiquetas.length;

        // Agregar líneas de límites si hay rangos
        if (rangos && rangos.verde) {
            datasets.push({
                label: 'Límite Verde min (' + rangos.verde.min + ')',
                data: Array(maxLength).fill(rangos.verde.min),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });
            datasets.push({
                label: 'Límite Verde max (' + rangos.verde.max + ')',
                data: Array(maxLength).fill(rangos.verde.max),
                borderColor: 'rgba(76, 175, 80, 0.9)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            });

            if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
                rangos.amarillo.forEach((r) => {
                    if (r.min !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (' + r.min + ')',
                            data: Array(maxLength).fill(r.min),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                    if (r.max !== undefined) {
                        datasets.push({
                            label: 'Límite Amarillo (' + r.max + ')',
                            data: Array(maxLength).fill(r.max),
                            borderColor: 'rgba(255, 193, 7, 0.9)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            fill: false,
                            pointRadius: 0
                        });
                    }
                });
            }
        }

        // Combinar todos los datos para calcular el eje Y
        const todosLosDatos = [...datosT1, ...datosT2];
        const { yMin, yMax } = calcularEjeY(todosLosDatos, rangos);
        console.log('📏 Sal PT (T1+T2) - Eje Y:', yMin.toFixed(2), 'a', yMax.toFixed(2));

        salPTChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: todasLasEtiquetas,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Sal PT - Tanque 1 vs Tanque 2',
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const idx = context.dataIndex;
                                const etiqueta = todasLasEtiquetas[idx];
                                if (context.datasetIndex === 0) {
                                    const dato = mapaT1.get(etiqueta);
                                    if (dato) return 'Producto: ' + dato.producto;
                                } else if (context.datasetIndex === 1) {
                                    const dato = mapaT2.get(etiqueta);
                                    if (dato) return 'Producto: ' + dato.producto;
                                }
                                return '';
                            }
                        }
                    },
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Sal PT (%)' },
                        min: yMin,
                        max: yMax
                    },
                    x: {
                        title: { display: true, text: 'Fecha y Hora' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    }
                }
            }
        });

        console.log('✅ Gráfica Sal PT (T1 + T2) creada');
    }

});