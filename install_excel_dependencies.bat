@echo off
echo =====================================
echo Instalando dependencias para Excel
echo =====================================
echo.

REM Activar el entorno virtual si existe
if exist "venv\Scripts\activate.bat" (
    echo Activando entorno virtual...
    call venv\Scripts\activate.bat
)

echo Instalando pandas...
pip install pandas>=1.5.0

echo Instalando openpyxl...
pip install openpyxl>=3.0.0

echo.
echo =====================================
echo Instalacion completada exitosamente
echo =====================================
echo.
echo La funcionalidad de descarga en Excel ya esta disponible.
echo Puede acceder a ella desde el dashboard de PAE.
echo.
pause
