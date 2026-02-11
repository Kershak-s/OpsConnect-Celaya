#!/usr/bin/env python3
"""
Prueba directa de la API de fisicoquímicos para EXTRUIDOS
"""

import requests
from datetime import datetime, timedelta

# Configurar fechas
ayer = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
hoy = datetime.now().strftime('%Y-%m-%d')

# URL de la API
url = f"http://127.0.0.1:5000/api/analisis_fisicoquimicos/EXTRUIDOS"

# Parámetros
params = {
    'periodo': 'personalizado',
    'producto': 'todos',
    'fecha_inicio': ayer,
    'fecha_fin': hoy
}

print("=" * 70)
print("🧪 TEST API - Análisis Fisicoquímicos EXTRUIDOS")
print("=" * 70)
print(f"\n📡 URL: {url}")
print(f"📋 Parámetros: {params}")
print(f"📅 Rango: {ayer} a {hoy}")

try:
    response = requests.get(url, params=params)
    
    print(f"\n📊 Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Respuesta exitosa:")
        print(f"   Success: {data.get('success', 'N/A')}")
        print(f"   Total registros: {len(data.get('datos', []))}")
        
        if data.get('resumen'):
            resumen = data['resumen']
            print(f"\n📈 Resumen:")
            print(f"   Total: {resumen.get('total_registros', 0)}")
            print(f"   Último: {resumen.get('ultimo_registro', 'N/A')}")
            print(f"   Productos: {resumen.get('productos', [])}")
        
        if data.get('datos'):
            print(f"\n🔍 Primer registro:")
            primer = data['datos'][0]
            print(f"   Folio: {primer.get('folio')}")
            print(f"   Fecha: {primer.get('fecha')}")
            print(f"   Producto: {primer.get('producto')}")
            print(f"   Humedad Base: {primer.get('humedad_base_frita')}")
            print(f"   Aceite Base: {primer.get('aceite_base_frita')}")
    else:
        print(f"\n❌ Error HTTP {response.status_code}")
        print(f"   Respuesta: {response.text[:200]}")
        
except requests.exceptions.ConnectionError:
    print(f"\n❌ No se puede conectar al servidor")
    print(f"   ¿Está corriendo la aplicación Flask?")
    print(f"   Ejecuta: python app.py")
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
