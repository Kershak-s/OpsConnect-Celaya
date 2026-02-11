from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, SelectField, IntegerField, FieldList, FormField, HiddenField, DateField, DecimalField, TimeField, FloatField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError, Optional, NumberRange
from wtforms.widgets import NumberInput
from models import User

class LoginForm(FlaskForm):
    user_id = StringField('GPID', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    remember_me = BooleanField('Recordarme')
    submit = SubmitField('Iniciar Sesión')

class RegistrationForm(FlaskForm):
    username = StringField('Nombre de Usuario', validators=[DataRequired(), Length(min=4, max=64)])
    user_id = StringField('GPID', validators=[DataRequired(), Length(min=1, max=64)])
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=8)])
    password2 = PasswordField('Repetir Contraseña', validators=[DataRequired(), EqualTo('password')])
    is_admin = BooleanField('Es Administrador')
    submit = SubmitField('Registrar')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Por favor use un nombre de usuario diferente.')

class ChangePasswordForm(FlaskForm):
    current_password = PasswordField('Contraseña Actual', validators=[DataRequired()])
    new_password = PasswordField('Nueva Contraseña', validators=[DataRequired(), Length(min=8)])
    new_password2 = PasswordField('Repetir Nueva Contraseña', validators=[DataRequired(), EqualTo('new_password')])
    submit = SubmitField('Cambiar Contraseña')

class MenuItemForm(FlaskForm):
    name = StringField('Nombre', validators=[DataRequired(), Length(max=64)])
    description = TextAreaField('Descripción')
    category = SelectField('Categoría', choices=[
        ('EXTRUIDOS', 'EXTRUIDOS'), 
        ('TORTILLA', 'TORTILLA'), 
        ('PAPA', 'PAPA')
    ], validators=[DataRequired()], validate_choice=False)
    image = FileField('Imagen', validators=[
        FileAllowed(['jpg', 'png', 'jpeg', 'gif'], 'Solo imágenes!')
    ])
    submit = SubmitField('Guardar')

# Formularios para el sistema de creación de formularios
class FormQuestionForm(FlaskForm):
    id = HiddenField('ID')
    question_text = StringField('Pregunta', validators=[DataRequired()])
    question_type = SelectField('Tipo de Pregunta', choices=[
        ('text', 'Texto Corto'),
        ('textarea', 'Texto Largo'),
        ('number', 'Número'),
        ('date', 'Fecha'),
        ('time', 'Hora'),
        ('radio', 'Selección Única'),
        ('checkbox', 'Casillas de Verificación'),
        ('select', 'Lista Desplegable')
    ], validators=[DataRequired()], validate_choice=False)
    is_required = BooleanField('Obligatorio')
    options = TextAreaField('Opciones (una por línea, para preguntas de selección)', validators=[Optional()])
    order = HiddenField('Orden')

class CreateFormForm(FlaskForm):
    title = StringField('Título del Formulario', validators=[DataRequired(), Length(max=128)])
    description = TextAreaField('Descripción', validators=[Optional()])
    category = SelectField('Línea de Producción', choices=[
        ('EXTRUIDOS', 'EXTRUIDOS'), 
        ('TORTILLA', 'TORTILLA'), 
        ('PAPA', 'PAPA')
    ], validators=[DataRequired()], validate_choice=False)
    section = SelectField('Sección', choices=[
        ('calidad', 'Calidad'),
        ('produccion', 'Producción'),
        ('mantenimiento', 'Mantenimiento'),
        ('inocuidad', 'Inocuidad'),
        ('formularios', 'Nuevos Formularios'),
        ('nuevo_formulario', 'Nuevo Formulario')
    ], validators=[DataRequired()], validate_choice=False)
    is_active = BooleanField('Activo', default=True)
    submit = SubmitField('Guardar Formulario')

