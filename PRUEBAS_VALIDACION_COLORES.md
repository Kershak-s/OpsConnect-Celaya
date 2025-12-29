# 🧪 Guía de Pruebas - Validación de Colores PAE PAPA

**Fecha:** 25 de Octubre, 2024
**Versión:** 1.2.1

---

## 🎯 Objetivo

Verificar que el sistema de validación de colores funciona correctamente según los rangos especificados.

---

## 📋 Tabla de Pruebas por Campo

### **Campo A: Defectos de color**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 0.5 | 🟢 Verde | Dentro de especificación (0-4) |
| 2.0 | 🟢 Verde | Dentro de especificación (0-4) |
| 4.0 | 🟢 Verde | Límite superior verde |
| 5.0 | 🟡 Amarillo | Requiere acción (4.1-10) |
| 7.5 | 🟡 Amarillo | Requiere acción (4.1-10) |
| 10.0 | 🟡 Amarillo | Límite superior amarillo |
| 11.0 | 🔴 Rojo | Fuera de especificación (>10) |
| 15.0 | 🔴 Rojo | Fuera de especificación (>10) |

### **Campo D: Defectos internos papa**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 5.0 | 🟢 Verde | Dentro de especificación (0-10) |
| 10.0 | 🟢 Verde | Límite superior verde |
| 12.0 | 🟡 Amarillo | Requiere acción (10.1-20) |
| 15.0 | 🟡 Amarillo | Requiere acción (10.1-20) |
| 20.0 | 🟡 Amarillo | Límite superior amarillo |
| 25.0 | 🔴 Rojo | Fuera de especificación (>20) |

### **Campo G: Centros suaves + clusters**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 0.0 | 🟢 Verde | Dentro de especificación (0-1) |
| 0.5 | 🟢 Verde | Dentro de especificación (0-1) |
| 1.0 | 🟢 Verde | Límite superior verde |
| 1.5 | 🟡 Amarillo | Requiere acción (1.1-2) |
| 2.0 | 🟡 Amarillo | Límite superior amarillo |
| 2.5 | 🔴 Rojo | Fuera de especificación (>2) |

### **Campo H: Exceso de cáscara**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 3.0 | 🟢 Verde | Dentro de especificación (0-6) |
| 6.0 | 🟢 Verde | Límite superior verde |
| 8.0 | 🟡 Amarillo | Requiere acción (6.1-20) |
| 15.0 | 🟡 Amarillo | Requiere acción (6.1-20) |
| 20.0 | 🟡 Amarillo | Límite superior amarillo |
| 25.0 | 🔴 Rojo | Fuera de especificación (>20) |

### **Campo L: Defectos Totales de Proceso**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 10.0 | 🟢 Verde | Dentro de especificación (0-30) |
| 25.0 | 🟢 Verde | Dentro de especificación (0-30) |
| 30.0 | 🟢 Verde | Límite superior verde |
| 32.0 | 🟡 Amarillo | Requiere acción (30.1-35) |
| 35.0 | 🟡 Amarillo | Límite superior amarillo |
| 40.0 | 🔴 Rojo | Fuera de especificación (>35) |

### **Campo M: Hojuelas dobladas**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 15.0 | 🟢 Verde | Dentro de especificación (0-30) |
| 30.0 | 🟢 Verde | Límite superior verde |
| 33.0 | 🟡 Amarillo | Requiere acción (30.1-35) |
| 35.0 | 🟡 Amarillo | Límite superior amarillo |
| 36.0 | 🔴 Rojo | Fuera de especificación (>35) |

### **Campo N: Hojuelas enteras** ⭐ (Caso especial)

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 100.0 | 🟢 Verde | Perfecto - exactamente 100% |
| 99.5 | 🟡 Amarillo | Aceptable pero no perfecto (75-99.99%) |
| 90.0 | 🟡 Amarillo | Aceptable pero no perfecto (75-99.99%) |
| 80.0 | 🟡 Amarillo | Aceptable pero no perfecto (75-99.99%) |
| 75.0 | 🟡 Amarillo | Límite inferior amarillo |
| 74.9 | 🔴 Rojo | Fuera de especificación (<75%) |
| 70.0 | 🔴 Rojo | Fuera de especificación (<75%) |

### **Campo O: Hojuelas enteras (FIESTA)** ⭐ (Caso especial)

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 100.0 | 🟢 Verde | Perfecto - exactamente 100% |
| 95.0 | 🟡 Amarillo | Aceptable pero no perfecto (73-99.99%) |
| 85.0 | 🟡 Amarillo | Aceptable pero no perfecto (73-99.99%) |
| 73.0 | 🟡 Amarillo | Límite inferior amarillo |
| 72.9 | 🔴 Rojo | Fuera de especificación (<73%) |
| 70.0 | 🔴 Rojo | Fuera de especificación (<73%) |

