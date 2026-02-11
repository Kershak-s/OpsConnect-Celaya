# 🔍 DIAGNÓSTICO - No se muestran resultados en EXTRUIDOS

## ✅ Datos Verificados

Según el diagnóstico de la base de datos:
- ✅ **Tabla existe:** analisis_calidad
- ✅ **Total EXTRUIDOS:** 2558 registros
- ✅ **Últimos 30 días:** 602 registros
- ✅ **Ayer a hoy:** 1 registro (2025-12-05)
- ✅ **Productos:** CHEETOS XTRA FLAMIN HOT, CHEETOS JALAQUEÑO, CHEETOS TORCIDITOS, etc.

## 🎯 Problema Identificado

El filtro por defecto en la sección de Resultados está configurado con:
- **Periodo:** "Fechas personalizadas" (selected por defecto)
- **Fechas:** Ayer a hoy
- **Producto:** "Todos"

**HAY DATOS** para mostrar (1 registro de hoy), pero **NO SE ESTÁN MOSTRANDO**.

---

## 🧪 Pasos para Diagnosticar

### 1. Verificar que el Servidor Esté Corriendo

```bash
python app.py
```

Debe mostrar:
```
* Running on http://127.0.0.1:5000
```

### 2. Probar la API Directamente en el Navegador

Abre en tu navegador:
```
http://127.0.0.1:5000/api/analisis_fisicoquimicos/EXTRUIDOS?periodo=mes&producto=todos
```

**Deberías ver:** JSON con datos de los últimos 30 días (602 registros)

**Si funciona la API**, el problema está en el JavaScript del frontend.

### 3. Abrir la Consola del Navegador

1. Ve a: `http://127.0.0.1:5000/analisis_fisicoquimicos/EXTRUIDOS`
2. Click en tab "Resultados"
3. Presiona **F12** para abrir DevTools
4. Ve a la pestaña **Console**
5. Click en "Actualizar Gráficos"

**Busca estos mensajes:**

✅ **Mensajes esperados (correcto):**
```
🔧 Inicializando módulo OPTIMIZADO de analisis fisicoquímicos...
📊 Categoría detectada: EXTRUIDOS
✅ Evento de actualización configurado
🔄 Iniciando actualización de gráficos...
📋 Filtros aplicados: período=personalizado, producto=todos, categoría=EXTRUIDOS
🌐 Solicitando datos: /api/analisis_fisicoquimicos/EXTRUIDOS?periodo=personalizado&producto=todos&fecha_inicio=2025-12-04&fecha_fin=2025-12-05
✅ Datos recibidos: {success: true, datos: [...], resumen: {...}}
📊 Procesando X registros para gráficos
```

❌ **Mensajes de error (problemas):**
```
❌ No se encontraron elementos de la pestaña de resultados
⚠️ No hay datos disponibles para los filtros seleccionados
Error HTTP: 404/500
```

### 4. Verificar en la Pestaña Network

En DevTools:
1. Ve a pestaña **Network**
2. Filtra por "Fetch/XHR"
3. Click "Actualizar Gráficos"
4. Busca la petición a `/api/analisis_fisicoquimicos/EXTRUIDOS`

**Verifica:**
- ✅ Status: 200 OK
- ✅ Response tiene datos
- ❌ Status: 404/500 (error en backend)
- ❌ No aparece la petición (JavaScript no se ejecuta)

---

## 🐛 Posibles Causas y Soluciones

### Causa 1: JavaScript no se carga
**Síntoma:** No aparecen mensajes en consola

**Solución:**
```javascript
// Verificar en consola:
document.getElementById('resultados-tab')
document.getElementById('actualizar-graficos-btn')

// Ambos deben retornar el elemento, no null
```

Si retornan `null`, el HTML tiene un problema.

### Causa 2: Evento no se registra
**Síntoma:** Click en botón no hace nada

**Solución:**
```javascript
// Ejecutar manualmente en consola:
document.getElementById('actualizar-graficos-btn').click()

// O llamar la función directamente:
actualizarGraficos()
```

