/**
 * Funcionalidad JavaScript OPTIMIZADA para análisis fisicoquímicos
 * 
 * Este script maneja la carga de datos REALES desde la API y la actualización de los gráficos
 * en la pestaña de Resultados de la página de análisis fisicoquímicos.
 * 
 * Optimizaciones implementadas:
 * - Procesamiento robusto de datos reales del formulario
 * - Rangos corregidos según especificaciones mostradas en la imagen
 * - Validación exhaustiva de datos numéricos
 * - Gráficos optimizados para mostrar tendencias reales
 * - Manejo inteligente de datos faltantes
 * - Mejor experiencia visual y de usuario
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando módulo OPTIMIZADO de análisis fisicoquímicos...');
    
    // Verificar si estamos en la página correcta
    const resultadosTab = document.getElementById('resultados-tab');
    const analisisTabContent = document.getElementById('analisisTabContent');
    
    if (!resultadosTab || !analisisTabContent) {
        console.log('❌ No se encontraron elementos de la pestaña de resultados');
        return;
    }
    
    // Variables para almacenar los objetos de gráficos
    let graficos = {
        humedadBase: null,
        aceiteBase: null,
        aceitePT: null,
        humedadPT: null,
        salPT: null
    };
    
    // Referencias a elementos DOM importantes
    const elementos = {
        periodoSelector: document.getElementById('periodo-selector'),
        productoSelector: document.getElementById('producto-selector'),
        fechaInicioFiltro: document.getElementById('fecha-inicio-filtro'),
        fechaFinFiltro: document.getElementById('fecha-fin-filtro'),
        btnActualizar: document.getElementById('actualizar-graficos-btn'),
        totalAnalisis: document.getElementById('total-analisis'),
        ultimoAnalisis: document.getElementById('ultimo-analisis')
    };
    
    // Obtener categoría de la URL
    const categoria = window.location.pathname.split('/').pop();
    console.log(`📊 Categoría detectada: ${categoria}`);
    
    // Configuración de rangos ideales CORREGIDOS según la imagen y por producto
    const rangosIdeales = {
        'EXTRUIDOS': {
            // Rangos por defecto para DORITOS/TORCIDITOS
            'default': {
                humedadBase: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 },
                aceiteBase: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 },
                aceitePT: { min: 32.46, max: 38.46, warning_low: 31.46, warning_high: 39.46 },
                humedadPT: { min: 0.5, max: 1.9, warning_low: 0.49, warning_high: 2.1 },
                salPT: { min: 0.95, max: 1.55, warning_low: 0.85, warning_high: 1.65 }
            },
            // Rangos específicos para Cheetos Xtra Flamin Hot
            'CHEETOS XTRA FLAMIN HOT': {
                humedadBase: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 }, // Mantener igual para base
                aceiteBase: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 }, // Mantener igual para base
                aceitePT: { min: 29.52, max: 35.52, warning_low: 28.51, warning_high: 36.01 },
                humedadPT: { min: 0.47, max: 1.67, warning_low: 0.47, warning_high: 2.07 },
                salPT: { min: 1.4, max: 1.8, warning_low: 1.19, warning_high: 2.01 }
            },
            // Rangos específicos para CHEETOS JALAQUEÑO - CORREGIDO EXACTO
            'CHEETOS JALAQUEÑO': {
                humedadBase: { min: 0.7, max: 1.7, warning_low: 0.60, warning_high: 1.80 },
                aceiteBase: { min: 21.7, max: 27.7, warning_low: 20.70, warning_high: 28.70 },
                // ACEITE PT: Verde 31.64-37.64, Amarillo 29.64-31.63 Y 37.65-39.64
                aceitePT: { 
                    min: 31.64, max: 37.64, 
                    amarillo_bajo_min: 29.64, amarillo_bajo_max: 31.63,
                    amarillo_alto_min: 37.65, amarillo_alto_max: 39.64
                },
                // HUMEDAD PT: Verde 0.5-1.9, Amarillo SOLO 1.91-2.10 (eliminado rango inferior)
                humedadPT: { min: 0.5, max: 1.9, warning_high: 2.10 },
                // SAL PT: Verde 1.06-1.66, Amarillo 0.95-1.05 Y 1.67-1.77
                salPT: { 
                    min: 1.06, max: 1.66,
                    amarillo_bajo_min: 0.95, amarillo_bajo_max: 1.05,
                    amarillo_alto_min: 1.67, amarillo_alto_max: 1.77
                },
                'CHEETOS EXTRA FH NUEVO': {
                    humedadBase: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 },
                    aceiteBase: { min: 21.7, max: 27.7, warning_low: 20.7, warning_high: 28.7 },
                    aceitePT: { min: 29.35, max: 35.35, warning_low: 27.35, warning_high: 37.35 },
                    humedadPT: { min: 0.5, max: 1.9},
                    salPT: { min: 1.16, max: 1.76, warning_low: 0.86, warning_high: 2.07 }
                    
            }
        },
        'TORTILLA': {
            'default': {
                humedadBase: { min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3 },
                aceiteBase: { min: 20, max: 23, warning_low: 19, warning_high: 24 },
                aceitePT: { min: 23.45, max: 26.45, warning_low: 29.64, warning_high: 39.64 },
                humedadPT: { min: 0.78, max: 1.58, warning_low: 0.68, warning_high: 1.68 },
                salPT: { min: 0.9, max: 1.5, warning_low: 0.8, warning_high: 1.6 }
            },
             // Rangos específicos para DORITOS
            'DORITOS': {
                humedadBase: { min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3 },
                aceiteBase: { min: 20, max:23, warning_low: 19, warning_high: 24 },
                aceitePT: { min: 23.45, max: 26.45, warning_low: 22.45, warning_high: 27.45 },
                humedadPT: { min: 0.78, max: 1.58, warning_low: 0.63, warning_high: 1.73 },
                salPT: { min: 0.9, max: 1.5, warning_low: 0.7, warning_high: 1.7 }
            },
            // Rangos específicos para TOSTITOS SALSA VERDE
            'TOSTITOS SALSA VERDE': {
                humedadBase: { min: 0.9, max: 1.3, warning_low: 0.8, warning_high: 1.4 },
                aceiteBase: { min: 22, max: 24, warning_low: 21, warning_high: 25 },
                aceitePT: { min: 23.14, max: 26.14, warning_low: 22.14, warning_high: 27.14 },
                humedadPT: { min: 1.03, max: 1.63, warning_low: 0.93, warning_high: 1.73 },
                salPT: { min: 0.97, max: 1.57, warning_low: 0.67, warning_high: 1.87 }
            },
            'TOSTITOS FH': {
                humedadBase: { min: 0.9, max: 1.3, warning_low: 0.8, warning_high: 1.4 },
                aceiteBase: { min: 22, max: 24, warning_low: 21, warning_high: 25 },
                aceitePT: { min: 22.98, max: 25.98, warning_low: 21.98, warning_high: 26.98 },
                humedadPT: { min: 0.94, max: 1.44, warning_low: 0.84, warning_high: 1.54},
                salPT: { min: 1.38, max: 1.98, warning_low: 1.18, warning_high: 2.18 }
            },
            // Rangos específicos para DORITOS INCÓGNITA - ACTUALIZADOS SEGÚN ESPECIFICACIONES
            'DORITOS INCÓGNITA': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.00, warning_high: 24.00 },
                aceitePT: { min: 22.35, max: 25.35, warning_low: 21.35, warning_high: 26.35 },
                humedadPT: { min: 1.02, max: 1.62, warning_low: 0.97, warning_high: 1.67 },
                salPT: { min: 0.72, max: 1.32, warning_low: 0.52, warning_high: 1.52 }
            },
            'DORITOS PIZZEROLA': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            },
            'DORITOS FH': {
                humedad_base: {min: 1, max: 1.2, warning_low: 0.9, warning_high: 1.3},
                aceite_base: {min: 20, max: 23, warning_low: 19.0, warning_high: 24},
                aceite_pt: {min: 22.71, max: 25.71, warning_low: 21.71, warning_high: 26.71},
                humedad_pt: {min: 1.12, max: 1.72, warning_low: 1.07, warning_high: 1.77},
                sal_pt: {min: 1.31, max: 1.91, warning_low: 1.11, warning_high: 2.11}
                        },
            'RANCHERITOS': {
                humedadBase: { min: 1.00, max: 1.20, warning_low: 0.90, warning_high: 1.30 },
                aceiteBase: { min: 20.00, max: 23.00, warning_low: 19.99, warning_high: 24.00 },
                aceitePT: { min: 22.83, max: 25.83, warning_low: 21.83, warning_high: 26.83 },
                humedadPT: { min: 0.99, max: 1.49, warning_low: 0.89, warning_high: 1.59 },
                salPT: { min: 1.10, max: 1.7, warning_low: 0.9, warning_high: 1.9 }
            },
            'RANCHERITOS': {
                humedad_base: {min: 0.8, max: 1.40, warning_low: 0.6, warning_high: 1.6},
                aceite_base: {min: 21.35, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                aceite_pt: {min: 22.01, max: 22.75, warning_low: 20.25, warning_high: 23.75},
                humedad_pt: {min: 0.94, max: 1.44, warning_low: 0.84, warning_high: 1.54},
                sal_pt: {min: 1.38, max: 1.98, warning_low: 1.18, warning_high: 2.18}
                        }
        },
        'PAPA': {
            'default': {
                humedadBase: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.8 },
                aceiteBase: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
                aceitePT: { min: 0, max: 0, warning_low: 0, warning_high: 0 },
                humedadPT: { min: 1.35, max: 1.8, warning_low: 1.20, warning_high: 2 },
                salPT: { min: 0.55, max: 0.85, warning_low: 0.45, warning_high: 0.95 }
            },

            'PAPA SAL': {
                humedadBase: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.8 },
                aceiteBase: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
                aceitePT: { min: 0, max: 0, warning_low: 0, warning_high: 0 },
                humedadPT: { min: 1.35, max: 1.8, warning_low: 1.20, warning_high: 2 },
                salPT: { min: 0.55, max: 0.85, warning_low: 0.45, warning_high: 0.95 }
            },

            'RUFFLES QUESO': {
                humedadBase: { min: 1.20, max: 1.5, warning_low: 1.05, warning_high: 1.65 },
                aceiteBase: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
                aceitePT: { min: 0, max: 0, warning_low: 0, warning_high: 0 },
                humedadPT: { min: 1.20, max: 1.5, warning_low: 1.05, warning_high: 1.65 },
                salPT: { min: 1.24, max: 1.54, warning_low: 1.19, warning_high: 1.59 }
            },
            'SABRITAS XTRA FH': {
                humedadBase: { min: 1.35, max: 1.65, warning_low: 1.20, warning_high: 1.80 },
                aceiteBase: { min: 31, max: 35, warning_low: 30, warning_high: 36 },
                aceitePT: { min: 32.21, max: 32.51, warning_low: 32.1, warning_high: 32.71 },
                humedadPT: { min: 1.41, max: 1.71, warning_low: 1.21, warning_high: 1.91 },
                salPT: { min: 1.58, max: 1.88, warning_low: 1.38, warning_high: 2.08 }
            }
        }
    };
    
    // Variable para almacenar el rango actual según producto seleccionado
    let rangoActual = null;
    
    // Función para obtener rangos según categoría y producto
    function obtenerRangos(categoria, producto = 'default') {
        const categoriaRangos = rangosIdeales[categoria] || rangosIdeales['TORTILLA'];
        return categoriaRangos[producto] || categoriaRangos['default'];
    }
    
    // Inicializar rangos por defecto
    rangoActual = obtenerRangos(categoria, 'default');
    
    // Configurar fechas por defecto (ayer a hoy)
    function configurarFechasPorDefecto() {
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);
        
        if (elementos.fechaInicioFiltro) {
            elementos.fechaInicioFiltro.value = ayer.toISOString().split('T')[0];
        }
        if (elementos.fechaFinFiltro) {
            elementos.fechaFinFiltro.value = hoy.toISOString().split('T')[0];
        }
    }
    
    // Configurar fechas al cargar
    configurarFechasPorDefecto();
    
    // Manejar cambio de período selector
    if (elementos.periodoSelector) {
        elementos.periodoSelector.addEventListener('change', function() {
            const periodo = this.value;
            const esPersonalizado = periodo === 'personalizado';
            
            // Habilitar/deshabilitar inputs de fecha
            if (elementos.fechaInicioFiltro) {
                elementos.fechaInicioFiltro.disabled = !esPersonalizado;
            }
            if (elementos.fechaFinFiltro) {
                elementos.fechaFinFiltro.disabled = !esPersonalizado;
            }
            
            // Si no es personalizado, limpiar fechas
            if (!esPersonalizado) {
                if (elementos.fechaInicioFiltro) elementos.fechaInicioFiltro.value = '';
                if (elementos.fechaFinFiltro) elementos.fechaFinFiltro.value = '';
            } else {
                // Si es personalizado, configurar fechas por defecto si están vacías
                if (!elementos.fechaInicioFiltro?.value || !elementos.fechaFinFiltro?.value) {
                    configurarFechasPorDefecto();
                }
            }
        });
        
        // Disparar evento inicial para configurar estado
        elementos.periodoSelector.dispatchEvent(new Event('change'));
    }
    
    // Función para destruir gráficos existentes
    function destruirGraficos() {
        Object.keys(graficos).forEach(key => {
            if (graficos[key]) {
                graficos[key].destroy();
                graficos[key] = null;
            }
        });
    }
    
    // Función para validar y convertir valores numéricos
    function validarValorNumerico(valor) {
        if (valor === null || valor === undefined || valor === '' || valor === 'None') {
            return null;
        }
        const numero = parseFloat(valor);
        return isNaN(numero) ? null : numero;
    }
    
    // Función para generar colores según rango - CORREGIDA PARA RANGOS DISCONTINUOS
    function generarColor(valor, rango, alpha = 0.7, producto = null) {
        const valorNumerico = validarValorNumerico(valor);
        
        if (valorNumerico === null) {
            return `rgba(169, 169, 169, ${alpha})`; // Gris para valores faltantes
        }
        
        // Verde: Dentro del rango principal
        if (valorNumerico >= rango.min && valorNumerico <= rango.max) {
            return `rgba(40, 167, 69, ${alpha})`; // Verde
        }
        
        // Amarillo: Verificar si hay rangos discontinuos (para CHEETOS JALAQUEÑO)
        if (rango.amarillo_bajo_min !== undefined) {
            // Rangos amarillos discontinuos específicos
            const enAmarilloBajo = (valorNumerico >= rango.amarillo_bajo_min && valorNumerico <= rango.amarillo_bajo_max);
            const enAmarilloAlto = (valorNumerico >= rango.amarillo_alto_min && valorNumerico <= rango.amarillo_alto_max);
            
            if (enAmarilloBajo || enAmarilloAlto) {
                return `rgba(255, 193, 7, ${alpha})`; // Amarillo
            }
        } else {
            // Lógica tradicional para otros productos
            if ((valorNumerico >= rango.warning_low && valorNumerico < rango.min) || 
                (valorNumerico > rango.max && valorNumerico <= rango.warning_high)) {
                return `rgba(255, 193, 7, ${alpha})`; // Amarillo
            }
        }
        
        // Rojo: Todo lo demás
        return `rgba(220, 53, 69, ${alpha})`; // Rojo
    }

    
    // Función para obtener datos desde la API (OPTIMIZADA PARA DATOS REALES)
    async function obtenerDatos(categoria, periodo, producto, fechaInicio = null, fechaFin = null) {
        try {
            let url = `/api/analisis_fisicoquimicos/${categoria}?periodo=${periodo}&producto=${producto}`;
            
            // Agregar fechas personalizadas si están disponibles
            if (periodo === 'personalizado' && fechaInicio && fechaFin) {
                url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
            }
            console.log(`🌐 Solicitando datos: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Datos recibidos:`, data);
            
            // Validar respuesta de la API
            if (!data.success && data.error) {
                throw new Error(data.error);
            }
            
            // Validar que los datos sean reales y no estén vacíos
            if (!data.datos || data.datos.length === 0) {
                console.log('⚠️ No hay datos disponibles para los filtros seleccionados');
                return {
                    datos: [],
                    resumen: {
                        total_registros: 0,
                        ultimo_registro: null,
                        productos: []
                    }
                };
            }
            
            // Los datos ya vienen validados desde la API optimizada
            const datosLimpios = data.datos;
            
            // Validación adicional en frontend para mayor seguridad
            const datosValidados = datosLimpios.map(registro => {
                return {
                    ...registro,
                    humedad_base_frita: validarValorNumerico(registro.humedad_base_frita),
                    aceite_base_frita: validarValorNumerico(registro.aceite_base_frita),
                    tanque1_aceite_pt: validarValorNumerico(registro.tanque1_aceite_pt),
                    tanque1_humedad_pt: validarValorNumerico(registro.tanque1_humedad_pt),
                    tanque1_sal_pt: validarValorNumerico(registro.tanque1_sal_pt),
                    tanque2_aceite_pt: validarValorNumerico(registro.tanque2_aceite_pt),
                    tanque2_humedad_pt: validarValorNumerico(registro.tanque2_humedad_pt),
                    tanque2_sal_pt: validarValorNumerico(registro.tanque2_sal_pt),
                    tanque3_aceite_pt: validarValorNumerico(registro.tanque3_aceite_pt),
                    tanque3_humedad_pt: validarValorNumerico(registro.tanque3_humedad_pt),
                    tanque3_sal_pt: validarValorNumerico(registro.tanque3_sal_pt)
                };
            });
            
            console.log(`📈 Datos procesados: ${datosValidados.length} registros válidos`);
            
            return {
                datos: datosValidados,
                resumen: data.resumen || {
                    total_registros: datosValidados.length,
                    ultimo_registro: datosValidados[datosValidados.length - 1]?.fecha,
                    productos: [...new Set(datosValidados.map(d => d.producto).filter(p => p))]
                }
            };
            
        } catch (error) {
            console.error('❌ Error al obtener datos:', error);
            mostrarMensajeError(`Error al cargar datos: ${error.message}`);
            return {
                datos: [],
                resumen: {
                    total_registros: 0,
                    ultimo_registro: null,
                    productos: []
                }
            };
        }
    }
    
    // Función para mostrar mensajes de error
    function mostrarMensajeError(mensaje) {
        const container = document.getElementById('resultados');
        if (container) {
            // Remover alertas anteriores
            const alertasAnteriores = container.querySelectorAll('.alert-error-api');
            alertasAnteriores.forEach(alerta => alerta.remove());
            
            const alert = document.createElement('div');
            alert.className = 'alert alert-warning alert-error-api mt-3';
            alert.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close float-end" aria-label="Close"></button>
            `;
            
            // Agregar funcionalidad al botón de cerrar
            const btnClose = alert.querySelector('.btn-close');
            btnClose.addEventListener('click', () => alert.remove());
            
            container.insertBefore(alert, container.firstChild);
            
            // Auto-remover después de 10 segundos
            setTimeout(() => alert.remove(), 10000);
        }
    }
    
    // Función para actualizar el resumen (MEJORADA)
    function actualizarResumen(resumen) {
        console.log('📈 Actualizando resumen:', resumen);
        
        if (elementos.totalAnalisis) {
            elementos.totalAnalisis.textContent = resumen.total_registros || 0;
        }
        
        if (elementos.ultimoAnalisis && resumen.ultimo_registro) {
            try {
                const fecha = new Date(resumen.ultimo_registro);
                elementos.ultimoAnalisis.textContent = fecha.toLocaleDateString('es-ES');
            } catch (e) {
                elementos.ultimoAnalisis.textContent = resumen.ultimo_registro;
            }
        } else if (elementos.ultimoAnalisis) {
            elementos.ultimoAnalisis.textContent = '-';
        }
        
        // Actualizar selector de productos dinámicamente
        if (elementos.productoSelector && resumen.productos && resumen.productos.length > 0) {
            const valorActual = elementos.productoSelector.value;
            
            // Guardar la primera opción (Todos)
            const primeraOpcion = elementos.productoSelector.options[0];
            
            // Limpiar todas las opciones
            elementos.productoSelector.innerHTML = '';
            
            // Restaurar la primera opción
            elementos.productoSelector.appendChild(primeraOpcion);
            
            // Añadir productos únicos encontrados en los datos
            const productosUnicos = [...new Set(resumen.productos.filter(p => p && p.trim() !== ''))];
            productosUnicos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto;
                option.textContent = producto;
                elementos.productoSelector.appendChild(option);
            });
            
            // Restaurar selección si existe
            if (valorActual && productosUnicos.includes(valorActual)) {
                elementos.productoSelector.value = valorActual;
            }
        }
    }
    
    // Función para preparar etiquetas de fecha CON HORA CORRECTA DE REGISTRO
    function prepararEtiquetas(datos) {
        return datos.map(d => {
            // Si existe fecha_hora_display, usarla directamente
            if (d.fecha_hora_display) {
                return d.fecha_hora_display;
            }
            
            // Construir fecha + hora de registro
            let fechaStr = '';
            
            // Procesar fecha
            if (d.fecha_iso) {
                const fecha = new Date(d.fecha_iso);
                fechaStr = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit', 
                    month: '2-digit'
                });
            } else if (d.fecha) {
                const fecha = new Date(d.fecha);
                fechaStr = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit', 
                    month: '2-digit'
                });
            }
            
            // Usar la hora exacta de registro (campo 'horario')
            const horaRegistro = d.horario || d.hora || '';
            
            // Combinar fecha y hora de registro
            if (horaRegistro && fechaStr) {
                return `${fechaStr} ${horaRegistro}`;
            } else if (fechaStr) {
                return fechaStr;
            } else {
                return 'Sin fecha';
            }
        });
    }
    
    // Gráfico de Humedad Base Frita (OPTIMIZADO - CAMBIO A LÍNEA DE TENDENCIA)
    function crearGraficoHumedadBase(datos) {
        const ctx = document.getElementById('humedad-base-chart');
        if (!ctx) {
            console.error('❌ No se encontró el canvas para Humedad Base');
            return;
        }
        
        // Filtrar solo datos con valores válidos
        const datosValidos = datos.filter(d => d.humedad_base_frita !== null && d.humedad_base_frita !== undefined);
        
        if (datosValidos.length === 0) {
            console.log('⚠️ No hay datos válidos para Humedad Base Frita');
            crearGraficoVacio(ctx, 'Humedad Base Frita');
            return;
        }
        
        const labels = prepararEtiquetas(datosValidos);
        const valores = datosValidos.map(d => parseFloat(d.humedad_base_frita));
        
        console.log('📊 Creando gráfico Humedad Base como línea de tendencia:', { 
            total: datos.length, 
            validos: datosValidos.length, 
            rango: rangoActual.humedadBase
        });
        
        if (graficos.humedadBase) graficos.humedadBase.destroy();
        
        // Dataset principal
        const datasets = [{
            label: 'Humedad Base Frita (%)',
            data: valores,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: valores.map((v, index) => {
                const producto = datosValidos[index]?.producto;
                if (v >= rangoActual.humedadBase.min && v <= rangoActual.humedadBase.max) {
                    return generarColor(v, rangoActual.humedadBase, 1, producto).replace('0.7', '1');
                } else if ((v >= rangoActual.humedadBase.warning_low && v < rangoActual.humedadBase.min) || 
                          (v > rangoActual.humedadBase.max && v <= rangoActual.humedadBase.warning_high)) {
                    return 'rgba(255, 193, 7, 1)';
                } else {
                    return 'rgba(220, 53, 69, 1)';
                }
            }),
            pointBorderColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }];
        
        // Agregar líneas de referencia
        const lineaMinima = {
            label: `Límite Mín (${rangoActual.humedadBase.min}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadBase.min),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };
        
        const lineaMaxima = {
            label: `Límite Máx (${rangoActual.humedadBase.max}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadBase.max),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };
        
        datasets.push(lineaMinima, lineaMaxima);
        
        graficos.humedadBase = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return `${context.dataset.label}: Sin datos`;
                                return `${context.dataset.label}: ${valor.toFixed(2)}%`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null || context.dataset.label.includes('Límite')) return '';
                                if (valor >= rangoActual.humedadBase.min && valor <= rangoActual.humedadBase.max) {
                                    return '✅ Dentro de rango ideal';
                                } else if (valor >= rangoActual.humedadBase.warning_low && valor <= rangoActual.humedadBase.warning_high) {
                                    return '⚠️ En zona de advertencia';
                                } else {
                                    return '❌ Fuera de especificación';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, rangoActual.humedadBase.min - 0.2),
                        max: rangoActual.humedadBase.max + 0.2,
                        title: {
                            display: true,
                            text: 'Humedad (%)'
                        },
                        grid: {
                            color: function(context) {
                                const value = context.tick.value;
                                if (value === rangoActual.humedadBase.min || value === rangoActual.humedadBase.max) {
                                    return 'rgba(40, 167, 69, 0.5)';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Aceite Base Frita (OPTIMIZADO - CAMBIO A LÍNEA DE TENDENCIA)
    function crearGraficoAceiteBase(datos) {
        const ctx = document.getElementById('aceite-base-chart');
        if (!ctx) {
            console.error('❌ No se encontró el canvas para Aceite Base');
            return;
        }
        
        // Filtrar solo datos con valores válidos
        const datosValidos = datos.filter(d => d.aceite_base_frita !== null && d.aceite_base_frita !== undefined);
        
        if (datosValidos.length === 0) {
            console.log('⚠️ No hay datos válidos para Aceite Base Frita');
            crearGraficoVacio(ctx, 'Aceite Base Frita');
            return;
        }
        
        const labels = prepararEtiquetas(datosValidos);
        const valores = datosValidos.map(d => parseFloat(d.aceite_base_frita));
        
        console.log('📊 Creando gráfico Aceite Base como línea de tendencia:', { 
            total: datos.length, 
            validos: datosValidos.length,
            rango: rangoActual.aceiteBase
        });
        
        if (graficos.aceiteBase) graficos.aceiteBase.destroy();
        
        // Dataset principal
        const datasets = [{
            label: 'Aceite Base Frita (%)',
            data: valores,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: valores.map((v, index) => {
                const producto = datosValidos[index]?.producto;
                return generarColor(v, rangoActual.aceiteBase, 1, producto);
            }),
            pointBorderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }];
        
        // Agregar líneas de referencia
        const lineaMinima = {
            label: `Límite Mín (${rangoActual.aceiteBase.min}%)`,
            data: new Array(labels.length).fill(rangoActual.aceiteBase.min),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };
        
        const lineaMaxima = {
            label: `Límite Máx (${rangoActual.aceiteBase.max}%)`,
            data: new Array(labels.length).fill(rangoActual.aceiteBase.max),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };
        
        datasets.push(lineaMinima, lineaMaxima);
        
        graficos.aceiteBase = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return `${context.dataset.label}: Sin datos`;
                                return `${context.dataset.label}: ${valor.toFixed(2)}%`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null || context.dataset.label.includes('Límite')) return '';
                                if (valor >= rangoActual.aceiteBase.min && valor <= rangoActual.aceiteBase.max) {
                                    return '✅ Dentro de rango ideal';
                                } else if (valor >= rangoActual.aceiteBase.warning_low && valor <= rangoActual.aceiteBase.warning_high) {
                                    return '⚠️ En zona de advertencia';
                                } else {
                                    return '❌ Fuera de especificación';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, rangoActual.aceiteBase.min - 3),
                        max: rangoActual.aceiteBase.max + 3,
                        title: {
                            display: true,
                            text: 'Aceite (%)'
                        },
                        grid: {
                            color: function(context) {
                                const value = context.tick.value;
                                if (value === rangoActual.aceiteBase.min || value === rangoActual.aceiteBase.max) {
                                    return 'rgba(40, 167, 69, 0.5)';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Función auxiliar para crear gráfico vacío
    function crearGraficoVacio(ctx, titulo) {
        const canvas = ctx.getContext('2d');
        
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Sin datos'],
                datasets: [{
                    label: titulo,
                    data: [0],
                    backgroundColor: ['rgba(200, 200, 200, 0.3)'],
                    borderColor: ['rgba(200, 200, 200, 0.6)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    y: { display: false },
                    x: { display: false }
                }
            }
        });
    }
    
    // Gráfico de Aceite PT por Tambor (OPTIMIZADO)
    function crearGraficoAceitePT(datos) {
        const ctx = document.getElementById('aceite-pt-chart');
        if (!ctx) return;
        
        const labels = prepararEtiquetas(datos);
        const datasets = [
            {
                label: 'Tambor 1',
                data: datos.map(d => validarValorNumerico(d.tanque1_aceite_pt)),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Tambor 2',
                data: datos.map(d => validarValorNumerico(d.tanque2_aceite_pt)),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: false
            }
        ];
        
        // Solo agregar Tambor 3 si no es EXTRUIDOS
        if (categoria !== 'EXTRUIDOS') {
            datasets.push({
                label: 'Tambor 3',
                data: datos.map(d => validarValorNumerico(d.tanque3_aceite_pt)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false
            });
        }
        
        console.log('📊 Creando gráfico Aceite PT:', { labels: labels.length, datasets: datasets.length });

        if (graficos.aceitePT) graficos.aceitePT.destroy();

        // Agregar líneas de referencia con colores según rangos (verde, amarillo, rojo)
        // Líneas verdes (rango ideal)
        const lineaVerdeMin = {
            label: `✅ Verde Mín (${rangoActual.aceitePT.min}%)`,
            data: new Array(labels.length).fill(rangoActual.aceitePT.min),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaVerdeMax = {
            label: `✅ Verde Máx (${rangoActual.aceitePT.max}%)`,
            data: new Array(labels.length).fill(rangoActual.aceitePT.max),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Líneas amarillas (rango de advertencia)
        const lineaAmarillaMin = {
            label: `⚠️ Amarillo Mín (${rangoActual.aceitePT.warning_low}%)`,
            data: new Array(labels.length).fill(rangoActual.aceitePT.warning_low),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaAmarillaMax = {
            label: `⚠️ Amarillo Máx (${rangoActual.aceitePT.warning_high}%)`,
            data: new Array(labels.length).fill(rangoActual.aceitePT.warning_high),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Agregar líneas de referencia a los datasets
        datasets.push(lineaVerdeMin, lineaVerdeMax, lineaAmarillaMin, lineaAmarillaMax);

        // Calcular rango dinámico basado en los datos reales
        const valoresReales = [];
        datasets.forEach(dataset => {
            if (!dataset.label.includes('Límite')) {
                dataset.data.forEach(valor => {
                    if (valor !== null && valor !== undefined && !isNaN(valor)) {
                        valoresReales.push(valor);
                    }
                });
            }
        });

        let yMin, yMax;
        if (valoresReales.length > 0) {
            const dataMin = Math.min(...valoresReales);
            const dataMax = Math.max(...valoresReales);
            const margin = (dataMax - dataMin) * 0.15 || 3; // 15% margen o mínimo 3
            yMin = Math.max(0, dataMin - margin);
            yMax = dataMax + margin;

            // Incluir las líneas de límite (verde y amarillo) en el rango visible
            if (rangoActual.aceitePT.warning_low > 0) {
                yMin = Math.min(yMin, rangoActual.aceitePT.warning_low - 2);
            }
            if (rangoActual.aceitePT.warning_high > 0) {
                yMax = Math.max(yMax, rangoActual.aceitePT.warning_high + 2);
            }
        } else {
            // Si no hay datos, usar rangos por defecto con margen para amarillo
            yMin = rangoActual.aceitePT.warning_low > 0 ? rangoActual.aceitePT.warning_low - 3 : 25;
            yMax = rangoActual.aceitePT.warning_high > 0 ? rangoActual.aceitePT.warning_high + 3 : 40;
        }

        graficos.aceitePT = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return `${context.dataset.label}: Sin datos`;
                                return `${context.dataset.label}: ${valor.toFixed(2)}%`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return '';
                                if (valor >= rangoActual.aceitePT.min && valor <= rangoActual.aceitePT.max) {
                                    return '✅ Dentro de rango';
                                } else {
                                    return '❌ Fuera de rango';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: yMin,
                        max: yMax,
                        title: {
                            display: true,
                            text: 'Aceite PT (%)'
                        },
                        grid: {
                            color: function(context) {
                                const value = context.tick.value;
                                // Resaltar líneas verdes
                                if (value === rangoActual.aceitePT.min || value === rangoActual.aceitePT.max) {
                                    return 'rgba(40, 167, 69, 0.5)';
                                }
                                // Resaltar líneas amarillas
                                if (value === rangoActual.aceitePT.warning_low || value === rangoActual.aceitePT.warning_high) {
                                    return 'rgba(255, 193, 7, 0.4)';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Humedad PT por Tambor (OPTIMIZADO)
    function crearGraficoHumedadPT(datos) {
        const ctx = document.getElementById('humedad-pt-chart');
        if (!ctx) return;
        
        const labels = prepararEtiquetas(datos);
        const datasets = [
            {
                label: 'Tambor 1',
                data: datos.map(d => validarValorNumerico(d.tanque1_humedad_pt)),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Tambor 2',
                data: datos.map(d => validarValorNumerico(d.tanque2_humedad_pt)),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: false
            }
        ];
        
        // Solo agregar Tambor 3 si no es EXTRUIDOS
        if (categoria !== 'EXTRUIDOS') {
            datasets.push({
                label: 'Tambor 3',
                data: datos.map(d => validarValorNumerico(d.tanque3_humedad_pt)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false
            });
        }
        
        if (graficos.humedadPT) graficos.humedadPT.destroy();

        // Agregar líneas de referencia con colores según rangos (verde, amarillo)
        // Líneas verdes (rango ideal)
        const lineaVerdeMinHumedad = {
            label: `✅ Verde Mín (${rangoActual.humedadPT.min}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadPT.min),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaVerdeMaxHumedad = {
            label: `✅ Verde Máx (${rangoActual.humedadPT.max}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadPT.max),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Líneas amarillas (rango de advertencia)
        const lineaAmarillaMinHumedad = {
            label: `⚠️ Amarillo Mín (${rangoActual.humedadPT.warning_low}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadPT.warning_low),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaAmarillaMaxHumedad = {
            label: `⚠️ Amarillo Máx (${rangoActual.humedadPT.warning_high}%)`,
            data: new Array(labels.length).fill(rangoActual.humedadPT.warning_high),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Agregar líneas de referencia a los datasets
        datasets.push(lineaVerdeMinHumedad, lineaVerdeMaxHumedad, lineaAmarillaMinHumedad, lineaAmarillaMaxHumedad);

        // Calcular rango dinámico basado en los datos reales
        const valoresRealesHumedad = [];
        datasets.forEach(dataset => {
            if (!dataset.label.includes('Límite')) {
                dataset.data.forEach(valor => {
                    if (valor !== null && valor !== undefined && !isNaN(valor)) {
                        valoresRealesHumedad.push(valor);
                    }
                });
            }
        });

        let yMinHumedad, yMaxHumedad;
        if (valoresRealesHumedad.length > 0) {
            const dataMin = Math.min(...valoresRealesHumedad);
            const dataMax = Math.max(...valoresRealesHumedad);
            const margin = (dataMax - dataMin) * 0.15 || 0.3; // 15% margen o mínimo 0.3
            yMinHumedad = Math.max(0, dataMin - margin);
            yMaxHumedad = dataMax + margin;

            // Incluir las líneas de límite (verde y amarillo) en el rango visible
            yMinHumedad = Math.min(yMinHumedad, rangoActual.humedadPT.warning_low - 0.2);
            yMaxHumedad = Math.max(yMaxHumedad, rangoActual.humedadPT.warning_high + 0.2);
        } else {
            // Si no hay datos, usar rangos por defecto con margen para amarillo
            yMinHumedad = Math.max(0, rangoActual.humedadPT.warning_low - 0.3);
            yMaxHumedad = rangoActual.humedadPT.warning_high + 0.3;
        }

        graficos.humedadPT = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return `${context.dataset.label}: Sin datos`;
                                return `${context.dataset.label}: ${valor.toFixed(2)}%`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return '';
                                if (valor >= rangoActual.humedadPT.min && valor <= rangoActual.humedadPT.max) {
                                    return '✅ Dentro de rango';
                                } else {
                                    return '❌ Fuera de rango';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: yMinHumedad,
                        max: yMaxHumedad,
                        title: {
                            display: true,
                            text: 'Humedad PT (%)'
                        },
                        grid: {
                            color: function(context) {
                                const value = context.tick.value;
                                // Resaltar líneas verdes
                                if (value === rangoActual.humedadPT.min || value === rangoActual.humedadPT.max) {
                                    return 'rgba(40, 167, 69, 0.5)';
                                }
                                // Resaltar líneas amarillas
                                if (value === rangoActual.humedadPT.warning_low || value === rangoActual.humedadPT.warning_high) {
                                    return 'rgba(255, 193, 7, 0.4)';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Sal PT por Tambor (OPTIMIZADO)
    function crearGraficoSalPT(datos) {
        const ctx = document.getElementById('sal-pt-chart');
        if (!ctx) return;
        
        const labels = prepararEtiquetas(datos);
        const datasets = [
            {
                label: 'Tambor 1',
                data: datos.map(d => validarValorNumerico(d.tanque1_sal_pt)),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Tambor 2',
                data: datos.map(d => validarValorNumerico(d.tanque2_sal_pt)),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: false
            }
        ];
        
        // Solo agregar Tambor 3 si no es EXTRUIDOS
        if (categoria !== 'EXTRUIDOS') {
            datasets.push({
                label: 'Tambor 3',
                data: datos.map(d => validarValorNumerico(d.tanque3_sal_pt)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false
            });
        }

        if (graficos.salPT) graficos.salPT.destroy();

        // Agregar líneas de referencia con colores según rangos (verde, amarillo)
        // Líneas verdes (rango ideal)
        const lineaVerdeMinSal = {
            label: `✅ Verde Mín (${rangoActual.salPT.min}%)`,
            data: new Array(labels.length).fill(rangoActual.salPT.min),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaVerdeMaxSal = {
            label: `✅ Verde Máx (${rangoActual.salPT.max}%)`,
            data: new Array(labels.length).fill(rangoActual.salPT.max),
            borderColor: 'rgba(40, 167, 69, 0.9)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Líneas amarillas (rango de advertencia)
        const lineaAmarillaMinSal = {
            label: `⚠️ Amarillo Mín (${rangoActual.salPT.warning_low}%)`,
            data: new Array(labels.length).fill(rangoActual.salPT.warning_low),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        const lineaAmarillaMaxSal = {
            label: `⚠️ Amarillo Máx (${rangoActual.salPT.warning_high}%)`,
            data: new Array(labels.length).fill(rangoActual.salPT.warning_high),
            borderColor: 'rgba(255, 193, 7, 0.8)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            borderDash: [10, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0
        };

        // Agregar líneas de referencia a los datasets
        datasets.push(lineaVerdeMinSal, lineaVerdeMaxSal, lineaAmarillaMinSal, lineaAmarillaMaxSal);

        // Calcular rango dinámico basado en los datos reales
        const valoresRealesSal = [];
        datasets.forEach(dataset => {
            if (!dataset.label.includes('Límite')) {
                dataset.data.forEach(valor => {
                    if (valor !== null && valor !== undefined && !isNaN(valor)) {
                        valoresRealesSal.push(valor);
                    }
                });
            }
        });

        let yMinSal, yMaxSal;
        if (valoresRealesSal.length > 0) {
            const dataMin = Math.min(...valoresRealesSal);
            const dataMax = Math.max(...valoresRealesSal);
            const margin = (dataMax - dataMin) * 0.15 || 0.3; // 15% margen o mínimo 0.3
            yMinSal = Math.max(0, dataMin - margin);
            yMaxSal = dataMax + margin;

            // Incluir las líneas de límite (verde y amarillo) en el rango visible
            yMinSal = Math.min(yMinSal, rangoActual.salPT.warning_low - 0.2);
            yMaxSal = Math.max(yMaxSal, rangoActual.salPT.warning_high + 0.2);
        } else {
            // Si no hay datos, usar rangos por defecto con margen para amarillo
            yMinSal = Math.max(0, rangoActual.salPT.warning_low - 0.3);
            yMaxSal = rangoActual.salPT.warning_high + 0.3;
        }

        graficos.salPT = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return `${context.dataset.label}: Sin datos`;
                                return `${context.dataset.label}: ${valor.toFixed(2)}%`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y;
                                if (valor === null) return '';
                                if (valor >= rangoActual.salPT.min && valor <= rangoActual.salPT.max) {
                                    return '✅ Dentro de rango';
                                } else {
                                    return '❌ Fuera de rango';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: yMinSal,
                        max: yMaxSal,
                        title: {
                            display: true,
                            text: 'Sal PT (%)'
                        },
                        grid: {
                            color: function(context) {
                                const value = context.tick.value;
                                // Resaltar líneas verdes
                                if (value === rangoActual.salPT.min || value === rangoActual.salPT.max) {
                                    return 'rgba(40, 167, 69, 0.5)';
                                }
                                // Resaltar líneas amarillas
                                if (value === rangoActual.salPT.warning_low || value === rangoActual.salPT.warning_high) {
                                    return 'rgba(255, 193, 7, 0.4)';
                                }
                                return 'rgba(0, 0, 0, 0.1)';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Función para mostrar overlay de carga
    function mostrarCarga() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <div class="mt-2">Actualizando gráficos...</div>
                </div>
            </div>
        `;
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 1000;
            display: flex;
        `;
        
        const container = document.getElementById('resultados');
        if (container) {
            container.style.position = 'relative';
            container.appendChild(overlay);
        }
        
        return overlay;
    }
    
    // Función para ocultar overlay de carga
    function ocultarCarga() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // Función principal para actualizar todos los gráficos (OPTIMIZADA)
    async function actualizarGraficos() {
        console.log('🔄 Iniciando actualización de gráficos...');
        
        const overlay = mostrarCarga();
        
        try {
            // Obtener valores de filtros
            let periodo = elementos.periodoSelector ? elementos.periodoSelector.value : 'mes';
            const producto = elementos.productoSelector ? elementos.productoSelector.value : 'todos';
            
            // Si es personalizado, usar fechas específicas
            let fechaInicio = null;
            let fechaFin = null;
            
            if (periodo === 'personalizado') {
                fechaInicio = elementos.fechaInicioFiltro?.value;
                fechaFin = elementos.fechaFinFiltro?.value;
                
                // MEJORADA: Validación más robusta de fechas
                if (!fechaInicio || !fechaFin) {
                    mostrarMensajeError('Por favor seleccione fechas de inicio y fin válidas para el filtro personalizado.');
                    return;
                }
                
                // Validar formato de fechas
                const fechaInicioObj = new Date(fechaInicio);
                const fechaFinObj = new Date(fechaFin);
                
                if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
                    mostrarMensajeError('Las fechas seleccionadas no tienen un formato válido.');
                    return;
                }
                
                if (fechaInicioObj > fechaFinObj) {
                    mostrarMensajeError('La fecha de inicio no puede ser mayor que la fecha de fin.');
                    return;
                }
                
                // Validar que no se seleccione un rango muy amplio (más de 1 año)
                const diffTime = Math.abs(fechaFinObj - fechaInicioObj);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 365) {
                    mostrarMensajeError('El rango de fechas no puede ser mayor a 1 año. Por favor seleccione un período más corto.');
                    return;
                }
                
                console.log(`📅 Fechas personalizadas válidas: ${fechaInicio} a ${fechaFin} (${diffDays} días)`);
            }
            
            console.log(`📋 Filtros aplicados: período=${periodo}, producto=${producto}, categoría=${categoria}`);

            // Deshabilitar botón durante la carga
            if (elementos.btnActualizar) {
                elementos.btnActualizar.disabled = true;
                elementos.btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Cargando...';
            }

            // Obtener datos con fechas validadas
            const response = await obtenerDatos(categoria, periodo, producto, fechaInicio, fechaFin);

            // Actualizar resumen
            if (response.resumen) {
                actualizarResumen(response.resumen);
            }

            // Verificar si hay datos para mostrar
            const datos = response.datos || [];
            console.log(`📊 Procesando ${datos.length} registros para gráficos`);

            if (datos.length === 0) {
                // Mostrar mensaje específico según el filtro
                let mensaje = 'No hay datos disponibles para los filtros seleccionados.';
                if (periodo === 'personalizado') {
                    mensaje += ` Intente con un rango de fechas diferente (${fechaInicio} - ${fechaFin}).`;
                } else {
                    mensaje += ' Intente con un período diferente o seleccione "Todos" los productos.';
                }

                mostrarMensajeError(mensaje);
                // Limpiar gráficos existentes
                destruirGraficos();
            } else {
                // Actualizar rangos según el producto seleccionado
                // Si no hay producto seleccionado (todos), usar el primer producto de los datos
                let productoParaRangos = producto;
                if (producto === 'todos' && datos.length > 0) {
                    // Buscar el primer producto no vacío en los datos
                    for (let i = 0; i < datos.length; i++) {
                        if (datos[i].producto && datos[i].producto.trim() !== '') {
                            productoParaRangos = datos[i].producto;
                            console.log(`📦 Usando primer producto encontrado para rangos: ${productoParaRangos}`);
                            break;
                        }
                    }
                    // Si no se encontró ningún producto, usar default
                    if (productoParaRangos === 'todos') {
                        productoParaRangos = 'default';
                    }
                } else if (producto === 'todos') {
                    productoParaRangos = 'default';
                }

                rangoActual = obtenerRangos(categoria, productoParaRangos);
                console.log(`📊 Rangos actualizados para gráficos (${productoParaRangos}):`, rangoActual);

                // Crear gráficos con datos reales y rangos actualizados
                crearGraficoHumedadBase(datos);
                crearGraficoAceiteBase(datos);
                crearGraficoAceitePT(datos);
                crearGraficoHumedadPT(datos);
                crearGraficoSalPT(datos);
                
                console.log('✅ Gráficos actualizados correctamente con datos reales y rangos dinámicos');
                
                // NUEVO: Mostrar información del rango de fechas actual (MEJORADO)
                if (periodo === 'personalizado' && fechaInicio && fechaFin) {
                    const infoFechas = document.createElement('div');
                    infoFechas.className = 'alert alert-primary shadow-sm border-0 mt-3';
                    infoFechas.style.cssText = 'font-size: 1.1rem; padding: 1rem 1.5rem;';
                    infoFechas.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-calendar-alt me-3" style="font-size: 1.3rem; color: #0d6efd;"></i>
                                <div>
                                    <strong style="font-size: 1.15rem;">Período personalizado activo</strong><br>
                                    <span class="text-muted">
                                        Del <strong class="text-dark">${new Date(fechaInicio).toLocaleDateString('es-ES')}</strong> 
                                        al <strong class="text-dark">${new Date(fechaFin).toLocaleDateString('es-ES')}</strong>
                                        • <span class="badge bg-primary ms-1">${datos.length} registros</span>
                                    </span>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-outline-primary btn-sm" onclick="cambiarFiltroFechas()" title="Cambiar fechas">
                                    <i class="fas fa-edit me-1"></i> Cambiar
                                </button>
                                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="limpiarFiltroFechas()" title="Quitar filtro">
                                    <i class="fas fa-times me-1"></i> Quitar
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Remover mensajes anteriores
                    const container = document.getElementById('resultados');
                    const alertasAnteriores = container.querySelectorAll('.alert-primary');
                    alertasAnteriores.forEach(alerta => {
                        if (alerta.innerHTML.includes('Período personalizado activo')) {
                            alerta.remove();
                        }
                    });
                    
                    container.insertBefore(infoFechas, container.firstChild);
                }
            }
            
        } catch (error) {
            console.error('❌ Error crítico al actualizar gráficos:', error);
            mostrarMensajeError(`Error crítico: ${error.message}. Por favor contacte al administrador del sistema.`);
            
        } finally {
            // Restaurar botón
            if (elementos.btnActualizar) {
                elementos.btnActualizar.disabled = false;
                elementos.btnActualizar.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Actualizar Gráficos';
            }
            
            ocultarCarga();
        }
    }
    
    // Configurar eventos
    if (elementos.btnActualizar) {
        elementos.btnActualizar.addEventListener('click', actualizarGraficos);
        console.log('✅ Evento de actualización configurado');
    }
    
    // Función para cambiar rangos según producto seleccionado
    function cambiarRangosPorProducto() {
        const productoSeleccionado = elementos.productoSelector ? elementos.productoSelector.value : 'default';
        console.log(`🔄 Cambiando rangos para producto: ${productoSeleccionado}`);
        
        // Actualizar tooltips y labels en los formularios
        actualizarTooltipsFormulario();
        
        // Actualizar gráficos con los nuevos rangos (esto ya maneja la actualización de rangos internamente)
        actualizarGraficos();
    }
    
    // Función para actualizar tooltips en formularios
    function actualizarTooltipsFormulario() {
        // Obtener el producto seleccionado actualmente
        const productoSeleccionado = elementos.productoSelector ? elementos.productoSelector.value : 'default';
        const productoParaRangos = (productoSeleccionado === 'todos') ? 'default' : productoSeleccionado;
        const rangosActuales = obtenerRangos(categoria, productoParaRangos);
        
        // Actualizar tooltips en modales si están visibles
        const spanElements = {
            'humedad_base_frita': '.input-group-text',
            'aceite_base_frita': '.input-group-text',
            'tanque1_aceite_pt': '.input-group-text',
            'tanque1_humedad_pt': '.input-group-text', 
            'tanque1_sal_pt': '.input-group-text'
        };
        
        // Solo actualizar si los modales están abiertos para evitar errores
        if (document.querySelector('#createAnalisisModal.show') || document.querySelector('#editAnalisisModal.show')) {
            Object.keys(spanElements).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    const span = field.closest('.input-group')?.querySelector(spanElements[fieldId]);
                    if (span) {
                        if (fieldId.includes('humedad_base')) {
                            span.textContent = `${rangosActuales.humedadBase.min} - ${rangosActuales.humedadBase.max}`;
                        } else if (fieldId.includes('aceite_base')) {
                            span.textContent = `${rangosActuales.aceiteBase.min} - ${rangosActuales.aceiteBase.max}`;
                        } else if (fieldId.includes('aceite_pt')) {
                            span.textContent = `${rangosActuales.aceitePT.min} - ${rangosActuales.aceitePT.max}`;
                        } else if (fieldId.includes('humedad_pt')) {
                            span.textContent = `${rangosActuales.humedadPT.min} - ${rangosActuales.humedadPT.max}`;
                        } else if (fieldId.includes('sal_pt')) {
                            span.textContent = `${rangosActuales.salPT.min} - ${rangosActuales.salPT.max}`;
                        }
                    }
                }
            });
        }
    }
    
    // Auto-actualizar cuando cambien los filtros
    if (elementos.periodoSelector) {
        elementos.periodoSelector.addEventListener('change', actualizarGraficos);
    }
    
    if (elementos.productoSelector) {
        elementos.productoSelector.addEventListener('change', cambiarRangosPorProducto);
    }
    
    // Auto-actualizar cuando cambien las fechas personalizadas
    if (elementos.fechaInicioFiltro) {
        elementos.fechaInicioFiltro.addEventListener('change', function() {
            if (elementos.periodoSelector?.value === 'personalizado') {
                actualizarGraficos();
            }
        });
    }
    
    if (elementos.fechaFinFiltro) {
        elementos.fechaFinFiltro.addEventListener('change', function() {
            if (elementos.periodoSelector?.value === 'personalizado') {
                actualizarGraficos();
            }
        });
    }
    
    // Configurar evento para mostrar gráficos cuando se active la pestaña
    resultadosTab.addEventListener('shown.bs.tab', function() {
        console.log('👁️ Pestaña de resultados activada - cargando gráficos');
        setTimeout(actualizarGraficos, 200); // Delay para asegurar que el DOM está listo
    });
    
    // Eventos para los selectores de productos en modales
    const productoCreateSelect = document.getElementById('producto');
    const productoEditSelect = document.getElementById('edit_producto');
    
    if (productoCreateSelect) {
        productoCreateSelect.addEventListener('change', function() {
            const productoSeleccionado = this.value;
            const productoParaRangos = productoSeleccionado || 'default';
            const nuevosRangos = obtenerRangos(categoria, productoParaRangos);
            actualizarTooltipsModal('create', nuevosRangos);
        });
    }
    
    if (productoEditSelect) {
        productoEditSelect.addEventListener('change', function() {
            const productoSeleccionado = this.value;
            const productoParaRangos = productoSeleccionado || 'default';
            const nuevosRangos = obtenerRangos(categoria, productoParaRangos);
            actualizarTooltipsModal('edit', nuevosRangos);
        });
    }
    
    // Función para actualizar tooltips en modales específicos
    function actualizarTooltipsModal(modalType, rangos) {
        const prefix = modalType === 'edit' ? 'edit_' : '';
        
        // Actualizar humedad base
        const humedadBaseField = document.getElementById(`${prefix}humedad_base_frita`);
        if (humedadBaseField) {
            const span = humedadBaseField.closest('.input-group')?.querySelector('.input-group-text');
            if (span) span.textContent = `${rangos.humedadBase.min} - ${rangos.humedadBase.max}`;
        }
        
        // Actualizar aceite base
        const aceiteBaseField = document.getElementById(`${prefix}aceite_base_frita`);
        if (aceiteBaseField) {
            const span = aceiteBaseField.closest('.input-group')?.querySelector('.input-group-text');
            if (span) span.textContent = `${rangos.aceiteBase.min} - ${rangos.aceiteBase.max}`;
        }
        
        // Actualizar campos de tambores
        for (let i = 1; i <= 3; i++) {
            // Aceite PT
            const aceiteField = document.getElementById(`${prefix}tanque${i}_aceite_pt`);
            if (aceiteField) {
                const span = aceiteField.closest('.input-group')?.querySelector('.input-group-text');
                if (span) span.textContent = `${rangos.aceitePT.min} - ${rangos.aceitePT.max}`;
            }
            
            // Humedad PT
            const humedadField = document.getElementById(`${prefix}tanque${i}_humedad_pt`);
            if (humedadField) {
                const span = humedadField.closest('.input-group')?.querySelector('.input-group-text');
                if (span) span.textContent = `${rangos.humedadPT.min} - ${rangos.humedadPT.max}`;
            }
            
            // Sal PT
            const salField = document.getElementById(`${prefix}tanque${i}_sal_pt`);
            if (salField) {
                const span = salField.closest('.input-group')?.querySelector('.input-group-text');
                if (span) span.textContent = `${rangos.salPT.min} - ${rangos.salPT.max}`;
            }
        }
        
        console.log(`✅ Tooltips actualizados en modal ${modalType} con rangos:`, rangos);
    }
    
    // Inicializar gráficos si ya estamos en la pestaña de resultados
    if (resultadosTab.classList.contains('active')) {
        console.log('🚀 Pestaña ya activa, iniciando carga inicial...');
        setTimeout(actualizarGraficos, 500);
    }
    
    // Limpiar gráficos al salir de la página
    window.addEventListener('beforeunload', function() {
        destruirGraficos();
    });
    
    // Funciones globales para el indicador de fechas
    window.cambiarFiltroFechas = function() {
        // Enfocar en los campos de fecha para facilitar el cambio
        if (elementos.fechaInicioFiltro) {
            elementos.fechaInicioFiltro.focus();
            elementos.fechaInicioFiltro.select();
        }
        
        // Scroll suave hacia los controles de filtro
        const filtrosContainer = document.querySelector('.row.mb-4');
        if (filtrosContainer) {
            filtrosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    window.limpiarFiltroFechas = function() {
        // Cambiar a período por defecto
        if (elementos.periodoSelector) {
            elementos.periodoSelector.value = 'mes';
            elementos.periodoSelector.dispatchEvent(new Event('change'));
        }
        
        // Limpiar campos de fecha
        if (elementos.fechaInicioFiltro) elementos.fechaInicioFiltro.value = '';
        if (elementos.fechaFinFiltro) elementos.fechaFinFiltro.value = '';
        
        // Remover el indicador
        const container = document.getElementById('resultados');
        const alertasAnteriores = container.querySelectorAll('.alert-primary');
        alertasAnteriores.forEach(alerta => {
            if (alerta.innerHTML.includes('Período personalizado activo')) {
                alerta.remove();
            }
        });
        
        // Actualizar gráficos automáticamente
        setTimeout(actualizarGraficos, 100);
    };
    
    console.log('✅ Módulo de análisis fisicoquímicos OPTIMIZADO inicializado correctamente');
});