class PNCForm(FlaskForm):
    folio = StringField('Folio', validators=[DataRequired()])
    fecha = DateField('Fecha', format='%Y-%m-%d', validators=[DataRequired()])
    turno = SelectField('Turno', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()])
    producto = SelectField('Nombre del Producto', choices=[
        ('CHETOS', 'CHETOS'),
        ('DORITOS', 'DORITOS'),
        ('TOSTITOS SALSA VERDE', 'TOSTITOS SALSA VERDE'),
        ('TOSTITOS FH', 'TOSTITOS FH'),
        ('DORITOS INCÓGNITA', 'DORITOS INCÓGNITA'),
        ('DORITOS PIZZEROLA', 'DORITOS PIZZEROLA'),
        ('DORITOS FH', 'DORITOS FH'),
        ('RANCHERITOS', 'RANCHERITOS'),
        ('CHEETOS TORCIDITOS', 'CHEETOS TORCIDITOS'),
        ('CHEETOS XTRA FLAMIN HOT', 'CHEETOS XTRA FLAMIN HOT'),
        ('CHEETOS JALAPENO', 'CHEETOS JALAQUEÑO'),
        ('CHEETOS XTRA FH NUEVO', 'CHEETOS XTRA FH NUEVO'),
        ('OTROS', 'OTROS')
    ], validators=[DataRequired()], validate_choice=False)
    horario = StringField('Horarios', validators=[DataRequired()])
    cantidad = StringField('Cantidad (Especificar)', validators=[DataRequired()],
                        description='Indicar en TONELADAS, KILOS, TARIMAS u OTROS')
    origen = StringField('Dónde se origina el PNC', validators=[DataRequired()])
    no_conformidad = TextAreaField('Especificar la No Conformidad', validators=[DataRequired()])
    status = SelectField('Status', choices=[
        ('Rechazado', 'Rechazado'),
        ('Detenido', 'Detenido')
    ], validators=[DataRequired()])
    detector = StringField('Nombre y Puesto de quien detecta', validators=[DataRequired()])
    rechazo = BooleanField('Rechazo')
    submit = SubmitField('Guardar Registro')

# Primera definición de WeakLinkForm eliminada - se mantiene solo la correcta al final del archivo
    oxigeno_residual_muestra_1 = FloatField('Muestra 1 Oxígeno Residual (%)', 
                                      validators=[Optional(), NumberRange(min=0, max=100)],
                                      render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    oxigeno_residual_muestra_2 = FloatField('Muestra 2 Oxígeno Residual (%)', 
                                      validators=[Optional(), NumberRange(min=0, max=100)],
                                      render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    oxigeno_residual_promedio = FloatField('Promedio Oxígeno Residual (%)', 
                                     validators=[Optional()],
                                     render_kw={"readonly": True})
    
    submit = SubmitField('Guardar Registro')
    
class PNCSimpleForm(FlaskForm):
    folio = StringField('Folio', validators=[DataRequired()])
    fecha = DateField('Fecha', format='%Y-%m-%d', validators=[DataRequired()])
    turno = SelectField('Turno', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()])
    producto = SelectField('Nombre del Producto', choices=[
        ('CHETOS', 'CHETOS'),
        ('DORITOS', 'DORITOS'),
        ('TOSTITOS SALSA VERDE', 'TOSTITOS SALSA VERDE'),
        ('TOSTITOS FH', 'TOSTITOS FH'),
        ('DORITOS PIZZEROLA', 'DORITOS PIZZEROLA'),
        ('DORITOS FH', 'DORITOS FH'),
        ('DORITOS INCÓGNITA', 'DORITOS INCÓGNITA'),
        ('RANCHERITOS', 'RANCHERITOS'),
        ('CHEETOS TORCIDITOS', 'CHEETOS TORCIDITOS'),
        ('CHEETOS XTRA FLAMIN HOT', 'CHEETOS XTRA FLAMIN HOT'),
        ('CHEETOS JALAPENO', 'CHEETOS JALAQUEÑO'),
        ('CHEETOS XTRA FH NUEVO', 'CHEETOS XTRA FH NUEVO'),
        ('OTROS', 'OTROS')
    ], validators=[DataRequired()])
    horario = StringField('Horarios', validators=[DataRequired()])
    
    # Campo modificado - Cantidad ahora es numérico y tiene placeholder
    cantidad = DecimalField('CANTIDAD', 
                         validators=[Optional()], 
                         places=3,  # Permite hasta 3 decimales
                         render_kw={"placeholder": "Ingresa la cantidad"})
    
    unidad_cantidad = SelectField('Unidad', choices=[
        ('TONELADAS', 'TONELADAS'),
        ('KILOS', 'KILOS'),
        ('TARIMAS', 'TARIMAS'),
        ('OTROS', 'OTROS')
    ], validators=[Optional()], validate_choice=False)
    
    origen = StringField('Dónde se origina el PNC', validators=[Optional()])
    
    # Campo modificado - No conformidad con placeholder
    no_conformidad = TextAreaField('NO CONFORMIDAD', 
                                validators=[Optional()],
                                render_kw={"placeholder": "Especifica la no conformidad"})
    
    status = SelectField('Status', choices=[
        ('Rechazado', 'Rechazado'),
        ('Detenido', 'Detenido')
    ], validators=[Optional()], validate_choice=False)
    
    # Campo modificado - Detector con placeholder
    detector = StringField('NOMBRE Y PUESTO DE QUIEN DETECTA', 
                        validators=[Optional()],
                        render_kw={"placeholder": "Ingresa tu nombre y posteriormente tu puesto"})
    
    rechazo = BooleanField('Rechazo')
    submit = SubmitField('Guardar Registro')

class CalidadTortillaForm(FlaskForm):
    folio = StringField('FOLIO', validators=[DataRequired()])
    fecha = DateField('FECHA', format='%Y-%m-%d', validators=[DataRequired()])
    turno = SelectField('TURNO', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()])
    producto = SelectField('NOMBRE DEL PRODUCTO', choices=[
        ('CHETOS', 'CHETOS'),
        ('DORITOS', 'DORITOS'),
        ('TOSTITOS SALSA VERDE', 'TOSTITOS SALSA VERDE'),
        ('TOSTITOS FH', 'TOSTITOS FH'),
        ('DORITOS PIZZEROLA', 'DORITOS PIZZEROLA'),
        ('DORITOS FH', 'DORITOS FH'),
        ('RANCHERITOS', 'RANCHERITOS'),
        ('DORITOS INCÓGNITA', 'DORITOS INCÓGNITA')
    ], validators=[DataRequired()])
    horario = StringField('HORARIOS', validators=[DataRequired()])
    submit = SubmitField('Guardar Registro')

