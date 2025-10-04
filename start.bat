@echo off
echo ==========================================
echo  Coach Fit Squad Builder - Demarrage
echo ==========================================
echo.

echo Demarrage du backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Demarrage du frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Les serveurs sont en cours de demarrage...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
