<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge&logo=semantic-release" alt="Version"/>
  <img src="https://img.shields.io/badge/python-3.9+-yellow?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/flask-2.3.3-black?style=for-the-badge&logo=flask" alt="Flask"/>
  <img src="https://img.shields.io/badge/status-production-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/license-MIT-purple?style=for-the-badge" alt="License"/>
</p>

<br/>

<h1 align="center">
  <br/>
  <span style="font-size: 3em;">⚙️</span>
  <br/><br/>
  <b>OpsConnect Celaya</b>
  <br/>
  <sub>Sistema Integral de Gestión de Operaciones Industriales</sub>
</h1>

<br/>

<p align="center">
  <b>🏭 Planta Celaya | 📊 Control de Calidad | 🔬 Análisis en Tiempo Real</b>
</p>

<br/>

---

<br/>

## 🌟 **Vista General**

**OpsConnect Celaya** es una plataforma web empresarial diseñada para digitalizar y optimizar los procesos de control de calidad y operaciones en plantas de producción de alimentos. El sistema integra múltiples módulos especializados para el monitoreo, registro y análisis de datos críticos de producción.

<br/>

<table>
<tr>
<td width="50%">

### 📈 **Métricas del Sistema**

| Indicador | Valor |
|-----------|-------|
| 🗂️ Módulos Activos | **12+** |
| 📋 Formularios | **Dinámicos** |
| 👥 Usuarios | **Multi-rol** |
| 📊 Reportes | **Excel/PDF** |
| 🔄 Actualizaciones | **Tiempo Real** |

</td>
<td width="50%">

### 🎯 **Líneas de Producción**

| Línea | Estado |
|-------|--------|
| 🌽 **EXTRUIDOS** | `✅ Activo` |
| 🫓 **TORTILLA** | `✅ Activo` |
| 🥔 **PAPA** | `✅ Activo` |

</td>
</tr>
</table>

<br/>

---

<br/>

## 🚀 **Características Principales**

<br/>

<table>
<tr>
<td align="center" width="25%">
<br/>
<h3>🔬</h3>
<b>Análisis Fisicoquímicos</b>
<br/><br/>
<sub>Humedad, Aceite, Sal<br/>Validación por rangos<br/>Gráficas dinámicas</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>⚖️</h3>
<b>Control de Pesos</b>
<br/><br/>
<sub>Registro por turno<br/>Especificaciones<br/>Alertas automáticas</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>🛢️</h3>
<b>Análisis de Aceite</b>
<br/><br/>
<sub>OV y AGL<br/>Monitoreo continuo<br/>Historial completo</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>📋</h3>
<b>PAE Dashboard</b>
<br/><br/>
<sub>Evaluación sensorial<br/>Registros por hora<br/>Análisis de tendencias</sub>
<br/><br/>
</td>
</tr>
</table>

<br/>

<table>
<tr>
<td align="center" width="25%">
<br/>
<h3>⚠️</h3>
<b>PNC (No Conformes)</b>
<br/><br/>
<sub>Gestión de rechazos<br/>Folios automáticos<br/>Trazabilidad total</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>🔗</h3>
<b>Weak Link</b>
<br/><br/>
<sub>Control de empaque<br/>Centerlines<br/>Oxígeno residual</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>📊</h3>
<b>Reportes Excel</b>
<br/><br/>
<sub>Exportación masiva<br/>Filtros avanzados<br/>Formatos personalizados</sub>
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<h3>👥</h3>
<b>Multi-Usuario</b>
<br/><br/>
<sub>Roles y permisos<br/>Autenticación segura<br/>Auditoría de acciones</sub>
<br/><br/>
</td>
</tr>
</table>

<br/>

---

<br/>

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────────────────────────────────────────────────────┐
│                        🌐 FRONTEND                               │
│    ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│    │  Dashboard  │  Formularios│   Gráficas  │   Reportes  │   │
│    │   Modern    │   Dinámicos │  Chart.js   │    Excel    │   │
│    └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      ⚙️ BACKEND (Flask)                          │
│    ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│    │   Routes    │    Models   │    Forms    │    Utils    │   │
│    │   Modulares │  SQLAlchemy │  Flask-WTF  │  Helpers    │   │
│    └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      💾 BASE DE DATOS                            │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │                    SQLite / PostgreSQL                   │ │
│    │  Users │ PAE │ PNC │ Pesos │ Aceite │ WeakLink │ Forms  │ │
│    └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

<br/>

---

<br/>

## 📦 **Módulos del Sistema**

<br/>

### 🌽 **EXTRUIDOS**
> Cheetos, Doritos, Rancheritos, Fritos

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| PAE Horario | Registro cada hora con evaluación sensorial | ✅ |
| Análisis Fisicoquímicos | Humedad base frita, aceite, sal PT | ✅ |
| Registro 4 Horas | Humedad cereal, temperatura freidor, slurry | ✅ |
| PNC Simple | Gestión de producto no conforme | ✅ |

<br/>

### 🫓 **TORTILLA**
> Tostitos, Doritos Nachos

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| PAE Horario | Evaluación sensorial por hora | ✅ |
| Calidad Tortilla | Control específico del proceso | ✅ |
| Registro 4 Horas | Tiempo reposo, temp masa, humedad | ✅ |
| Análisis Aceite | OV y AGL del freidor | ✅ |

<br/>

