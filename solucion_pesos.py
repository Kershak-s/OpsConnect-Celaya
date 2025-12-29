"""
Módulo para manejar la solución integrada de control de pesos para las líneas 
de producción TORTILLA con soporte para medición en dos lados y base frita.
"""
from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from models import db, Peso
from datetime import datetime
import re

def get_product_weight_ranges(product, tipo='crudo'):
    """
    Devuelve los rangos de peso válidos para cada producto y tipo
    """
    # Rangos para peso de crudo
    crudo_ranges = {
        'DORITO': (40, 42),  # Entre 40g y 42g
        'DORITOS': (40, 42), # Entre 40g y 42g (versión con 'S')
        'TSV': (41, 43),    # Entre 41g y 43g
    }
    
    # Rangos para peso de base frita
    base_frita_ranges = {
        'DORITO': (23.5, 26.5),  # Entre 23.5g y 26.5g
        'TSV': (24, 27),     # Entre 24g y 27g
    }
    
    # Seleccionar rangos según el tipo
    if tipo == 'base_frita':
        return base_frita_ranges.get(product, (0, 100))  # Valor por defecto si no está definido
    else:
        return crudo_ranges.get(product, (0, 100))  # Valor por defecto si no está definido

def validate_weight_in_range(product, weight, tipo='crudo'):
    """
    Verifica si un peso está dentro del rango válido para un producto
    """
    if weight is None:
        return False
        
    min_weight, max_weight = get_product_weight_ranges(product, tipo)
    return min_weight <= weight <= max_weight

def generate_peso_folio(category, fecha, tipo='crudo'):
    """
    Genera un folio único para el registro de peso basado en la categoría y fecha
    Formato: PESO_DDMM_XX_001
    """
    fecha_str = fecha.strftime('%d%m')
    categoria_sufijo = ''
    
    if category == 'PAPA':
        categoria_sufijo = 'PA'
    elif category == 'EXTRUIDOS':
        categoria_sufijo = 'EX'
    elif category == 'TORTILLA':
        # Para TORTILLA, añadimos un sufijo adicional para diferenciar base frita
        if tipo == 'base_frita':
            categoria_sufijo = 'TO-BF'
        else:
            categoria_sufijo = 'TO'
    else:
        categoria_sufijo = 'XX'
    
    # Base del folio
    folio_base = f"PESO_{fecha_str}_{categoria_sufijo}"
    
    # Buscar el último número de folio para este día y categoría
    existing_folios = Peso.query.filter(
        Peso.folio.like(f"{folio_base}_%")
    ).all()
    
    # Encontrar el número más alto
    ultimo_numero = 0
    # Usar una cadena raw para evitar problemas con secuencias de escape
    patron = re.compile(r"%s_(\d+)" % folio_base)
    
    for reg in existing_folios:
        match = patron.match(reg.folio)
        if match:
            try:
                num = int(match.group(1))
                if num > ultimo_numero:
                    ultimo_numero = num
            except ValueError:
                pass
    
    # Incrementar para el nuevo folio
    numero_folio = f"{ultimo_numero + 1:03d}"
    return f"{folio_base}_{numero_folio}"

def create_peso_registro(category, form_data, tipo='crudo'):
    """
    Crea un nuevo registro de peso basado en los datos del formulario
    """
    # Obtener datos básicos del formulario
    fecha = datetime.strptime(form_data.get('fecha'), '%Y-%m-%d').date()
    turno = form_data.get('turno')
    
    # Manejo del horario (hora automática + minutos manuales para TORTILLA)
    if form_data.get('horario_hora') and form_data.get('horario_minutos') and category == 'TORTILLA':
        horario = f"{form_data.get('horario_hora')}:{form_data.get('horario_minutos')}"
    else:
        horario = form_data.get('horario')
    
    producto = form_data.get('producto')
    observaciones = form_data.get('observaciones', '')
    
    # Manejo de los pesos para todos los tipos
    peso = None
    peso_lado_a = None
    peso_lado_b = None

    # Para todos los casos, intentamos obtener peso_lado_a y peso_lado_b directamente
    if form_data.get('peso_lado_a') and form_data.get('peso_lado_a').strip():
        try:
            peso_lado_a = float(form_data.get('peso_lado_a'))
        except ValueError:
            peso_lado_a = None
    
    if form_data.get('peso_lado_b') and form_data.get('peso_lado_b').strip():
        try:
            peso_lado_b = float(form_data.get('peso_lado_b'))
        except ValueError:
            peso_lado_b = None
    
    # Si estamos en el caso de Base Frita y tenemos el campo peso_frita_a
    if tipo == 'base_frita' and form_data.get('peso_frita_a') and form_data.get('peso_frita_a').strip():
        try:
            peso_lado_a = float(form_data.get('peso_frita_a'))
        except ValueError:
            pass
    
    # Si no tenemos valores en los campos específicos, intentamos usar el campo peso general
    if (peso_lado_a is None or peso_lado_b is None) and form_data.get('peso') and form_data.get('peso').strip():
        try:
            peso_general = float(form_data.get('peso'))
            # Si no tenemos valor para lado_a, usamos el general
            if peso_lado_a is None:
                peso_lado_a = peso_general
            # Si no tenemos valor para lado_b, usamos el general o el del lado A
            if peso_lado_b is None:
                if form_data.get('peso_frita') and form_data.get('peso_frita').strip():
                    try:
                        peso_lado_b = float(form_data.get('peso_frita'))
                    except ValueError:
                        peso_lado_b = peso_general
                else:
                    peso_lado_b = peso_general
        except ValueError:
            pass
    
    # Para el campo peso principal, preferimos usar lado_a (por compatibilidad)
    peso = peso_lado_a if peso_lado_a is not None else (peso_lado_b if peso_lado_b is not None else 0.0)
    
    # Modificar las observaciones para incluir el tipo si es base_frita
    if tipo == 'base_frita' and '[BASE_FRITA]' not in observaciones:
        if observaciones:
            observaciones = f"[BASE_FRITA] {observaciones}"
        else:
            observaciones = "[BASE_FRITA]"
    
    # Generar folio automático
    folio = generate_peso_folio(category, fecha, tipo)
    
    # Verificar si los pesos están dentro de los rangos válidos
    dentro_especificacion = True
    if peso_lado_a is not None:
        dentro_especificacion = dentro_especificacion and validate_weight_in_range(producto, peso_lado_a, tipo)
    if peso_lado_b is not None:
        dentro_especificacion = dentro_especificacion and validate_weight_in_range(producto, peso_lado_b, tipo)
    
    # Crear nuevo registro con toda la información
    nuevo_registro = Peso(
        folio=folio,
        fecha=fecha,
        turno=turno,
        horario=horario,
        producto=producto,
        peso=peso,
        peso_lado_a=peso_lado_a,
        peso_lado_b=peso_lado_b,
        dentro_especificacion=dentro_especificacion,
        observaciones=observaciones,
        categoria=category,
        created_by=current_user.id
    )
    
    return nuevo_registro

