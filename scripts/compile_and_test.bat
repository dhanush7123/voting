@echo off
echo ===========================================
echo SMART VOTING SYSTEM - C++ BACKEND TEST
echo RV College of Engineering
echo ===========================================

echo.
echo Compiling C++ files...

:: Compile the main voting system
g++ -o voting_system.exe src/cpp/structures.cpp src/cpp/voting.cpp src/cpp/blockchain.cpp -std=c++17

if %errorlevel% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)

echo.
echo Compilation successful!
echo.

echo Running voting system tests...
echo ===========================================

:: Run the compiled program
voting_system.exe

echo.
echo ===========================================
echo Test completed!
echo.
echo Files created:
echo - voting_system.exe (executable)
echo - vote_data.txt (vote data)
echo - blockchain.txt (blockchain data)
echo - enhanced_blockchain.txt (enhanced blockchain)
echo.

pause 