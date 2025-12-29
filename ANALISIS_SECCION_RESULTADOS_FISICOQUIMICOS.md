# 📊 ANÁLISIS - Sección Resultados (Análisis Fisicoquímicos)

## 📍 Ubicación
- **Tab:** "Resultados" en `/analisis_fisicoquimicos/<category>`
- **HTML:** `templates/pnc/list_analisis_fisicoquimicos.html` (líneas 870-1064)
- **JavaScript Principal:** `static/js/custom/analisis_fisicoquimicos.js`
- **JavaScript Validación:** `static/js/custom/rangos_fisicoquimicos_unificado_final.js`

---

## 🏗️ Estructura de la Sección (Líneas 870-1064)

### 1. **Filtros** (Líneas 873-930)

```html
┌─────────────────────────────────────────────┐
│ FILTROS                                     │
├─────────────────────────────────────────────┤
│ ┌─────────────┬─────────────┬─────────────┐ │
│ │ Período     │ Producto    │ Fechas      │ │
│ │ (select)    │ (select)    │ (inputs)    │ │
│ └─────────────┴─────────────┴─────────────┘ │
│                                             │
│        [Actualizar Gráficos]                │
└─────────────────────────────────────────────┘
```

**Periodo (select):**
- Última Semana
- Último Mes
- Último Trimestre
- Todo el tiempo
- **Fechas personalizadas** (selected por defecto)

**Producto (select):**
- Todos
- Lista según categoría (mismo que en formulario)

**Rango de Fechas:**
- Input fecha inicio
- Input fecha fin
- Texto: "Por defecto: ayer a hoy"

**Botón:**
- `id="actualizar-graficos-btn"`
- Actualiza todos los gráficos

---

### 2. **Resumen** (Líneas 931-964)

```html
┌─────────────────────────────────────────────┐
│ RESUMEN                                     │
├─────────────────────────────────────────────┤
│  [🧪] Total de análisis: 0                 │
│                                             │
│  [📅] Último análisis: -                   │
└─────────────────────────────────────────────┘
```

**Elementos dinámicos:**
- `#total-analisis` - Contador de registros
- `#ultimo-analisis` - Fecha del último

---

### 3. **Exportar Datos** (Líneas 967-980)

```html
┌─────────────────────────────────────────────┐
│ EXPORTAR DATOS                              │
├─────────────────────────────────────────────┤
│       [📥 Descargar Excel]                  │
│           (btn-lg verde)                    │
└─────────────────────────────────────────────┘
```

**Botón:** `#btn-descargar-excel-fisico`
- Abre modal con opciones de descarga

---

### 4. **Gráficas Base Frita** (Líneas 982-1010)

```html
┌──────────────────────┬──────────────────────┐
│ Humedad Base Frita   │ Aceite Base Frita    │
│ ┌──────────────────┐ │ ┌──────────────────┐ │
│ │                  │ │ │                  │ │
│ │   Chart.js       │ │ │   Chart.js       │ │
│ │   Canvas         │ │ │   Canvas         │ │
│ │                  │ │ │                  │ │
│ └──────────────────┘ │ └──────────────────┘ │
└──────────────────────┴──────────────────────┘
```

**Canvas IDs:**
- `#humedad-base-chart`
- `#aceite-base-chart`

---

### 5. **Gráficas por Tambor** (Líneas 1012-1062)

```html
┌─────────────────────────────────────────────┐
│ RESULTADOS POR TAMBOR                       │
├─────────────────────────────────────────────┤
│  [Aceite PT] [Humedad PT] [Sal PT]  (tabs) │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │        Chart.js Canvas                │  │
│  │        (según tab activo)             │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Rango ideal: X - Y                         │
└─────────────────────────────────────────────┘
```

**Tabs:**
- `#aceite-tab` → Canvas: `#aceite-pt-chart`
- `#humedad-tab` → Canvas: `#humedad-pt-chart`
- `#sal-tab` → Canvas: `#sal-pt-chart`

**Rangos mostrados:**
- `{{ aceite_pt_min }} - {{ aceite_pt_max }}`
- `{{ humedad_pt_min }} - {{ humedad_pt_max }}`
- `{{ sal_pt_min }} - {{ sal_pt_max }}`

---

## ⚙️ Lógica JavaScript (analisis_fisicoquimicos.js)

### Inicialización (Líneas 15-49)

```javascript
// Objetos de gráficos
let graficos = {
    humedadBase: null,
    aceiteBase: null,
    aceitePT: null,
    humedadPT: null,
    salPT: null
};

// Referencias DOM
const elementos = {
    periodoSelector: document.getElementById('periodo-selector'),
    productoSelector: document.getElementById('producto-selector'),
    fechaInicioFiltro: document.getElementById('fecha-inicio-filtro'),
    fechaFinFiltro: document.getElementById('fecha-fin-filtro'),
    btnActualizar: document.getElementById('actualizar-graficos-btn'),
    totalAnalisis: document.getElementById('total-analisis'),
    ultimoAnalisis: document.getElementById('ultimo-analisis')
};

// Detectar categoría de URL
const categoria = window.location.pathname.split('/').pop();
```

