"""
Rutas para visualización de registros PAE guardados
Permite ver registros con colores de validación aplicados
"""

from flask import jsonify, request
from flask_login import login_required
from datetime import datetime, timedelta
import json
from models import PAERegistro

# Rangos PAPA (sincronizados con frontend y papa_excel_routes.py)
RANGOS_PAPA = {
    'A': {'verde': (0, 4), 'amarillo': (4.1, 10), 'descripcion': 'Defectos de color'},
    'B': {'verde': (0, 4), 'amarillo': (4.1, 10), 'descripcion': 'Daño seco'},
    'C': {'verde': (0, 4), 'amarillo': (4.1, 10), 'descripcion': 'Color indeseable'},
    'D': {'verde': (0, 10), 'amarillo': (10.1, 20), 'descripcion': 'Defectos internos papa'},
    'E': {'verde': (0, 10), 'amarillo': (10.1, 20), 'descripcion': 'Defectos externos papa'},
    'F': {'verde': (0, 10), 'amarillo': (10.1, 20), 'descripcion': 'Defectos totales de papa'},
    'G': {'verde': (0, 1), 'amarillo': (1.1, 2), 'descripcion': 'Centros suaves + clusters'},
    'H': {'verde': (0, 6), 'amarillo': (6.1, 20), 'descripcion': 'Exceso de cáscara'},
    'I': {'verde': (0, 6), 'amarillo': (6.1, 20), 'descripcion': 'Hojuelas aceitosas'},
    'J': {'verde': (0, 6), 'amarillo': (6.1, 20), 'descripcion': 'Ampulas'},
    'K': {'verde': (0, 6), 'amarillo': (6.1, 20), 'descripcion': 'Puntos obscuros'},
    'L': {'verde': (0, 20), 'amarillo': (20.1, 40), 'descripcion': 'Defectos totales de proceso'},
    'M': {'verde': (0, 30), 'amarillo': (30.1, 35), 'descripcion': 'Hojuelas dobladas'},
    'N': {'verde': (75, 100), 'amarillo': None, 'descripcion': 'Hojuela Entera (%)'},
    'O': {'verde': (73, 100), 'amarillo': None, 'descripcion': 'Hojuela Entera FIESTA (%)'},
    'P': {'verde': (0, 12), 'amarillo': (12.1, 15), 'descripcion': 'Pedacera (scrap) (%)'},
    'Q': {'verde': (61, 100), 'amarillo': (58, 60.9), 'descripcion': 'Color de la Base L'},
    'R': {'verde': (-3, 2.5), 'amarillo': (2.51, 10), 'descripcion': 'Color de la base a'},
    # Campos 4H - Registros cada 4 horas
    '4H-PELADO': {'verde': (95, 100), 'amarillo': None, 'descripcion': 'Pelado - Remoción de cáscara'},
    '4H-GROSOR': {'verde': (1.3, 1.4), 'amarillo': None, 'descripcion': 'Rebanado - Grosor'},
    '4H-DESVIACION': {'verde': (0, 0.071), 'amarillo': None, 'descripcion': 'Rebanado - Desviación'},
    '4H-ALMIDON': {'verde': (0, 3), 'amarillo': None, 'descripcion': 'Lavador - Almidón superficial'},
    '4H-HUMEDAD': {'verde': (0, 9.99), 'amarillo': None, 'descripcion': 'Producto terminado - Humedad superficial'},
    '4H-TIEMPO': {'verde': (2.83, 3.16), 'amarillo': None, 'descripcion': 'Freidor - Tiempo de residencia'},
    '4H-TEMP': {'verde': (171, 9999), 'amarillo': None, 'descripcion': 'Freidor - Temperatura'},
    '4H-OV': {'verde': (0, 15), 'amarillo': (15.1, 25), 'descripcion': 'Producto terminado - OV'},
    '4H-AGL': {'verde': (0, 0.25), 'amarillo': (0.26, 0.35), 'descripcion': 'Producto terminado - AGL'}
}

