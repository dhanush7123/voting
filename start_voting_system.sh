#!/bin/bash

echo "========================================"
echo "   Smart Voting System - RV College"
echo "========================================"
echo ""
echo "Starting the Smart Voting System..."
echo ""
echo "Server will be available at:"
echo "http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ERROR: Python is not installed or not in PATH"
        echo "Please install Python 3.7+ and try again"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Start the HTTP server
$PYTHON_CMD -m http.server 8000

echo ""
echo "Server stopped." 