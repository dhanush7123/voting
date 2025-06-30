@echo off
echo ===========================================
echo    RV College of Engineering
echo    Smart Voting System - C++ Backend
echo ===========================================
echo.

echo Compiling C++ program...
g++ src/cpp/main.cpp -o voting_system.exe

if %errorlevel% equ 0 (
    echo.
    echo Compilation successful!
    echo.
    echo Starting voting system...
    echo.
    voting_system.exe
) else (
    echo.
    echo Compilation failed! Please check your C++ compiler installation.
    echo Make sure you have g++ installed and added to your PATH.
    echo.
    pause
) 