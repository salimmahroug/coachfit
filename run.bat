@echo off
echo ==============================================
echo    Coach Fit Squad Builder - Demarrage
echo ==============================================
echo.

echo Demarrage du serveur backend...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo Attente du demarrage du backend...
timeout /t 3 >nul

echo.
echo Demarrage du serveur frontend...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==============================================
echo    Application demarree!
echo ==============================================
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo.
echo Identifiants de test:
echo Email: coach@demo.com
echo Mot de passe: password123
echo.
pause
