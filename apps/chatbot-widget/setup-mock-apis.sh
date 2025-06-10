#!/bin/bash

# Setup Mock APIs for HeyBo Chatbot Widget Development
echo "🚀 Setting up Mock APIs for Frontend Development..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local with mock API configuration..."
    cat > .env.local << EOL
# Mock API Configuration for Development
NEXT_PUBLIC_USE_MOCK_API=true

# Optional: Adjust mock API behavior
NEXT_PUBLIC_MOCK_API_DELAY=300
NEXT_PUBLIC_MOCK_ERROR_RATE=0.05
NEXT_PUBLIC_MOCK_ENABLE_LOGGING=true

# Development flags
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
EOL
    echo "✅ Created .env.local"
else
    echo "ℹ️  .env.local already exists"
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ -f package.json ]; then
    if [ -f node_modules/.package-lock.json ] || [ -f pnpm-lock.yaml ] || [ -f yarn.lock ]; then
        echo "✅ Dependencies already installed"
    else
        echo "📦 Installing dependencies..."
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v yarn &> /dev/null; then
            yarn install
        else
            npm install
        fi
    fi
fi

# Create a quick test page if it doesn't exist
if [ ! -f src/app/api-test/page.tsx ]; then
    mkdir -p src/app/api-test
    cat > src/app/api-test/page.tsx << 'EOL'
import ComponentAPIIntegration from '@/components/examples/ComponentAPIIntegration';

export default function APITestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ComponentAPIIntegration />
    </div>
  );
}
EOL
    echo "✅ Created API test page at /api-test"
fi

echo ""
echo "🎉 Mock API setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start the development server:"
echo "     cd apps/chatbot-widget && npm run dev"
echo ""
echo "  2. Test the APIs at:"
echo "     http://localhost:3000/api-test"
echo ""
echo "  3. Open browser console to see API calls in action"
echo ""
echo "  4. Start integrating APIs into your components using the patterns from:"
echo "     • src/components/examples/ComponentAPIIntegration.tsx"
echo "     • src/components/examples/FrontendAPIMapping.md"
echo ""
echo "🔧 To switch to real APIs later:"
echo "  • Set NEXT_PUBLIC_USE_MOCK_API=false in .env.local"
echo "  • Implement real API client in src/lib/api-client.ts"
echo ""
echo "Happy coding! 🚀" 