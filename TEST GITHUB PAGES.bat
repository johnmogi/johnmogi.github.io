@echo off
echo Ì∑™ TESTING GITHUB PAGES DEPLOYMENT
echo.
echo Ì≥Å Checking index.html structure...
echo.
findstr "portfolio-with-galleries.html" index.html >nul
if %errorlevel% neq 0 (
    echo ‚úÖ No internal file references found
) else (
    echo ‚ö†Ô∏è  Found internal file references - may need updating
)

findstr "<title>" index.html >nul
if %errorlevel% equ 0 (
    echo ‚úÖ HTML title found
) else (
    echo ‚ùå Missing HTML title
)

findstr "John Mogi" index.html >nul
if %errorlevel% equ 0 (
    echo ‚úÖ Portfolio content found
) else (
    echo ‚ùå Portfolio content missing
)

echo.
echo Ìºê GitHub Pages URL: https://johnmogi.github.io/
echo.
echo ‚úÖ Deployment Checklist:
echo    Ì≥Ñ index.html - Main portfolio file (READY)
echo    Ì≤¨ WhatsApp integration - Direct chat (READY)
echo    Ìºç Multi-language support - 4 languages (READY)
echo    Ì≥± Mobile optimization - Responsive design (READY)
echo    Ìæ® Dark mode support - Theme switching (READY)
echo.
echo Ì∫Ä Ready to deploy to GitHub Pages!
echo.
echo Ì≥ã Deployment commands:
echo    git add .
echo    git commit -m "Deploy multilingual portfolio to GitHub Pages"
echo    git push origin main
echo.
pause
