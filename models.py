from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True, nullable=False)
    user_id = db.Column(db.String(64), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), unique=True, index=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def __init__(self, username, password, user_id, email=None, is_admin=False):
        self.username = username
        self.user_id = user_id
        self.email = email
        self.set_password(password)
        self.is_admin = is_admin
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text)
    image_path = db.Column(db.String(256))
    category = db.Column(db.String(64), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<MenuItem {self.name} ({self.category})>'

# Modelos para el sistema de formularios
class Form(db.Model):
    __tablename__ = 'forms'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(64), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    section = db.Column(db.String(64), nullable=False, default='calidad')  # calidad, produccion, etc.
    is_active = db.Column(db.Boolean, default=True)
    
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    questions = db.relationship('FormQuestion', backref='form', lazy=True, cascade='all, delete-orphan')
    responses = db.relationship('FormResponse', backref='form', lazy=True, cascade='all, delete-orphan')
    creator = db.relationship('User', backref='created_forms')
    
    def __repr__(self):
        return f'<Form {self.title} ({self.category})>'

class FormQuestion(db.Model):
    __tablename__ = 'form_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(32), nullable=False)  # text, number, select, radio, checkbox, date, etc.
    is_required = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    options = db.Column(db.Text)  # JSON string para opciones en preguntas de selección
    
    # Relaciones
    answers = db.relationship('FormAnswer', backref='question', lazy=True, cascade='all, delete-orphan')
    
    def get_options(self):
        """Convierte las opciones JSON a lista Python"""
        if self.options and self.question_type in ['select', 'radio', 'checkbox']:
            return json.loads(self.options)
        return []
    
    def set_options(self, options_list):
        """Convierte lista Python a JSON para almacenar"""
        if options_list and self.question_type in ['select', 'radio', 'checkbox']:
            self.options = json.dumps(options_list)
    
    def __repr__(self):
        return f'<FormQuestion {self.id}: {self.question_text[:30]}...>'

class FormResponse(db.Model):
    __tablename__ = 'form_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    answers = db.relationship('FormAnswer', backref='response', lazy=True, cascade='all, delete-orphan')
    user = db.relationship('User', backref='form_responses')
    
    def __repr__(self):
        return f'<FormResponse {self.id} for Form {self.form_id} by User {self.user_id}>'

class FormAnswer(db.Model):
    __tablename__ = 'form_answers'
    
    id = db.Column(db.Integer, primary_key=True)
    response_id = db.Column(db.Integer, db.ForeignKey('form_responses.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('form_questions.id'), nullable=False)
    answer_text = db.Column(db.Text)
    
    def __repr__(self):
        return f'<FormAnswer {self.id} for Question {self.question_id}>'

class PNC(db.Model):
    __tablename__ = 'pnc'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(20), nullable=False)
    producto = db.Column(db.String(100), nullable=False)
    horario = db.Column(db.String(50), nullable=False)
    cantidad = db.Column(db.String(100), nullable=False)
    origen = db.Column(db.String(200), nullable=False)
    no_conformidad = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    detector = db.Column(db.String(100), nullable=False)
    rechazo = db.Column(db.Boolean, default=False)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='pnc_records')
    
    def __repr__(self):
        return f'<PNC {self.folio}: {self.producto}>'

class PNCSimple(db.Model):
    __tablename__ = 'pnc_simple'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(20), nullable=False)
    producto = db.Column(db.String(100), nullable=False)
    horario = db.Column(db.String(50), nullable=False)
    cantidad = db.Column(db.Numeric(10, 3), nullable=True)  # Permite hasta 3 decimales
    unidad_cantidad = db.Column(db.String(20), nullable=True)  # TONELADAS, KILOS, TARIMAS, OTROS
    origen = db.Column(db.String(200), nullable=True)  # Freidor, Sazonado, Horno, Freidor y sazonado
    no_conformidad = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=True)  # RECHAZADO, DETENIDO
    detector = db.Column(db.String(100), nullable=True)  # Nombre y puesto de quien detecta
    rechazo = db.Column(db.Boolean, default=False)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='pnc_simple_records')
    
    def __repr__(self):
        return f'<PNCSimple {self.folio}: {self.producto}>'

class CalidadTortilla(db.Model):
    __tablename__ = 'calidad_tortilla'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(20), nullable=False)
    producto = db.Column(db.String(100), nullable=False)
    horario = db.Column(db.String(50), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='calidad_tortilla_records')
    
    def __repr__(self):
        return f'<CalidadTortilla {self.folio}: {self.producto}>'

