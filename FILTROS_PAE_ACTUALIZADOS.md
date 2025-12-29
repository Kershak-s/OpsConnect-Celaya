# Filtros PAE - Actualización

## Cambios Implementados

### 1. Filtro por Producto (CORREGIDO)

**Problema:** El dropdown de producto existía pero el backend NO aplicaba el filtro.

**Solución:**
- Agregado parámetro `producto` en `api_pae_datos` (app.py:3390)
- Agregado filtro en la consulta SQL:
```python
# Filtrar por producto si se especifica
if producto != 'all':
    query = query.filter(PAERegistro.producto == producto)
```

**Resultado:** Ahora el filtro por producto funciona correctamente.

---

### 2. Filtro por Periodo Personalizado (NUEVO)

**Funcionalidad Agregada:**
- Nueva opción "Personalizado" en el dropdown de periodo
- Campos de fecha inicio y fecha fin que aparecen al seleccionar "Personalizado"
- Backend procesa las fechas y filtra registros en el rango especificado

**Implementación:**

#### Backend (app.py)
```python
# Nuevos parámetros
producto = request.args.get('producto', 'all')
fecha_inicio_param = request.args.get('fecha_inicio')
fecha_fin_param = request.args.get('fecha_fin')

# Lógica de fechas personalizadas
if periodo == 'personalizado' and fecha_inicio_param and fecha_fin_param:
    try:
        from datetime import datetime as dt
        fecha_inicio = dt.strptime(fecha_inicio_param, '%Y-%m-%d').date()
        fecha_fin = dt.strptime(fecha_fin_param, '%Y-%m-%d').date()
    except ValueError:
        fecha_inicio = today
        fecha_fin = today
```

#### Frontend (templates/pae/dashboard.html)

**HTML:**
```html
<select class="form-select" id="filter-periodo">
    <option value="turno" selected>Turno Actual</option>
    <option value="hoy">Hoy</option>
    <option value="ayer">Ayer</option>
    <option value="semana">Última Semana</option>
    <option value="personalizado">Personalizado</option>
</select>

<!-- Campos de fecha (ocultos por defecto) -->
<div class="row g-3 mt-2" id="date-range-container" style="display: none;">
    <div class="col-md-6">
        <label class="form-label" for="filter-fecha-inicio">Fecha Inicio</label>
        <input type="date" class="form-control" id="filter-fecha-inicio">
    </div>
    <div class="col-md-6">
        <label class="form-label" for="filter-fecha-fin">Fecha Fin</label>
        <input type="date" class="form-control" id="filter-fecha-fin">
    </div>
</div>
```

**JavaScript:**
```javascript
// Evento para mostrar/ocultar campos de fecha
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

// Incluir fechas en la petición fetch
if (periodo === 'personalizado') {
    const fechaInicio = document.getElementById('filter-fecha-inicio')?.value;
    const fechaFin = document.getElementById('filter-fecha-fin')?.value;
    if (fechaInicio && fechaFin) {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    }
}
```

---

## Archivos Modificados

### 1. app.py
**Líneas modificadas:** ~3390-3425
- Agregado parámetro `producto`
- Agregado parámetros `fecha_inicio_param` y `fecha_fin_param`
- Agregada lógica para periodo personalizado
- Agregado filtro por producto en query

**Backup:** `app.py.backup_filters`

### 2. templates/pae/dashboard.html
**Secciones modificadas:**
- Líneas ~542-550: Select de periodo (agregada opción "Personalizado")
- Líneas ~565-575: Nuevos campos de fecha
- Líneas ~1424-1445: JavaScript para evento de periodo
- Líneas ~1451-1470: JavaScript para construir URL con fechas

**Backup:** `templates/pae/dashboard.html.backup_filters`

---

## Cómo Usar

### Filtro por Producto:
1. Seleccionar producto del dropdown
2. Hacer clic en "Aplicar Filtros"
3. Los gráficos mostrarán solo datos del producto seleccionado

### Filtro por Fecha Personalizada:
1. En "Periodo", seleccionar "Personalizado"
2. Aparecerán dos campos de fecha (inicio y fin)
3. Seleccionar el rango de fechas deseado
4. Hacer clic en "Aplicar Filtros"
5. Los gráficos mostrarán datos del rango seleccionado

### Combinación de Filtros:
Todos los filtros son compatibles entre sí:
- Periodo (personalizado, hoy, ayer, semana, turno)
- Turno (A, B, Todos)
- Producto (específico o Todos)

---

## Casos de Uso

### Ejemplo 1: Ver producción de un producto específico en la última semana
```
Periodo: Última Semana
Turno: Todos
Producto: DORITOS NACHO
→ Click "Aplicar Filtros"
```

### Ejemplo 2: Analizar turno B de un producto entre dos fechas
```
Periodo: Personalizado
Fecha Inicio: 2025-11-01
Fecha Fin: 2025-11-30
Turno: B
Producto: CHEETOS FLAMIN HOT
→ Click "Aplicar Filtros"
```

### Ejemplo 3: Comparar todos los productos de hoy
```
Periodo: Hoy
Turno: Todos
Producto: Todos
→ Click "Aplicar Filtros"
```

---

## Validación

El backend valida:
- Formato de fechas (YYYY-MM-DD)
- Si el formato es inválido, usa fecha de hoy como fallback
- Categoría válida (EXTRUIDOS, TORTILLA, PAPA)

El frontend:
- Muestra/oculta campos de fecha automáticamente
- Establece fecha de hoy como valor por defecto
- Solo envía parámetros de fecha si periodo es "personalizado"

---

## Scripts de Implementación

1. **fix_pae_filters.py** - Actualiza backend (app.py)
2. **fix_pae_dashboard_filters.py** - Actualiza HTML
3. **fix_pae_dashboard_js.py** - Actualiza JavaScript

Todos los scripts crean backups automáticamente antes de modificar archivos.

---

**Fecha de implementación:** 2025-12-05
**Archivos backup:**
- app.py.backup_filters
- templates/pae/dashboard.html.backup_filters
