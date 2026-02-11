# 🔧 Troubleshooting - Validación de Colores PAE PAPA

## ⚠️ PROBLEMA: Los campos no se pintan de colores al ingresar datos

---

## ✅ SOLUCIÓN RÁPIDA

### **Paso 1: Limpiar caché del navegador**

La causa más común es que el navegador tiene cacheado el JavaScript antiguo.

**Opción A: Hard Refresh (RECOMENDADO)**
```
Chrome/Edge: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows) o Cmd + Shift + R (Mac)
```

**Opción B: Limpiar caché manualmente**
1. Abrir DevTools (F12)
2. Click derecho en el botón de refresh
3. Seleccionar "Vaciar caché y volver a cargar de manera forzada"

---

### **Paso 2: Verificar que el script se cargó**

1. Abrir DevTools (F12)
2. Ir a la pestaña **Console**
3. Buscar estos mensajes:

```
🥔 PAPA Validation Final v2 - Iniciando...
✅ Inicializando validación PAPA
✅ CSS inyectado correctamente
🔍 Configurando 16 campos PAPA  (o el número de campos visibles)
🎉 Validación PAPA configurada completamente
```

**Si NO ves estos mensajes:**
- El script no se está cargando
- Verificar en la pestaña **Network** que `pae-papa-rangos-final.js` se descargó (status 200)
- Verificar que estás en categoría PAPA (no TORTILLA o EXTRUIDOS)

---

### **Paso 3: Verificar diagnóstico**

En la consola, buscar el mensaje de diagnóstico:

```
🔍 Diagnóstico PAE PAPA:
  - window.papaValidationLoaded: true
  - Campos encontrados: 16
  - Primer campo tipo: A
  - Tiene _papaValidator: true
  - CSS inyectado: true
```

**Si algún valor es `false` o `0`:**
- `papaValidationLoaded: false` → El script no se ejecutó
- `Campos encontrados: 0` → No hay campos con `data-type` en el HTML
- `Tiene _papaValidator: false` → Los event listeners no se agregaron
- `CSS inyectado: false` → Los estilos no se inyectaron

---

### **Paso 4: Probar manualmente**

1. Abrir el formulario PAE PAPA
2. Escribir en el campo **A (Defectos de color)**:
   - Escribir: `2` → Debe pintarse **VERDE**
   - Escribir: `5` → Debe pintarse **AMARILLO**
   - Escribir: `12` → Debe pintarse **ROJO**

3. En la consola debe aparecer:
```
🔍 Validando campo A: "2"
  → ✓ Estado: ok (clase: input-value-ok)
```

---

## 🐛 PROBLEMAS COMUNES

### **Problema 1: El script se carga pero no hace nada**

**Causa:** El script se ejecutó antes de que existieran los campos en el DOM

**Solución:**
1. Abrir consola
2. Ejecutar manualmente:
```javascript
window.papaValidationLoaded = false;
// Recargar la página
location.reload();
```

---

### **Problema 2: Los campos se pintan pero los colores son incorrectos**

**Causa:** CSS con mayor especificidad está ganando

**Solución:**
1. Inspeccionar el campo (Click derecho → Inspeccionar)
2. Ver qué estilos se están aplicando
3. Verificar que las clases `input-value-ok/warning/error` estén presentes
4. Si los estilos están tachados, hay otro CSS con mayor prioridad

---

### **Problema 3: Solo algunos campos se pintan**

**Causa:** Algunos campos no tienen el atributo `data-type`

**Solución:**
1. Inspeccionar el campo que no funciona
2. Verificar que tenga: `<input ... data-type="A">`
3. Si falta, hay un error en el template HTML

---

### **Problema 4: Los colores desaparecen al refrescar**

**Causa:** Los valores no se están guardando en la base de datos

**Solución:**
1. Verificar que el formulario se envíe correctamente
2. Verificar que el campo oculto `data` tenga el JSON correcto
3. Abrir consola del backend (Flask) y buscar errores

---

### **Problema 5: El porcentaje no se calcula**

**Causa:** La función `calcularPorcentaje` no se está ejecutando

**Solución:**
1. Verificar en consola que no haya errores
2. El porcentaje aparece al lado del campo después de escribir
3. Fórmula: `(valor / 200) * 100`

---

## 🔬 DIAGNÓSTICO AVANZADO

### **Verificar que las clases CSS están disponibles**

Ejecutar en consola:
```javascript
const style = document.getElementById('papa-validation-styles');
console.log('CSS inyectado:', !!style);
console.log('Contenido:', style ? style.textContent.substring(0, 100) : 'No encontrado');
```

### **Verificar que los event listeners están activos**

Ejecutar en consola:
```javascript
const campo = document.querySelector('input[data-type="A"]');
console.log('Campo A encontrado:', !!campo);
console.log('Tiene validator:', !!campo._papaValidator);
console.log('Clases actuales:', campo.className);
```

### **Forzar validación manual**

Ejecutar en consola:
```javascript
const campo = document.querySelector('input[data-type="A"]');
campo.value = '5';
if (campo._papaValidator) {
    campo._papaValidator();
    console.log('Clases después de validar:', campo.className);
}
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Caché del navegador limpiado (Ctrl + Shift + R)
- [ ] Console muestra: "PAPA Validation Final v2 - Iniciando..."
- [ ] Console muestra: "Configurando X campos PAPA"
- [ ] Campos tienen atributo `data-type` (inspeccionar HTML)
- [ ] CSS inyectado: `papa-validation-styles` existe
- [ ] Event listeners agregados: `_papaValidator` existe en campos
- [ ] Al escribir aparecen mensajes en consola
- [ ] Las clases `input-value-ok/warning/error` se agregan

---

## 🚀 SI NADA FUNCIONA

### **Opción 1: Recargar script manualmente**

1. Abrir consola
2. Ejecutar:
```javascript
window.papaValidationLoaded = false;
const script = document.createElement('script');
script.src = '/static/js/custom/pae-papa-rangos-final.js?v=' + Date.now();
document.head.appendChild(script);
```

### **Opción 2: Verificar ruta del archivo**

1. Abrir: `http://localhost:5000/static/js/custom/pae-papa-rangos-final.js`
2. Debe mostrar el código JavaScript
3. Si muestra error 404, el archivo no está en la ubicación correcta

### **Opción 3: Modo debug extremo**

Ejecutar en consola:
```javascript
// Ver todos los inputs con data-type
document.querySelectorAll('input[data-type]').forEach((input, i) => {
    console.log(`${i+1}. Tipo: ${input.getAttribute('data-type')}, Valor: ${input.value}, Validator: ${!!input._papaValidator}`);
});
```

---

## 📞 INFORMACIÓN ÚTIL

**Archivo JavaScript:** `/static/js/custom/pae-papa-rangos-final.js`
**Tamaño esperado:** ~7KB
**Versión:** v2 (con logs detallados)

**Para verificar versión:**
```javascript
console.log(document.querySelector('script[src*="pae-papa-rangos"]')?.src);
```

---

## ✅ RESULTADO ESPERADO

Al escribir `5` en el campo A, debes ver:

**En el campo:**
- Fondo amarillo (#fff3cd)
- Borde amarillo (#ffeaa7)
- Texto oscuro (#856404)
- Sombra amarilla

**En la consola:**
```
🔍 Validando campo A: "5"
  → ✓ Estado: warning (clase: input-value-warning)
```

**Al lado del campo:**
- Muestra: `2.50%` (5/200*100)
