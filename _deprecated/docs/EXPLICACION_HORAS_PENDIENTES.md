# 🔴 CORRECCIÓN: Lógica de Horas Pendientes (Rojas)

**Problema:** Cuando estás en la hora 00:00 (medianoche), las horas 21, 22, 23 aparecen **bloqueadas (grises)** en lugar de **pendientes (rojas)**.

---

## 🎯 ESCENARIO

```
Hora actual: 00:00 (Medianoche)
Turno: B (Noche)
Horas del turno: [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5]

Estado esperado:
  18:00 → 🔴 Pendiente (ya pasó)
  19:00 → 🔴 Pendiente (ya pasó)
  20:00 → 🔴 Pendiente (ya pasó)
  21:00 → 🔴 Pendiente (ya pasó)
  22:00 → 🔴 Pendiente (ya pasó)
  23:00 → 🔴 Pendiente (ya pasó)
  00:00 → 🟢 Disponible (hora actual)
  01:00 → ⚪ Bloqueada (no ha llegado)
  02:00 → ⚪ Bloqueada (no ha llegado)
  03:00 → ⚪ Bloqueada (no ha llegado)
  04:00 → ⚪ Bloqueada (no ha llegado)
  05:00 → ⚪ Bloqueada (no ha llegado)
```

---

## ❌ PROBLEMA ANTERIOR

**Lógica incorrecta:**
```jinja2
{% elif current_turno == 'B' and (
    (current_hour >= 18 and hora < current_hour and hora >= 18) or
    (current_hour < 6 and hora < current_hour and hora < 6)
) %}
```

**¿Qué pasaba cuando current_hour = 0?**

Para hora = 21:
- Primera condición: `0 >= 18` → **False**
- Segunda condición: `21 < 0 and 21 < 6` → **False**
- Resultado: **NO se marca como pendiente** → Queda bloqueada ❌

---

## ✅ SOLUCIÓN IMPLEMENTADA

**Nueva lógica:**
```jinja2
{% elif current_turno == 'B' %}
    {% if current_hour >= 18 %}
        {# Estamos en la primera parte del turno (18-23) #}
        {% if hora >= 18 and hora < current_hour %}
            {% set estado = 'missed' %}
            {% set status_text = 'Pendiente' %}
        {% endif %}
    {% elif current_hour < 6 %}
        {# Estamos en la segunda parte del turno (0-5) #}
        {# Las horas 18-23 del día anterior son pendientes #}
        {# Las horas 0 hasta current_hour son pendientes #}
        {% if hora >= 18 or (hora >= 0 and hora < current_hour) %}
            {% set estado = 'missed' %}
            {% set status_text = 'Pendiente' %}
        {% endif %}
    {% endif %}
{% endif %}
```

---

## 📊 CASOS DE PRUEBA

### **Caso 1: Hora actual = 00:00 (Medianoche)**

```python
current_hour = 0
current_turno = 'B'

Para hora = 18: 
  ✓ current_hour < 6 → True
  ✓ hora >= 18 → True
  → Estado: PENDIENTE 🔴

Para hora = 21:
  ✓ current_hour < 6 → True
  ✓ hora >= 18 → True
  → Estado: PENDIENTE 🔴

Para hora = 0:
  ✓ hora == current_hour → True
  → Estado: DISPONIBLE 🟢

Para hora = 1:
  ✓ current_hour < 6 → True
  ✗ hora >= 18 → False
  ✗ hora < current_hour → False (1 no es < 0)
  → Estado: BLOQUEADA ⚪
```

### **Caso 2: Hora actual = 02:00**

```python
current_hour = 2
current_turno = 'B'

Para hora = 21:
  ✓ current_hour < 6 → True
  ✓ hora >= 18 → True
  → Estado: PENDIENTE 🔴

Para hora = 0:
  ✓ current_hour < 6 → True
  ✓ hora >= 0 and hora < 2 → True
  → Estado: PENDIENTE 🔴

Para hora = 1:
  ✓ current_hour < 6 → True
  ✓ hora >= 0 and hora < 2 → True
  → Estado: PENDIENTE 🔴

Para hora = 2:
  ✓ hora == current_hour → True
  → Estado: DISPONIBLE 🟢

Para hora = 3:
  ✗ hora < current_hour → False
  → Estado: BLOQUEADA ⚪
```

### **Caso 3: Hora actual = 20:00**

```python
current_hour = 20
current_turno = 'B'

Para hora = 18:
  ✓ current_hour >= 18 → True
  ✓ hora >= 18 and hora < 20 → True
  → Estado: PENDIENTE 🔴

Para hora = 19:
  ✓ current_hour >= 18 → True
  ✓ hora >= 18 and hora < 20 → True
  → Estado: PENDIENTE 🔴

Para hora = 20:
  ✓ hora == current_hour → True
  → Estado: DISPONIBLE 🟢

Para hora = 21:
  ✗ hora < current_hour → False
  → Estado: BLOQUEADA ⚪
```

---

## 🎨 COLORES Y ESTADOS

| Estado | Color | CSS Class | Descripción |
|--------|-------|-----------|-------------|
| **Completado** | 🟢 Verde | `completed` | Ya se llenó el formulario |
| **Disponible** | 🟡 Amarillo | `active` | Hora actual - puede llenarse |
| **Pendiente** | 🔴 Rojo | `missed` | Ya pasó - debió llenarse |
| **Bloqueado** | ⚪ Gris | `disabled` | Aún no llega - no disponible |

---

## ✅ RESULTADO

**Ahora cuando estás en la hora 00:00:**
```
Turno B Dashboard:
├── 18:00 🔴 Pendiente ✅
├── 19:00 🔴 Pendiente ✅  
├── 20:00 🔴 Pendiente ✅
├── 21:00 🔴 Pendiente ✅ (AHORA CORRECTO)
├── 22:00 🔴 Pendiente ✅ (AHORA CORRECTO)
├── 23:00 🔴 Pendiente ✅ (AHORA CORRECTO)
├── 00:00 🟢 Disponible ✅
├── 01:00 ⚪ Bloqueada ✅
├── 02:00 ⚪ Bloqueada ✅
├── 03:00 ⚪ Bloqueada ✅
├── 04:00 ⚪ Bloqueada ✅
└── 05:00 ⚪ Bloqueada ✅
```

---

**Archivo modificado:** `templates/pae/dashboard.html`  
**Backup:** `templates/pae/dashboard.html.backup_pending`  
**Fecha:** 2025-12-04
