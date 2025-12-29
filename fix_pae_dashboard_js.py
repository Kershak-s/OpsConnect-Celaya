#!/usr/bin/env python3
"""
Actualiza el JavaScript del dashboard PAE para manejar fechas personalizadas
"""

# Leer archivo
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar evento para mostrar/ocultar campos de fecha cuando se selecciona "Personalizado"
# Buscar la función configurarEventosFiltros
old_config = """// Configurar eventos de filtros
    function configurarEventosFiltros() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const btnActualizar = document.getElementById('btn-actualizar-resumen');
        const btnReporteCompleto = document.getElementById('btn-reporte-completo');
        
        if (btnFiltrar) {
            btnFiltrar.addEventListener('click', cargarDatosGraficos);
        }"""

new_config = """// Configurar eventos de filtros
    function configurarEventosFiltros() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const btnActualizar = document.getElementById('btn-actualizar-resumen');
        const btnReporteCompleto = document.getElementById('btn-reporte-completo');
        const filterPeriodo = document.getElementById('filter-periodo');
        const dateRangeContainer = document.getElementById('date-range-container');
        
        // Mostrar/ocultar campos de fecha según periodo seleccionado
        if (filterPeriodo && dateRangeContainer) {
            filterPeriodo.addEventListener('change', function() {
                if (this.value === 'personalizado') {
                    dateRangeContainer.style.display = 'block';
                    // Establecer fecha de hoy por defecto
                    const today = new Date().toISOString().split('T')[0];
                    document.getElementById('filter-fecha-inicio').value = today;
                    document.getElementById('filter-fecha-fin').value = today;
                } else {
                    dateRangeContainer.style.display = 'none';
                }
            });
        }
        
        if (btnFiltrar) {
            btnFiltrar.addEventListener('click', cargarDatosGraficos);
        }"""

if old_config in content:
    content = content.replace(old_config, new_config)
    print("✅ Evento para mostrar/ocultar fechas agregado")
else:
    print("⚠️  No se encontró función configurarEventosFiltros")

# 2. Actualizar la función cargarDatosGraficos para incluir fechas
old_fetch = """    // Cargar datos para gráficos
    function cargarDatosGraficos() {
        const categoria = document.getElementById('tab-content').dataset.category;
        const periodo = document.getElementById('filter-periodo')?.value || 'turno';
        const turno = document.getElementById('filter-turno')?.value || 'all';
        const producto = document.getElementById('filter-producto')?.value || 'all';
        
        ['loadingChart1', 'loadingChart2', 'loadingChart3'].forEach(id => {
            const loading = document.getElementById(id);
            if (loading) loading.style.display = 'block';
        });
        
        fetch(`/pae/${categoria}/datos?periodo=${periodo}&turno=${turno}&producto=${producto}`)"""

new_fetch = """    // Cargar datos para gráficos
    function cargarDatosGraficos() {
        const categoria = document.getElementById('tab-content').dataset.category;
        const periodo = document.getElementById('filter-periodo')?.value || 'turno';
        const turno = document.getElementById('filter-turno')?.value || 'all';
        const producto = document.getElementById('filter-producto')?.value || 'all';
        
        // Construir URL con parámetros
        let url = `/pae/${categoria}/datos?periodo=${periodo}&turno=${turno}&producto=${producto}`;
        
        // Agregar fechas si periodo es personalizado
        if (periodo === 'personalizado') {
            const fechaInicio = document.getElementById('filter-fecha-inicio')?.value;
            const fechaFin = document.getElementById('filter-fecha-fin')?.value;
            if (fechaInicio && fechaFin) {
                url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
            }
        }
        
        ['loadingChart1', 'loadingChart2', 'loadingChart3'].forEach(id => {
            const loading = document.getElementById(id);
            if (loading) loading.style.display = 'block';
        });
        
        fetch(url)"""

if old_fetch in content:
    content = content.replace(old_fetch, new_fetch)
    print("✅ Función cargarDatosGraficos actualizada para incluir fechas")
else:
    print("⚠️  No se encontró función cargarDatosGraficos")

# Guardar cambios
with open('templates/pae/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ JavaScript actualizado para manejar fechas personalizadas")