### Rangos Ideales por Producto (Líneas 52-200+)

**Estructura compleja:**
```javascript
const rangosIdeales = {
    'EXTRUIDOS': {
        'default': { /* rangos generales */ },
        'CHEETOS XTRA FLAMIN HOT': { /* rangos específicos */ },
        'CHEETOS JALAQUEÑO': { /* rangos con zonas amarillas */ },
        'CHEETOS EXTRA FH NUEVO': { /* ... */ }
    },
    'TORTILLA': {
        'default': { /* ... */ },
        'DORITOS': { /* ... */ },
        'TOSTITOS SALSA VERDE': { /* ... */ },
        'TOSTITOS FH': { /* ... */ },
        'DORITOS INCÓGNITA': { /* ... */ },
        'DORITOS PIZZEROLA': { /* ... */ },
        'DORITOS FH': { /* ... */ }
    },
    'PAPA': {
        'PAPA SAL': { 
            // Rangos ideales y aceptables
            // con validación de colores
        },
        'RUFFLES QUESO': { /* ... */ },
        'SABRITAS XTRA FH': { /* ... */ }
    }
};
```

**Formato de Rangos:**
```javascript
{
    humedadBase: { 
        min: X, max: Y, 
        warning_low: W, warning_high: Z 
    },
    aceiteBase: { /* ... */ },
    aceitePT: { /* ... */ },
    humedadPT: { /* ... */ },
    salPT: { /* ... */ }
}
```

**Rangos Especiales (Cheetos Jalaqueño):**
```javascript
aceitePT: { 
    min: 31.64, max: 37.64,  // Verde
    amarillo_bajo_min: 29.64, amarillo_bajo_max: 31.63,  // Amarillo bajo
    amarillo_alto_min: 37.65, amarillo_alto_max: 39.64   // Amarillo alto
}
```

---

## 📡 Flujo de Datos

### 1. Usuario Interactúa con Filtros

```
Usuario selecciona:
  - Periodo (o fechas personalizadas)
  - Producto
  - Fechas inicio/fin
  
Usuario hace clic en "Actualizar Gráficos"
```

### 2. Evento del Botón

```javascript
elementos.btnActualizar.addEventListener('click', function() {
    // Recoger valores de filtros
    const periodo = elementos.periodoSelector.value;
    const producto = elementos.productoSelector.value;
    const fechaInicio = elementos.fechaInicioFiltro.value;
    const fechaFin = elementos.fechaFinFiltro.value;
    
    // Llamar API para obtener datos
    cargarDatos(categoria, periodo, producto, fechaInicio, fechaFin);
});
```

### 3. Llamada a API

```javascript
function cargarDatos(categoria, periodo, producto, fechaInicio, fechaFin) {
    const url = `/api/analisis_fisicoquimicos/${categoria}`;
    const params = new URLSearchParams({
        periodo: periodo,
        producto: producto,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
    });
    
    fetch(`${url}?${params}`)
        .then(response => response.json())
        .then(data => {
            actualizarResumen(data);
            actualizarGraficos(data);
        });
}
```

### 4. Backend API (app.py:1922)

```python
@app.route('/api/analisis_fisicoquimicos/<category>', methods=['GET'])
@login_required
def api_analisis_fisicoquimicos(category):
    # Obtener parámetros
    periodo = request.args.get('periodo')
    producto = request.args.get('producto')
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    # Construir query
    query = AnalisisCalidad.query.filter(
        AnalisisCalidad.categoria == category
    )
    
    # Filtrar por fechas
    if fecha_inicio and fecha_fin:
        query = query.filter(
            AnalisisCalidad.fecha >= fecha_inicio,
            AnalisisCalidad.fecha <= fecha_fin
        )
    
    # Filtrar por producto
    if producto and producto != 'todos':
        query = query.filter(
            AnalisisCalidad.producto == producto
        )
    
    registros = query.order_by(
        AnalisisCalidad.fecha.desc()
    ).all()
    
    # Serializar y retornar
    return jsonify({
        'registros': [r.to_dict() for r in registros],
        'total': len(registros)
    })
```

### 5. Actualizar Gráficos

