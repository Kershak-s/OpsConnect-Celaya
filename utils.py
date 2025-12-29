import os
import secrets
from PIL import Image
from flask import current_app
from functools import wraps
from flask_login import current_user
from flask import flash, redirect, url_for

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('Acceso restringido. Se requieren privilegios de administrador.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

def save_image(file, category):
    """Guarda una imagen cargada y devuelve el nombre del archivo"""
    if not file:
        return None
        
    # Genera un nombre de archivo aleatorio para evitar colisiones
    random_hex = secrets.token_hex(8)
    _, file_ext = os.path.splitext(file.filename)
    filename = random_hex + file_ext
    
    # Ruta completa para guardar el archivo
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    
    # Crea la carpeta si no existe
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Redimensionar la imagen a un tamaño estándar y guardarla
    image = Image.open(file)
    image = image.resize((800, 600), Image.LANCZOS)
    image.save(file_path)
    
    # Devuelve la ruta relativa para guardar en la BD - asegurando uso de forward slashes
    return os.path.join('img', 'uploads', filename).replace('\\', '/')

def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']