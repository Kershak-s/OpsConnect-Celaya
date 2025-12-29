#!/usr/bin/env python3
"""
Agrega más logging para diagnosticar por qué no se ven las gráficas PT
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar logging en la sección de canvas PT
old_canvas_check = '''    // Referencias a canvas - PRODUCTO TERMINADO (PT)
    const aceitePTCanvas = document.getElementById('aceite-pt-chart');
    const humedadPTCanvas = document.getElementById('humedad-pt-chart');
    const salPTCanvas = document.getElementById('sal-pt-chart');

    if (!aceitePTCanvas || !humedadPTCanvas || !salPTCanvas) {
        console.warn('⚠️ Canvas de PT no encontrados (puede ser normal si no están en esta vista)');
    }'''

new_canvas_check = '''    // Referencias a canvas - PRODUCTO TERMINADO (PT)
    const aceitePTCanvas = document.getElementById('aceite-pt-chart');
    const humedadPTCanvas = document.getElementById('humedad-pt-chart');
    const salPTCanvas = document.getElementById('sal-pt-chart');

    console.log('🔍 Buscando canvas PT...');
    console.log('   aceite-pt-chart:', aceitePTCanvas ? '✅ Encontrado' : '❌ No encontrado');
    console.log('   humedad-pt-chart:', humedadPTCanvas ? '✅ Encontrado' : '❌ No encontrado');
    console.log('   sal-pt-chart:', salPTCanvas ? '✅ Encontrado' : '❌ No encontrado');'''

content = content.replace(old_canvas_check, new_canvas_check)

# Agregar logging en el procesamiento de datos PT
old_log_pt = '''        console.log('📈 PT - Aceite:', datosAceitePT.length, '| Humedad:', datosHumedadPT.length, '| Sal:', datosSalPT.length);

        // Crear gráficas de PT solo si hay canvas y datos
        if (aceitePTCanvas && datosAceitePT.length > 0) {
            crearGraficaAceitePT(datosAceitePT, producto);
        }
        if (humedadPTCanvas && datosHumedadPT.length > 0) {
            crearGraficaHumedadPT(datosHumedadPT, producto);
        }
        if (salPTCanvas && datosSalPT.length > 0) {
            crearGraficaSalPT(datosSalPT, producto);
        }'''

new_log_pt = '''        console.log('📈 PT - Aceite:', datosAceitePT.length, '| Humedad:', datosHumedadPT.length, '| Sal:', datosSalPT.length);

        // Debug: mostrar algunos datos de ejemplo
        if (datosAceitePT.length > 0) {
            console.log('   Ejemplo Aceite PT:', datosAceitePT[0]);
        }
        if (datosHumedadPT.length > 0) {
            console.log('   Ejemplo Humedad PT:', datosHumedadPT[0]);
        }
        if (datosSalPT.length > 0) {
            console.log('   Ejemplo Sal PT:', datosSalPT[0]);
        }

        // Crear gráficas de PT solo si hay canvas y datos
        if (aceitePTCanvas) {
            if (datosAceitePT.length > 0) {
                console.log('🎨 Creando gráfica Aceite PT...');
                crearGraficaAceitePT(datosAceitePT, producto);
            } else {
                console.warn('⚠️ No hay datos de Aceite PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas aceite-pt-chart no disponible');
        }
        
        if (humedadPTCanvas) {
            if (datosHumedadPT.length > 0) {
                console.log('🎨 Creando gráfica Humedad PT...');
                crearGraficaHumedadPT(datosHumedadPT, producto);
            } else {
                console.warn('⚠️ No hay datos de Humedad PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas humedad-pt-chart no disponible');
        }
        
        if (salPTCanvas) {
            if (datosSalPT.length > 0) {
                console.log('🎨 Creando gráfica Sal PT...');
                crearGraficaSalPT(datosSalPT, producto);
            } else {
                console.warn('⚠️ No hay datos de Sal PT para graficar');
            }
        } else {
            console.warn('⚠️ Canvas sal-pt-chart no disponible');
        }'''

content = content.replace(old_log_pt, new_log_pt)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Debug logging agregado")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