class AnalisisCalidad(db.Model):
    __tablename__ = 'analisis_calidad'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(20), nullable=False)
    producto = db.Column(db.String(100), nullable=False)
    horario = db.Column(db.String(50), nullable=False)
    lote = db.Column(db.String(50), nullable=True)
    analista = db.Column(db.String(100), nullable=True)
    peso = db.Column(db.String(20), nullable=True)
    
    # Campos para análisis fisicoquímico
    humedad_base_frita = db.Column(db.String(20), nullable=True)
    aceite_base_frita = db.Column(db.String(20), nullable=True)

    # Campos PAPA - Cloruros (valor único para todos los tanques)
    cloruros_base = db.Column(db.String(20), nullable=True)

    # Tanque 1
    tanque1_aceite_pt = db.Column(db.String(20), nullable=True)
    tanque1_humedad_pt = db.Column(db.String(20), nullable=True)
    tanque1_sal_titulador = db.Column(db.String(20), nullable=True)  # NUEVO
    tanque1_sal_pt = db.Column(db.String(20), nullable=True)  # Calculado: sal_titulador - cloruros_base

    # Tanque 2
    tanque2_aceite_pt = db.Column(db.String(20), nullable=True)
    tanque2_humedad_pt = db.Column(db.String(20), nullable=True)
    tanque2_sal_titulador = db.Column(db.String(20), nullable=True)  # NUEVO
    tanque2_sal_pt = db.Column(db.String(20), nullable=True)  # Calculado: sal_titulador - cloruros_base

    # Tanque 3
    tanque3_aceite_pt = db.Column(db.String(20), nullable=True)
    tanque3_humedad_pt = db.Column(db.String(20), nullable=True)
    tanque3_sal_titulador = db.Column(db.String(20), nullable=True)  # NUEVO
    tanque3_sal_pt = db.Column(db.String(20), nullable=True)  # Calculado: sal_titulador - cloruros_base
    
    # Campos PT Producto Terminado Generales
    aceite_pt_producto_terminado = db.Column(db.String(20), nullable=True)
    humedad_pt_producto_terminado = db.Column(db.String(20), nullable=True)
    sal_pt_producto_terminado = db.Column(db.String(20), nullable=True)
    
    observaciones = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='analisis_calidad_records')
    
    def __repr__(self):
        return f'<AnalisisCalidad {self.folio}: {self.producto}>'

class PAERegistro(db.Model):
    __tablename__ = 'pae_registros'
    
    id = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(1), nullable=False)  # A o B
    hora = db.Column(db.Time, nullable=False)  # Hora exacta de registro
    hora_bloque = db.Column(db.Integer, nullable=False)  # Hora en formato 24h (7, 8, 9, etc.)
    hora_muestreo = db.Column(db.Time, nullable=True)  # Hora exacta del muestreo
    producto = db.Column(db.String(100), nullable=False)

    data = db.Column(db.Text, nullable=True)

    # Sensorial
    sensorial_apariencia = db.Column(db.String(20), nullable=True)  # Adecuado o Corregir
    sensorial_apariencia_comentario = db.Column(db.Text, nullable=True)
    sensorial_textura = db.Column(db.String(20), nullable=True)  # Adecuado o Corregir
    sensorial_textura_comentario = db.Column(db.Text, nullable=True)
    sensorial_sabor = db.Column(db.String(20), nullable=True)  # Adecuado o Corregir
    sensorial_sabor_comentario = db.Column(db.Text, nullable=True)
    observaciones = db.Column(db.Text, nullable=True)
    
    # Sección Rotura (solo para PAPA)
    # Evaluado cada hora en PAE si el producto se elabora en menos de 4 horas
    # Cuando corre más de 4 horas, evaluar en Weak Link
    rotura_aplica = db.Column(db.Boolean, default=False, nullable=True)  # Si aplica evaluación de rotura
    hojuela_entera = db.Column(db.Float, nullable=True)  # Porcentaje de hojuela entera
    hojuela_entera_fiesta = db.Column(db.Float, nullable=True)  # Porcentaje de hojuela entera FIESTA
    peladeras_scrap = db.Column(db.Float, nullable=True)  # Porcentaje de peladeras (scrap)
    rotura_observaciones = db.Column(db.Text, nullable=True)  # Observaciones específicas de rotura

    # Sección Registro cada 4 Horas (solo para EXTRUIDOS)
    registro_4horas_aplica = db.Column(db.Boolean, default=False, nullable=True)  # Si aplica registro cada 4 horas
    extrusor_humedad_cereal = db.Column(db.Float, nullable=True)  # Humedad de cereal en el trompo (verde: 15-16.5)
    freidor_tiempo_residencia = db.Column(db.Float, nullable=True)  # Tiempo de residencia en el freidor (verde: 30-40)
    freidor_temperatura = db.Column(db.Float, nullable=True)  # Temperatura del freidor (verde: 188-194)
    sazonado_temp_slurry = db.Column(db.Float, nullable=True)  # Temperatura del slurry en marmitas (verde: 40-46)

    # Sección Registro cada 4 Horas (solo para TORTILLA)
    registro_4horas_tortilla_aplica = db.Column(db.Boolean, default=False, nullable=True)
    tortilla_tiempo_reposo = db.Column(db.Float, nullable=True)  # Cocimiento - Tiempo de reposo (verde: 10-18)
    tortilla_temp_masa = db.Column(db.Float, nullable=True)  # Molino - Temperatura de masa (verde: 32-38)
    tortilla_humedad_masa = db.Column(db.Float, nullable=True)  # Humedad de masa (verde: 49.5-51.5)
    tortilla_peso_10_base = db.Column(db.Float, nullable=True)  # Laminado - Peso de 10 base frita (verde según producto)
    tortilla_temp_freidor = db.Column(db.Float, nullable=True)  # Freidor - Temperatura de freidor recto (verde: 183.3-186.7)

    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='pae_registros')
    
    def __repr__(self):
        return f'<PAERegistro {self.categoria} - {self.fecha} {self.hora} - Turno {self.turno}>'

