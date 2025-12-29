import re
from datetime import datetime
from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from models import db, Peso
from solucion_pesos import create_peso_registro, update_peso_registro

# Rutas para Control de Pesos (Nuevo módulo)
def pesos_list(category):
    # Verificar categoría válida
    if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
        flash('Línea de producción no válida', 'danger')
        return redirect(url_for('index'))
    
    # Obtener parámetros de filtrado
    fecha_desde = request.args.get('fecha_desde')
    fecha_hasta = request.args.get('fecha_hasta')
    producto = request.args.get('producto')
    
    # Construir la consulta base
    query = Peso.query.filter_by(categoria=category)
    
    # Aplicar filtros si se proporcionaron
    if fecha_desde:
        query = query.filter(Peso.fecha >= datetime.strptime(fecha_desde, '%Y-%m-%d').date())
    if fecha_hasta:
        query = query.filter(Peso.fecha <= datetime.strptime(fecha_hasta, '%Y-%m-%d').date())
    if producto:
        query = query.filter(Peso.producto == producto)
    
    # Ordenar por fecha descendente
    todos_registros = query.order_by(Peso.fecha.desc(), Peso.id.desc()).all()
    
    # Separar registros entre crudo y base frita
    registros = []
    registros_base_frita = []
    
    for reg in todos_registros:
        # Verificar si es un registro de base frita
        es_base_frita = False
        if ((reg.folio and 'TO-BF' in reg.folio) or 
            (reg.observaciones and '[BASE_FRITA]' in reg.observaciones)):
            es_base_frita = True
            registros_base_frita.append(reg)
        else:
            registros.append(reg)
    
    # Agregar atributo formato_fecha para cada registro y convertir a diccionarios
    registros_dict = []
    registros_base_frita_dict = []
    
    for reg in registros:
        reg_dict = reg.to_dict()
        # Añadir campos de fecha formateada
        reg_dict['fecha_formateada'] = reg.fecha.strftime('%d/%m/%Y') if hasattr(reg.fecha, 'strftime') else str(reg.fecha)
        reg_dict['fecha_iso'] = reg.fecha.strftime('%Y-%m-%d') if hasattr(reg.fecha, 'strftime') else str(reg.fecha)
        registros_dict.append(reg_dict)
    
    for reg in registros_base_frita:
        reg_dict = reg.to_dict()
        # Añadir campos de fecha formateada
        reg_dict['fecha_formateada'] = reg.fecha.strftime('%d/%m/%Y') if hasattr(reg.fecha, 'strftime') else str(reg.fecha)
        reg_dict['fecha_iso'] = reg.fecha.strftime('%Y-%m-%d') if hasattr(reg.fecha, 'strftime') else str(reg.fecha)
        registros_base_frita_dict.append(reg_dict)
    
    # Activar pestaña de Base Frita si viene de una operación exitosa
    base_frita_success = request.args.get('base_frita_success', '0') == '1'
    
    return render_template('pesos/list.html',
                          title=f'Control de Pesos - {category}',
                          category=category,
                          registros=registros_dict,
                          registros_base_frita=registros_base_frita_dict,
                          base_frita_success=base_frita_success)

def pesos_create(category):
    # Verificar categoría válida
    if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
        flash('Línea de producción no válida', 'danger')
        return redirect(url_for('index'))
    
    # Determinar el tipo de registro (crudo o base_frita)
    tipo = request.form.get('tipo', 'crudo')
    
    try:
        # Usar la función de la solución para crear el registro
        nuevo_registro = create_peso_registro(category, request.form, tipo)
        
        db.session.add(nuevo_registro)
        db.session.commit()
        flash(f'Registro de peso con folio {nuevo_registro.folio} creado exitosamente.', 'success')
        
        # Redireccionar a la pestaña correspondiente si se especifica
        redirect_tab = request.form.get('redirect_tab')
        if redirect_tab == 'base_frita' or tipo == 'base_frita':
            return redirect(url_for('pesos_list_route_register', category=category, base_frita_success=1))
    except Exception as e:
        db.session.rollback()
        flash(f'Error al guardar el registro: {str(e)}', 'danger')
    
    return redirect(url_for('pesos_list_route_register', category=category))

def pesos_edit(category, registro_id):
    # Verificar categoría válida
    if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
        flash('Línea de producción no válida', 'danger')
        return redirect(url_for('index'))
    
    # Obtener el registro
    registro = db.session.get(Peso, registro_id)
    if not registro:
        flash('Registro no encontrado', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    # Verificar que el registro pertenece a la categoría correcta
    if registro.categoria != category:
        flash('El registro no pertenece a esta categoría', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    # Verificar si es el creador o un administrador
    if registro.created_by != current_user.id and not current_user.is_admin:
        flash('No tienes permiso para editar este registro', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    try:
        # Usar la función de la solución para actualizar el registro
        registro = update_peso_registro(registro, request.form)
        
        db.session.commit()
        flash('Registro actualizado correctamente', 'success')
        
        # Redireccionar a la pestaña correspondiente si es un registro de base frita
        es_base_frita = 'TO-BF' in registro.folio or '[BASE_FRITA]' in registro.observaciones
        if es_base_frita:
            return redirect(url_for('pesos_list_route_register', category=category, base_frita_success=1))
    except Exception as e:
        db.session.rollback()
        flash(f'Error al actualizar el registro: {str(e)}', 'danger')
    
    return redirect(url_for('pesos_list_route_register', category=category))

def pesos_delete(category, registro_id):
    # Verificar categoría válida
    if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
        flash('Línea de producción no válida', 'danger')
        return redirect(url_for('index'))
    
    # Obtener el registro
    registro = db.session.get(Peso, registro_id)
    if not registro:
        flash('Registro no encontrado', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    # Verificar que el registro pertenece a la categoría correcta
    if registro.categoria != category:
        flash('El registro no pertenece a esta categoría', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    # Verificar si es el creador o un administrador
    if registro.created_by != current_user.id and not current_user.is_admin:
        flash('No tienes permiso para eliminar este registro', 'danger')
        return redirect(url_for('pesos_list_route_register', category=category))
    
    # Determinar si es un registro de base frita para redireccionar después
    es_base_frita = 'TO-BF' in registro.folio or '[BASE_FRITA]' in registro.observaciones
    
    try:
        db.session.delete(registro)
        db.session.commit()
        flash('Registro eliminado correctamente', 'success')
        
        # Redireccionar a la pestaña correspondiente
        if es_base_frita:
            return redirect(url_for('pesos_list_route_register', category=category, base_frita_success=1))
    except Exception as e:
        db.session.rollback()
        flash(f'Error al eliminar el registro: {str(e)}', 'danger')
    
    return redirect(url_for('pesos_list_route_register', category=category))
