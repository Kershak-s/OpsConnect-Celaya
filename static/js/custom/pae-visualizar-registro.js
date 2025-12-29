/**
 * PAE - Visualización de Registros Guardados
 * Permite ver registros completados con colores de validación
 */

(function() {
    'use strict';

    console.log('📋 PAE Visualización de Registros - Cargando...');

    /**
     * Muestra el detalle de un registro PAE en un modal
     */
    window.mostrarRegistroPAE = function(categoria, hora, turno) {
        console.log(`📊 Cargando registro: ${categoria} - Hora ${hora} - Turno ${turno}`);

        // Crear o obtener modal
        let modal = document.getElementById('modalVisualizarRegistro');
        if (!modal) {
            modal = crearModalVisualizacion();
            document.body.appendChild(modal);
        }

        // Mostrar loading
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando registro...</p>
            </div>
        `;

        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Obtener datos del registro
        const url = `/api/pae/${categoria}/registro/${hora}?turno=${turno}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderizarRegistro(modal, data);
                } else {
                    mostrarError(modalBody, data.error || 'Error desconocido');
                }
            })
            .catch(error => {
                console.error('Error cargando registro:', error);
                mostrarError(modalBody, 'Error al cargar el registro');
            });
    };

    /**
     * Crea el modal de visualización
     */
    function crearModalVisualizacion() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'modalVisualizarRegistro';
        modal.setAttribute('tabindex', '-1');
        modal.innerHTML = `
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-clipboard-check me-2"></i>
                            <span id="modalTituloRegistro">Registro PAE</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cerrar
                        </button>
                        <button type="button" class="btn btn-primary" id="btnEditarRegistro">
                            <i class="fas fa-edit me-2"></i>Editar Registro
                        </button>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    /**
     * Renderiza el contenido del registro en el modal
     */
    function renderizarRegistro(modal, data) {
        // Actualizar título
        const titulo = modal.querySelector('#modalTituloRegistro');
        titulo.textContent = `Registro PAE ${data.categoria} - Hora ${data.hora_str} - Turno ${data.turno}`;

        // Configurar botón editar
        const btnEditar = modal.querySelector('#btnEditarRegistro');
        btnEditar.onclick = () => {
            window.location.href = `/pae/${data.categoria}/registro/${data.hora}`;
        };

        // Renderizar body según categoría
        const modalBody = modal.querySelector('.modal-body');

        if (data.categoria === 'PAPA') {
            modalBody.innerHTML = renderizarRegistroPAPA(data);
        } else if (data.categoria === 'EXTRUIDOS') {
            modalBody.innerHTML = renderizarRegistroEXTRUIDOS(data);
        } else if (data.categoria === 'TORTILLA') {
            modalBody.innerHTML = renderizarRegistroTORTILLA(data);
        } else {
            modalBody.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Visualización no implementada para ${data.categoria}
                </div>
            `;
        }
    }

    /**
     * Renderiza un registro PAPA con todos sus campos y colores
     */
    function renderizarRegistroPAPA(data) {
        let html = `
            <!-- Información del Registro -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-info-circle me-2"></i>
                        Información del Registro
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <strong>Fecha:</strong><br>${data.fecha_display}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Bloque:</strong><br>${data.hora_str}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Muestreo:</strong><br>${data.hora_muestreo}
                        </div>
                        <div class="col-md-3">
                            <strong>Producto:</strong><br>${data.producto}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campos de Atributos con Validación -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Atributos Evaluados
                    </h6>
                </div>
                <div class="card-body">
        `;

        // Renderizar cada sección de campos
        for (const [seccion, campos] of Object.entries(data.campos)) {
            html += `
                <h6 class="mt-3 mb-3 fw-bold text-secondary border-bottom pb-2">
                    ${seccion}
                </h6>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="table-light">
                            <tr>
                                <th width="10%">Código</th>
                                <th width="35%">Atributo</th>
                                <th width="15%">Valor</th>
                                <th width="15%">Porcentaje</th>
                                <th width="25%">Rangos</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            campos.forEach(campo => {
                const colorClass = obtenerClaseColor(campo.color);
                const valorDisplay = campo.valor || '-';
                const porcentajeDisplay = campo.porcentaje !== null ? `${campo.porcentaje}%` : '-';

                let rangosHTML = '';
                if (campo.rango_info) {
                    rangosHTML = `
                        <small>
                            <span class="badge bg-success me-1">✓ ${campo.rango_info.verde}</span>
                            ${campo.rango_info.amarillo ? `<span class="badge bg-warning text-dark">⚠ ${campo.rango_info.amarillo}</span>` : ''}
                        </small>
                    `;
                }

                html += `
                    <tr>
                        <td><strong>${campo.codigo}</strong></td>
                        <td>${campo.nombre}</td>
                        <td class="${colorClass}">
                            <strong>${valorDisplay}</strong>
                        </td>
                        <td>${porcentajeDisplay}</td>
                        <td>${rangosHTML}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <!-- Evaluación Sensorial -->
            <div class="card mb-4">
                <div class="card-header bg-info text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-utensils me-2"></i>
                        Evaluación Sensorial
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h6 class="fw-bold">Apariencia</h6>
                            <p class="mb-1">${data.sensorial.apariencia}</p>
                            ${data.sensorial.apariencia_comentario ?
                                `<small class="text-muted">${data.sensorial.apariencia_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Textura</h6>
                            <p class="mb-1">${data.sensorial.textura}</p>
                            ${data.sensorial.textura_comentario ?
                                `<small class="text-muted">${data.sensorial.textura_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Sabor</h6>
                            <p class="mb-1">${data.sensorial.sabor}</p>
                            ${data.sensorial.sabor_comentario ?
                                `<small class="text-muted">${data.sensorial.sabor_comentario}</small>` :
                                ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Observaciones -->
            ${data.observaciones !== 'Sin observaciones' ? `
            <div class="card mb-4">
                <div class="card-header bg-secondary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-comment me-2"></i>
                        Observaciones
                    </h6>
                </div>
                <div class="card-body">
                    <p class="mb-0">${data.observaciones}</p>
                </div>
            </div>
            ` : ''}

            <!-- Leyenda de Colores -->
            <div class="card">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-palette me-2"></i>
                        Leyenda de Colores
                    </h6>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex align-items-center">
                            <span class="badge bg-success me-2" style="min-width: 60px;">Verde</span>
                            <span>Dentro de especificación</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-warning text-dark me-2" style="min-width: 60px;">Amarillo</span>
                            <span>Requiere acción correctiva</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-danger me-2" style="min-width: 60px;">Rojo</span>
                            <span>Fuera de especificación</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pie de página con info de creación -->
            <div class="mt-3 text-center text-muted">
                <small>
                    <i class="fas fa-clock me-1"></i>
                    Registro creado: ${data.created_at}
                </small>
            </div>
        `;

        return html;
    }

    /**
     * Obtiene la clase CSS según el color de validación
     */
    function obtenerClaseColor(color) {
        const clasesColor = {
            'ok': 'bg-success bg-opacity-25 text-success fw-bold',
            'warning': 'bg-warning bg-opacity-25 text-warning fw-bold',
            'error': 'bg-danger bg-opacity-25 text-danger fw-bold',
            'empty': ''
        };
        return clasesColor[color] || '';
    }

    /**
     * Renderiza un registro EXTRUIDOS con todos sus campos y colores
     */
    function renderizarRegistroEXTRUIDOS(data) {
        let html = `
            <!-- Información del Registro -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-info-circle me-2"></i>
                        Información del Registro
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <strong>Fecha:</strong><br>${data.fecha_display}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Bloque:</strong><br>${data.hora_str}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Muestreo:</strong><br>${data.hora_muestreo}
                        </div>
                        <div class="col-md-3">
                            <strong>Producto:</strong><br>${data.producto}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campos de Atributos con Validación -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Atributos Evaluados
                    </h6>
                </div>
                <div class="card-body">
        `;

        // Renderizar cada sección de campos
        for (const [seccion, campos] of Object.entries(data.campos)) {
            html += `
                <h6 class="mt-3 mb-3 fw-bold text-secondary border-bottom pb-2">
                    ${seccion}
                </h6>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="table-light">
                            <tr>
                                <th width="10%">Código</th>
                                <th width="45%">Atributo</th>
                                <th width="20%">Valor</th>
                                <th width="25%">Rango Verde</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            campos.forEach(campo => {
                const colorClass = obtenerClaseColor(campo.color);
                const valorDisplay = campo.valor || '-';

                let rangosHTML = '';
                if (campo.rango_info) {
                    rangosHTML = `
                        <small>
                            <span class="badge bg-success">✓ ${campo.rango_info.verde}</span>
                        </small>
                    `;
                }

                html += `
                    <tr>
                        <td><strong>${campo.codigo}</strong></td>
                        <td>${campo.nombre}</td>
                        <td class="${colorClass}">
                            <strong>${valorDisplay}</strong>
                        </td>
                        <td>${rangosHTML}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <!-- Evaluación Sensorial -->
            <div class="card mb-4">
                <div class="card-header bg-info text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-utensils me-2"></i>
                        Evaluación Sensorial
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h6 class="fw-bold">Apariencia</h6>
                            <p class="mb-1">${data.sensorial.apariencia}</p>
                            ${data.sensorial.apariencia_comentario ?
                                `<small class="text-muted">${data.sensorial.apariencia_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Textura</h6>
                            <p class="mb-1">${data.sensorial.textura}</p>
                            ${data.sensorial.textura_comentario ?
                                `<small class="text-muted">${data.sensorial.textura_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Sabor</h6>
                            <p class="mb-1">${data.sensorial.sabor}</p>
                            ${data.sensorial.sabor_comentario ?
                                `<small class="text-muted">${data.sensorial.sabor_comentario}</small>` :
                                ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Observaciones -->
            ${data.observaciones !== 'Sin observaciones' ? `
            <div class="card mb-4">
                <div class="card-header bg-secondary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-comment me-2"></i>
                        Observaciones
                    </h6>
                </div>
                <div class="card-body">
                    <p class="mb-0">${data.observaciones}</p>
                </div>
            </div>
            ` : ''}

            <!-- Leyenda de Colores -->
            <div class="card">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-palette me-2"></i>
                        Leyenda de Colores
                    </h6>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex align-items-center">
                            <span class="badge bg-success me-2" style="min-width: 60px;">Verde</span>
                            <span>Dentro de especificación</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-danger me-2" style="min-width: 60px;">Rojo</span>
                            <span>Fuera de especificación</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pie de página con info de creación -->
            <div class="mt-3 text-center text-muted">
                <small>
                    <i class="fas fa-clock me-1"></i>
                    Registro creado: ${data.created_at}
                </small>
            </div>
        `;

        return html;
    }

    /**
     * Renderiza un registro TORTILLA con todos sus campos y colores
     */
    function renderizarRegistroTORTILLA(data) {
        let html = `
            <!-- Información del Registro -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-info-circle me-2"></i>
                        Información del Registro
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <strong>Fecha:</strong><br>${data.fecha_display}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Bloque:</strong><br>${data.hora_str}
                        </div>
                        <div class="col-md-3">
                            <strong>Hora Muestreo:</strong><br>${data.hora_muestreo}
                        </div>
                        <div class="col-md-3">
                            <strong>Producto:</strong><br>${data.producto}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campos de Atributos -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Atributos Evaluados
                    </h6>
                </div>
                <div class="card-body">
        `;

        // Renderizar cada sección de campos
        for (const [seccion, campos] of Object.entries(data.campos)) {
            html += `
                <h6 class="mt-3 mb-3 fw-bold text-secondary border-bottom pb-2">
                    ${seccion}
                </h6>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="table-light">
                            <tr>
                                <th width="10%">Código</th>
                                <th width="50%">Atributo</th>
                                <th width="40%">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            campos.forEach(campo => {
                const colorClass = obtenerClaseColor(campo.color);
                const valorDisplay = campo.valor || '-';

                html += `
                    <tr>
                        <td><strong>${campo.codigo}</strong></td>
                        <td>${campo.nombre}</td>
                        <td class="${colorClass}">
                            <strong>${valorDisplay}</strong>
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <!-- Evaluación Sensorial -->
            <div class="card mb-4">
                <div class="card-header bg-info text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-utensils me-2"></i>
                        Evaluación Sensorial
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h6 class="fw-bold">Apariencia</h6>
                            <p class="mb-1">${data.sensorial.apariencia}</p>
                            ${data.sensorial.apariencia_comentario ?
                                `<small class="text-muted">${data.sensorial.apariencia_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Textura</h6>
                            <p class="mb-1">${data.sensorial.textura}</p>
                            ${data.sensorial.textura_comentario ?
                                `<small class="text-muted">${data.sensorial.textura_comentario}</small>` :
                                ''}
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Sabor</h6>
                            <p class="mb-1">${data.sensorial.sabor}</p>
                            ${data.sensorial.sabor_comentario ?
                                `<small class="text-muted">${data.sensorial.sabor_comentario}</small>` :
                                ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Registro cada 4 Horas TORTILLA -->
            ${data.registro_4horas_tortilla && data.registro_4horas_tortilla.aplica ? `
            <div class="card mb-4">
                <div class="card-header bg-warning text-dark">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-clock me-2"></i>
                        Registro cada 4 Horas
                    </h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th width="40%">Campo</th>
                                    <th width="30%">Valor</th>
                                    <th width="30%">Rango Verde</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Cocimiento</strong> - Tiempo de reposo</td>
                                    <td class="${obtenerColorTortilla4h(data.registro_4horas_tortilla.tiempo_reposo, 10, 18)}">
                                        ${data.registro_4horas_tortilla.tiempo_reposo || '-'}
                                    </td>
                                    <td><span class="badge bg-success">10 - 18</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Molino</strong> - Temperatura de masa</td>
                                    <td class="${obtenerColorTortilla4h(data.registro_4horas_tortilla.temp_masa, 32, 38)}">
                                        ${data.registro_4horas_tortilla.temp_masa ? data.registro_4horas_tortilla.temp_masa + ' °C' : '-'}
                                    </td>
                                    <td><span class="badge bg-success">32 - 38 °C</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Molino</strong> - Humedad de masa</td>
                                    <td class="${obtenerColorTortilla4h(data.registro_4horas_tortilla.humedad_masa, 49.5, 51.5)}">
                                        ${data.registro_4horas_tortilla.humedad_masa ? data.registro_4horas_tortilla.humedad_masa + '%' : '-'}
                                    </td>
                                    <td><span class="badge bg-success">49.5 - 51.5%</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Laminado</strong> - Peso de 10 base frita</td>
                                    <td class="${obtenerColorPesoBase(data.registro_4horas_tortilla.peso_10_base, data.producto)}">
                                        ${data.registro_4horas_tortilla.peso_10_base ? data.registro_4horas_tortilla.peso_10_base + 'g' : '-'}
                                    </td>
                                    <td><span class="badge bg-success">${obtenerRangoPesoBase(data.producto)}</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Freidor</strong> - Temperatura de freidor recto</td>
                                    <td class="${obtenerColorTortilla4h(data.registro_4horas_tortilla.temp_freidor, 183.3, 186.7)}">
                                        ${data.registro_4horas_tortilla.temp_freidor ? data.registro_4horas_tortilla.temp_freidor + ' °C' : '-'}
                                    </td>
                                    <td><span class="badge bg-success">183.3 - 186.7 °C</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Observaciones -->
            ${data.observaciones !== 'Sin observaciones' ? `
            <div class="card mb-4">
                <div class="card-header bg-secondary text-white">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-comment me-2"></i>
                        Observaciones
                    </h6>
                </div>
                <div class="card-body">
                    <p class="mb-0">${data.observaciones}</p>
                </div>
            </div>
            ` : ''}

            <!-- Leyenda de Colores -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0 fw-bold">
                        <i class="fas fa-palette me-2"></i>
                        Leyenda de Colores
                    </h6>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex align-items-center">
                            <span class="badge bg-success me-2" style="min-width: 60px;">Verde</span>
                            <span>Dentro de especificación</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-danger me-2" style="min-width: 60px;">Rojo</span>
                            <span>Fuera de especificación</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pie de página con info de creación -->
            <div class="mt-3 text-center text-muted">
                <small>
                    <i class="fas fa-clock me-1"></i>
                    Registro creado: ${data.created_at}
                </small>
            </div>
        `;

        return html;
    }

    /**
     * Obtiene el color para campos de 4 horas TORTILLA
     */
    function obtenerColorTortilla4h(valor, min, max) {
        if (valor === null || valor === undefined) return '';
        const numValor = parseFloat(valor);
        if (isNaN(numValor)) return '';
        if (numValor >= min && numValor <= max) {
            return 'bg-success bg-opacity-25 text-success fw-bold';
        }
        return 'bg-danger bg-opacity-25 text-danger fw-bold';
    }

    /**
     * Obtiene el color para Peso de 10 base frita según producto
     */
    function obtenerColorPesoBase(valor, producto) {
        if (valor === null || valor === undefined) return '';
        const numValor = parseFloat(valor);
        if (isNaN(numValor)) return '';

        // Rangos según producto
        const productosTostitos = ['TOSTITOS SALSA VERDE', 'TOSTITOS FH'];
        let min, max;

        if (productosTostitos.includes(producto)) {
            min = 24;
            max = 27;
        } else {
            // DORITOS, DORITOS INCÓGNITA, DORITOS PIZZEROLA, DORITOS FH, RANCHERITOS
            min = 23.5;
            max = 26.5;
        }

        if (numValor >= min && numValor <= max) {
            return 'bg-success bg-opacity-25 text-success fw-bold';
        }
        return 'bg-danger bg-opacity-25 text-danger fw-bold';
    }

    /**
     * Obtiene el rango de peso base según producto
     */
    function obtenerRangoPesoBase(producto) {
        const productosTostitos = ['TOSTITOS SALSA VERDE', 'TOSTITOS FH'];
        if (productosTostitos.includes(producto)) {
            return '24 - 27g';
        }
        return '23.5 - 26.5g';
    }

    /**
     * Muestra un mensaje de error en el modal
     */
    function mostrarError(container, mensaje) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Error:</strong> ${mensaje}
            </div>
        `;
    }

    console.log('✅ PAE Visualización de Registros - Listo');
})();