### **Campo P: Pedacera (scrap)**

| Valor | Color Esperado | Estado |
|-------|----------------|--------|
| 5.0 | 🟢 Verde | Dentro de especificación (0-12%) |
| 10.0 | 🟢 Verde | Dentro de especificación (0-12%) |
| 12.0 | 🟢 Verde | Límite superior verde |
| 13.0 | 🟡 Amarillo | Requiere acción (12.1-15%) |
| 15.0 | 🟡 Amarillo | Límite superior amarillo |
| 16.0 | 🔴 Rojo | Fuera de especificación (>15%) |

---

## 🔍 Casos Especiales a Verificar

### **1. Campos N y O (Hojuelas enteras)**

Estos campos tienen una lógica especial:
- **Verde**: Solo cuando el valor es **exactamente 100%**
- **Amarillo**: Cuando el valor está en rango pero **no es 100%**
- **Rojo**: Cuando está fuera del rango mínimo

### **2. Campo R (Color de la base a)**

Puede tener valores negativos:
- **Verde**: -3 a 2.5
- **Amarillo**: 2.51 a 10 **O** menor a -3
- **Rojo**: Mayor a 10

---

## 🧪 Procedimiento de Prueba

### **Paso 1: Prueba Manual en Formulario**

1. Abrir navegador y acceder a: `http://localhost:5000/pae/PAPA/registro/7`
2. Para cada campo, ingresar los valores de prueba de la tabla
3. Verificar que el campo se pinte del color esperado
4. Verificar que el porcentaje se calcule correctamente (si aplica)

### **Paso 2: Verificación en Consola del Navegador**

1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Al escribir en un campo, debe aparecer:
   ```
   ✓ Campo A: 5.0 → warning
   ```
4. Verificar que el estado coincida con lo esperado

### **Paso 3: Prueba de Exportación Excel**

1. Crear varios registros con diferentes valores
2. Exportar a Excel
3. Verificar que las celdas tengan los colores correctos:
   - Verde: `#C6EFCE`
   - Amarillo: `#FFEB9C`
   - Rojo: `#FFC7CE`

---

## ✅ Checklist de Validación

- [ ] **Campo A**: Verde con 2.0, Amarillo con 5.0, Rojo con 12.0
- [ ] **Campo D**: Verde con 8.0, Amarillo con 15.0, Rojo con 25.0
- [ ] **Campo G**: Verde con 0.5, Amarillo con 1.5, Rojo con 2.5
- [ ] **Campo H**: Verde con 4.0, Amarillo con 10.0, Rojo con 25.0
- [ ] **Campo L**: Verde con 25.0, Amarillo con 32.0, Rojo con 40.0
- [ ] **Campo M**: Verde con 20.0, Amarillo con 33.0, Rojo con 38.0
- [ ] **Campo N**: Verde con 100.0, Amarillo con 85.0, Rojo con 70.0
- [ ] **Campo O**: Verde con 100.0, Amarillo con 80.0, Rojo con 65.0
- [ ] **Campo P**: Verde con 10.0, Amarillo con 13.0, Rojo con 18.0

---

## 🐛 Troubleshooting

### **Si un campo no se pinta:**

1. Verificar en consola si hay errores
2. Verificar que el script `pae-papa-rangos-final.js` se haya cargado
3. Verificar que el campo tenga el atributo `data-type`
4. Refrescar la página con Ctrl+F5 (hard refresh)

### **Si los colores son incorrectos:**

1. Verificar los rangos en `pae-papa-rangos-final.js` (líneas 24-43)
2. Verificar la función `determinarEstado` (líneas 98-142)
3. Verificar que no haya caché del navegador

### **Si el porcentaje no se calcula:**

1. Verificar que el campo tenga `data-type`
2. Verificar que la función `calcularPorcentaje` se esté ejecutando
3. Verificar en consola si hay errores

---

## 📊 Resultados Esperados

Al completar todas las pruebas:

- ✅ Todos los campos se pintan con el color correcto
- ✅ Los porcentajes se calculan correctamente
- ✅ La exportación Excel muestra los colores correctos
- ✅ No hay errores en la consola del navegador
- ✅ La validación funciona en tiempo real

---

## 📞 Referencias

- **Archivo JS**: `static/js/custom/pae-papa-rangos-final.js`
- **Archivo Python**: `papa_excel_routes.py`
- **Template**: `templates/pae/registro.html`
- **Tabla de rangos**: `ACTUALIZACION_RANGOS_PAE.md`

---

**Última actualización:** 25 de Octubre, 2024
