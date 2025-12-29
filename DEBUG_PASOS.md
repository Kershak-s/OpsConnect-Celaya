# 🔍 DEBUG - Por qué no aparece nada en la consola

## 🎯 PROBLEMA ACTUAL

El script no se está ejecutando porque **no aparece NADA en la consola**.

---

## ✅ SOLUCIÓN PASO A PASO

### **PASO 1: Reinicia Flask**

```bash
# Detén Flask si está corriendo (Ctrl + C)
# Inicia de nuevo:
python app.py
```

**Espera a ver:**
```
* Running on http://127.0.0.1:5000
```

---

### **PASO 2: Abre el navegador en modo incógnito**

**¿Por qué incógnito?** → Sin caché, sin extensiones que interfieran

```
Ctrl + Shift + N (Chrome/Edge)
Cmd + Shift + N (Mac)
```

---

### **PASO 3: Ve a la URL exacta**

```
http://localhost:5000/pae/PAPA/registro/7
```

**IMPORTANTE:** Asegúrate que diga `PAPA` en mayúsculas, no `papa`

---

### **PASO 4: Abre la consola ANTES de cargar**

1. Con la página en blanco, presiona `F12`
2. Ve a la pestaña **Console**
3. Ahora recarga la página (`Ctrl + Shift + R`)

---

### **PASO 5: Busca estos mensajes**

Debes ver (en este orden):

```
📍 CATEGORIA: PAPA
📍 Condición category == PAPA: true
🥔 VALIDACIÓN PAPA INLINE - INICIANDO
✅ CSS inyectado
📋 X campos encontrados
  1. A
  2. B
  ...
🎉 LISTO
✅ Template PAE registro.html cargado completamente
```

---

## 🔍 DIAGNÓSTICO SEGÚN LO QUE VES

### ❌ **Caso 1: NO aparece NADA en la consola**

**Causa:** La página no se está cargando o hay un error antes

**Solución:**
1. Ve a la pestaña **Network** en DevTools
2. Recarga la página
3. ¿Ves la petición a `/pae/PAPA/registro/7`?
4. ¿Qué status code tiene? (debe ser 200)
5. Si es 404 o 500, hay un error en Flask

---

### ❌ **Caso 2: Solo aparece "CATEGORIA: (vacío)"**

**Causa:** La variable `category` no se está pasando desde Flask

**Solución:**
1. Verifica que en `app.py` línea 2423 dice:
   ```python
   category=category,
   ```
2. Reinicia Flask

---

### ❌ **Caso 3: Aparece "CATEGORIA: PAPA" pero "Condición: false"**

**Causa:** Hay espacios extra o el if de Jinja no funciona

**Solución:** Cambiar el template

---

### ❌ **Caso 4: Aparece "CATEGORIA: TORTILLA" o "EXTRUIDOS"**

**Causa:** Estás en la URL incorrecta

**Solución:** Asegúrate que la URL diga `/pae/PAPA/...`

---

### ✅ **Caso 5: Aparece todo pero "0 campos encontrados"**

**Causa:** Los campos no tienen el atributo `data-type`

**Solución:**
1. Ve a la pestaña **Elements** en DevTools
2. Busca (Ctrl+F): `data-type="A"`
3. ¿Lo encuentra?
   - **NO** → El HTML no tiene los campos correctos
   - **SÍ** → El selector está mal

---

### ✅ **Caso 6: Todo aparece pero los colores no se aplican**

**Causa:** El CSS está siendo sobrescrito

**Solución:**
1. Escribe `5` en campo A
2. Click derecho → Inspeccionar
3. Ve qué estilos tiene el input
4. ¿Tiene la clase `input-value-warning`?
   - **NO** → El JavaScript no está funcionando
   - **SÍ** → El CSS está siendo bloqueado

---

## 🧪 PRUEBAS MANUALES EN CONSOLA

### **Verificar que hay campos:**

```javascript
document.querySelectorAll('input[data-type]').length
```

**Debe retornar:** Un número > 0 (ej: 16)

---

### **Verificar que el CSS se inyectó:**

```javascript
document.head.innerHTML.includes('input-value-ok')
```

**Debe retornar:** `true`

---

### **Probar validación manual:**

```javascript
const campo = document.querySelector('input[data-type="A"]');
if (campo) {
    campo.value = '5';
    campo.dispatchEvent(new Event('input'));
    console.log('Clases:', campo.className);
} else {
    console.log('❌ Campo A no encontrado');
}
```

**Debe mostrar:** `input-value-warning` en las clases

---

## 📋 CHECKLIST COMPLETO

Marca cada uno:

- [ ] Flask reiniciado (ver mensaje "Running on...")
- [ ] Navegador en modo incógnito (Ctrl+Shift+N)
- [ ] URL correcta: `http://localhost:5000/pae/PAPA/registro/7`
- [ ] Consola abierta ANTES de cargar (F12)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Veo mensaje "📍 CATEGORIA: PAPA"
- [ ] Veo mensaje "📍 Condición: true"
- [ ] Veo mensaje "🥔 VALIDACIÓN PAPA INLINE"
- [ ] Veo mensaje "✅ Template... cargado completamente"

---

## 🆘 SI SIGUES SIN VER NADA

**Copia EXACTAMENTE lo que sale en la terminal de Flask:**

```bash
# Al iniciar Flask debe aparecer algo como:
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://127.0.0.1:5000
```

**Copia EXACTAMENTE lo que sale en la consola del navegador:**

```
(Todo lo que aparezca, errores incluidos)
```

**Verifica la pestaña Network:**
1. Ve a Network en DevTools
2. Recarga la página
3. Click en la petición `registro/7`
4. ¿Qué status code tiene?
5. Click en la pestaña "Response"
6. ¿Contiene HTML?

---

## 🎯 RESULTADO ESPERADO

Si todo está bien, en la consola debe aparecer:

```
📍 CATEGORIA: PAPA
📍 Condición category == PAPA: true
🥔 VALIDACIÓN PAPA INLINE - INICIANDO
✅ CSS inyectado
📋 16 campos encontrados
  1. A
  2. B
  3. C
  ... (continúa)
🎉 LISTO
✅ Template PAE registro.html cargado completamente

(Al escribir "5" en campo A)
Validando A = 5
  → warning (input-value-warning)
```

Y el campo debe pintarse de **AMARILLO**.
