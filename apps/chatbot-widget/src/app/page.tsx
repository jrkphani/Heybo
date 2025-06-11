import ChatbotWidget from '../components/ChatbotWidget';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          HeyBo Chatbot Widget
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered grain bowl ordering assistant
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/demo" 
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🤖 Chatbot Demo
            </h3>
            <p className="text-gray-600">
              Experience the full chatbot widget with mock APIs
            </p>
          </Link>
          
          <Link 
            href="/api-test" 
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🧪 API Test Suite
            </h3>
            <p className="text-gray-600">
              Test all mock API endpoints and integrations
            </p>
          </Link>
          
          <Link
            href="/demo/comprehensive-flows"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔄 Flow Testing
            </h3>
            <p className="text-gray-600">
              Test comprehensive user flows and interactions
            </p>
          </Link>

          <Link
            href="/calendar-demo"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📅 Calendar Components
            </h3>
            <p className="text-gray-600">
              HeyBo-branded calendar and time selection components
            </p>
          </Link>

          <Link
            href="/otp-demo"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔐 OTP Input Components
            </h3>
            <p className="text-gray-600">
              HeyBo-branded OTP input with design system compliance
            </p>
          </Link>

          <div className="md:col-span-2 lg:col-span-3 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📚 Documentation
            </h3>
            <p className="text-gray-600 mb-4">
              Implementation guides and API references
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>• Frontend API Mapping Guide</div>
              <div>• Mock API Setup Instructions</div>
              <div>• Component Integration Examples</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 Current Status</h4>
          <p className="text-blue-800 text-sm">
            ✅ Phase 3: Component Integration (Complete)<br/>
            🚧 Phase 4: Backend Integration (In Progress - Mock APIs Active)<br/>
            📱 Frontend components now use mock APIs for realistic testing
          </p>
        </div>
      </div>
    </div>
  );
}
