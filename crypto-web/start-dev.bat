@echo off
echo 🚀 Setting up Crypto Tracker development environment...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the crypto-web directory.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build CSS
echo 🎨 Building Tailwind CSS...
npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css --minify

REM Start the development server
echo 🌐 Starting development server on http://localhost:8000
echo 📱 Open your browser and navigate to: http://localhost:8000
echo 🎯 Click 'Grid' to see the main page, then 'Tracker' for portfolio tracking
echo.
echo 💡 Tips:
echo    - Demo mode is enabled by default for reliable experience
echo    - Toggle 'Live Updates' for real-time price updates
echo    - Toggle 'Demo Mode' to switch between real and demo data
echo    - Click coins in the grid to add them to your tracker
echo.

REM Start the server
python -m http.server 8000
