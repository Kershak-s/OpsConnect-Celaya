@echo off
echo === Iniciando Servidor de Aplicacion de Gestion ===
cd /d C:\Users\Administrator\Desktop\app_gestion

REM Verificar si el entorno virtual existe
IF EXIST venv\Scripts\activate.bat (
    echo Activando entorno virtual...
    call venv\Scripts\activate.bat
) ELSE (
    echo Usando Python del sistema...
)

REM Iniciar el servidor
echo Iniciando servidor...
start pythonw run_server.py

echo Servidor iniciado en segundo plano!
echo La aplicacion estara disponible en http://localhost:5000
echo.
echo Para acceder desde otras computadoras, usa la IP de esta maquina:
ipconfig | findstr IPv4
echo.
echo Presiona cualquier tecla para cerrar esta ventana.
pause > nul