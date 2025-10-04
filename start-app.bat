@echo off
title Coach Fit Squad Builder - Full Stack Launcher
echo ================================
echo   COACH FIT SQUAD BUILDER
echo   Full Stack Launcher
echo ================================
echo.

echo Demarrage du serveur backend...
start "Backend" cmd /k "cd /d %~dp0backend && node stable-server.js"

timeout /t 3 /nobreak >nul

echo Demarrage du serveur frontend...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Les deux serveurs sont en cours de demarrage...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
pause