class AnalisisCalidadForm(FlaskForm):
    folio = StringField('FOLIO', validators=[DataRequired()])
    fecha = DateField('FECHA', format='%Y-%m-%d', validators=[DataRequired()])
    turno = SelectField('TURNO', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()])
    producto = SelectField('NOMBRE DEL PRODUCTO', choices=[
        ('DORITOS', 'DORITOS'),
        ('TOSTITOS SALSA VERDE', 'TOSTITOS SALSA VERDE'),
        ('TOSTITOS FH', 'TOSTITOS FH'),
        ('DORITOS PIZZEROLA', 'DORITOS PIZZEROLA'),
        ('DORITOS INCÓGNITA', 'DORITOS INCÓGNITA'),
        ('DORITOS FH', 'DORITOS FH'),
        ('CHEETOS TORCIDITOS', 'CHEETOS TORCIDITOS'),
        ('RANCHERITOS', 'RANCHERITOS'),
        ('CHEETOS XTRA FLAMIN HOT', 'CHEETOS XTRA FLAMIN HOT'),
        ('CHEETOS XTRA FH NUEVO', 'CHEETOS XTRA FH NUEVO'),
        ('CHEETOS JALAQUEÑO', 'CHEETOS JALAQUEÑO')

    ], validators=[DataRequired()])
    horario = StringField('HORARIOS', validators=[DataRequired()])
    lote = StringField('LOTE', validators=[Optional()])
    analista = StringField('ANALISTA', validators=[Optional()])
    peso = StringField('PESO (g)', validators=[Optional()])
    
    # Campos para análisis fisicoquímico
    humedad_base_frita = StringField('Humedad Base Frita', validators=[Optional()])
    aceite_base_frita = StringField('Aceite Base Frita', validators=[Optional()])
    
    # Tanque 1
    tanque1_aceite_pt = StringField('Tanque 1 - Aceite PT', validators=[Optional()])
    tanque1_humedad_pt = StringField('Tanque 1 - Humedad PT', validators=[Optional()])
    tanque1_sal_pt = StringField('Tanque 1 - Sal PT', validators=[Optional()])
    
    # Tanque 2
    tanque2_aceite_pt = StringField('Tanque 2 - Aceite PT', validators=[Optional()])
    tanque2_humedad_pt = StringField('Tanque 2 - Humedad PT', validators=[Optional()])
    tanque2_sal_pt = StringField('Tanque 2 - Sal PT', validators=[Optional()])
    
    # Tanque 3
    tanque3_aceite_pt = StringField('Tanque 3 - Aceite PT', validators=[Optional()])
    tanque3_humedad_pt = StringField('Tanque 3 - Humedad PT', validators=[Optional()])
    tanque3_sal_pt = StringField('Tanque 3 - Sal PT', validators=[Optional()])
    
    # Campos PT Producto Terminado Generales - NUEVOS CAMPOS
    aceite_pt_producto_terminado = StringField('Aceite PT PRODUCTO TERMINADO', validators=[Optional()])
    humedad_pt_producto_terminado = StringField('Humedad PT PRODUCTO TERMINADO', validators=[Optional()])
    sal_pt_producto_terminado = StringField('Sal PT PRODUCTO TERMINADO', validators=[Optional()])
    
    observaciones = TextAreaField('OBSERVACIONES', validators=[Optional()])
    submit = SubmitField('Guardar Análisis')