# Rangos específicos para RUFFLES QUESO (sobrescribe solo estos campos)
RANGOS_RUFFLES_QUESO = {
    '4H-GROSOR': {'verde': (2.73, 2.83), 'amarillo': None, 'descripcion': 'Rebanado - Grosor'},
    '4H-DESVIACION': {'verde': (0, 0.089), 'amarillo': None, 'descripcion': 'Rebanado - Desviación'},
    '4H-TIEMPO': {'verde': (3.08, 3.41), 'amarillo': None, 'descripcion': 'Freidor - Tiempo de residencia'}
}

# Rangos EXTRUIDOS (sin amarillo - solo verde/rojo)
RANGOS_EXTRUIDOS = {
    'A': {'verde': (0, 0), 'descripcion': 'Quemado'},
    'B': {'verde': (0, 8), 'descripcion': 'Roto'},
    'C': {'verde': (0, 18), 'descripcion': 'Defectos totales'},
    'D': {'verde': (64.0, 72.0), 'descripcion': 'Densidad extrusor'},
    'E': {'verde': (95, 110), 'descripcion': 'Densidad base frita'},
    'F': {'verde': (21.0, 23), 'descripcion': 'Diámetro 20 collets'},
    'G': {'verde': (100, 100), 'descripcion': 'Cobertura'},
    # Campos Registro cada 4 Horas (EXTRUIDOS)
    'EXT-HUMEDAD': {'verde': (15, 16.5), 'descripcion': 'Humedad cereal trompo'},
    'EXT-TIEMPO': {'verde': (30, 40), 'descripcion': 'Tiempo residencia freidor'},
    'EXT-TEMP': {'verde': (188, 194), 'descripcion': 'Temperatura freidor'},
    'EXT-SLURRY': {'verde': (40, 46), 'descripcion': 'Temperatura slurry marmitas'}
}

# Rangos TORTILLA (sin amarillo - solo verde/rojo)
RANGOS_TORTILLA = {
    'A': {'verde': (0, 0.99), 'descripcion': 'Puntos Negros'},
    'B': {'verde': (0, 0.99), 'descripcion': 'Quemado'},
    'C': {'verde': (0, 0.99), 'descripcion': 'Manchas de condensados'},
    'D': {'verde': (0, 0), 'descripcion': 'Doblados'},
    'E': {'verde': (0, 0), 'descripcion': 'Pegados'},
    'F': {'verde': (0, 1.99), 'descripcion': 'Aceitoso'},
    'G': {'verde': (0, 1.99), 'descripcion': 'Puntos Tostados'},
    'H': {'verde': (0, 4.99), 'descripcion': 'Forma'},
    'I': {'verde': (0, 1.99), 'descripcion': 'Planos'},
    'J': {'verde': (0, 4.99), 'descripcion': 'Ámpulas'},
    'K': {'verde': (0, 0), 'descripcion': 'Cúmulos'},
    'L': {'verde': (0, 0), 'descripcion': 'Hoyos'},
    'M': {'verde': (0, 0), 'descripcion': 'Tiras de masa'},
    'N': {'verde': (0, 0), 'descripcion': 'Pliegue'},
    'O': {'verde': (0, 0), 'descripcion': 'Dobles'},
    'P': {'verde': (0, 4.99), 'descripcion': 'Tamaño'},
    'Q': {'verde': (0, 16.99), 'descripcion': 'Total de Defectos'}
}

