#!/usr/bin/env python3
"""
Agrega event listener para redibujar gráficas cuando se cambian los tabs
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar donde está el event listener del botón y agregar después
old_btn_listener = '''    // Event listener para el botón de actualizar
    const btnActualizar = document.getElementById('actualizar-graficos-btn');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Botón clickeado');
            actualizarGraficas();
        });
        console.log('✅ Listener agregado');
    } else {
        console.warn('⚠️ Botón no encontrado');
    }'''

new_btn_listener = '''    // Event listener para el botón de actualizar
    const btnActualizar = document.getElementById('actualizar-graficos-btn');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Botón clickeado');
            actualizarGraficas();
        });
        console.log('✅ Listener agregado');
    } else {
        console.warn('⚠️ Botón no encontrado');
    }

    // Event listener para tabs de PT - Redimensionar gráficas al cambiar de tab
    const tabsDrums = document.querySelectorAll('#tabDrums button[data-bs-toggle="tab"]');
    tabsDrums.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            console.log('📑 Tab cambiado a:', event.target.textContent.trim());
            
            // Redimensionar las gráficas de PT para que se vean correctamente
            if (aceitePTChart) {
                aceitePTChart.resize();
                console.log('   ↳ Aceite PT redimensionado');
            }
            if (humedadPTChart) {
                humedadPTChart.resize();
                console.log('   ↳ Humedad PT redimensionado');
            }
            if (salPTChart) {
                salPTChart.resize();
                console.log('   ↳ Sal PT redimensionado');
            }
        });
    });
    console.log('✅ Listeners de tabs PT agregados:', tabsDrums.length, 'tabs');'''

content = content.replace(old_btn_listener, new_btn_listener)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Event listeners para tabs agregados")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
