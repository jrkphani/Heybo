#!/bin/bash

# HeyBo Chatbot Development Setup Script
echo "🚀 Setting up HeyBo Chatbot Development Environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies with pnpm..."

# Install dependencies (pnpm handles React 19 better than npm)
pnpm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now run:"
    echo ""
    echo "  # Start mock HeyBo website (port 3001)"
    echo "  pnpm dev:website"
    echo ""
    echo "  # Start chatbot widget (port 3000)"  
    echo "  pnpm dev:widget"
    echo ""
    echo "  # Start both applications"
    echo "  pnpm dev:all"
    echo ""
    echo "📖 Visit http://localhost:3001 to see the mock HeyBo website"
    echo "🤖 The chatbot widget will be available for integration testing"
else
    echo "❌ Installation failed. Please check the error messages above."
    echo ""
    echo "💡 If you see React 19 peer dependency warnings with npm, try:"
    echo "   npm install --legacy-peer-deps"
    echo ""
    echo "   Or use pnpm instead (recommended):"
    echo "   npm install -g pnpm && pnpm install"
    exit 1
fi
