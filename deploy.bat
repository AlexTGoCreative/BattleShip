@echo off
:: 🚀 Battleship Game Deployment Script for Windows
:: This script helps you deploy your Battleship game quickly

echo 🚢 Battleship Game Deployment Script
echo ======================================
echo.

:menu
echo Choose deployment option:
echo 1) Prepare project for deployment
echo 2) Deploy to Render (Manual setup required)
echo 3) Deploy to Heroku (Automated)  
echo 4) Show deployment guide
echo 5) Exit
echo.

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto prepare
if "%choice%"=="2" goto render
if "%choice%"=="3" goto heroku
if "%choice%"=="4" goto guide
if "%choice%"=="5" goto exit
echo ❌ Invalid choice. Please try again.
echo.
goto menu

:prepare
echo 📦 Preparing project for deployment...
echo 🔨 Building production version...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please check the errors above.
    pause
    goto menu
)
echo ✅ Build successful!

echo 🧪 Running tests...
call npm test -- --passWithNoTests

echo 📝 Checking git status...
git status --porcelain > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt
if %size% gtr 0 (
    echo 📝 You have uncommitted changes. Committing them...
    git add .
    git commit -m "Prepare for deployment - %date% %time%"
)

echo ✅ Project ready for deployment!
pause
goto menu

:render
call :prepare
echo.
echo 🏗️ Deploying to Render...
echo 1. Make sure you've pushed to GitHub
echo 2. Go to render.com and create a new Web Service  
echo 3. Connect your GitHub repository
echo 4. Use these settings:
echo    - Build Command: npm ci ^&^& npm run build
echo    - Start Command: npm start
echo    - Environment Variables:
echo      NODE_ENV=production
echo      MONGODB_URI=mongodb+srv://admin:admin123456@construction-ms.t3ekpjd.mongodb.net/?retryWrites=true^&w=majority^&appName=Construction-MS
echo      PORT=3000
echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
pause
goto menu

:heroku
where heroku >nul 2>nul
if errorlevel 1 (
    echo ❌ Heroku CLI not found. Please install it first:
    echo    npm install -g heroku
    pause
    goto menu
)

call :prepare
echo.
echo ⚡ Deploying to Heroku...
set /p app_name=Enter your Heroku app name: 

echo 🔧 Setting up Heroku app...
call heroku create %app_name%

echo 🔧 Setting environment variables...
call heroku config:set NODE_ENV=production
call heroku config:set MONGODB_URI="mongodb+srv://admin:admin123456@construction-ms.t3ekpjd.mongodb.net/?retryWrites=true&w=majority&appName=Construction-MS"

echo 📦 Building and deploying...
git add .
git commit -m "Deploy to Heroku"
git push heroku main

echo 🚀 Opening your app...
call heroku open
pause
goto menu

:guide
echo 📚 Opening deployment guide...
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
    "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe" DEPLOYMENT_GUIDE.md
) else (
    echo Please open DEPLOYMENT_GUIDE.md for detailed instructions
)
pause
goto menu

:exit
echo 👋 Goodbye!
pause
exit /b 0