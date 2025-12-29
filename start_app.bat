@echo off 
cd /d %~dp0 
 
echo Iniciando App Gestion... 
 
mkdir logs 2>nul 
 
REM Buscar Python en diferentes ubicaciones 
where python >nul 2>&1 
if %errorlevel% neq 0 ( 
    if exist C:\Python311\python.exe ( 
        C:\Python311\python.exe run_server.py 
        exit /b 
    ) 
    if exist C:\Python310\python.exe ( 
        C:\Python310\python.exe run_server.py 
        exit /b 
    ) 
    if exist C:\Python39\python.exe ( 
        C:\Python39\python.exe run_server.py 
        exit /b 
    ) 
    if exist "C:\Program Files\Python311\python.exe" ( 
        "C:\Program Files\Python311\python.exe" run_server.py 
        exit /b 
    ) 
    echo ERROR: No se pudo encontrar Python 
    exit /b 1 
) else ( 
    python run_server.py 
) 
