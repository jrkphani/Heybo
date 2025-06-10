import { HeyBoChatbotWidget } from "@/components/chatbot/widget";

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HeyBo AI Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Order your perfect warm grain bowl with AI-powered recommendations
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <HeyBoChatbotWidget />
        </div>
      </div>
    </main>
  );
}
