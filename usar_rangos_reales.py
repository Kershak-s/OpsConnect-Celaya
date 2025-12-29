#!/usr/bin/env python3
"""
Actualiza graficas_base_frita.js para usar RANGOS_FISICOQUIMICOS_FINAL
"""

with open('static/js/custom/graficas_base_frita.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Eliminar los rangos hardcodeados antiguos
old_rangos_start = content.find('    // Rangos por producto y categoría')
if old_rangos_start != -1:
    old_rangos_end = content.find('    /**\n     * Obtiene rangos', old_rangos_start)
    if old_rangos_end != -1:
        content = content[:old_rangos_start] + content[old_rangos_end:]

# Reemplazar la función obtenerRangos
old_obtener_rangos = '''    /**
     * Obtiene rangos para un producto específico o default
     */
    function obtenerRangos(categoria, producto, campo) {
        if (!rangosPorProducto[categoria]) {
            return null;
        }
        
        // Si hay producto específico seleccionado
        if (producto && producto !== 'todos' && rangosPorProducto[categoria][producto]) {
            return rangosPorProducto[categoria][producto][campo];
        }
        
        // Usar default o null (sin líneas)
        if (rangosPorProducto[categoria]['default']) {
            return rangosPorProducto[categoria]['default'][campo];
        }
        
        return null;
    }'''

new_obtener_rangos = '''    /**
     * Obtiene rangos del producto desde RANGOS_FISICOQUIMICOS_FINAL
     * @param {string} categoria - EXTRUIDOS, TORTILLA, PAPA
     * @param {string} producto - nombre del producto o 'todos'
     * @param {string} campo - 'humedad_base' o 'aceite_base'
     * @returns {object|null} - { verde: {min, max}, amarillo: [{min,max},...] } o null
     */
    function obtenerRangos(categoria, producto, campo) {
        // Verificar que existe RANGOS_FISICOQUIMICOS_FINAL (del archivo rangos_fisicoquimicos_unificado_final.js)
        if (typeof RANGOS_FISICOQUIMICOS_FINAL === 'undefined') {
            console.warn('⚠️ RANGOS_FISICOQUIMICOS_FINAL no está definido');
            return null;
        }
        
        // Si no hay categoría o no existe en rangos
        if (!categoria || !RANGOS_FISICOQUIMICOS_FINAL[categoria]) {
            console.warn('⚠️ Categoría no encontrada:', categoria);
            return null;
        }
        
        const rangosCategoria = RANGOS_FISICOQUIMICOS_FINAL[categoria];
        
        // Si producto es 'todos' o vacío, no mostrar líneas de límites
        if (!producto || producto === 'todos') {
            console.log('📊 Sin producto específico - no se mostrarán líneas de límites');
            return null;
        }
        
        // Buscar rangos del producto específico
        let rangosProducto = rangosCategoria[producto];
        
        // Si no existe el producto, usar default
        if (!rangosProducto) {
            console.log('📊 Producto no encontrado, usando default:', producto);
            rangosProducto = rangosCategoria['default'];
        }
        
        if (!rangosProducto || !rangosProducto[campo]) {
            console.warn('⚠️ Campo no encontrado:', campo);
            return null;
        }
        
        console.log('✅ Rangos encontrados para', producto, '-', campo);
        return rangosProducto[campo];
    }
    
    /**
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

content = content.replace(old_obtener_rangos, new_obtener_rangos)

with open('static/js/custom/graficas_base_frita.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Funciones actualizadas para usar RANGOS_FISICOQUIMICOS_FINAL")

# Verificar sintaxis
import subprocess
result = subprocess.run(['node', '-c', 'static/js/custom/graficas_base_frita.js'],
                       capture_output=True, text=True)

if result.returncode == 0:
    print("✅ Sintaxis JavaScript válida")
else:
    print("❌ Error de sintaxis:")
    print(result.stderr[:500])