def determinar_color_papa(valor, campo, rangos_custom=None):
    """Determina el color de validación para un campo PAPA"""
    rangos = rangos_custom if rangos_custom is not None else RANGOS_PAPA

    if campo not in rangos:
        return 'empty'

    rango = rangos[campo]
    verde_min, verde_max = rango['verde']
    amarillo_info = rango.get('amarillo')  # Puede ser None
    amarillo_min, amarillo_max = amarillo_info if amarillo_info else (None, None)

    # Caso especial campo N: Hojuela Entera
    # Verde: 75-100%, Rojo: <75%, Sin amarillo
    if campo == 'N':
        if 75 <= valor <= 100:
            return 'ok'
        return 'error'

    # Campo O: Hojuela Entera FIESTA
    # Verde: 73-100%, Rojo: <73%
    if campo == 'O':
        if 73 <= valor <= 100:
            return 'ok'
        return 'error'

    # Caso especial para campo R (puede ser negativo)
    if campo == 'R':
        if verde_min <= valor <= verde_max:
            return 'ok'
        if (amarillo_min <= valor <= amarillo_max) or valor < -3:
            return 'warning'
        return 'error'

    # Lógica estándar para campos A-M y P
    if verde_min <= valor <= verde_max:
        return 'ok'

    if amarillo_min is not None and amarillo_max is not None:
        if amarillo_min <= valor <= amarillo_max:
            return 'warning'

    return 'error'

def determinar_color_extruidos(valor, campo):
    """Determina el color de validación para un campo EXTRUIDOS (sin amarillo)"""
    if campo not in RANGOS_EXTRUIDOS:
        return 'empty'

    rango = RANGOS_EXTRUIDOS[campo]
    verde_min, verde_max = rango['verde']

    # Lógica sin amarillo: solo verde o rojo
    if verde_min <= valor <= verde_max:
        return 'ok'
    else:
        return 'error'

def determinar_color_tortilla(valor, campo):
    """Determina el color de validación para un campo TORTILLA (sin amarillo)"""
    if campo not in RANGOS_TORTILLA:
        return 'empty'

    rango = RANGOS_TORTILLA[campo]
    verde_min, verde_max = rango['verde']

    # Lógica sin amarillo: solo verde o rojo
    if verde_min <= valor <= verde_max:
        return 'ok'
    else:
        return 'error'

def setup_pae_visualizacion_routes(app):
    """Configura las rutas de visualización PAE"""

    @app.route('/api/pae/<category>/registro/<int:hora>', methods=['GET'])
    @login_required
    def api_get_pae_registro(category, hora):
        """Obtiene el detalle de un registro PAE específico con validación de colores"""
        try:
            # Verificar categoría válida
            if category not in ['EXTRUIDOS', 'TORTILLA', 'PAPA']:
                return jsonify({'error': 'Categoría no válida'}), 400

            # Obtener fecha y turno de parámetros
            fecha_str = request.args.get('fecha')
            turno = request.args.get('turno')

            # Si no se proporciona turno, determinarlo por hora del registro
            if not turno:
                turno = 'A' if 7 <= hora <= 18 else 'B'

            # Si no se proporciona fecha, calcularla según el turno y la hora del registro
            if fecha_str:
                try:
                    fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
                except ValueError:
                    fecha = datetime.now().date()
            else:
                # Calcular la fecha correcta según el turno y la hora del registro
                now = datetime.now()
                current_hour = now.hour
                fecha = now.date()

                # Para el turno B, determinar la fecha según la hora del registro
                if turno == 'B':
                    if hora >= 19:
                        # El registro es de la parte 19:00-23:59 del turno B
                        if current_hour < 7:
                            # Estamos después de medianoche, esa hora fue AYER
                            fecha = fecha - timedelta(days=1)
                    # Si hora < 7, la fecha es hoy (correcto por defecto)

            # Buscar el registro
            registro = PAERegistro.query.filter_by(
                categoria=category,
                fecha=fecha,
                turno=turno,
                hora_bloque=hora
            ).first()

            if not registro:
                return jsonify({'error': 'Registro no encontrado'}), 404

            # Parsear datos JSON
            atributos = {}
            if registro.data:
                try:
                    atributos = json.loads(registro.data)
                except:
                    pass

            # Procesar datos según categoría
            if category == 'PAPA':
                return procesar_registro_papa(registro, atributos, hora)
            elif category == 'EXTRUIDOS':
                return procesar_registro_extruidos(registro, atributos, hora)
            elif category == 'TORTILLA':
                return procesar_registro_tortilla(registro, atributos, hora)
            else:
                return jsonify({
                    'success': True,
                    'categoria': category,
                    'mensaje': 'Visualización no implementada para esta categoría'
                })

        except Exception as e:
            print(f"Error en API get registro: {str(e)}")
            return jsonify({'error': f'Error interno: {str(e)}'}), 500