### Causa 3: Fechas inválidas
**Síntoma:** Error "fechas no válidas"

**Solución:**
```javascript
// Verificar en consola:
document.getElementById('fecha-inicio-filtro').value
document.getElementById('fecha-fin-filtro').value

// Ambos deben tener formato YYYY-MM-DD
```

### Causa 4: API retorna error
**Síntoma:** Status 40x/50x en Network

**Solución:** Ver logs del servidor Flask
```bash
# En la terminal donde corre app.py, buscar:
Error en API PAE datos: ...
```

### Causa 5: Categoría incorrecta
**Síntoma:** URL tiene categoria diferente a EXTRUIDOS

**Solución:**
```javascript
// Verificar en consola:
window.location.pathname
// Debe ser: /analisis_fisicoquimicos/EXTRUIDOS

const categoria = window.location.pathname.split('/').pop();
console.log(categoria);
// Debe mostrar: EXTRUIDOS
```

### Causa 6: Chart.js no carga
**Síntoma:** Error "Chart is not defined"

**Solución:**
```javascript
// Verificar en consola:
typeof Chart
// Debe ser: "function"
```

Si es "undefined", Chart.js no se cargó.

---

## 🔧 Fix Temporal (Para Prueba Inmediata)

Si quieres probar que los datos sí cargan, ejecuta esto en la consola del navegador:

```javascript
// Forzar carga con periodo 'mes'
fetch('/api/analisis_fisicoquimicos/EXTRUIDOS?periodo=mes&producto=todos')
    .then(r => r.json())
    .then(data => {
        console.log('✅ Datos recibidos:', data);
        console.log(`📊 Total registros: ${data.datos.length}`);
        console.log('📋 Resumen:', data.resumen);
    })
    .catch(err => console.error('❌ Error:', err));
```

**Deberías ver:** 602 registros de los últimos 30 días

---

## ✅ Verificación Final

Una vez que determines la causa, ejecuta este checklist:

- [ ] Servidor Flask corriendo en puerto 5000
- [ ] API responde correctamente (status 200)
- [ ] API retorna datos válidos (JSON con array de datos)
- [ ] JavaScript se carga sin errores
- [ ] Botón "Actualizar Gráficos" existe en DOM
- [ ] Evento click está registrado
- [ ] Fechas tienen formato válido
- [ ] Chart.js está cargado
- [ ] No hay errores en consola

---

## 📝 Información de Debug Útil

### Estructura esperada de la respuesta API:

```json
{
  "success": true,
  "datos": [
    {
      "id": 6308,
      "folio": "ANL_0512_EX_001",
      "fecha": "05/12/2025",
      "fecha_iso": "2025-12-05",
      "producto": "CHEETOS XTRA FH NUEVO",
      "turno": "A",
      "humedad_base_frita": 0.7,
      "aceite_base_frita": 21.7,
      "tanque1_aceite_pt": 29.35,
      "tanque1_humedad_pt": 0.5,
      "tanque1_sal_pt": 1.16,
      ...
    }
  ],
  "resumen": {
    "total_registros": 1,
    "ultimo_registro": "05/12/2025",
    "productos": ["CHEETOS XTRA FH NUEVO"]
  }
}
```

### Scripts de prueba incluidos:

1. **diagnosticar_resultados_fisicoquimicos.py** - Verifica datos en BD
2. **test_api_extruidos.py** - Prueba API directamente

---

## 🚀 Próximos Pasos

1. **Inicia el servidor:** `python app.py`
2. **Ejecuta el test de API:** `python test_api_extruidos.py`
3. **Abre el navegador:** `http://127.0.0.1:5000/analisis_fisicoquimicos/EXTRUIDOS`
4. **Ve a tab Resultados**
5. **Abre DevTools (F12)**
6. **Click "Actualizar Gráficos"**
7. **Observa la consola**
8. **Reporta qué mensajes ves**

---

**Fecha:** 2025-12-05  
**Registros disponibles:** 2558 total, 602 últimos 30 días, 1 hoy  
**Estado:** Datos existen, problema en frontend o API
