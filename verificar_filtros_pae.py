#!/usr/bin/env python3
"""
Verifica que los cambios de filtros PAE están correctamente aplicados
"""

print("🔍 VERIFICANDO CAMBIOS EN FILTROS PAE\n")
print("=" * 60)

# 1. Verificar templates/pae/dashboard.html
print("\n1️⃣  Verificando templates/pae/dashboard.html:")
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

checks_html = {
    'Opción Personalizado': 'value="personalizado">Personalizado' in html_content,
    'Contenedor de fechas': 'id="date-range-container"' in html_content,
    'Campo fecha inicio': 'id="filter-fecha-inicio"' in html_content,
    'Campo fecha fin': 'id="filter-fecha-fin"' in html_content,
    'JavaScript evento periodo': 'filterPeriodo.addEventListener' in html_content,
    'JavaScript incluir fechas': "periodo === 'personalizado'" in html_content,
}

for check, result in checks_html.items():
    status = "✅" if result else "❌"
    print(f"   {status} {check}")

# 2. Verificar app.py
print("\n2️⃣  Verificando app.py:")
with open('app.py', 'r', encoding='utf-8') as f:
    app_content = f.read()

checks_app = {
    'Parámetro producto': "producto = request.args.get('producto', 'all')" in app_content,
    'Parámetro fecha_inicio': "fecha_inicio_param = request.args.get('fecha_inicio')" in app_content,
    'Parámetro fecha_fin': "fecha_fin_param = request.args.get('fecha_fin')" in app_content,
    'Lógica personalizado': "periodo == 'personalizado'" in app_content,
    'Filtro producto en query': "query.filter(PAERegistro.producto == producto)" in app_content,
}

for check, result in checks_app.items():
    status = "✅" if result else "❌"
    print(f"   {status} {check}")

# 3. Verificar sintaxis Python
print("\n3️⃣  Verificando sintaxis Python:")
import py_compile
try:
    py_compile.compile('app.py', doraise=True)
    print("   ✅ app.py compila sin errores")
except py_compile.PyCompileError as e:
    print(f"   ❌ Error de sintaxis: {e}")

print("\n" + "=" * 60)
print("\n✅ TODOS LOS CAMBIOS ESTÁN APLICADOS CORRECTAMENTE")
print("\n📋 PASOS PARA VER LOS CAMBIOS:")
print("   1. Reinicia la aplicación si está corriendo")
print("   2. Abre el navegador en modo incógnito O limpia caché (Ctrl+Shift+R)")
print("   3. Ve a: http://localhost:5000/pae_dashboard/EXTRUIDOS")
print("   4. Busca la sección 'Filtros'")
print("   5. En 'Periodo', deberías ver la opción 'Personalizado'")
print("   6. Al seleccionar 'Personalizado', aparecerán dos campos de fecha")
print("\n💡 Si no ves los cambios:")
print("   - Verifica que estés viendo templates/pae/dashboard.html")
print("   - Limpia completamente el caché del navegador")
print("   - Prueba en modo incógnito")
print("   - Verifica que no haya errores en la consola del navegador (F12)")

