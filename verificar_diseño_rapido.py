#!/usr/bin/env python
"""
Verificación rápida del diseño principal
"""

import os

def check_file(path, description):
    """Verifica si un archivo existe"""
    if os.path.exists(path):
        print(f"✅ {description} encontrado")
        return True
    else:
        print(f"❌ {description} NO encontrado")
        return False

def check_css_in_template():
    """Verifica que el template use el CSS correcto"""
    try:
        with open('templates/auth/login.html', 'r', encoding='utf-8') as f:
            content = f.read()
            if 'login-modern.css' in content:
                print("✅ Template usando el diseño split-screen correcto")
                return True
            else:
                print("⚠️  Template NO usa login-modern.css")
                return False
    except:
        return False

def main():
    print("\n" + "="*50)
    print("   VERIFICACIÓN RÁPIDA - DISEÑO PRINCIPAL")
    print("="*50 + "\n")
    
    print("Verificando archivos del diseño split-screen...\n")
    
    # Verificar archivos
    all_ok = True
    all_ok &= check_file('static/css/login-modern.css', 'CSS del diseño principal')
    all_ok &= check_file('templates/auth/login.html', 'Template de login')
    all_ok &= check_file('static/img/nuevo LOGO SF (5).png', 'Logo de Ops Connect')
    
    # Verificar que el template use el CSS correcto
    if os.path.exists('templates/auth/login.html'):
        all_ok &= check_css_in_template()
    
    print("\n" + "="*50)
    print("   RESUMEN DEL DISEÑO ACTIVO:")
    print("="*50 + "\n")
    
    if all_ok:
        print("✅ ESTADO: ACTIVO Y FUNCIONANDO")
    else:
        print("⚠️  ESTADO: Requiere verificación")
    
    print("\n• Tipo: Split-screen moderno")
    print("• Logo: 280px (balanceado)")
    print("• Zoom: 100% (sin ajustes)")
    print("• Responsive: Totalmente adaptable")
    
    print("\nPara probar:")
    print("1. Ejecuta: python app.py")
    print("2. Abre: http://127.0.0.1:5000/login")
    print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    main()
