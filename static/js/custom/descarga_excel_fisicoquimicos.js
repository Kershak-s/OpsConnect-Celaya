// JavaScript para descarga Excel de análisis fisicoquímicos
// Incluye campos de Producto Terminado (PT)

document.addEventListener('DOMContentLoaded', function() {
    const btnDescargar = document.getElementById('btn-descargar-excel-fisico');
    console.log('Botón de descarga encontrado:', btnDescargar);
    
    if (btnDescargar) {
        btnDescargar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón de descarga');
            
            const modalElement = document.getElementById('modalDescargaExcelFisico');
            console.log('Modal encontrado:', modalElement);
            
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Configurar valores por defecto
                const hoy = new Date();
                const hace30Dias = new Date();
                hace30Dias.setDate(hoy.getDate() - 30);
                
                const fechaInicio = document.getElementById('fecha-inicio-fisico');
                const fechaFin = document.getElementById('fecha-fin-fisico');
                
                if (fechaInicio) fechaInicio.value = hace30Dias.toISOString().split('T')[0];
                if (fechaFin) fechaFin.value = hoy.toISOString().split('T')[0];
            } else {
                console.log('Modal no encontrado, descargando con valores por defecto');
                descargarExcelFisicoquimicosDirecto();
            }
        });
    }
    
    // Manejar el botón de confirmar descarga en el modal
    const btnConfirmar = document.getElementById('btn-confirmar-descarga-fisico');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function() {
            descargarExcelFisicoquimicos();
        });
    }
});

function descargarExcelFisicoquimicosDirecto() {
    const categoria = obtenerCategoriaActual();
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    const fechaInicio = hace30Dias.toISOString().split('T')[0];
    const fechaFin = hoy.toISOString().split('T')[0];
    
    const params = new URLSearchParams({
        categoria: categoria,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        turno: 'all',
        producto: 'all',
        incluir_rangos: 'true'
    });
    
    const url = `/excel-fisicoquimicos/${categoria}?${params.toString()}`;
    console.log('Descargando desde URL:', url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis_fisicoquimicos_${categoria.toLowerCase()}_${fechaInicio}_${fechaFin}.xlsx`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function descargarExcelFisicoquimicos() {
    const categoria = obtenerCategoriaActual();
    const fechaInicio = document.getElementById('fecha-inicio-fisico').value;
    const fechaFin = document.getElementById('fecha-fin-fisico').value;
    const turno = document.getElementById('turno-excel-fisico').value;
    const producto = document.getElementById('producto-excel-fisico').value;
    const incluirRangos = document.getElementById('incluir-rangos-fisico').checked;
    
    if (!fechaInicio || !fechaFin) {
        alert('Por favor seleccione ambas fechas');
        return;
    }
    
    if (new Date(fechaInicio) > new Date(fechaFin)) {
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
        return;
    }
    
    const btnConfirmar = document.getElementById('btn-confirmar-descarga-fisico');
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Descargando...';
    btnConfirmar.disabled = true;
    
    const params = new URLSearchParams({
        categoria: categoria,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        turno: turno,
        producto: producto,
        incluir_rangos: incluirRangos
    });
    
    const url = `/excel-fisicoquimicos/${categoria}?${params.toString()}`;
    console.log('Descargando desde URL:', url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis_fisicoquimicos_${categoria.toLowerCase()}_${fechaInicio}_${fechaFin}.xlsx`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        btnConfirmar.innerHTML = textoOriginal;
        btnConfirmar.disabled = false;
        
        const modalElement = document.getElementById('modalDescargaExcelFisico');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
    }, 2000);
}

function obtenerCategoriaActual() {
    const path = window.location.pathname;
    if (path.includes('EXTRUIDOS')) return 'EXTRUIDOS';
    if (path.includes('TORTILLA')) return 'TORTILLA';
    if (path.includes('PAPA')) return 'PAPA';
    return 'EXTRUIDOS'; // Default
}
