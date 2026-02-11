# LIMPIEZA COMPLETA Y FIX DEFINITIVO
import re
import os

print("🧹 Limpiando app.py...")

# Leer archivo
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# PASO 1: Remover TODAS las funciones duplicadas de Excel
patterns_to_remove = [
    r'@app\.route\(\'/analisis_fisicoquimicos/descargar-excel\'\).*?(?=@app\.route|def (?!descargar_excel)|if __name__|$)',
    r'def descargar_excel_fisicoquimicos\(\):.*?(?=@app\.route|def (?!descargar_excel)|if __name__|$)',
    r'def descargar_excel_analisis_fisicoquimicos\(\):.*?(?=@app\.route|def (?!descargar_excel)|if __name__|$)',
    r'def generar_excel_con_logica_existente.*?(?=@app\.route|def (?!generar_excel)|if __name__|$)'
]

for pattern in patterns_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

# PASO 2: Limpiar múltiples if __name__
content = re.sub(r'if __name__ == ["\']__main__["\']:.*?(?=if __name__|$)', '', content, flags=re.DOTALL)

# PASO 3: Agregar función única y funcional CON ARCHIVO TEMPORAL
excel_function = '''
    @app.route('/analisis_fisicoquimicos/descargar-excel')
    @login_required
    def descargar_excel_fisicoquimicos():
        """Descarga Excel con campos PT - usando archivo temporal"""
        import pandas as pd
        import tempfile
        import os
        
        categoria = request.args.get('categoria', 'TORTILLA')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        turno = request.args.get('turno', 'all')
        producto = request.args.get('producto', 'all')
        
        # Query
        query = AnalisisCalidad.query.filter_by(categoria=categoria)
        
        if fecha_inicio:
            try:
                query = query.filter(AnalisisCalidad.fecha >= datetime.strptime(fecha_inicio, '%Y-%m-%d').date())
            except:
                pass
        if fecha_fin:
            try:
                query = query.filter(AnalisisCalidad.fecha <= datetime.strptime(fecha_fin, '%Y-%m-%d').date())
            except:
                pass
        if turno != 'all':
            query = query.filter(AnalisisCalidad.turno == turno)
        if producto != 'all':
            query = query.filter(AnalisisCalidad.producto == producto)
        
        registros = query.order_by(AnalisisCalidad.fecha.desc()).all()
        
        # Crear datos con TODOS los campos PT
        data = []
        for r in registros:
            data.append({
                'Fecha': r.fecha.strftime('%d/%m/%Y') if r.fecha else '',
                'Turno': r.turno or '',
                'Producto': r.producto or '',
                'Horario': r.horario or '',
                'Folio': r.folio or '',
                'Humedad_Base': r.humedad_base_frita or '',
                'Aceite_Base': r.aceite_base_frita or '',
                'Aceite_PT_General': r.aceite_pt_producto_terminado or '',
                'Humedad_PT_General': r.humedad_pt_producto_terminado or '',
                'Sal_PT_General': r.sal_pt_producto_terminado or '',
                'T1_Aceite': r.tanque1_aceite_pt or '',
                'T1_Humedad': r.tanque1_humedad_pt or '',
                'T1_Sal': r.tanque1_sal_pt or '',
                'T2_Aceite': r.tanque2_aceite_pt or '',
                'T2_Humedad': r.tanque2_humedad_pt or '',
                'T2_Sal': r.tanque2_sal_pt or '',
                'T3_Aceite': r.tanque3_aceite_pt or '',
                'T3_Humedad': r.tanque3_humedad_pt or '',
                'T3_Sal': r.tanque3_sal_pt or '',
                'Observaciones': r.observaciones or ''
            })
        
        df = pd.DataFrame(data)
        
        # USAR ARCHIVO TEMPORAL (evita corrupción)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp:
            try:
                df.to_excel(tmp.name, index=False, engine='openpyxl')
                tmp.flush()
                
                filename = f"fisicoquimicos_{categoria.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                
                return send_file(
                    tmp.name,
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    as_attachment=True,
                    download_name=filename
                )
                
            except Exception as e:
                flash(f'Error generando Excel: {str(e)}', 'danger')
                return redirect(url_for('list_analisis_fisicoquimicos', category=categoria))
            finally:
                # Limpiar archivo temporal después
                try:
                    os.unlink(tmp.name)
                except:
                    pass
'''

# PASO 4: Insertar función limpia
insert_point = content.find("    return app")
if insert_point != -1:
    content = content[:insert_point] + excel_function + "\n" + content[insert_point:]

# PASO 5: Asegurar final correcto
if not content.strip().endswith('app.run(debug=True)'):
    content += '\n\nif __name__ == "__main__":\n    app = create_app()\n    app.run(debug=True)'

# PASO 6: Limpiar líneas vacías excesivas
content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)

# PASO 7: Guardar archivo limpio
with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ app.py limpiado completamente")
print("📊 Excel incluye: Aceite_PT_General, Humedad_PT_General, Sal_PT_General")
print("🔧 Usa archivos temporales (no BytesIO) - evita corrupción")
