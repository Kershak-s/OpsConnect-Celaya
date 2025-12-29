#!/usr/bin/env python3
"""
Corrige los campos de PT para usar tanque1, tanque2, tanque3
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar el procesamiento de datos PT
old_datos_pt = '''        // Datos de Producto Terminado (PT)
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
            .sort((a, b) => new Date(a.x) - new Date(b.x));'''

new_datos_pt = '''        // Datos de Producto Terminado (PT) - Combina datos de los 3 tanques
        const datosAceitePT = [];
        const datosHumedadPT = [];
        const datosSalPT = [];
        
        datos.forEach(r => {
            const fechaBase = (r.fecha + ' ' + (r.hora || '')).trim();
            
            // Tanque 1
            if (r.tanque1_aceite_pt !== null && r.tanque1_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            if (r.tanque1_humedad_pt !== null && r.tanque1_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            if (r.tanque1_sal_pt !== null && r.tanque1_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque1_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 1'
                });
            }
            
            // Tanque 2
            if (r.tanque2_aceite_pt !== null && r.tanque2_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            if (r.tanque2_humedad_pt !== null && r.tanque2_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            if (r.tanque2_sal_pt !== null && r.tanque2_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque2_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 2'
                });
            }
            
            // Tanque 3
            if (r.tanque3_aceite_pt !== null && r.tanque3_aceite_pt !== undefined) {
                datosAceitePT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_aceite_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
            if (r.tanque3_humedad_pt !== null && r.tanque3_humedad_pt !== undefined) {
                datosHumedadPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_humedad_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
            if (r.tanque3_sal_pt !== null && r.tanque3_sal_pt !== undefined) {
                datosSalPT.push({
                    x: fechaBase,
                    y: parseFloat(r.tanque3_sal_pt),
                    producto: r.producto,
                    tambor: 'Tanque 3'
                });
            }
        });
        
        // Ordenar por fecha
        datosAceitePT.sort((a, b) => new Date(a.x) - new Date(b.x));
        datosHumedadPT.sort((a, b) => new Date(a.x) - new Date(b.x));
        datosSalPT.sort((a, b) => new Date(a.x) - new Date(b.x));'''

content = content.replace(old_datos_pt, new_datos_pt)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Campos PT corregidos para usar tanque1, tanque2, tanque3")
print("")
print("Ahora procesa:")
print("  - tanque1_aceite_pt, tanque2_aceite_pt, tanque3_aceite_pt")
print("  - tanque1_humedad_pt, tanque2_humedad_pt, tanque3_humedad_pt")
print("  - tanque1_sal_pt, tanque2_sal_pt, tanque3_sal_pt")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
