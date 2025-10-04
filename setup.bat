@echo off
echo ==========================================
echo  Coach Fit Squad Builder - Setup
echo ==========================================
echo.

echo Verification de Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Verification de MongoDB...
mongod --version > nul 2>&1
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: MongoDB n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer MongoDB depuis https://www.mongodb.com/try/download/community
    echo Ou utilisez MongoDB Atlas (cloud)
    echo.
)

echo Installation des dependances du backend...
cd backend
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERREUR: Echec de l'installation des dependances du backend
        pause
        exit /b 1
    )
)

echo Installation des dependances du frontend...
cd ..
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERREUR: Echec de l'installation des dependances du frontend
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo  Installation terminee avec succes!
echo ==========================================
echo.
echo Pour demarrer l'application:
echo 1. Demarrez MongoDB (si local)
echo 2. Ouvrez 2 terminaux:
echo    - Terminal 1: cd backend ^&^& npm run dev
echo    - Terminal 2: npm run dev
echo.
echo Ou utilisez le script start.bat pour demarrer automatiquement
echo.
pause
