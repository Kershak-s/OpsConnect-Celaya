#!/usr/bin/env python3
"""
Agrega las gráficas de Aceite PT, Humedad PT y Sal PT
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar referencias a canvas de PT después de los canvas base
old_canvas_refs = '''    // Referencias a canvas
    const humedadCanvas = document.getElementById('humedad-base-chart');
    const aceiteCanvas = document.getElementById('aceite-base-chart');

    if (!humedadCanvas || !aceiteCanvas) {
        console.warn('⚠️ Canvas no encontrados');
        return;
    }'''

new_canvas_refs = '''    // Referencias a canvas - BASE FRITA
    const humedadCanvas = document.getElementById('humedad-base-chart');
    const aceiteCanvas = document.getElementById('aceite-base-chart');
    
    // Referencias a canvas - PRODUCTO TERMINADO (PT)
    const aceitePTCanvas = document.getElementById('aceite-pt-chart');
    const humedadPTCanvas = document.getElementById('humedad-pt-chart');
    const salPTCanvas = document.getElementById('sal-pt-chart');

    if (!humedadCanvas || !aceiteCanvas) {
        console.warn('⚠️ Canvas de Base Frita no encontrados');
    }
    
    if (!aceitePTCanvas || !humedadPTCanvas || !salPTCanvas) {
        console.warn('⚠️ Canvas de PT no encontrados (puede ser normal si no están en esta vista)');
    }'''

content = content.replace(old_canvas_refs, new_canvas_refs)

# 2. Agregar variables para instancias de Chart PT después de las de base
old_chart_vars = '''    // Variables para Chart.js
    let humedadChart = null;
    let aceiteChart = null;'''

new_chart_vars = '''    // Variables para Chart.js - BASE FRITA
    let humedadChart = null;
    let aceiteChart = null;
    
    // Variables para Chart.js - PRODUCTO TERMINADO (PT)
    let aceitePTChart = null;
    let humedadPTChart = null;
    let salPTChart = null;'''

content = content.replace(old_chart_vars, new_chart_vars)

# 3. Agregar procesamiento de datos PT en procesarYMostrarGraficas
old_procesar = '''        console.log('📈 Humedad:', datosHumedad.length, '| Aceite:', datosAceite.length);

        crearGraficaHumedad(datosHumedad, producto);
        crearGraficaAceite(datosAceite, producto);
    }'''

new_procesar = '''        console.log('📈 Base - Humedad:', datosHumedad.length, '| Aceite:', datosAceite.length);

        crearGraficaHumedad(datosHumedad, producto);
        crearGraficaAceite(datosAceite, producto);
        
        // Datos de Producto Terminado (PT)
        const datosAceitePT = datos
            .filter(r => r.aceite_pt !== null && r.aceite_pt !== undefined)
            .map(r => ({
                x: (r.fecha + ' ' + (r.hora || '')).trim(),
                y: parseFloat(r.aceite_pt),
                producto: r.producto,
                tambor: r.tambor
            }))
            .sort((a, b) => new Date(a.x) - new Date(b.x));

        const datosHumedadPT = datos
            .filter(r => r.humedad_pt !== null && r.humedad_pt !== undefined)
            .map(r => ({
                x: (r.fecha + ' ' + (r.hora || '')).trim(),
                y: parseFloat(r.humedad_pt),
                producto: r.producto,
                tambor: r.tambor
            }))
            .sort((a, b) => new Date(a.x) - new Date(b.x));

        const datosSalPT = datos
            .filter(r => r.sal_pt !== null && r.sal_pt !== undefined)
            .map(r => ({
                x: (r.fecha + ' ' + (r.hora || '')).trim(),
                y: parseFloat(r.sal_pt),
                producto: r.producto,
                tambor: r.tambor
            }))
            .sort((a, b) => new Date(a.x) - new Date(b.x));

        console.log('📈 PT - Aceite:', datosAceitePT.length, '| Humedad:', datosHumedadPT.length, '| Sal:', datosSalPT.length);

        // Crear gráficas de PT solo si hay canvas y datos
        if (aceitePTCanvas && datosAceitePT.length > 0) {
            crearGraficaAceitePT(datosAceitePT, producto);
        }
        if (humedadPTCanvas && datosHumedadPT.length > 0) {
            crearGraficaHumedadPT(datosHumedadPT, producto);
        }
        if (salPTCanvas && datosSalPT.length > 0) {
            crearGraficaSalPT(datosSalPT, producto);
        }
    }'''

content = content.replace(old_procesar, new_procesar)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Referencias y procesamiento de PT agregados")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
