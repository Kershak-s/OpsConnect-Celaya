# ✅ RANGOS DINÁMICOS POR PRODUCTO IMPLEMENTADOS

## 🎯 Objetivo Cumplido

Las gráficas ahora:
1. ✅ Muestran **líneas de límites verde y amarillo** según el producto seleccionado
2. ✅ **Sin líneas** cuando no hay producto específico (filtro = "todos")
3. ✅ **Eje Y dinámico** que se ajusta automáticamente a los datos visibles
4. ✅ Usan los **rangos reales** del sistema (extraídos de analisis_fisicoquimicos.js)

## 📊 Sistema de Líneas de Límites

### Cuando se selecciona UN producto específico:

**Líneas Verdes (Límites ideales):**
- Línea verde punteada INFERIOR = `min` (límite verde mínimo)
- Línea verde punteada SUPERIOR = `max` (límite verde máximo)
- Color: Verde (`rgba(76, 175, 80, 0.8)`)
- Estilo: Punteado corto `[5, 5]`

**Líneas Amarillas (Advertencias):**
- Línea amarilla punteada INFERIOR = `warning_low` (límite amarillo bajo)
- Línea amarilla punteada SUPERIOR = `warning_high` (límite amarillo alto)
- Color: Amarillo/Naranja (`rgba(255, 193, 7, 0.8)`)
- Estilo: Punteado largo `[10, 5]`

### Cuando filtro = "todos" (sin producto específico):
- ❌ **NO se muestran líneas de límites**
- ✅ Solo se muestra la línea de datos
- ✅ Eje Y se ajusta solo a los valores de los datos

## 🗂️ Rangos por Producto Incluidos

### EXTRUIDOS (default y específicos):
- Default (DORITOS/TORCIDITOS)
- CHEETOS XTRA FLAMIN HOT
- CHEETOS JALAQUEÑO
- CHEETOS EXTRA FH NUEVO

**Rangos:**
- **Humedad Base:** Verde 0.7-1.7%, Amarillo 0.6-1.8%
- **Aceite Base:** Verde 21.7-27.7%, Amarillo 20.7-28.7%

### TORTILLA:
- Default
- DORITOS
- TOSTITOS SALSA VERDE
- TOSTITOS FH
- DORITOS INCÓGNITA
- DORITOS PIZZEROLA
- RANCHERITOS

**Ejemplos de rangos:**
- **DORITOS:** Humedad 1.0-1.2% (verde), 0.9-1.3% (amarillo)
- **TOSTITOS:** Humedad 0.9-1.3% (verde), 0.8-1.4% (amarillo)

### PAPA:
- Default
- PAPA SAL
- RUFFLES QUESO
- SABRITAS XTRA FH

**Rangos:**
- **Humedad Base:** Verde 1.35-1.65%, Amarillo 1.2-1.8%
- **Aceite Base:** Verde 31-35%, Amarillo 30-36%

## 🔧 Implementación Técnica

### 1. Función `obtenerRangos(categoria, producto, campo)`
Busca los rangos específicos del producto o devuelve `null` si no hay.

```javascript
// Ejemplo de uso
const rangos = obtenerRangos('EXTRUIDOS', 'CHEETOS JALAQUEÑO', 'humedad_base_frita');
// Retorna: { min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 }
```

### 2. Datasets Dinámicos
Las gráficas construyen arrays de datasets según si hay rangos o no:

```javascript
const datasets = [
    { /* Línea de datos principal */ }
];

if (rangos) {
    datasets.push({ /* Línea verde min */ });
    datasets.push({ /* Línea verde max */ });
    if (rangos.warning_low) datasets.push({ /* Línea amarilla baja */ });
    if (rangos.warning_high) datasets.push({ /* Línea amarilla alta */ });
}
```

### 3. Eje Y Dinámico
El eje Y se calcula según los datos y los rangos:

```javascript
// Obtener min/max de los datos
const minValor = Math.min(...valores);
const maxValor = Math.max(...valores);
const margen = (maxValor - minValor) * 0.1;

// Base: datos + margen
let yMin = minValor - margen;
let yMax = maxValor + margen;

// Si hay rangos, incluirlos
if (rangos) {
    yMin = Math.min(yMin, rangos.warning_low || rangos.min);
    yMax = Math.max(yMax, rangos.warning_high || rangos.max);
}
```

**Resultado:** 
- Siempre se ven todos los datos
- Si hay rangos, también se incluyen en el área visible
- Margen del 10% para visualización

## 🎨 Ejemplo Visual

### Con producto específico (ej: CHEETOS JALAQUEÑO):
```
35% |                                    
    |                     ▲ [Línea amarilla warning_high 28.7]
30% | ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ [Línea verde max 27.7]
    |      ●     ●    ●   │  ●
25% |   ●           ●     │      ●
    | ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ [Línea verde min 21.7]
20% |                     ▼ [Línea amarilla warning_low 20.7]
    |__________________________________
       Fecha/Hora
```

