#!/bin/bash

# Crypto Tracker Development Setup
echo "🚀 Setting up Crypto Tracker development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the crypto-web directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build CSS
echo "🎨 Building Tailwind CSS..."
npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css --minify

# Start the development server
echo "🌐 Starting development server on http://localhost:8000"
echo "📱 Open your browser and navigate to: http://localhost:8000"
echo "🎯 Click 'Grid' to see the main page, then 'Tracker' for portfolio tracking"
echo ""
echo "💡 Tips:"
echo "   - Demo mode is enabled by default for reliable experience"
echo "   - Toggle 'Live Updates' for real-time price updates"
echo "   - Toggle 'Demo Mode' to switch between real and demo data"
echo "   - Click coins in the grid to add them to your tracker"
echo ""

# Start the server
python3 -m http.server 8000
