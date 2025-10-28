#!/bin/bash

# MGNREGA District Performance Portal - Setup Script
# This script sets up the development environment

set -e

echo "======================================"
echo "MGNREGA Portal - Setup Script"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is installed"
echo ""

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << EOF
DATABASE_URL=sqlite+aiosqlite:///./data/mgnrega.db
API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost
CACHE_EXPIRY_HOURS=24
EOF
    echo "✅ Backend .env created"
else
    echo "✅ Backend .env already exists"
fi

# Create data directory
echo "📁 Creating data directory..."
mkdir -p backend/data
echo "✅ Data directory created"
echo ""

# Build and start containers
echo "🐳 Building and starting Docker containers..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d --build

echo ""
echo "======================================"
echo "✨ Setup Complete!"
echo "======================================"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop application:"
echo "   docker-compose down"
echo ""
echo "🔄 Restart application:"
echo "   docker-compose restart"
echo ""
echo "Happy coding! 🚀"
echo ""

