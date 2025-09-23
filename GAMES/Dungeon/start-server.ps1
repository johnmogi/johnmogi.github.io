Write-Host "Starting local server for Dungeon Game testing..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start a local server on http://127.0.0.1:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps:" -ForegroundColor Cyan
Write-Host "1. Open your browser" -ForegroundColor White
Write-Host "2. Go to: http://127.0.0.1:8080/local-test.html" -ForegroundColor Green
Write-Host "3. The game should load without cache issues!" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    python3 -m http.server 8080 -b 127.0.0.1
} catch {
    try {
        python -m http.server 8080 -b 127.0.0.1
    } catch {
        Write-Host "Python not found. Please install Python or use Node.js:" -ForegroundColor Red
        Write-Host "npm install -g http-server" -ForegroundColor Yellow
        Write-Host "Then run: npx http-server -p 8080 -a 127.0.0.1" -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
    }
}