### Sin producto específico (filtro = "todos"):
```
35% |                     
    |      ●     ●    ●      ●
30% |   ●           ●            ●
    |
25% | [Sin líneas de límites]
    |
20% |
    |__________________________________
       Fecha/Hora
```

## 🚀 Cómo Funciona

### Escenario 1: Usuario selecciona "CHEETOS JALAQUEÑO"
1. Usuario selecciona producto = "CHEETOS JALAQUEÑO"
2. Click en "Actualizar Gráficos"
3. `obtenerRangos('EXTRUIDOS', 'CHEETOS JALAQUEÑO', 'humedad_base_frita')`
4. Retorna: `{ min: 0.7, max: 1.7, warning_low: 0.6, warning_high: 1.8 }`
5. Se dibujan 4 líneas:
   - Verde punteada en 0.7
   - Verde punteada en 1.7
   - Amarilla punteada en 0.6
   - Amarilla punteada en 1.8
6. Eje Y: 0.5 a 2.0 (incluye datos y rangos)

### Escenario 2: Usuario selecciona "Todos"
1. Usuario selecciona producto = "todos"
2. Click en "Actualizar Gráficos"
3. `obtenerRangos('EXTRUIDOS', 'todos', 'humedad_base_frita')`
4. Retorna: `null` (sin rangos específicos)
5. Solo se dibuja la línea de datos
6. Eje Y: Solo según valores de datos (ej: 0.8 a 1.5)

### Escenario 3: Producto sin rangos definidos
1. Usuario selecciona producto no listado en rangos
2. `obtenerRangos()` retorna `null`
3. Se comporta como "todos" (sin líneas)

## 📝 Archivos Modificados

### `static/js/custom/graficas_base_frita.js`

**Agregado:**
- `rangosPorProducto` (objeto con todos los rangos por categoría/producto)
- `obtenerRangos(categoria, producto, campo)` (función de búsqueda)

**Modificado:**
- `procesarYMostrarGraficas(datos, producto)` - ahora recibe producto
- `crearGraficaHumedad(datos, productoSeleccionado)` - usa rangos dinámicos
- `crearGraficaAceite(datos, productoSeleccionado)` - usa rangos dinámicos
- Datasets dinámicos según existencia de rangos
- Eje Y calculado dinámicamente

## 🧪 Pruebas Sugeridas

### Test 1: Producto específico con rangos
1. Filtro: Producto = "CHEETOS JALAQUEÑO", Periodo = "Semana"
2. Click "Actualizar Gráficos"
3. **Esperado:** 
   - Gráficas con 5 líneas (datos + 4 límites)
   - Líneas verdes en 0.7 y 1.7 (humedad)
   - Líneas amarillas en 0.6 y 1.8 (humedad)

### Test 2: Todos los productos
1. Filtro: Producto = "Todos", Periodo = "Hoy"
2. Click "Actualizar Gráficos"
3. **Esperado:**
   - Gráficas con 1 línea (solo datos)
   - Sin líneas de límites
   - Eje Y ajustado solo a datos

### Test 3: Cambio dinámico
1. Seleccionar producto específico → Ver líneas de límites
2. Cambiar a "Todos" → Líneas desaparecen
3. Cambiar a otro producto → Líneas con nuevos rangos

### Test 4: Eje Y dinámico
1. Filtrar datos con valores entre 1.0-1.2
2. **Esperado:** Eje Y cercano a esos valores (ej: 0.9-1.3)
3. No debe mostrar eje desde 0 a 2 si no hay datos ahí

## 🐛 Console Logs para Debugging

En la consola del navegador deberías ver:

```
🎨 Módulo de gráficas Base Frita cargado
📊 Categoría: EXTRUIDOS
✅ Listener agregado
🔄 Actualizando gráficas...
📡 API: /api/analisis_fisicoquimicos/EXTRUIDOS?periodo=semana&producto=CHEETOS%20JALAQUEÑO
✅ Datos recibidos: 15 registros
📊 Procesando datos...
📈 Humedad: 15 puntos | Aceite: 15 puntos
✅ Gráfica Humedad creada
✅ Gráfica Aceite creada
```

## ✨ Resumen

**Antes:**
- ❌ Líneas fijas hardcodeadas
- ❌ No respetaban rangos del producto
- ❌ Siempre mostraban líneas

**Ahora:**
- ✅ Rangos dinámicos por producto
- ✅ Líneas verdes (ideal) y amarillas (advertencia)
- ✅ Sin líneas cuando filtro = "todos"
- ✅ Eje Y se ajusta automáticamente
- ✅ 100% integrado con sistema de rangos existente

**Estado:** ✅ LISTO PARA PROBAR CON CTRL+SHIFT+R
