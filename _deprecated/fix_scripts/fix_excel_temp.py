import pandas as pd
from datetime import datetime

# Leer app.py y encontrar función problemática
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Función Excel simple que funciona
excel_func = '''    @app.route('/analisis_fisicoquimicos/descargar-excel')
    @login_required
    def descargar_excel_fisicoquimicos():
        import pandas as pd
        import tempfile
        import os
        
        categoria = request.args.get('categoria', 'TORTILLA')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        turno = request.args.get('turno', 'all')
        producto = request.args.get('producto', 'all')
        
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
        
        data = []
        for r in registros:
            data.append({
                'Fecha': r.fecha.strftime('%d/%m/%Y') if r.fecha else '',
                'Turno': r.turno or '',
                'Producto': r.producto or '',
                'Horario': r.horario or '',
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
        
        # Usar archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp:
            df.to_excel(tmp.name, index=False, engine='openpyxl')
            tmp_path = tmp.name
        
        try:
            return send_file(
                tmp_path,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                as_attachment=True,
                download_name=f"fisicoquimicos_{categoria.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
        finally:
            # Limpiar archivo temporal después de enviar
            try:
                os.unlink(tmp_path)
            except:
                pass'''

# Remover función existente si existe
import re
content = re.sub(r'@app\.route\(\'/analisis_fisicoquimicos/descargar-excel\'\).*?(?=\n    @|\n    def|\nif __name__|$)', '', content, flags=re.DOTALL)

# Insertar nueva función
insert_point = content.find("if __name__ == '__main__':")
if insert_point != -1:
    content = content[:insert_point] + excel_func + "\n\n    " + content[insert_point:]

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Excel corregido - usa archivo temporal")
print("Incluye: Aceite_PT_General, Humedad_PT_General, Sal_PT_General")