### 🥔 **PAPA**
> Sabritas Clásicas, Adobadas, Sal y Limón

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| PAE Horario | Evaluación con rotura de hojuela | ✅ |
| Análisis por Tanque | 3 tanques con sal titulador | ✅ |
| Cloruros Base | Control de sal en proceso | ✅ |
| Weak Link | Control de empaque completo | ✅ |

<br/>

---

<br/>

## 🛠️ **Instalación**

<br/>

### **Requisitos Previos**

```bash
Python 3.9+
pip (gestor de paquetes)
Git
```

<br/>

### **Paso 1: Clonar el Repositorio**

```bash
git clone https://github.com/Kershak-s/OpsConnect-Celaya.git
cd OpsConnect-Celaya
```

<br/>

### **Paso 2: Crear Entorno Virtual**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

<br/>

### **Paso 3: Instalar Dependencias**

```bash
pip install -r requirements.txt
```

<br/>

### **Paso 4: Iniciar la Aplicación**

```bash
# Desarrollo
python run_server.py

# Producción (Waitress)
python waitress_serve.py
```

<br/>

### **Paso 5: Acceder al Sistema**

```
🌐 URL: http://localhost:5000
👤 Usuario: admin
🔑 Contraseña: admin123
```

<br/>

---

<br/>

## 📊 **Stack Tecnológico**

<br/>

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="50"/>
<br/><b>Python</b>
<br/><sub>3.9+</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" width="50"/>
<br/><b>Flask</b>
<br/><sub>2.3.3</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="50"/>
<br/><b>SQLite</b>
<br/><sub>SQLAlchemy</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="50"/>
<br/><b>Bootstrap</b>
<br/><sub>5.x</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="50"/>
<br/><b>JavaScript</b>
<br/><sub>ES6+</sub>
</td>
</tr>
</table>

<br/>

### **Dependencias Principales**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| Flask | 2.3.3 | Framework web |
| Flask-SQLAlchemy | 3.1.1 | ORM Base de datos |
| Flask-Login | 0.6.3 | Autenticación |
| Flask-WTF | 1.2.1 | Formularios seguros |
| Pandas | 1.5+ | Procesamiento de datos |
| OpenPyXL | 3.0+ | Exportación Excel |
| Pillow | 9.0+ | Procesamiento imágenes |
| Waitress | - | Servidor producción |

<br/>

---

<br/>

## 📁 **Estructura del Proyecto**

```
OpsConnect-Celaya/
│
├── 📄 app.py                    # Aplicación principal Flask
├── 📄 models.py                 # Modelos de base de datos
├── 📄 forms.py                  # Formularios WTForms
├── 📄 config.py                 # Configuración
├── 📄 utils.py                  # Utilidades
│
├── 📂 routes/                   # Rutas modulares
│   ├── aceite_routes.py         # Análisis de aceite
│   ├── pae_visualizacion_routes.py  # Dashboard PAE
│   ├── excel_fisicoquimicos_routes.py  # Exportación Excel
│   └── papa_excel_routes.py     # Excel específico PAPA
│
├── 📂 templates/                # Plantillas HTML
│   ├── 📂 dashboard/            # Dashboard principal
│   ├── 📂 pae/                  # Módulo PAE
│   ├── 📂 pnc/                  # Producto no conforme
│   ├── 📂 pesos/                # Control de pesos
│   ├── 📂 weaklink/             # Weak Link
│   └── 📂 auth/                 # Autenticación
│
├── 📂 static/                   # Archivos estáticos
│   ├── 📂 css/                  # Estilos
│   ├── 📂 js/                   # JavaScript
│   └── 📂 img/                  # Imágenes
│
├── 📂 instance/                 # Base de datos SQLite
└── 📄 requirements.txt          # Dependencias
```

<br/>

---

<br/>

## 🔐 **Seguridad**

<br/>

| Característica | Implementación |
|----------------|----------------|
| 🔒 Autenticación | Flask-Login con sesiones seguras |
| 🛡️ CSRF Protection | Flask-WTF tokens en formularios |
| 🔑 Passwords | Werkzeug hash (pbkdf2:sha256) |
| 👮 Roles | Admin / Usuario estándar |
| 📝 Auditoría | Registro de creador y timestamps |

<br/>

---

<br/>

## 🤝 **Contribuir**

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

<br/>

---

<br/>

## 📞 **Soporte**

<br/>

<table>
<tr>
<td align="center">
<h3>📧</h3>
<b>Email</b>
<br/>
<sub>soporte@opsconnect.mx</sub>
</td>
<td align="center">
<h3>🐛</h3>
<b>Issues</b>
<br/>
<sub>GitHub Issues</sub>
</td>
<td align="center">
<h3>📖</h3>
<b>Docs</b>
<br/>
<sub>Wiki del proyecto</sub>
</td>
</tr>
</table>

<br/>

---

<br/>

<p align="center">
  <b>Desarrollado con ❤️ para Planta Celaya</b>
  <br/><br/>
  <img src="https://img.shields.io/badge/Made%20with-Python-1f425f.svg?style=flat-square" alt="Made with Python"/>
  <img src="https://img.shields.io/badge/Powered%20by-Flask-000000.svg?style=flat-square&logo=flask" alt="Powered by Flask"/>
  <br/><br/>
  <sub>© 2024 OpsConnect Celaya - Todos los derechos reservados</sub>
</p>
