@echo off
rem Abre Sin Rodeos en una ventana propia, como una aplicacion de escritorio.
rem Si el servidor no esta levantado, lo arranca minimizado.

setlocal
cd /d "%~dp0"

set "SERVIDOR=1"
curl.exe -s -o NUL http://127.0.0.1:8000/ 2>NUL
if not errorlevel 1 set "SERVIDOR=0"

if "%SERVIDOR%"=="1" (
  start "Sin Rodeos (servidor)" /min node servidor.js
  timeout /t 2 /nobreak > NUL
)

set "NAVEGADOR=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not exist "%NAVEGADOR%" set "NAVEGADOR=C:\Program Files\Google\Chrome\Application\chrome.exe"

if not exist "%NAVEGADOR%" (
  echo No se encontro Edge ni Chrome. Abre http://localhost:8000 en tu navegador.
  pause
  exit /b 1
)

start "" "%NAVEGADOR%" --app=http://localhost:8000/?v=4 --window-size=1180,900
endlocal
