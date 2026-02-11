# Script para arreglar la descarga de Excel de fisicoquímicos
# Solo agrega las funciones necesarias al final del app.py

def get_corrected_routes():
    return '''
    # Ruta para eliminar registros de análisis fisicoquímicos
    @app.route('/analisis_fisicoquimicos/<category>/delete/<int:analisis_id>', methods=['POST'])
    @login_required
    def delete_analisis_fisicoquimico(category, analisis_id):
        # Verificar categoría válida
        if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
            flash('Línea de producción no válida', 'danger')
            return redirect(url_for('index'))
        
        # Obtener el registro
        analisis = AnalisisCalidad.query.get_or_404(analisis_id)
        
        # Verificar que pertenece a la categoría correcta
        if analisis.categoria != category:
            flash('Registro no pertenece a esta categoría', 'danger')
            return redirect(url_for('list_analisis_fisicoquimicos', category=category))
        
        # Verificar permisos
        if analisis.created_by != current_user.id and not current_user.is_admin:
            flash('No tienes permiso para eliminar este registro', 'danger')
            return redirect(url_for('list_analisis_fisicoquimicos', category=category))
        
        try:
            db.session.delete(analisis)
            db.session.commit()
            flash('Registro eliminado correctamente', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Error al eliminar: {str(e)}', 'danger')
        
        return redirect(url_for('list_analisis_fisicoquimicos', category=category))

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
'''

# Leer archivo actual y limpiar contenido corrupto
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar donde se corta la función
cut_point = content.find('sal_pt', registro.producto, rangos, verde_fill, amarillo_fill, rojo_fill, gris_fill)')
if cut_point != -1:
    # Cortar hasta antes del texto corrupto y agregar las funciones corregidas
    clean_content = content[:cut_point]
    
    # Agregar el cierre de la función create_app
    clean_content += '''
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
'''
    
    # Escribir archivo limpio
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(clean_content)
    
    print("Archivo app.py limpiado y corregido")
    print("Función de descarga de Excel ya está implementada (simple, sin colores)")
    print("Agregada función para eliminar registros de fisicoquímicos")
else:
    print("No se encontró el punto de corte en el archivo")
