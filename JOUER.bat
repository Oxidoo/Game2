@echo off
title Les Terres d'Ebrume - serveur
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js n'est pas installe sur cet ordinateur.
  echo   1. Va sur  https://nodejs.org
  echo   2. Clique le gros bouton vert, installe en cliquant Suivant partout
  echo   3. Relance ce fichier JOUER.bat
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo Premiere installation, patiente quelques secondes...
  call npm install
)

echo.
echo   Le jeu va s'ouvrir dans ton navigateur.
echo   NE FERME PAS cette fenetre noire : c'est elle le serveur !
echo.
start "" /b cmd /c "ping -n 3 127.0.0.1 >nul && start http://localhost:3000"
node server.js
pause