class Peso(db.Model):
    __tablename__ = 'pesos'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(1), nullable=False)  # A o B
    horario = db.Column(db.String(50), nullable=False)
    producto = db.Column(db.String(100), nullable=False)
    peso = db.Column(db.Float, nullable=False)
    peso_lado_a = db.Column(db.Float, nullable=True)
    peso_lado_b = db.Column(db.Float, nullable=True)
    dentro_especificacion = db.Column(db.Boolean, default=True)
    observaciones = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    created_by_user = db.relationship('User', backref='pesos_records')
    
    def __repr__(self):
        return f'<Peso {self.folio}: {self.producto} - {self.peso}g>'
        
    def to_dict(self):
        """Convierte el objeto Peso a un diccionario"""
        return {
            'id': self.id,
            'folio': self.folio,
            'fecha': self.fecha,
            'turno': self.turno,
            'horario': self.horario,
            'producto': self.producto,
            'peso': self.peso,
            'peso_lado_a': self.peso_lado_a if hasattr(self, 'peso_lado_a') else self.peso,
            'peso_lado_b': self.peso_lado_b if hasattr(self, 'peso_lado_b') else self.peso,
            'dentro_especificacion': self.dentro_especificacion,
            'observaciones': self.observaciones,
            'categoria': self.categoria,
            'created_by': self.created_by,
            'created_at': self.created_at
        }

