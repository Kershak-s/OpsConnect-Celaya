#!/usr/bin/env python3
"""
Modifica calcularEjeY para centrar los datos en la gráfica
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar la función calcularEjeY
old_func = '''    /**
     * Calcula los límites del eje Y basándose en los rangos del producto
     * @param {array} datos - array de valores de datos
     * @param {object} rangos - { verde: {min, max}, amarillo: [{min,max},...] }
     * @returns {object} - { yMin, yMax }
     */
    function calcularEjeY(datos, rangos) {
        const valores = datos.map(d => d.y);
        const minDatos = Math.min(...valores);
        const maxDatos = Math.max(...valores);
        
        if (!rangos) {
            // Sin rangos: solo ajustar a los datos con 15% de margen
            const rango = maxDatos - minDatos;
            const margen = rango * 0.15 || 0.5;
            return {
                yMin: minDatos - margen,
                yMax: maxDatos + margen
            };
        }
        
        // Con rangos: incluir límites verdes y amarillos
        let todosLosLimites = [minDatos, maxDatos];
        
        // Agregar límites verdes
        if (rangos.verde) {
            todosLosLimites.push(rangos.verde.min, rangos.verde.max);
        }
        
        // Agregar límites amarillos (pueden ser arrays)
        if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
            rangos.amarillo.forEach(rango => {
                if (rango.min !== undefined) todosLosLimites.push(rango.min);
                if (rango.max !== undefined) todosLosLimites.push(rango.max);
            });
        }
        
        const minAbsoluto = Math.min(...todosLosLimites);
        const maxAbsoluto = Math.max(...todosLosLimites);
        
        // Agregar 15% de margen
        const rangoTotal = maxAbsoluto - minAbsoluto;
        const margen = rangoTotal * 0.15 || 0.3;
        
        return {
            yMin: minAbsoluto - margen,
            yMax: maxAbsoluto + margen
        };
    }'''

new_func = '''    /**
     * Calcula los límites del eje Y CENTRADO EN LOS DATOS
     * Los datos quedan en el centro, los límites se muestran si caben
     * @param {array} datos - array de valores de datos
     * @param {object} rangos - { verde: {min, max}, amarillo: [{min,max},...] }
     * @returns {object} - { yMin, yMax }
     */
    function calcularEjeY(datos, rangos) {
        const valores = datos.map(d => d.y);
        const minDatos = Math.min(...valores);
        const maxDatos = Math.max(...valores);
        const rangoDatos = maxDatos - minDatos;
        const centroDatos = (maxDatos + minDatos) / 2;
        
        console.log('📊 Datos - min:', minDatos.toFixed(2), 'max:', maxDatos.toFixed(2), 'centro:', centroDatos.toFixed(2));
        
        if (!rangos) {
            // Sin rangos: centrar en datos con 40% de margen a cada lado
            const margen = rangoDatos * 0.4 || 0.5;
            return {
                yMin: minDatos - margen,
                yMax: maxDatos + margen
            };
        }
        
        // Obtener todos los límites
        let limiteMasBajo = Infinity;
        let limiteMasAlto = -Infinity;
        
        if (rangos.verde) {
            limiteMasBajo = Math.min(limiteMasBajo, rangos.verde.min);
            limiteMasAlto = Math.max(limiteMasAlto, rangos.verde.max);
        }
        
        if (rangos.amarillo && Array.isArray(rangos.amarillo)) {
            rangos.amarillo.forEach(r => {
                if (r.min !== undefined) limiteMasBajo = Math.min(limiteMasBajo, r.min);
                if (r.max !== undefined) limiteMasAlto = Math.max(limiteMasAlto, r.max);
            });
        }
        
        console.log('📏 Límites - bajo:', limiteMasBajo.toFixed(2), 'alto:', limiteMasAlto.toFixed(2));
        
        // Calcular el rango necesario para mostrar datos Y límites
        const minTotal = Math.min(minDatos, limiteMasBajo);
        const maxTotal = Math.max(maxDatos, limiteMasAlto);
        const rangoTotal = maxTotal - minTotal;
        
        // Agregar margen del 20% arriba y abajo para que nada quede pegado al borde
        const margen = rangoTotal * 0.20 || 0.3;
        
        return {
            yMin: minTotal - margen,
            yMax: maxTotal + margen
        };
    }'''

content = content.replace(old_func, new_func)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Función calcularEjeY actualizada")
print("")
print("Nuevo comportamiento:")
print("  1. Calcula min/max de DATOS")
print("  2. Calcula min/max de LÍMITES")
print("  3. Toma el rango total (datos + límites)")
print("  4. Agrega 20% de margen arriba y abajo")
print("  5. Los datos y límites quedan visibles con espacio")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("\n✅ Sintaxis JavaScript válida")
else:
    print("\n❌ Error de sintaxis:")
    print(result.stderr[:500])
