#!/bin/bash
# Run script for FastAPI backend (Linux/Mac)
# Usage: ./run.sh

echo "Starting BRImo FastAPI Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ".env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration!"
fi

# Run the application
echo "Starting FastAPI server..."
echo "API Documentation: http://localhost:5000/docs"
echo "Health Check: http://localhost:5000/api/ping"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