```javascript
function actualizarGraficos(data) {
    // Procesar datos
    const datasets = procesarDatos(data.registros);
    
    // Destruir gráficos existentes
    Object.values(graficos).forEach(grafico => {
        if (grafico) grafico.destroy();
    });
    
    // Crear nuevos gráficos
    graficos.humedadBase = crearGrafico(
        'humedad-base-chart', 
        datasets.humedadBase,
        rangosIdeales[categoria][producto].humedadBase
    );
    
    graficos.aceiteBase = crearGrafico(
        'aceite-base-chart',
        datasets.aceiteBase,
        rangosIdeales[categoria][producto].aceiteBase
    );
    
    // ... crear resto de gráficos
}
```

### 6. Crear Gráfico con Chart.js

```javascript
function crearGrafico(canvasId, datos, rangos) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.fechas,
            datasets: [{
                label: 'Valores',
                data: datos.valores,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }, {
                label: 'Límite Superior',
                data: Array(datos.valores.length).fill(rangos.max),
                borderColor: 'red',
                borderDash: [5, 5],
                pointRadius: 0
            }, {
                label: 'Límite Inferior',
                data: Array(datos.valores.length).fill(rangos.min),
                borderColor: 'red',
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tendencia'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
```

---

## 🎨 Características Especiales

### 1. Rangos Dinámicos por Producto
- Cada producto tiene rangos específicos
- Rangos verde (ideal), amarillo (warning), rojo (fuera)
- Algunos productos tienen zonas amarillas asimétricas

### 2. Validación Visual
- Líneas de límites en gráficos
- Colores según cumplimiento
- Tooltips con información detallada

### 3. Filtrado Flexible
- Periodos predefinidos o personalizados
- Por producto específico o todos
- Rango de fechas manual

### 4. Resumen Dinámico
- Total de análisis en el periodo
- Fecha del último análisis
- Se actualiza con cada filtro

---

## 📊 Tipos de Gráficos

### Base Frita (2 gráficos)
- Humedad Base Frita (línea de tiempo)
- Aceite Base Frita (línea de tiempo)

### Tambores (3 gráficos en tabs)
- Aceite PT por tambor
- Humedad PT por tambor
- Sal PT por tambor

**Cada gráfico muestra:**
- Valores reales (línea principal)
- Límite superior (línea roja punteada)
- Límite inferior (línea roja punteada)
- Zona verde (dentro de rangos)
- Zona amarilla (warning)
- Zona roja (fuera de rango)

---

## 🔄 Estados del Sistema

### Inicial
```
- Filtros con valores por defecto
- Período: "Fechas personalizadas"
- Fechas: ayer a hoy
- Producto: "Todos"
- Gráficos vacíos
- Resumen: 0 análisis
```

### Cargando
```
- Botón deshabilitado
- Indicador de carga
- Gráficos con placeholder
```

### Con Datos
```
- Gráficos renderizados
- Resumen actualizado
- Botón habilitado
- Exportar disponible
```

### Sin Datos
```
- Mensaje: "No hay datos para el periodo seleccionado"
- Gráficos vacíos
- Resumen: 0 análisis
```

---

## 🐛 Manejo de Errores

```javascript
// Error en fetch
.catch(error => {
    console.error('Error cargando datos:', error);
    mostrarMensaje('Error al cargar datos', 'danger');
});

// Datos faltantes
if (!data || !data.registros || data.registros.length === 0) {
    mostrarMensaje('No hay datos para mostrar', 'info');
    return;
}

// Valores numéricos inválidos
const valor = parseFloat(registro.humedad_base_frita);
if (isNaN(valor)) {
    console.warn('Valor inválido:', registro.humedad_base_frita);
    continue; // Saltar este registro
}
```

---

## 📝 Notas Importantes

1. **Rangos por Producto:** Cada producto tiene especificaciones únicas
2. **Chart.js 3.9.1:** Biblioteca de gráficos utilizada
3. **Actualización Manual:** Usuario debe hacer clic en "Actualizar Gráficos"
4. **Fechas Por Defecto:** Ayer a hoy cuando periodo es "personalizado"
5. **Filtro de Producto:** "Todos" combina todos los productos de la categoría
6. **API REST:** Endpoint `/api/analisis_fisicoquimicos/<category>`
7. **Destrucción de Gráficos:** Se destruyen antes de crear nuevos para evitar memory leaks

---

## 🚀 Mejoras Potenciales

### No Implementadas Actualmente:
- ❌ Actualización automática (sin hacer clic)
- ❌ Exportar gráficos como imagen
- ❌ Comparación entre productos
- ❌ Alertas cuando valores salen de rango
- ❌ Predicción de tendencias
- ❌ Filtro por turno
- ❌ Zoom en gráficos
- ❌ Descargar datos en CSV

---

**Fecha de análisis:** 2025-12-05  
**Archivos principales:**  
- HTML: templates/pnc/list_analisis_fisicoquimicos.html (líneas 870-1064)
- JS: static/js/custom/analisis_fisicoquimicos.js
- Backend: app.py (línea 1922)