def procesar_registro_papa(registro, atributos, hora):
    """Procesa y formatea un registro PAPA con colores de validación"""

    # Determinar rangos según producto
    producto = registro.producto
    rangos_a_usar = RANGOS_PAPA.copy()

    # Si es Ruffles Queso, sobrescribir rangos específicos
    if producto == 'RUFFLES QUESO':
        rangos_a_usar.update(RANGOS_RUFFLES_QUESO)

    # Estructura de campos PAPA
    campos_papa = {
        'DEFECTOS MATERIA PRIMA': [
            {'codigo': 'A', 'nombre': 'Defectos de color'},
            {'codigo': 'B', 'nombre': 'Daño seco'},
            {'codigo': 'C', 'nombre': 'Color indeseable'},
            {'codigo': 'D', 'nombre': 'Defectos internos papa'},
            {'codigo': 'E', 'nombre': 'Defectos externos papa'},
            {'codigo': 'F', 'nombre': 'Defectos totales de papa'}
        ],
        'DEFECTOS DE PROCESO': [
            {'codigo': 'G', 'nombre': 'Centros suaves + clusters'},
            {'codigo': 'H', 'nombre': 'Exceso de cáscara'},
            {'codigo': 'I', 'nombre': 'Hojuelas aceitosas'},
            {'codigo': 'J', 'nombre': 'Ampulas'},
            {'codigo': 'K', 'nombre': 'Puntos obscuros'},
            {'codigo': 'L', 'nombre': 'Defectos totales de proceso'},
            {'codigo': 'M', 'nombre': 'Hojuelas dobladas'}
        ],
        'ROTURA - MÉTODO A-517': [
            {'codigo': 'N', 'nombre': 'Hojuela Entera'},
            {'codigo': 'O', 'nombre': 'Hojuela Entera (FIESTA)'},
            {'codigo': 'P', 'nombre': 'Pedacera (scrap)'}
        ],
        'COLOR DE LA BASE': [
            {'codigo': 'Q', 'nombre': 'Color de la Base L'},
            {'codigo': 'R', 'nombre': 'Color de la base a'}
        ],
        'REGISTROS CADA 4 HORAS': [
            {'codigo': '4H-PELADO', 'nombre': 'Pelado - Remoción de cáscara'},
            {'codigo': '4H-GROSOR', 'nombre': 'Rebanado - Grosor'},
            {'codigo': '4H-DESVIACION', 'nombre': 'Rebanado - Desviación'},
            {'codigo': '4H-ALMIDON', 'nombre': 'Lavador - Almidón superficial'},
            {'codigo': '4H-HUMEDAD', 'nombre': 'Lavador - Humedad superficial'},
            {'codigo': '4H-TIEMPO', 'nombre': 'Freidor - Tiempo de residencia'},
            {'codigo': '4H-TEMP', 'nombre': 'Freidor - Temperatura entrada'},
            {'codigo': '4H-OV', 'nombre': 'Freidor - OV'},
            {'codigo': '4H-AGL', 'nombre': 'Freidor - AGL'}
        ]
    }

    # Procesar cada campo con su validación
    campos_procesados = {}
    for seccion, campos in campos_papa.items():
        campos_procesados[seccion] = []
        for campo in campos:
            codigo = campo['codigo']
            valor_str = atributos.get(codigo, '')

            campo_data = {
                'codigo': codigo,
                'nombre': campo['nombre'],
                'valor': valor_str,
                'color': 'empty',
                'porcentaje': None,
                'rango_info': None
            }

            # Si hay valor, calcular validación
            if valor_str and valor_str.strip():
                try:
                    valor = float(valor_str)
                    campo_data['color'] = determinar_color_papa(valor, codigo, rangos_a_usar)

                    # Calcular porcentaje (valor / 200 * 100)
                    if codigo not in ['Q', 'R'] and not codigo.startswith('4H-'):  # Q, R y 4H no usan porcentaje
                        porcentaje = (valor / 200) * 100
                        campo_data['porcentaje'] = round(porcentaje, 4)

                    # Agregar información de rangos
                    if codigo in rangos_a_usar:
                        rango = rangos_a_usar[codigo]
                        rango_info = {
                            'verde': f"{rango['verde'][0]} - {rango['verde'][1]}"
                        }
                        # Solo agregar amarillo si existe
                        if rango.get('amarillo') is not None:
                            rango_info['amarillo'] = f"{rango['amarillo'][0]} - {rango['amarillo'][1]}"
                        campo_data['rango_info'] = rango_info

                except ValueError:
                    pass

            campos_procesados[seccion].append(campo_data)

    # Preparar respuesta
    response = {
        'success': True,
        'categoria': 'PAPA',
        'hora': hora,
        'hora_str': f"{hora:02d}:00",
        'fecha': registro.fecha.strftime('%Y-%m-%d'),
        'fecha_display': registro.fecha.strftime('%d/%m/%Y'),
        'turno': registro.turno,
        'producto': registro.producto,
        'hora_muestreo': registro.hora_muestreo.strftime('%H:%M') if registro.hora_muestreo else 'N/A',
        'campos': campos_procesados,
        'sensorial': {
            'apariencia': registro.sensorial_apariencia or 'No registrado',
            'apariencia_comentario': registro.sensorial_apariencia_comentario or '',
            'textura': registro.sensorial_textura or 'No registrado',
            'textura_comentario': registro.sensorial_textura_comentario or '',
            'sabor': registro.sensorial_sabor or 'No registrado',
            'sabor_comentario': registro.sensorial_sabor_comentario or ''
        },
        'observaciones': registro.observaciones or 'Sin observaciones',
        'created_at': registro.created_at.strftime('%d/%m/%Y %H:%M') if hasattr(registro, 'created_at') else 'N/A'
    }

    return jsonify(response)

