/**
 * Implementación de búsqueda y filtrado para PNC Simple
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de PNC Simple TORTILLA
    const currentUrl = window.location.href;
    if (currentUrl.includes('/pnc_simple/TORTILLA')) {
        // Inicializar funcionalidad de búsqueda y filtrado
        initializeSearch();
        initializeFilters();
    }
});

/**
 * Inicializar la funcionalidad de búsqueda en tiempo real
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Agregar event listener para búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterTable(searchTerm);
    });
    
    // Función para filtrar la tabla según el término de búsqueda
    function filterTable(searchTerm) {
        const table = document.querySelector('.pnc-simple-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            // Ignorar la fila de mensaje "no hay resultados"
            if (row.id === 'noResultsMessage') return;
            
            // Si no hay término de búsqueda, mostrar todas las filas
            if (!searchTerm) {
                row.style.display = '';
                visibleCount++;
                return;
            }
            
            // Obtener el texto de todas las celdas para buscar
            const cells = row.querySelectorAll('td');
            let found = false;
            
            cells.forEach(cell => {
                const text = cell.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    found = true;
                }
            });
            
            // Mostrar u ocultar la fila según si se encontró el término
            if (found) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Actualizar mensaje de no hay resultados
        if (visibleCount === 0) {
            showNoResultsMessage();
        } else {
            hideNoResultsMessage();
        }
    }
    
    // Función para actualizar el mensaje de "no hay resultados"
    function updateNoResultsMessage(rows) {
        // Verificar si hay alguna fila visible
        let visibleRows = 0;
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                visibleRows++;
            }
        });
        
        // Obtener o crear el elemento de mensaje
        let noResultsMessage = document.getElementById('noResultsMessage');
        
        if (visibleRows === 0) {
            // No hay resultados, mostrar mensaje
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('tr');
                noResultsMessage.id = 'noResultsMessage';
                noResultsMessage.innerHTML = `
                    <td colspan="9" class="text-center py-4">
                        <p class="text-muted mb-0">No se encontraron resultados para la búsqueda.</p>
                    </td>
                `;
                
                // Agregar el mensaje a la tabla
                const tbody = document.querySelector('.pnc-simple-table tbody');
                if (tbody) {
                    tbody.appendChild(noResultsMessage);
                }
            } else {
                noResultsMessage.style.display = '';
            }
        } else if (noResultsMessage) {
            // Hay resultados, ocultar mensaje
            noResultsMessage.style.display = 'none';
        }
    }
}

/**
 * Inicializar la funcionalidad de filtros avanzados
 */
