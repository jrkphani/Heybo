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
    echo "  # Start chatbot widget (port 3000)"
    echo "  pnpm dev:widget"
    echo ""
    echo "  # Start all development services"
    echo "  pnpm dev"
    echo ""
    echo "🤖 Visit http://localhost:3000 to see the chatbot widget"
    echo "📖 The widget is ready for integration testing"
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
