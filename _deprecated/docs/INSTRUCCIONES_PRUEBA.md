# 🧪 INSTRUCCIONES DE PRUEBA - Validación de Colores PAE PAPA

## ⚠️ IMPORTANTE: He creado una versión SUPER SIMPLE del script para debug

---

## 🚀 OPCIÓN 1: Prueba Rápida (SIN servidor Flask)

### **Abre el archivo de prueba directamente:**

1. **Navega a la carpeta del proyecto:**
   ```
   C:\Users\drago\Desktop\miclaude\Opsv1\
   ```

2. **Doble click en:**
   ```
   test_validacion.html
   ```

3. **Abre la consola del navegador:**
   - Presiona `F12`
   - Ve a la pestaña `Console`

4. **Prueba escribiendo:**
   - Campo A con `2` → Debe ponerse **VERDE**
   - Campo A con `5` → Debe ponerse **AMARILLO**
   - Campo A con `12` → Debe ponerse **ROJO**

### **Lo que debes ver en la consola:**
```
🥔 INICIANDO VALIDACIÓN PAPA - Test Page
✅ CSS inyectado
📋 Configurando 5 campos
🎉 ¡Listo! Escribe en los campos para ver los colores

(Al escribir "5" en campo A)
Validando A = 5
  → WARNING: input-value-warning
```

---

## 🔥 OPCIÓN 2: Prueba en la Aplicación Flask

### **Paso 1: Reiniciar el servidor Flask**

Si Flask está corriendo, reinícialo para cargar el nuevo script:
```bash
# Detener Flask (Ctrl + C)
# Iniciar de nuevo
python app.py
```

### **Paso 2: Limpiar caché completamente**

**MUY IMPORTANTE - El caché del navegador es el problema #1**

1. Abre el navegador
2. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
3. Selecciona:
   - ✅ Cookies y datos de sitios
   - ✅ Imágenes y archivos en caché
   - ✅ Solo "Última hora" o "Todo"
4. Click en "Eliminar datos"

### **Paso 3: Hard Refresh**

1. Ve a: `http://localhost:5000/pae/PAPA/registro/7`
2. Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
3. **NO uses F5 normal** - debe ser `Ctrl + Shift + R`

### **Paso 4: Abrir consola y verificar**

1. Presiona `F12`
2. Ve a la pestaña `Console`
3. Debes ver:
```
🥔 INICIANDO VALIDACIÓN PAPA - Versión Simple
✅ CSS inyectado
📋 Encontrados X campos
  1. Campo A
  2. Campo B
  ...
🎉 Configuración completada
```

### **Paso 5: Probar escribiendo**

1. Escribe en **campo A (Defectos de color)**:
   - `2` → **VERDE**
   - `5` → **AMARILLO**
   - `12` → **ROJO**

2. En la consola debe aparecer:
```
Validando A = 2
  → Estado: ok, Clase: input-value-ok
  → Clases finales: form-control input-value-ok
```

---

## 🔍 QUÉ BUSCAR EN LA CONSOLA

### ✅ **Si funciona correctamente:**
```
🥔 INICIANDO VALIDACIÓN PAPA - Versión Simple
✅ CSS inyectado
📋 Encontrados 16 campos  (o más)
  1. Campo A
  2. Campo B
  ... (etc)
🎉 Configuración completada

(Al escribir)
Validando A = 5
  → Estado: warning, Clase: input-value-warning
  → Clases finales: form-control input-value-warning
```

### ❌ **Si NO funciona:**

**Error 1: "Encontrados 0 campos"**
- Los campos no tienen `data-type`
- Estás en categoría TORTILLA o EXTRUIDOS (no PAPA)

**Error 2: No aparece ningún mensaje**
- El script no se está cargando
- Verifica en pestaña `Network` que `pae-papa-validation-simple.js` se descargó

**Error 3: Script se carga pero campos no cambian de color**
- El CSS está siendo sobrescrito por otro estilo
- Inspecciona el campo (click derecho → Inspeccionar)
- Ve qué estilos se están aplicando

---

## 🎯 COLORES ESPERADOS

### **Verde (OK)**
- Fondo: `#d4edda` (verde claro)
- Borde: `#c3e6cb` o `#28a745` (verde)
- Texto: `#155724` (verde oscuro)

### **Amarillo (Warning)**
- Fondo: `#fff3cd` (amarillo claro)
- Borde: `#ffeaa7` o `#ffc107` (amarillo)
- Texto: `#856404` (amarillo oscuro)

### **Rojo (Error)**
- Fondo: `#f8d7da` (rojo claro)
- Borde: `#f5c6cb` o `#dc3545` (rojo)
- Texto: `#721c24` (rojo oscuro)

---

## 🛠️ DEBUGGING AVANZADO

### **Verificar que el script correcto se cargó:**

En la consola, ejecuta:
```javascript
document.querySelector('script[src*="pae-papa"]')?.src
```

Debe mostrar:
```
"http://localhost:5000/static/js/custom/pae-papa-validation-simple.js"
```

### **Ver todos los campos encontrados:**

En la consola, ejecuta:
```javascript
document.querySelectorAll('input[data-type]').forEach((input, i) => {
    console.log(`${i+1}. ${input.getAttribute('data-type')} - Valor: ${input.value}`);
});
```

### **Probar validación manual:**

En la consola, ejecuta:
```javascript
const campo = document.querySelector('input[data-type="A"]');
campo.value = '5';
campo.dispatchEvent(new Event('input'));
console.log('Clases:', campo.className);
```

Debe mostrar:
```
Validando A = 5
  → Estado: warning, Clase: input-value-warning
Clases: form-control input-value-warning
```

---

## 📝 CHECKLIST COMPLETO

Antes de reportar que no funciona, verifica:

- [ ] Reinicié el servidor Flask
- [ ] Limpié la caché del navegador (Ctrl + Shift + Delete)
- [ ] Hice hard refresh (Ctrl + Shift + R) NO F5
- [ ] Abrí la consola (F12)
- [ ] Veo el mensaje "🥔 INICIANDO VALIDACIÓN PAPA"
- [ ] Veo "Encontrados X campos" con X > 0
- [ ] Estoy en la URL correcta: `/pae/PAPA/registro/X`
- [ ] Los campos tienen `data-type` (inspeccionar HTML)
- [ ] Al escribir aparecen mensajes "Validando..."

---

## 🆘 SI NADA FUNCIONA

### **Prueba el archivo HTML de test primero:**

Si `test_validacion.html` funciona pero la app no:
- El problema es del caché del navegador
- O hay otro JavaScript interfiriendo

Si `test_validacion.html` tampoco funciona:
- El problema puede ser del navegador
- Prueba en modo incógnito: `Ctrl + Shift + N`

### **Información para debug:**

Ejecuta esto en la consola y copia el resultado:
```javascript
console.log('URL:', window.location.href);
console.log('Scripts cargados:', Array.from(document.querySelectorAll('script[src]')).map(s => s.src));
console.log('Campos encontrados:', document.querySelectorAll('input[data-type]').length);
console.log('CSS inyectado:', !!document.querySelector('style'));
```

---

## ✅ RESULTADO ESPERADO FINAL

Al escribir `5` en el campo A:

**Visualmente:**
- El campo se pone con fondo **AMARILLO CLARO**
- El borde se pone **AMARILLO**

**En la consola:**
```
Validando A = 5
  → Estado: warning, Clase: input-value-warning
  → Clases finales: form-control input-value-warning
```

---

**Si sigues los pasos y aún no funciona, envíame la salida completa de la consola.**
