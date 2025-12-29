# 📊 ANÁLISIS - Formulario de Análisis Fisicoquímicos

## 📍 Ubicación
- **Ruta:** `/analisis_fisicoquimicos/<category>` (EXTRUIDOS, TORTILLA, PAPA)
- **Template:** `templates/pnc/list_analisis_fisicoquimicos.html` (2545 líneas)
- **Backend:** `app.py` línea 1675
- **Modal Form:** Líneas 1155-1410 del template

---

## 🏗️ Estructura del Formulario

### 1. **Información General** (Líneas 1168-1234)

```html
<div class="form-section">
    <h6 class="form-section-title">Información</h6>
    
    <!-- Campos -->
    - Folio: Oculto, auto-generado (ANL_DDMM_XX_001)
    - Fecha: Readonly, fecha actual
    - Turno: Select (A, B)
    - Hora: Dos selects (hora:minutos)
    - Producto: Select según categoría (OBLIGATORIO)
</div>
```

**Productos por Categoría:**
- **EXTRUIDOS:**
  - CHEETOS TORCIDITOS
  - CHEETOS XTRA FH NUEVO
  - CHEETOS XTRA FLAMIN HOT
  - CHEETOS JALAQUEÑO

- **TORTILLA:**
  - DORITOS
  - DORITOS FH
  - DORITOS PIZZEROLA
  - TOSTITOS SALSA VERDE
  - TOSTITOS FH
  - RANCHERITOS
  - DORITOS INCÓGNITA

- **PAPA:**
  - PAPA SAL
  - RUFFLES QUESO
  - SABRITAS XTRA FH

---

### 2. **Detalles del Análisis** (Líneas 1236-1400)

#### A. Base Frita (Líneas 1238-1273)
```
┌─────────────────────────┬─────────────────────────┐
│ Humedad Base Frita      │ Aceite Base Frita       │
│ Rango según categoría   │ Rango según categoría   │
└─────────────────────────┴─────────────────────────┘
```

**Rangos por Categoría:**
- **EXTRUIDOS:**
  - Humedad: 0.7 - 1.7
  - Aceite: 21.7 - 27.7

- **TORTILLA:**
  - Humedad: 1 - 1.2
  - Aceite: 20 - 23

- **PAPA:**
  - Humedad: 1.35 - 1.65 (ideal) / 1.20-1.80 (aceptable)
  - Aceite: 31 - 35 (ideal) / 30-36 (aceptable)

#### B. Cloruros Base (Solo PAPA) (Líneas 1274-1288)
```
┌──────────────────────────────────────┐
│ Cloruros en la base (%)              │
│ Rango: 0 - 1                         │
│ Se resta de Sal Titulador → Sal PT  │
└──────────────────────────────────────┘
```

#### C. Tambores (Líneas 1290-1370)

**Número de Tambores:**
- EXTRUIDOS: 2 tambores
- PAPA: 2 tambores
- TORTILLA: 3 tambores

**Campos por Tambor:**

**Para EXTRUIDOS y TORTILLA:**
```
Tambor X:
  ├── Aceite PT
  ├── Humedad PT
  └── Sal PT
```

**Para PAPA (con cálculo automático):**
```
Tambor X:
  ├── Sal Titulador (%) - ENTRADA MANUAL
  └── Sal PT (Calculado) - READONLY
      Fórmula: Sal Titulador - Cloruros Base
      Rango: 0.55-0.85 (ideal) / 0.45-0.95 (aceptable)
```

**Rangos por Categoría:**

**EXTRUIDOS:**
- Aceite PT: 29-38
- Humedad PT: 0.5 - 1.9
- Sal PT: 0.95 - 1.55

**TORTILLA:**
- Aceite PT: 22-26
- Humedad PT: 0.78 - 1.58
- Sal PT: 0.9 - 1.5

**PAPA:**
- Aceite PT: N/A (deshabilitado)
- Humedad PT: N/A (deshabilitado)
- Sal PT: 0.55 - 0.85 (calculado)

#### D. Producto Terminado (Líneas 1372-1391)
```
┌──────────────┬──────────────┬──────────────┐
│ Producto     │ Producto     │ Producto Sal │
│ Aceite       │ Humedad      │              │
│ (PAPA: N/A)  │ (PAPA: N/A)  │ (Habilitado) │
└──────────────┴──────────────┴──────────────┘
```

#### E. Observaciones (Líneas 1393-1399)
```
┌──────────────────────────────────────┐
│ Observaciones (textarea)             │
│ Comentarios adicionales              │
└──────────────────────────────────────┘
```

---

## 🔧 Lógica del Backend (app.py:1675-1830)

### Generación de Folio
```python
formato: ANL_DDMM_XX_001
         │   │   │   └─ Número secuencial (001, 002, 003...)
         │   │   └───── Sufijo categoría (PA/EX/TO)
         │   └───────── Día y mes (DDMM)
         └───────────── Prefijo fijo

Ejemplo: ANL_0512_EX_001
```