class WeakLink(db.Model):
    __tablename__ = 'weak_link'
    
    id = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)  # Hora exacta de registro
    turno = db.Column(db.String(1), nullable=False)  # A o B
    operador = db.Column(db.String(100), nullable=False)
    orden = db.Column(db.String(50), nullable=False)
    maquina = db.Column(db.String(50), nullable=False)  # Maquina 1, Maquina 2, etc.
    producto = db.Column(db.String(100), nullable=False)  # Dorito, Tostito, Rancherito
    observaciones = db.Column(db.Text, nullable=True)
    
    # Sección LIL (Limpieza, Inspección, Lubricación)
    limpieza_pesadora = db.Column(db.String(10), nullable=True)  # Ok, No ok
    limpieza_cabezal = db.Column(db.String(10), nullable=True)  # Ok, No ok
    limpieza_mordazas = db.Column(db.String(10), nullable=True)  # Ok, No ok
    condicion_velcro = db.Column(db.String(10), nullable=True)  # Ok, No ok
    validacion_recetas = db.Column(db.String(10), nullable=True)  # Ok, No ok
    validacion_etiquetas = db.Column(db.String(10), nullable=True)  # Ok, No ok
    
    # Sección Centerlines
    temperatura_mordaza_frontal = db.Column(db.Float, nullable=True)  # Rango 110°C-160°C
    temperatura_mordaza_trasera = db.Column(db.Float, nullable=True)  # Rango 110°C-160°C
    temperatura_sellado_vertical = db.Column(db.Float, nullable=True)  # Rango 110°C-160°C
    bolsa_por_cajas = db.Column(db.Integer, nullable=True)
    
    # Sección Empaque
    codigo_empaque = db.Column(db.Float, nullable=True)  # Rango 97.5%-100%
    eficiencia_promocion = db.Column(db.String(20), nullable=True)  # Aplica, No aplica
    porcentaje_eficiencia = db.Column(db.Float, nullable=True)  # Porcentaje de eficiencia si aplica
    volumen_llenado = db.Column(db.Float, nullable=True)  # Rango 70%-80%
    fecha_frescura = db.Column(db.String(50), nullable=True)  # Permitir cualquier texto
    acomodo_correcto = db.Column(db.String(20), nullable=True)  # Cumple, No cumple
    apariencia_empaque = db.Column(db.Float, nullable=True)  # Rango 90%-100%
    hermeticidad = db.Column(db.Float, nullable=True)  # Rango 97.5%-100%
    
    # Sección Peso
    gramaje_impreso = db.Column(db.Float, nullable=True)  # Gramaje impreso en el empaque
    peso_ishida = db.Column(db.Float, nullable=True)  # Peso Ishida (referencia)
    # Campos para las 10 muestras de peso
    peso_muestra_1 = db.Column(db.Float, nullable=True)
    peso_muestra_2 = db.Column(db.Float, nullable=True)
    peso_muestra_3 = db.Column(db.Float, nullable=True)
    peso_muestra_4 = db.Column(db.Float, nullable=True)
    peso_muestra_5 = db.Column(db.Float, nullable=True)
    peso_muestra_6 = db.Column(db.Float, nullable=True)
    peso_muestra_7 = db.Column(db.Float, nullable=True)
    peso_muestra_8 = db.Column(db.Float, nullable=True)
    peso_muestra_9 = db.Column(db.Float, nullable=True)
    peso_muestra_10 = db.Column(db.Float, nullable=True)
    # Campos calculados (se pueden completar desde el frontend)
    peso_promedio = db.Column(db.Float, nullable=True)  # Promedio de las muestras
    dif_vs_gramaje = db.Column(db.Float, nullable=True)  # Diferencia vs Gramaje impreso
    dif_vs_ishida = db.Column(db.Float, nullable=True)  # Diferencia vs Ishida
    
    # Sección Cama de Aire
    cama_aire_tipo = db.Column(db.String(50), nullable=True)  # Normal, Interplantas 1, Interplantas 2
    cama_aire_muestra_1 = db.Column(db.Float, nullable=True)
    cama_aire_muestra_2 = db.Column(db.Float, nullable=True)
    cama_aire_muestra_3 = db.Column(db.Float, nullable=True)
    cama_aire_promedio = db.Column(db.Float, nullable=True)  # Promedio calculado
    
    # Sección Oxígeno Residual
    oxigeno_residual_muestra_1 = db.Column(db.Float, nullable=True)
    oxigeno_residual_muestra_2 = db.Column(db.Float, nullable=True)
    oxigeno_residual_muestra_3 = db.Column(db.Float, nullable=True)
    oxigeno_residual_promedio = db.Column(db.Float, nullable=True)  # Promedio calculado
    
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relaciones
    creator = db.relationship('User', backref='weaklink_records')
    
    def __repr__(self):
        return f'<WeakLink {self.categoria} - {self.fecha} - {self.linea} - {self.producto}>'

class AnalisisAceite(db.Model):
    __tablename__ = 'analisis_aceite'

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(1), nullable=False)  # A o B
    horario = db.Column(db.Time, nullable=False)
    producto = db.Column(db.String(64), nullable=False)
    ov = db.Column(db.Float, nullable=False)   # OV 0-50%
    agl = db.Column(db.Float, nullable=False)  # AGL 0-5%
    observaciones = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(20), nullable=False)  # EXTRUIDOS, TORTILLA, PAPA
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    creator = db.relationship('User', backref='analisis_aceite_records')

    def __repr__(self):
        return f'<Analisis Aceite {self.fecha} {self.turno} {self.producto}>'