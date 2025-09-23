@echo off
echo Starting local server for Dungeon Game testing...
echo.
echo This will start a local server on http://127.0.0.1:8080
echo.
echo Steps:
echo 1. Open your browser
echo 2. Go to: http://127.0.0.1:8080/local-test.html
echo 3. The game should load without cache issues!
echo.
echo Press Ctrl+C to stop the server
echo.
python3 -m http.server 8080 --bind 127.0.0.1 2>nul
if %errorlevel% neq 0 (
    python -m http.server 8080 --bind 127.0.0.1 2>nul
    if %errorlevel% neq 0 (
        echo.
        echo Python not found. Please install Python or use Node.js:
        echo npm install -g http-server
        echo Then run: npx http-server -p 8080 -a 127.0.0.1
        echo.
        pause
    )
)
