#!/bin/bash

# MGNREGA Portal - Development Mode Startup
# This script runs backend and frontend in development mode

set -e

echo "======================================"
echo "MGNREGA Portal - Development Mode"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Backend setup
echo "🐍 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo "Starting backend server..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# Frontend setup
echo ""
echo "⚛️ Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "======================================"
echo "✨ Development servers started!"
echo "======================================"
echo ""
echo "🌐 URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Trap Ctrl+C to kill both processes
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait

