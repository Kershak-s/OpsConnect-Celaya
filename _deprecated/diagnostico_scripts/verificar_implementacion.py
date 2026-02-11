#!/usr/bin/env python3
"""
Script de verificación final para la implementación de campos PT Producto Terminado
"""

import os
import sqlite3
from datetime import datetime

def check_file_exists(filepath, description):
    """Verifica si un archivo existe"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - NO ENCONTRADO")
        return False

def check_file_content(filepath, search_terms, description):
    """Verifica si un archivo contiene términos específicos"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_terms = []
        missing_terms = []
        
        for term in search_terms:
            if term in content:
                found_terms.append(term)
            else:
                missing_terms.append(term)
        
        if missing_terms:
            print(f"⚠️  {description}: Faltan términos {missing_terms}")
            return False
        else:
            print(f"✅ {description}: Todos los términos encontrados")
            return True
            
    except Exception as e:
        print(f"❌ Error al verificar {filepath}: {e}")
        return False

def check_database_migration():
    """Verifica si la migración de la base de datos se aplicó"""
    db_path = os.path.join('instance', 'app.db')
    
    if not os.path.exists(db_path):
        print("⚠️  Base de datos no encontrada - ejecutar la aplicación primero")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si la tabla existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='analisis_calidad'")
        if not cursor.fetchone():
            print("❌ Tabla 'analisis_calidad' no encontrada")
            return False
        
        # Verificar columnas
        cursor.execute("PRAGMA table_info(analisis_calidad)")
        columns = [col[1] for col in cursor.fetchall()]
        
        required_columns = [
            'aceite_pt_producto_terminado',
            'humedad_pt_producto_terminado',
            'sal_pt_producto_terminado'
        ]
        
        missing_columns = [col for col in required_columns if col not in columns]
        
        if missing_columns:
            print(f"❌ BD: Faltan columnas {missing_columns}")
            print("   📝 Ejecutar: python migrate_analisis_fisicoquimicos.py")
            return False
        else:
            print("✅ BD: Todas las columnas PT están presentes")
            return True
            
    except Exception as e:
        print(f"❌ Error al verificar BD: {e}")
        return False
    finally:
        if conn:
            conn.close()

def main():
    """Función principal de verificación"""
    
    print("🔍 VERIFICACIÓN DE IMPLEMENTACIÓN - Campos PT Producto Terminado")
    print("=" * 70)
    print()
    
    # Verificar directorio de trabajo
    if not os.path.exists('app.py'):
        print("❌ Este script debe ejecutarse desde el directorio raíz del proyecto")
        print("   Asegúrate de estar en la carpeta app_gestion")
        return False
    
    checks_passed = 0
    total_checks = 0
    
    print("📋 1. VERIFICACIÓN DE ARCHIVOS PRINCIPALES")
    print("-" * 50)
    
    # Verificar archivos principales
    main_files = [
        ('app.py', 'Aplicación principal'),
        ('models.py', 'Modelos de base de datos'), 
        ('forms.py', 'Formularios'),
        ('templates/pnc/list_analisis_fisicoquimicos.html', 'Template principal')
    ]
    
    for filepath, description in main_files:
        total_checks += 1
        if check_file_exists(filepath, description):
            checks_passed += 1
    
    print("\n📋 2. VERIFICACIÓN DE MODELOS Y FORMULARIOS")
    print("-" * 50)
    
    # Verificar models.py
    total_checks += 1
    if check_file_content('models.py', [
        'aceite_pt_producto_terminado',
        'humedad_pt_producto_terminado', 
        'sal_pt_producto_terminado'
    ], 'Campos en models.py'):
        checks_passed += 1
    
    # Verificar forms.py
    total_checks += 1
    if check_file_content('forms.py', [
        'aceite_pt_producto_terminado',
        'humedad_pt_producto_terminado',
        'sal_pt_producto_terminado'
    ], 'Campos en forms.py'):
        checks_passed += 1
    
    print("\n📋 3. VERIFICACIÓN DE BASE DE DATOS")
    print("-" * 50)
    
    total_checks += 1
    if check_database_migration():
        checks_passed += 1
    
    print("\n📋 4. VERIFICACIÓN DE ARCHIVOS DE IMPLEMENTACIÓN")
    print("-" * 50)
    
    # Verificar archivos creados
    implementation_files = [
        ('migrate_analisis_fisicoquimicos.py', 'Script de migración'),
        ('template_patch_create_modal.html', 'Patch modal creación'),
        ('template_patch_edit_modal.html', 'Patch modal edición'),
        ('template_patch_table.html', 'Patch tabla'),
        ('analyze_app_py.py', 'Script análisis app.py'),
        ('IMPLEMENTACION_PT_CAMPOS.md', 'Documentación')
    ]
    
    for filepath, description in implementation_files:
        total_checks += 1
        if check_file_exists(filepath, description):
            checks_passed += 1
    
    print("\n📋 5. RESUMEN DE IMPLEMENTACIÓN")
    print("-" * 50)
    
    print(f"✅ Completado: {checks_passed}/{total_checks} verificaciones")
    print(f"📊 Progreso: {(checks_passed/total_checks)*100:.1f}%")
    
    print("\n📋 6. SIGUIENTES PASOS")
    print("-" * 50)
    
    if checks_passed == total_checks:
        print("🎉 ¡Implementación básica completa!")
        print("📝 Pasos pendientes:")
        print("   1. Aplicar patches a list_analisis_fisicoquimicos.html")
        print("   2. Actualizar función en app.py")
        print("   3. Probar la funcionalidad completa")
    else:
        print("⚠️  Implementación incompleta")
        missing = total_checks - checks_passed
        print(f"   Faltan {missing} elementos por completar")
        print("   Revisar los errores anteriores")
    
    print("\n📚 DOCUMENTACIÓN")
    print("-" * 50)
    print("📖 Ver IMPLEMENTACION_PT_CAMPOS.md para instrucciones detalladas")
    print("🔧 Ejecutar migrate_analisis_fisicoquimicos.py para migrar BD")
    print("🔍 Ejecutar analyze_app_py.py para localizar funciones en app.py")
    
    print("\n" + "=" * 70)
    print(f"📅 Verificación completada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return checks_passed == total_checks

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