class PAEForm(FlaskForm):
    hora_muestreo = TimeField('Hora de muestreo', format='%H:%M', validators=[Optional()])
    producto = StringField('Producto', validators=[DataRequired()])
    data = HiddenField('Datos de atributos')  # Aquí se almacenará el JSON de los atributos A-P

    # Sensorial
    sensorial_apariencia = SelectField('Apariencia', choices=[
        ('', 'Seleccionar...'),
        ('Adecuado', 'Adecuado'),
        ('Corregir', 'Corregir')
    ], validators=[Optional()])
    sensorial_apariencia_comentario = TextAreaField('Comentario de Apariencia', validators=[Optional()])
    sensorial_textura = SelectField('Textura', choices=[
        ('', 'Seleccionar...'),
        ('Adecuado', 'Adecuado'),
        ('Corregir', 'Corregir')
    ], validators=[Optional()])
    sensorial_textura_comentario = TextAreaField('Comentario de Textura', validators=[Optional()])
    sensorial_sabor = SelectField('Sabor', choices=[
        ('', 'Seleccionar...'),
        ('Adecuado', 'Adecuado'),
        ('Corregir', 'Corregir')
    ], validators=[Optional()])
    sensorial_sabor_comentario = TextAreaField('Comentario de Sabor', validators=[Optional()])
    observaciones = TextAreaField('Observaciones', validators=[Optional()])
    
    # Sección Rotura (solo para PAPA)
    rotura_aplica = BooleanField('Evaluar Rotura (solo si el producto se elabora en menos de 4 horas)', default=False)
    hojuela_entera = FloatField('N - Hojuela Entera (%)', validators=[Optional(), NumberRange(min=0, max=100)])
    hojuela_entera_fiesta = FloatField('O - Hojuela Entera (FIESTA) (%)', validators=[Optional(), NumberRange(min=0, max=100)])
    peladeras_scrap = FloatField('P - Peladeras (scrap) (%)', validators=[Optional(), NumberRange(min=0, max=100)])
    rotura_observaciones = TextAreaField('Observaciones de Rotura', validators=[Optional()])

    # Sección Registro cada 4 Horas (solo para EXTRUIDOS)
    registro_4horas_aplica = BooleanField('Registro cada 4 Horas', default=False)
    extrusor_humedad_cereal = FloatField('Humedad de cereal en el trompo (%)', validators=[Optional(), NumberRange(min=0, max=100)])
    freidor_tiempo_residencia = FloatField('Tiempo de residencia en el freidor (seg)', validators=[Optional(), NumberRange(min=0)])
    freidor_temperatura = FloatField('Temperatura del freidor (°C)', validators=[Optional(), NumberRange(min=0)])
    sazonado_temp_slurry = FloatField('Temperatura del slurry en marmitas (°C)', validators=[Optional(), NumberRange(min=0)])

    submit = SubmitField('Guardar Registro')

class PesoForm(FlaskForm):
    folio = StringField('Folio', validators=[DataRequired()])
    fecha = DateField('Fecha', format='%Y-%m-%d', validators=[DataRequired()])
    turno = SelectField('Turno', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()])
    horario = StringField('Horario', validators=[DataRequired()])
    producto = SelectField('Producto', choices=[
        ('TORTILLA DORADA', 'TORTILLA DORADA'),
        ('TORTILLA MAIZ', 'TORTILLA MAIZ'),
        ('TOSTADA NATURAL', 'TOSTADA NATURAL'),
        ('TOSTADA HORNEADA', 'TOSTADA HORNEADA')
    ], validators=[DataRequired()])
    peso = FloatField('Peso (g)', validators=[DataRequired(), NumberRange(min=0)])
    dentro_especificacion = BooleanField('Dentro de especificación', default=True)
    observaciones = TextAreaField('Observaciones', validators=[Optional()])
    submit = SubmitField('Guardar Registro')

