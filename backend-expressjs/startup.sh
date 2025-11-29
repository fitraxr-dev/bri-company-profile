#!/bin/bash
# Startup script for Azure App Service (Linux)
# This file is executed when the container starts

echo "🚀 Starting BRImo Backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Navigate to app directory
cd /home/site/wwwroot

# Install dependencies if needed (for zip deployment)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production
fi

# Start the application
echo "✨ Starting Express server..."
node src/index.js
