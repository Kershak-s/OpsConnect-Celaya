import os
import sys
import logging
from waitress import serve
from app import create_app

# Crear carpeta de logs si no existe
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
os.makedirs(log_dir, exist_ok=True)

# Configurar registro de eventos
logging.basicConfig(
    filename=os.path.join(log_dir, 'server.log'),
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Crear la aplicación
app = create_app()

# Iniciar servidor
if __name__ == '__main__':
    try:
        logging.info("Servidor iniciando...")
        serve(app, host='0.0.0.0', port=5000, threads=4)
    except Exception as e:
        logging.error(f"Error en el servidor: {str(e)}")