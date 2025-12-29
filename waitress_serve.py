from waitress import serve
from app import create_app
import logging
import os
import sys

# Configurar logging
if not os.path.exists('logs'):
    os.makedirs('logs')

logging.basicConfig(
    filename='logs/waitress.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Crear la aplicación
try:
    app = create_app()
    
    # Imprimir mensaje en la consola y log
    print("Iniciando servidor Waitress...")
    logging.info("Iniciando servidor Waitress...")
    
    # Iniciar el servidor
    serve(app, host='0.0.0.0', port=5000, threads=4)
except Exception as e:
    logging.error(f"Error al iniciar Waitress: {str(e)}")
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