def update_peso_registro(registro, form_data):
    """
    Actualiza un registro de peso existente basado en los datos del formulario
    """
    # Actualizar campos básicos
    registro.fecha = datetime.strptime(form_data.get('fecha'), '%Y-%m-%d').date()
    registro.turno = form_data.get('turno')
    registro.producto = form_data.get('producto')
    
    # Manejo del horario (hora + minutos para TORTILLA)
    if form_data.get('horario_hora') and form_data.get('horario_minutos') and registro.categoria == 'TORTILLA':
        horario = f"{form_data.get('horario_hora')}:{form_data.get('horario_minutos')}"
        registro.horario = horario
    else:
        registro.horario = form_data.get('horario')
    
    # Determinar si es base frita por el folio o las observaciones
    es_base_frita = 'TO-BF' in registro.folio or '[BASE_FRITA]' in registro.observaciones
    tipo = 'base_frita' if es_base_frita else 'crudo'
    
    # Manejo de los pesos - versión mejorada
    # Para todos los casos, intentamos obtener peso_lado_a y peso_lado_b directamente
    if form_data.get('peso_lado_a') and form_data.get('peso_lado_a').strip():
        try:
            registro.peso_lado_a = float(form_data.get('peso_lado_a'))
            # Para mantener compatibilidad con el campo 'peso'
            registro.peso = registro.peso_lado_a
        except ValueError:
            pass
    
    if form_data.get('peso_lado_b') and form_data.get('peso_lado_b').strip():
        try:
            registro.peso_lado_b = float(form_data.get('peso_lado_b'))
        except ValueError:
            pass
    
    # Si estamos en el caso de Base Frita y tenemos el campo peso_frita_a
    if es_base_frita and form_data.get('peso_frita_a') and form_data.get('peso_frita_a').strip():
        try:
            registro.peso_lado_a = float(form_data.get('peso_frita_a'))
            # Para mantener compatibilidad con el campo 'peso'
            registro.peso = registro.peso_lado_a
        except ValueError:
            pass
    
    # Si no tenemos valores en los campos específicos, intentamos usar el campo peso general
    if form_data.get('peso') and form_data.get('peso').strip():
        try:
            peso_general = float(form_data.get('peso'))
            registro.peso = peso_general
            
            # Si no se especificaron los lados, usamos el valor general para ambos
            if not form_data.get('peso_lado_a') or not form_data.get('peso_lado_a').strip():
                registro.peso_lado_a = peso_general
            
            if not form_data.get('peso_lado_b') or not form_data.get('peso_lado_b').strip():
                registro.peso_lado_b = peso_general
        except ValueError:
            pass
    
    # Actualizar observaciones
    registro.observaciones = form_data.get('observaciones', '')
    
    # Mantener indicador de base frita si ya lo tenía
    if es_base_frita and '[BASE_FRITA]' not in registro.observaciones:
        registro.observaciones = f"[BASE_FRITA] {registro.observaciones}"
    
    # Verificar si los pesos están dentro de los rangos válidos
    registro.dentro_especificacion = True
    if registro.peso_lado_a is not None:
        registro.dentro_especificacion = registro.dentro_especificacion and validate_weight_in_range(registro.producto, registro.peso_lado_a, tipo)
    if registro.peso_lado_b is not None:
        registro.dentro_especificacion = registro.dentro_especificacion and validate_weight_in_range(registro.producto, registro.peso_lado_b, tipo)
    
    return registro