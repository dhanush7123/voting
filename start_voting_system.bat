@echo off
echo ========================================
echo    Smart Voting System - RV College
echo ========================================
echo.
echo Starting the Smart Voting System...
echo.
echo Server will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Start the HTTP server
python -m http.server 8000

echo.
echo Server stopped.
pause 