class WeakLinkForm(FlaskForm):
    # Campos autocompletados (solo lectura)
    fecha = DateField('Fecha', format='%Y-%m-%d', validators=[DataRequired()])
    hora = TimeField('Hora', format='%H:%M', validators=[DataRequired()], render_kw={'readonly': True})
    turno = SelectField('Turno', choices=[
        ('A', 'A'),
        ('B', 'B')
    ], validators=[DataRequired()], render_kw={'readonly': True})
    
    # Campos a completar por el usuario
    operador = StringField('Nombre del Operador', validators=[Optional()])
    orden = StringField('Orden', validators=[Optional()])
    maquina = SelectField('Máquina', choices=[
        # Opciones para TORTILLA (tubos 1-16)
        ('Tubo 1', 'Tubo 1'),
        ('Tubo 2', 'Tubo 2'),
        ('Tubo 3', 'Tubo 3'),
        ('Tubo 4', 'Tubo 4'),
        ('Tubo 5', 'Tubo 5'),
        ('Tubo 6', 'Tubo 6'),
        ('Tubo 7', 'Tubo 7'),
        ('Tubo 8', 'Tubo 8'),
        ('Tubo 9', 'Tubo 9'),
        ('Tubo 10', 'Tubo 10'),
        ('Tubo 11', 'Tubo 11'),
        ('Tubo 12', 'Tubo 12'),
        ('Tubo 13', 'Tubo 13'),
        ('Tubo 14', 'Tubo 14'),
        ('Tubo 15', 'Tubo 15'),
        ('Tubo 16', 'Tubo 16'),
        # Opciones para EXTRUIDOS (tubos 17-32)
        ('Tubo 17', 'Tubo 17'),
        ('Tubo 18', 'Tubo 18'),
        ('Tubo 19', 'Tubo 19'),
        ('Tubo 20', 'Tubo 20'),
        ('Tubo 21', 'Tubo 21'),
        ('Tubo 22', 'Tubo 22'),
        ('Tubo 23', 'Tubo 23'),
        ('Tubo 24', 'Tubo 24'),
        ('Tubo 25', 'Tubo 25'),
        ('Tubo 26', 'Tubo 26'),
        ('Tubo 27', 'Tubo 27'),
        ('Tubo 28', 'Tubo 28'),
        ('Tubo 29', 'Tubo 29'),
        ('Tubo 30', 'Tubo 30'),
        ('Tubo 31', 'Tubo 31'),
        ('Tubo 32', 'Tubo 32'),
        # Opciones para PAPA (tubos 33-50)
        ('Tubo 33', 'Tubo 33'),
        ('Tubo 34', 'Tubo 34'),
        ('Tubo 35', 'Tubo 35'),
        ('Tubo 36', 'Tubo 36'),
        ('Tubo 37', 'Tubo 37'),
        ('Tubo 38', 'Tubo 38'),
        ('Tubo 39', 'Tubo 39'),
        ('Tubo 40', 'Tubo 40'),
        ('Tubo 41', 'Tubo 41'),
        ('Tubo 42', 'Tubo 42'),
        ('Tubo 43', 'Tubo 43'),
        ('Tubo 44', 'Tubo 44'),
        ('Tubo 45', 'Tubo 45'),
        ('Tubo 46', 'Tubo 46'),
        ('Tubo 47', 'Tubo 47'),
        ('Tubo 48', 'Tubo 48'),
        ('Tubo 49', 'Tubo 49'),
        ('Tubo 50', 'Tubo 50')
    ], validators=[Optional()])
    producto = SelectField('Producto', choices=[
        # Opciones para TORTILLA
        ('DORITOS', 'DORITOS'),
        ('TOSTITOS SALSA VERDE', 'TOSTITOS SALSA VERDE'),
        ('DORITOS INCOGNITA', 'DORITOS INCOGNITA'),
        ('TOSTITOS FH', 'TOSTITOS FH'),
        ('DORITOS PIZZEROLA', 'DORITOS PIZZEROLA'),
        ('DORITOS FH', 'DORITOS FH'),
        ('RANCHERITOS', 'RANCHERITOS'),
        # Opciones para EXTRUIDOS
        ('CHEETOS TORCIDITOS', 'CHEETOS TORCIDITOS'),
        ('CHEETOS XTRA FLAMIN HOT', 'CHEETOS XTRA FLAMIN HOT'),
        ('CHEETOS JALAPENO', 'CHEETOS JALAQUEÑO'),
        ('CHEETOS XTRA FH NUEVO', 'CHEETOS XTRA FH NUEVO'),
        # Opciones para PAPA
        ('PAPA SAL', 'PAPA SAL'),
        ('RUFFLES QUESO', 'RUFFLES QUESO'),
        ('RUFFLES SAL', 'RUFFLES SAL'),
        ('SABRITAS LIMON', 'SABRITAS LIMON'),
        ('SABRITAS XTRA FH', 'SABRITAS XTRA FH'),
        # Opciones generales
        ('OTROS', 'OTROS')
    ], validators=[Optional()], validate_choice=False)
    
    # Sección LIL (Limpieza, Inspección, Lubricación)
    limpieza_pesadora = SelectField('Limpieza a pesadora', choices=[
        ('', 'Seleccionar...'),
        ('Ok', 'Ok'),
        ('No ok', 'No ok')
    ], validators=[Optional()])
    limpieza_cabezal = SelectField('Limpieza cabezal cada cambio de cinta', choices=[
        ('', 'Seleccionar...'),
        ('Ok', 'Ok'),
        ('No ok', 'No ok')
    ], validators=[Optional()])
    limpieza_mordazas = SelectField('Limpieza de mordazas', choices=[
        ('', 'Seleccionar...'),
        ('Ok', 'Ok'),
        ('No ok', 'No ok')
    ], validators=[Optional()])
    condicion_velcro = SelectField('Condición del Velcro', choices=[
        ('', 'Seleccionar...'),
        ('Ok', 'Ok'),
        ('No ok', 'No ok')
    ], validators=[Optional()])
    validacion_recetas = SelectField('Validación de recetas', choices=[
        ('', 'Seleccionar...'),
        ('Ok', 'Ok'),
        ('No ok', 'No ok')
    ], validators=[Optional()])
    validacion_etiquetas = StringField('Validación de etiquetas Acp', 
                                 validators=[Optional()],
                                 render_kw={"placeholder": "Ingrese la validación de etiquetas"})
    
    # Sección Centerlines
    temperatura_mordaza_frontal = FloatField('Temperatura Mordaza frontal', 
                                          validators=[Optional(), NumberRange(min=0, max=200)],
                                          render_kw={"placeholder": "Rango: 110°C-160°C"})
    temperatura_mordaza_trasera = FloatField('Temperatura Mordaza trasera', 
                                          validators=[Optional(), NumberRange(min=0, max=200)],
                                          render_kw={"placeholder": "Rango: 110°C-160°C"})
    temperatura_sellado_vertical = FloatField('Temperatura sellado Vertical', 
                                           validators=[Optional(), NumberRange(min=0, max=200)],
                                           render_kw={"placeholder": "Rango: 110°C-160°C"})
    bolsa_por_cajas = IntegerField('Bolsa por cajas', 
                                validators=[Optional()],
                                widget=NumberInput(min=0))
    
    # Sección Empaque
    codigo_empaque = FloatField('Código de Empaque', 
                             validators=[Optional(), NumberRange(min=0, max=100)],
                             render_kw={"placeholder": "Rango: 97.5%-100%"})
    
    eficiencia_promocion = SelectField('Eficiencia de Promoción', choices=[
        ('', 'Seleccionar...'),
        ('Aplica', 'Aplica'),
        ('No aplica', 'No aplica')
    ], validators=[Optional()])
    
    porcentaje_eficiencia = FloatField('% de Eficiencia', 
                                   validators=[Optional(), NumberRange(min=0, max=100)],
                                   render_kw={"placeholder": "Ingrese el porcentaje de eficiencia"})
    
    volumen_llenado = FloatField('Volumen de llenado', 
                              validators=[Optional(), NumberRange(min=0, max=100)],
                              render_kw={"placeholder": "Rango: 70%-80%"})
    
    fecha_frescura = StringField('Fecha de frescura', 
                            validators=[Optional()],
                            render_kw={"placeholder": "Ingrese fecha o texto alfanumérico"})
    
    acomodo_correcto = SelectField('Acomodo Correcto', choices=[
        ('', 'Seleccionar...'),
        ('Cumple', 'Cumple'),
        ('No cumple', 'No cumple')
    ], validators=[Optional()])
    
    apariencia_empaque = FloatField('Apariencia del empaque', 
                                 validators=[Optional(), NumberRange(min=0, max=100)],
                                 render_kw={"placeholder": "Rango: 90%-100%"})
    
    hermeticidad = FloatField('Hermeticidad', 
                           validators=[Optional(), NumberRange(min=0, max=100)],
                           render_kw={"placeholder": "Rango: 97.5%-100%"})
    
    # Sección Peso
    gramaje_impreso = FloatField('Gramaje Impreso (g)', 
                              validators=[Optional(), NumberRange(min=0)],
                              render_kw={"placeholder": "Ingrese el gramaje impreso en el empaque"})
    
    peso_ishida = FloatField('Peso Ishida (g)', 
                          validators=[Optional(), NumberRange(min=0)],
                          render_kw={"placeholder": "Ingrese el peso Ishida de referencia"})
    
    # 10 muestras de peso
    peso_muestra_1 = FloatField('Muestra 1 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_2 = FloatField('Muestra 2 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_3 = FloatField('Muestra 3 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_4 = FloatField('Muestra 4 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_5 = FloatField('Muestra 5 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_6 = FloatField('Muestra 6 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_7 = FloatField('Muestra 7 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_8 = FloatField('Muestra 8 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_9 = FloatField('Muestra 9 (g)', validators=[Optional(), NumberRange(min=0)])
    peso_muestra_10 = FloatField('Muestra 10 (g)', validators=[Optional(), NumberRange(min=0)])
    
    # Campos calculados (solo de lectura)
    peso_promedio = FloatField('Promedio (g)', 
                           validators=[Optional()],
                           render_kw={"readonly": True})
    
    dif_vs_gramaje = FloatField('Dif. vs Gramaje (g)', 
                             validators=[Optional()],
                             render_kw={"readonly": True})
    
    dif_vs_ishida = FloatField('Dif. vs Ishida (g)', 
                            validators=[Optional()],
                            render_kw={"readonly": True})
    
    # Sección Cama de Aire
    cama_aire_tipo = SelectField('Tipo de Cámara de Aire', choices=[
        ('', 'Seleccionar...'),
        ('Normal', 'Normal'),
        ('Interplantas 1', 'Interplantas 1'),
        ('Interplantas 2', 'Interplantas 2')
    ], validators=[Optional()])
    
    cama_aire_muestra_1 = FloatField('Muestra 1 Cama de Aire', 
                                 validators=[Optional(), NumberRange(min=0)],
                                 render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    cama_aire_muestra_2 = FloatField('Muestra 2 Cama de Aire', 
                                 validators=[Optional(), NumberRange(min=0)],
                                 render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    cama_aire_muestra_3 = FloatField('Muestra 3 Cama de Aire', 
                                 validators=[Optional(), NumberRange(min=0)],
                                 render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    cama_aire_promedio = FloatField('Promedio Cama de Aire', 
                                validators=[Optional()],
                                render_kw={"readonly": True})
    
    # Sección Oxígeno Residual
    oxigeno_residual_muestra_1 = FloatField('Muestra 1 Oxígeno Residual (%)', 
                                      validators=[Optional(), NumberRange(min=0, max=100)],
                                      render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    oxigeno_residual_muestra_2 = FloatField('Muestra 2 Oxígeno Residual (%)', 
                                      validators=[Optional(), NumberRange(min=0, max=100)],
                                      render_kw={"placeholder": "Ingrese el valor de la muestra"})
    
    oxigeno_residual_muestra_3 = FloatField('Muestra 3 Oxígeno Residual (%)',
                                      validators=[Optional(), NumberRange(min=0, max=100)],
                                      render_kw={"placeholder": "Ingrese el valor de la muestra"})

    oxigeno_residual_promedio = FloatField('Promedio Oxígeno Residual (%)',
                                     validators=[Optional()],
                                     render_kw={"readonly": True})

    # Sección Observaciones
    observaciones = TextAreaField('Observaciones / Planes de Acción',
                                 validators=[Optional()],
                                 render_kw={"rows": 4, "placeholder": "Ingrese observaciones generales"})

    submit = SubmitField('Guardar Registro')