def procesar_registro_extruidos(registro, atributos, hora):
    """Procesa y formatea un registro EXTRUIDOS con colores de validación"""

    # Estructura de campos EXTRUIDOS
    campos_extruidos = {
        'DEFECTOS Y MEDICIONES': [
            {'codigo': 'A', 'nombre': 'Quemado'},
            {'codigo': 'B', 'nombre': 'Roto'},
            {'codigo': 'C', 'nombre': 'Defectos totales'},
            {'codigo': 'D', 'nombre': 'Densidad extrusor'},
            {'codigo': 'E', 'nombre': 'Densidad base frita'},
            {'codigo': 'F', 'nombre': 'Diámetro 20 collets'},
            {'codigo': 'G', 'nombre': 'Cobertura'}
            ],
        'REGISTRO CADA 4 HORAS': [
            {'codigo': 'EXT-HUMEDAD', 'nombre': 'Humedad cereal trompo (%)'},
            {'codigo': 'EXT-TIEMPO', 'nombre': 'Tiempo residencia freidor (seg)'},
            {'codigo': 'EXT-TEMP', 'nombre': 'Temperatura freidor (°C)'},
            {'codigo': 'EXT-SLURRY', 'nombre': 'Temperatura slurry marmitas (°C)'}
        ]
    }

    # Procesar cada campo con su validación
    campos_procesados = {}
    for seccion, campos in campos_extruidos.items():
        campos_procesados[seccion] = []
        for campo in campos:
            codigo = campo['codigo']
            valor_str = atributos.get(codigo, '')

            campo_data = {
                'codigo': codigo,
                'nombre': campo['nombre'],
                'valor': valor_str,
                'color': 'empty',
                'rango_info': None
            }

            # Si hay valor, calcular validación
            if valor_str and valor_str.strip():
                try:
                    valor = float(valor_str)
                    campo_data['color'] = determinar_color_extruidos(valor, codigo)

                    # Agregar información de rangos
                    if codigo in RANGOS_EXTRUIDOS:
                        rango = RANGOS_EXTRUIDOS[codigo]
                        campo_data['rango_info'] = {
                            'verde': f"{rango['verde'][0]} - {rango['verde'][1]}"
                        }

                except ValueError:
                    pass

            campos_procesados[seccion].append(campo_data)

    # Preparar respuesta
    response = {
        'success': True,
        'categoria': 'EXTRUIDOS',
        'hora': hora,
        'hora_str': f"{hora:02d}:00",
        'fecha': registro.fecha.strftime('%Y-%m-%d'),
        'fecha_display': registro.fecha.strftime('%d/%m/%Y'),
        'turno': registro.turno,
        'producto': registro.producto,
        'hora_muestreo': registro.hora_muestreo.strftime('%H:%M') if registro.hora_muestreo else 'N/A',
        'campos': campos_procesados,
        'sensorial': {
            'apariencia': registro.sensorial_apariencia or 'No registrado',
            'apariencia_comentario': registro.sensorial_apariencia_comentario or '',
            'textura': registro.sensorial_textura or 'No registrado',
            'textura_comentario': registro.sensorial_textura_comentario or '',
            'sabor': registro.sensorial_sabor or 'No registrado',
            'sabor_comentario': registro.sensorial_sabor_comentario or ''
        },
        'observaciones': registro.observaciones or 'Sin observaciones',
        'created_at': registro.created_at.strftime('%d/%m/%Y %H:%M') if hasattr(registro, 'created_at') else 'N/A',
        # Información de Registro cada 4 Horas (columnas específicas)
        'registro_4horas': {
            'aplica': bool(registro.registro_4horas_aplica) if hasattr(registro, 'registro_4horas_aplica') else False,
            'humedad_cereal': registro.extrusor_humedad_cereal if hasattr(registro, 'extrusor_humedad_cereal') and registro.extrusor_humedad_cereal else None,
            'tiempo_freidor': registro.freidor_tiempo_residencia if hasattr(registro, 'freidor_tiempo_residencia') and registro.freidor_tiempo_residencia else None,
            'temp_freidor': registro.freidor_temperatura if hasattr(registro, 'freidor_temperatura') and registro.freidor_temperatura else None,
            'temp_slurry': registro.sazonado_temp_slurry if hasattr(registro, 'sazonado_temp_slurry') and registro.sazonado_temp_slurry else None
        }
    }

    return jsonify(response)

