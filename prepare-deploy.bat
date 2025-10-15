@echo off
echo 🚀 BATTLESHIP DEPLOYMENT PREPARATION
echo =====================================
echo.

echo 📋 Checking project structure...
if not exist "frontend\" (
    echo ❌ Frontend folder not found!
    exit /b 1
)
if not exist "backend\" (
    echo ❌ Backend folder not found!
    exit /b 1
)
echo ✅ Project structure OK

echo.
echo 🔧 Installing dependencies...
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed!
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo.
echo Installing backend dependencies...
cd ..\backend
call npm install  
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed!
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo 🧪 Running tests...
echo.

echo Testing frontend...
cd ..\frontend
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo ⚠️  Frontend tests failed (continuing anyway)
)

echo Testing backend...
cd ..\backend
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo ⚠️  Backend tests failed (continuing anyway)
)

echo.
echo 📦 Building frontend for production...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)
echo ✅ Frontend build successful

echo.
echo ✅ DEPLOYMENT PREPARATION COMPLETE!
echo.
echo 📋 Next Steps:
echo.
echo 1. 🌐 BACKEND (Render):
echo    - Go to https://render.com
echo    - Connect your GitHub repository
echo    - Create a new Web Service
echo    - Root directory: backend
echo    - Build command: npm install
echo    - Start command: npm start
echo    - Add environment variables:
echo      * NODE_ENV=production
echo      * MONGODB_URI=(your MongoDB connection string)
echo      * JWT_SECRET=(your JWT secret)
echo      * PORT=10000
echo.
echo 2. 🎨 FRONTEND (Netlify):
echo    - Go to https://netlify.com
echo    - Connect your GitHub repository  
echo    - Base directory: frontend
echo    - Build command: npm run build
echo    - Publish directory: frontend/dist
echo    - Add environment variables:
echo      * BACKEND_URL=(your Render backend URL)
echo.
echo 3. 🔗 UPDATE URLS:
echo    - Update BACKEND_URL in Netlify with your Render URL
echo    - Update FRONTEND_URL in Render with your Netlify URL
echo.
echo 📖 For detailed instructions, see README.md
echo.
pause