function initializeFilters() {
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (!btnFiltrar) return;
    
    // Crear el modal de filtros si no existe
    createFilterModal();
    
    // Agregar event listener para abrir el modal de filtros
    btnFiltrar.addEventListener('click', function() {
        // Mostrar el modal
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });
    
    // Función para crear el modal de filtros
    function createFilterModal() {
        // Verificar si ya existe el modal
        if (document.getElementById('filterModal')) return;
        
        // Crear el elemento del modal
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal fade';
        modalDiv.id = 'filterModal';
        modalDiv.tabIndex = '-1';
        modalDiv.setAttribute('aria-labelledby', 'filterModalLabel');
        modalDiv.setAttribute('aria-hidden', 'true');
        
        // Añadir estilo para centrar las opciones de los select
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #filterModal .form-select option {
                text-align: center;
            }
            
            #filterModal .form-select {
                text-align-last: center;
                text-align: center;
                -moz-text-align-last: center;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Contenido del modal
        modalDiv.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="filterModalLabel">
                            <i class="fas fa-filter me-2"></i>Filtros Avanzados
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="filterForm">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="filterFechaDesde" class="form-label">Fecha desde:</label>
                                        <input type="date" class="form-control text-center" id="filterFechaDesde" name="fechaDesde">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="filterFechaHasta" class="form-label">Fecha hasta:</label>
                                        <input type="date" class="form-control text-center" id="filterFechaHasta" name="fechaHasta">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="filterTurno" class="form-label">Turno:</label>
                                        <select class="form-select text-center" id="filterTurno" name="turno">
                                            <option value="">Todos</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="filterProducto" class="form-label">Producto:</label>
                                        <select class="form-select text-center" id="filterProducto" name="producto">
                                            <option value="">Todos</option>
                                            <option value="DORITOS">DORITOS</option>
                                            <option value="TOSTITOS SALSA VERDE">TOSTITOS SALSA VERDE</option>
                                            <option value="TOSTITOS FH">TOSTITOS FH</option>
                                            <option value="DORITOS PIZZEROLA">DORITOS PIZZEROLA</option>
                                            <option value="DORITOS FH">DORITOS FH</option>
                                            <option value="RANCHERITOS">RANCHERITOS</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="filterStatus" class="form-label">Status:</label>
                                        <select class="form-select text-center" id="filterStatus" name="status">
                                            <option value="">Todos</option>
                                            <option value="RECHAZADO">RECHAZADO</option>
                                            <option value="DETENIDO">DETENIDO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="filterOrigen" class="form-label">Origen:</label>
                                        <select class="form-select text-center" id="filterOrigen" name="origen">
                                            <option value="">Todos</option>
                                            <option value="COCIMIENTO">COCIMIENTO</option>
                                            <option value="FREIDOR">FREIDOR</option>
                                            <option value="LIMPIEZA DE MAIZ">LIMPIEZA DE MAIZ</option>
                                            <option value="MOLINO/LAMINADOR">MOLINO/LAMINADOR</option>
                                            <option value="SAZONADO">SAZONADO</option>
                                            <option value="EMPAQUE GENERAL">EMPAQUE GENERAL</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="filterRechazo" class="form-label">Rechazo:</label>
                                        <select class="form-select text-center" id="filterRechazo" name="rechazo">
                                            <option value="">Todos</option>
                                            <option value="false">NO</option>
                                            <option value="true">SÍ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnAplicarFiltros">
                            <i class="fas fa-check me-1"></i>Aplicar Filtros
                        </button>
                        <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFiltros">
                            <i class="fas fa-undo me-1"></i>Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar el modal al documento
        document.body.appendChild(modalDiv);
        
        // Configurar los event listeners para los botones del modal
        document.getElementById('btnAplicarFiltros').addEventListener('click', function() {
            applyFilters();
            const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
            filterModal.hide();
        });
        
        document.getElementById('btnLimpiarFiltros').addEventListener('click', function() {
            clearFilters();
        });
    }
    
    // Función para aplicar los filtros a la tabla
    function applyFilters() {
        // Obtener los valores de los filtros
        const fechaDesde = document.getElementById('filterFechaDesde').value;
        const fechaHasta = document.getElementById('filterFechaHasta').value;
        const turno = document.getElementById('filterTurno').value;
        const producto = document.getElementById('filterProducto').value;
        const status = document.getElementById('filterStatus').value;
        const origen = document.getElementById('filterOrigen').value;
        const rechazo = document.getElementById('filterRechazo').value;
        
        // Verificar si hay algún filtro activo
        const hasActiveFilters = fechaDesde || fechaHasta || turno || producto || status || origen || rechazo;
        
        // Si no hay filtros activos, mostrar todas las filas y salir
        if (!hasActiveFilters) {
            showAllRows();
            updateFilterCounter({});
            return;
        }
        
        // Mostrar contador de filtros activos
        updateFilterCounter({
            fechaDesde,
            fechaHasta,
            turno,
            producto,
            status,
            origen,
            rechazo
        });
        
        // Obtener todas las filas de la tabla
        const table = document.querySelector('.pnc-simple-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        // Aplicar filtros a cada fila
        rows.forEach(row => {
            // Ignorar la fila de "no hay resultados" si existe
            if (row.id === 'noResultsMessage') return;
            
            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return; // Verificar que hay suficientes celdas
            
            // Obtener los valores de las celdas
            const fechaCell = cells[1].textContent.trim();
            const turnoCell = cells[2].textContent.trim();
            const productoCell = cells[3].textContent.trim();
            const origenCell = cells[6].textContent.trim();
            const statusCell = cells[7].textContent.trim();
            
            // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD para comparación
            let fechaCellConverted = '';
            if (fechaCell) {
                const parts = fechaCell.split('/');
                if (parts.length === 3) {
                    fechaCellConverted = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
            
            // Verificar cada filtro
            let showRow = true;
            
            // Filtro por fecha desde
            if (fechaDesde && fechaCellConverted && fechaCellConverted < fechaDesde) {
                showRow = false;
            }
            
            // Filtro por fecha hasta
            if (fechaHasta && fechaCellConverted && fechaCellConverted > fechaHasta) {
                showRow = false;
            }
            
            // Filtro por turno
            if (turno && turnoCell !== turno) {
                showRow = false;
            }
            
            // Filtro por producto
            if (producto && productoCell !== producto) {
                showRow = false;
            }
            
            // Filtro por origen
            if (origen && origenCell !== origen) {
                showRow = false;
            }
            
            // Filtro por status
            if (status && statusCell !== status) {
                showRow = false;
            }
            
            // Mostrar u ocultar la fila según los resultados del filtro
            if (showRow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        console.log(`Filas visibles después de filtrar: ${visibleCount}`);
        
        // Actualizar mensaje de no hay resultados
        if (visibleCount === 0) {
            showNoResultsMessage();
        } else {
            hideNoResultsMessage();
        }
    }
    
    // Función para mostrar todas las filas
    function showAllRows() {
        const table = document.querySelector('.pnc-simple-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // Ignorar la fila de mensaje "no hay resultados"
            if (row.id === 'noResultsMessage') return;
            row.style.display = '';
        });
        
        // Ocultar mensaje de no hay resultados
        hideNoResultsMessage();
    }
    
    // Función para mostrar el mensaje de "no hay resultados"
    function showNoResultsMessage() {
        // Obtener o crear el elemento de mensaje
        let noResultsMessage = document.getElementById('noResultsMessage');
        
        if (!noResultsMessage) {
            // Crear el mensaje si no existe
            noResultsMessage = document.createElement('tr');
            noResultsMessage.id = 'noResultsMessage';
            noResultsMessage.innerHTML = `
                <td colspan="9" class="text-center py-4">
                    <p class="text-muted mb-0">No se encontraron resultados con los filtros aplicados.</p>
                </td>
            `;
            
            // Agregar el mensaje a la tabla
            const tbody = document.querySelector('.pnc-simple-table tbody');
            if (tbody) {
                tbody.appendChild(noResultsMessage);
            }
        } else {
            // Mostrar el mensaje si ya existe
            noResultsMessage.style.display = '';
        }
    }
    
    // Función para ocultar el mensaje de "no hay resultados"
    function hideNoResultsMessage() {
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
    
    // Función para limpiar los filtros
    function clearFilters() {
        // Limpiar los campos de filtro
        document.getElementById('filterFechaDesde').value = '';
        document.getElementById('filterFechaHasta').value = '';
        document.getElementById('filterTurno').value = '';
        document.getElementById('filterProducto').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterOrigen').value = '';
        document.getElementById('filterRechazo').value = '';
        
        // Mostrar todas las filas
        showAllRows();
        
        // Limpiar contador de filtros
        updateFilterCounter({});
    }
    
    // Función para actualizar el contador de filtros activos
    function updateFilterCounter(filters) {
        // Contar filtros activos
        let activeFilters = 0;
        for (const key in filters) {
            if (filters[key]) {
                activeFilters++;
            }
        }
        
        // Buscar o crear el elemento para el contador
        let filterCounter = document.getElementById('filterCounter');
        if (!filterCounter) {
            filterCounter = document.createElement('span');
            filterCounter.id = 'filterCounter';
            filterCounter.className = 'badge bg-primary rounded-pill ms-2';
            
            // Agregar el contador junto al botón de filtro
            const btnFiltrar = document.getElementById('btnFiltrar');
            if (btnFiltrar) {
                btnFiltrar.appendChild(filterCounter);
            }
        }
        
        // Actualizar el contador
        if (activeFilters > 0) {
            filterCounter.textContent = activeFilters;
            filterCounter.style.display = '';
            
            // Actualizar también el estilo del botón
            const btnFiltrar = document.getElementById('btnFiltrar');
            if (btnFiltrar) {
                btnFiltrar.classList.remove('btn-outline-primary');
                btnFiltrar.classList.add('btn-primary');
            }
        } else {
            filterCounter.style.display = 'none';
            
            // Restaurar estilo del botón
            const btnFiltrar = document.getElementById('btnFiltrar');
            if (btnFiltrar) {
                btnFiltrar.classList.remove('btn-primary');
                btnFiltrar.classList.add('btn-outline-primary');
            }
        }
    }
}
