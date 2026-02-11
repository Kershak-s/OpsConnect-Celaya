#!/usr/bin/env python3
"""
Script para buscar y mostrar las funciones relacionadas con análisis fisicoquímicos en app.py
"""

import re
import os

def find_analisis_functions():
    """Busca funciones relacionadas con análisis fisicoquímicos en app.py"""
    
    app_file = 'app.py'
    
    if not os.path.exists(app_file):
        print("❌ Archivo app.py no encontrado")
        return False
    
    try:
        with open(app_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.split('\n')
        
        # Buscar funciones relacionadas con análisis fisicoquímicos
        fisico_functions = []
        analisis_functions = []
        
        for i, line in enumerate(lines):
            line_num = i + 1
            
            # Buscar referencias a fisicoquímicos
            if 'fisicoquimicos' in line.lower():
                fisico_functions.append((line_num, line.strip()))
            
            # Buscar funciones de análisis
            if ('analisis' in line.lower() and 
                ('@app.route' in line or 'def ' in line)):
                analisis_functions.append((line_num, line.strip()))
        
        print("🔍 FUNCIONES RELACIONADAS CON ANÁLISIS FISICOQUÍMICOS")
        print("=" * 60)
        
        if fisico_functions:
            print("\n📋 Referencias a 'fisicoquímicos':")
            for line_num, line in fisico_functions:
                print(f"   Línea {line_num}: {line}")
        
        if analisis_functions:
            print("\n📋 Funciones de análisis encontradas:")
            for line_num, line in analisis_functions:
                print(f"   Línea {line_num}: {line}")
        
        # Buscar patrones de manejo de campos
        print("\n📋 Búsqueda de patrones de manejo de campos:")
        
        # Buscar referencias a tanque1_aceite_pt
        tanque_patterns = []
        for i, line in enumerate(lines):
            if 'tanque1_aceite_pt' in line or 'tanque2_aceite_pt' in line:
                tanque_patterns.append((i + 1, line.strip()))
        
        if tanque_patterns:
            print("   Patrones de campos de tanque encontrados:")
            for line_num, line in tanque_patterns[:5]:  # Mostrar solo los primeros 5
                print(f"      Línea {line_num}: {line}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al leer el archivo: {e}")
        return False

def generate_app_patch():
    """Genera un patch sugerido para app.py"""
    
    patch_content = '''
"""
PATCH SUGERIDO PARA APP.PY - ANÁLISIS FISICOQUÍMICOS
Agregar el manejo de los nuevos campos PT Producto Terminado
"""

# EN LA FUNCIÓN QUE MANEJA EL POST (probablemente list_analisis_fisicoquimicos):
# Agregar después de los campos existentes de tanques:

# Campos PT Producto Terminado Generales - NUEVOS
aceite_pt_producto_terminado = request.form.get('aceite_pt_producto_terminado')
humedad_pt_producto_terminado = request.form.get('humedad_pt_producto_terminado')
sal_pt_producto_terminado = request.form.get('sal_pt_producto_terminado')

# AL CREAR EL OBJETO AnalisisCalidad:
# Agregar estos campos al constructor o asignación:

nuevo_analisis.aceite_pt_producto_terminado = aceite_pt_producto_terminado
nuevo_analisis.humedad_pt_producto_terminado = humedad_pt_producto_terminado
nuevo_analisis.sal_pt_producto_terminado = sal_pt_producto_terminado

# EN LA FUNCIÓN DE EDICIÓN:
# Agregar la actualización de estos campos:

if request.method == 'POST' and 'submit_edit_analisis' in request.form:
    # ... código existente ...
    
    # Actualizar nuevos campos PT
    analisis.aceite_pt_producto_terminado = request.form.get('aceite_pt_producto_terminado')
    analisis.humedad_pt_producto_terminado = request.form.get('humedad_pt_producto_terminado')
    analisis.sal_pt_producto_terminado = request.form.get('sal_pt_producto_terminado')

# EN LA DESCARGA DE EXCEL:
# Agregar las nuevas columnas al headers:

headers.extend(['Aceite_PT_General', 'Humedad_PT_General', 'Sal_PT_General'])

# Y en el loop de datos:
ws_datos.cell(row=row_idx, column=col_aceite_pt_general, value=registro.aceite_pt_producto_terminado or '')
ws_datos.cell(row=row_idx, column=col_humedad_pt_general, value=registro.humedad_pt_producto_terminado or '')
ws_datos.cell(row=row_idx, column=col_sal_pt_general, value=registro.sal_pt_producto_terminado or '')

"""
'''
    
    with open('app_py_patch_suggestions.txt', 'w', encoding='utf-8') as f:
        f.write(patch_content)
    
    print("📝 Patch sugerido guardado en: app_py_patch_suggestions.txt")

if __name__ == "__main__":
    print("🔍 ANÁLISIS DE FUNCIONES - app.py")
    print("=" * 50)
    
    if not os.path.exists('app.py'):
        print("❌ Este script debe ejecutarse desde el directorio raíz del proyecto")
        exit(1)
    
    success = find_analisis_functions()
    
    if success:
        print("\n" + "=" * 60)
        generate_app_patch()
    
    print("\n✅ Análisis completado")
