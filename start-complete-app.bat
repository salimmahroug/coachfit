@echo off
echo ========================================
echo   COACH FIT SQUAD BUILDER - DEMARRAGE
echo ========================================
echo.

echo [1/3] Demarrage du serveur backend...
cd backend
start "Backend Server" cmd /k "npm run stable"
timeout /t 3 /nobreak >nul

echo [2/3] Demarrage du serveur frontend...
cd ..
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Ouverture du navigateur...
timeout /t 5 /nobreak >nul
start http://localhost:8080

echo.
echo ========================================
echo   APPLICATION DEMARREE AVEC SUCCES!
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:8080
echo ========================================
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
