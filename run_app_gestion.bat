@echo off
echo Iniciando servicio AppGestion - %date% %time% > C:\Users\Administrator\Desktop\app_gestion\logs\service_startup.log
cd /d C:\Users\Administrator\Desktop\app_gestion

REM Crear directorio de logs si no existe
IF NOT EXIST logs mkdir logs

REM Activar entorno virtual
call venv\Scripts\activate.bat

REM Instalar waitress si no está instalado
pip install waitress 2>>C:\Users\Administrator\Desktop\app_gestion\logs\pip_error.log 1>>C:\Users\Administrator\Desktop\app_gestion\logs\pip_output.log

REM Iniciar la aplicación con Waitress
echo Ejecutando aplicación con Waitress >> C:\Users\Administrator\Desktop\app_gestion\logs\service_startup.log
python waitress_serve.py >> C:\Users\Administrator\Desktop\app_gestion\logs\output.log 2>> C:\Users\Administrator\Desktop\app_gestion\logs\error.log

echo Servicio terminado con código %ERRORLEVEL% - %date% %time% >> C:\Users\Administrator\Desktop\app_gestion\logs\service_startup.log