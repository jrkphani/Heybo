#!/bin/bash

# HeyBo Chatbot Setup Script
echo "🤖 Setting up HeyBo Chatbot with shadcn-chatbot-kit..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies first
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Navigate to chatbot widget directory
cd apps/chatbot-widget

echo "🎨 Initializing shadcn/ui in chatbot widget..."

# Initialize shadcn/ui (this will create components.json)
npx shadcn@latest init --yes --defaults

echo "🤖 Installing shadcn-chatbot-kit components..."

# Install chatbot components from shadcn-chatbot-kit
echo "Installing Chat component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/chat.json

echo "Installing Message Input component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/message-input.json

echo "Installing Message List component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/message-list.json

echo "Installing Chat Message component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/chat-message.json

echo "Installing Typing Indicator component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/typing-indicator.json

echo "Installing Prompt Suggestions component..."
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/prompt-suggestions.json

# Go back to root
cd ../..

echo "✅ Chatbot components installed successfully!"
echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "  # Start the mock HeyBo website"
echo "  pnpm dev:website"
echo ""
echo "  # Start the chatbot widget"
echo "  pnpm dev:widget"
echo ""
echo "  # Start both applications"
echo "  pnpm dev:all"
echo ""
echo "📖 Visit the documentation: https://shadcn-chatbot-kit.vercel.app/docs"