def procesar_registro_tortilla(registro, atributos, hora):
    """Procesa y formatea un registro TORTILLA con colores de validación"""

    # Estructura de campos TORTILLA
    campos_tortilla = {
        'DEFECTOS': [
            {'codigo': 'A', 'nombre': 'Puntos Negros'},
            {'codigo': 'B', 'nombre': 'Quemado'},
            {'codigo': 'C', 'nombre': 'Manchas de condensados'},
            {'codigo': 'D', 'nombre': 'Doblados'},
            {'codigo': 'E', 'nombre': 'Pegados'},
            {'codigo': 'F', 'nombre': 'Aceitoso'},
            {'codigo': 'G', 'nombre': 'Puntos Tostados'},
            {'codigo': 'H', 'nombre': 'Forma'}
        ],
        'BURBUJA': [
            {'codigo': 'I', 'nombre': 'Planos'},
            {'codigo': 'J', 'nombre': 'Ámpulas'}
        ],
        'LAMINADO': [
            {'codigo': 'K', 'nombre': 'Cúmulos'},
            {'codigo': 'L', 'nombre': 'Hoyos'},
            {'codigo': 'M', 'nombre': 'Tiras de masa'},
            {'codigo': 'N', 'nombre': 'Pliegue'},
            {'codigo': 'O', 'nombre': 'Dobles'}
        ],
        'TAMAÑO': [
            {'codigo': 'P', 'nombre': 'Tamaño'}
        ],
        'TOTAL': [
            {'codigo': 'Q', 'nombre': 'Total de Defectos'}
        ]
    }

    # Procesar cada campo con su validación
    campos_procesados = {}
    for seccion, campos in campos_tortilla.items():
        campos_procesados[seccion] = []
        for campo in campos:
            codigo = campo['codigo']
            valor_str = atributos.get(codigo, '')

            campo_data = {
                'codigo': codigo,
                'nombre': campo['nombre'],
                'valor': valor_str,
                'color': 'empty',
                'rango_info': None
            }

            # Si hay valor, calcular validación
            if valor_str and valor_str.strip():
                try:
                    valor = float(valor_str)
                    campo_data['color'] = determinar_color_tortilla(valor, codigo)

                    # Agregar información de rangos
                    if codigo in RANGOS_TORTILLA:
                        rango = RANGOS_TORTILLA[codigo]
                        campo_data['rango_info'] = {
                            'verde': f"{rango['verde'][0]} - {rango['verde'][1]}"
                        }

                except ValueError:
                    pass

            campos_procesados[seccion].append(campo_data)

    # Preparar respuesta
    response = {
        'success': True,
        'categoria': 'TORTILLA',
        'hora': hora,
        'hora_str': f"{hora:02d}:00",
        'fecha': registro.fecha.strftime('%Y-%m-%d'),
        'fecha_display': registro.fecha.strftime('%d/%m/%Y'),
        'turno': registro.turno,
        'producto': registro.producto,
        'hora_muestreo': registro.hora_muestreo.strftime('%H:%M') if registro.hora_muestreo else 'N/A',
        'campos': campos_procesados,
        'sensorial': {
            'apariencia': registro.sensorial_apariencia or 'No registrado',
            'apariencia_comentario': registro.sensorial_apariencia_comentario or '',
            'textura': registro.sensorial_textura or 'No registrado',
            'textura_comentario': registro.sensorial_textura_comentario or '',
            'sabor': registro.sensorial_sabor or 'No registrado',
            'sabor_comentario': registro.sensorial_sabor_comentario or ''
        },
        'observaciones': registro.observaciones or 'Sin observaciones',
        'created_at': registro.created_at.strftime('%d/%m/%Y %H:%M') if hasattr(registro, 'created_at') else 'N/A',
        # Información de Registro cada 4 Horas TORTILLA
        'registro_4horas_tortilla': {
            'aplica': bool(registro.registro_4horas_tortilla_aplica) if hasattr(registro, 'registro_4horas_tortilla_aplica') else False,
            'tiempo_reposo': registro.tortilla_tiempo_reposo if hasattr(registro, 'tortilla_tiempo_reposo') and registro.tortilla_tiempo_reposo else None,
            'temp_masa': registro.tortilla_temp_masa if hasattr(registro, 'tortilla_temp_masa') and registro.tortilla_temp_masa else None,
            'humedad_masa': registro.tortilla_humedad_masa if hasattr(registro, 'tortilla_humedad_masa') and registro.tortilla_humedad_masa else None,
            'peso_10_base': registro.tortilla_peso_10_base if hasattr(registro, 'tortilla_peso_10_base') and registro.tortilla_peso_10_base else None,
            'temp_freidor': registro.tortilla_temp_freidor if hasattr(registro, 'tortilla_temp_freidor') and registro.tortilla_temp_freidor else None
        }
    }

    return jsonify(response)