### Proceso de Guardado
1. Validar que producto no esté vacío
2. Generar folio automático
3. Buscar último número de folio del día/categoría
4. Incrementar número secuencial
5. Guardar en base de datos (tabla: AnalisisCalidad)

---

## 🎨 Características Especiales

### 1. Coloración PAPA SAL (CSS)
Los campos de PAPA tienen clase `papa-sal-field` que aplica:
- Validación en tiempo real con colores
- Verde: dentro del rango ideal
- Amarillo: dentro del rango aceptable
- Rojo: fuera de rango

### 2. Cálculo Automático (PAPA)
JavaScript calcula automáticamente:
```javascript
Sal PT = Sal Titulador - Cloruros Base
```

### 3. Validación de Tiempo
- Selects para hora (00-23) y minutos (00, 15, 30, 45)
- Se combina en campo oculto `horario`

---

## 📋 Filtros Disponibles (Líneas 882-918)

```html
<div class="filters">
    ├── Periodo (select)
    │   ├── Hoy
    │   ├── Ayer
    │   ├── Última semana
    │   └── Último mes
    ├── Producto (select dinámico)
    └── Rango de fechas (date inputs)
        ├── Fecha inicio
        └── Fecha fin
</div>
```

---

## 📊 Descarga de Excel (Líneas 1068-1152)

Modal con opciones:
- Fecha de inicio
- Fecha de fin
- Turno (A, B, Todos)
- Producto (dinámico según categoría)
- Incluir rangos de referencia (checkbox)

Endpoint: `/analisis_fisicoquimicos/descargar-excel`

---

## 🔍 API Endpoints

### 1. Listar Análisis
```
GET/POST /analisis_fisicoquimicos/<category>
```

### 2. Obtener Registro Individual
```
GET /api/analisis_fisicoquimicos/<int:registro_id>
```

### 3. Obtener Todos (API)
```
GET /api/analisis_fisicoquimicos/<category>
```

### 4. Eliminar
```
POST /analisis_fisicoquimicos/<category>/delete/<int:analisis_id>
```

### 5. Descargar Excel
```
POST /analisis_fisicoquimicos/descargar-excel
Parámetros: fecha_inicio, fecha_fin, turno, producto, categoria
```

---

## 🐛 Validaciones

### Frontend:
- Producto obligatorio (required)
- Fecha obligatoria (readonly con fecha actual)
- Turno obligatorio (select)
- Formato numérico en campos de análisis

### Backend:
```python
if not request.form.get('producto'):
    flash('Error: El campo Producto es obligatorio')
    return redirect(...)
```

---

## 💾 Modelo de Datos (AnalisisCalidad)

```python
class AnalisisCalidad(db.Model):
    - id (PK)
    - folio (string, unique)
    - fecha (date)
    - turno (string: A/B)
    - horario (string)
    - categoria (string: EXTRUIDOS/TORTILLA/PAPA)
    - producto (string)
    
    # Base Frita
    - humedad_base_frita
    - aceite_base_frita
    - cloruros_base (PAPA)
    
    # Tambores (1-3)
    - tanque1_aceite_pt
    - tanque1_humedad_pt
    - tanque1_sal_pt
    - tanque1_sal_titulador (PAPA)
    # ... (repetido para tanque2 y tanque3)
    
    # Producto Terminado
    - aceite_pt_producto_terminado
    - humedad_pt_producto_terminado
    - sal_pt_producto_terminado
    
    # Metadatos
    - observaciones
    - usuario_id
    - created_at
```

---

## 🎯 Características por Categoría

### EXTRUIDOS
- ✅ 2 Tambores
- ✅ Aceite PT habilitado
- ✅ Humedad PT habilitado
- ✅ Sal PT manual
- ❌ Sin cloruros
- ❌ Sin cálculo automático

### TORTILLA
- ✅ 3 Tambores
- ✅ Aceite PT habilitado
- ✅ Humedad PT habilitado
- ✅ Sal PT manual
- ❌ Sin cloruros
- ❌ Sin cálculo automático

### PAPA
- ✅ 2 Tambores
- ❌ Aceite PT deshabilitado
- ❌ Humedad PT deshabilitado
- ✅ Sal Titulador (entrada)
- ✅ Cloruros base
- ✅ Sal PT calculado automáticamente
- ✅ Validación con colores (ideal/aceptable/fuera)

---

## 📝 Notas Importantes

1. **Folio único:** Se genera automáticamente y debe ser único
2. **Productos fijos:** Lista hardcodeada en el HTML, no en BD
3. **PAPA especial:** Tiene lógica de cálculo y validación diferente
4. **Campos deshabilitados:** PAPA no usa Aceite/Humedad en tambores ni PT
5. **Hora en intervalos:** Solo permite 00, 15, 30, 45 minutos
6. **Validación cliente:** JavaScript valida antes de enviar
7. **Validación servidor:** Backend valida producto obligatorio

---

**Fecha de análisis:** 2025-12-05  
**Archivo principal:** templates/pnc/list_analisis_fisicoquimicos.html  
**Líneas totales:** 2545  
**Modal formulario:** Líneas 1155-1410
