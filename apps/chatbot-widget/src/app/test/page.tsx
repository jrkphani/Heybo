'use client';

import React, { useState } from 'react';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function TestPage() {
  const [showWidget, setShowWidget] = useState(true);

  const testScenarios = [
    {
      title: "Authentication Flow",
      steps: [
        "1. Click the HeyBo chatbot icon",
        "2. Try 'I have an account' with demo@heybo.sg / demo123",
        "3. Try 'Continue as guest' with +65 9123 4567",
        "4. Use OTP: 123456",
        "5. Verify successful login"
      ]
    },
    {
      title: "Location Selection Flow",
      steps: [
        "1. After login, select 'Create Your Own'",
        "2. Choose location type (Station/Outlet)",
        "3. Select a specific location",
        "4. Choose pickup time (ASAP/Scheduled)",
        "5. Proceed to order type selection"
      ]
    },
    {
      title: "Create Your Own Flow",
      steps: [
        "1. Set dietary preferences",
        "2. Select base ingredient",
        "3. Choose protein (optional)",
        "4. Pick sides (up to 3)",
        "5. Add sauce",
        "6. Add garnish",
        "7. Review and add to cart"
      ]
    },
    {
      title: "Signature Bowls Flow",
      steps: [
        "1. From welcome, select 'Signature Bowls'",
        "2. Complete location selection",
        "3. Browse signature bowls",
        "4. Select a bowl",
        "5. Add to cart"
      ]
    },
    {
      title: "Cart & Checkout Flow",
      steps: [
        "1. Review items in cart",
        "2. Check order summary pane",
        "3. Add optional add-ons",
        "4. Proceed to checkout",
        "5. Verify two-pane layout works"
      ]
    },
    {
      title: "Error Scenarios",
      steps: [
        "1. Try wrong login credentials",
        "2. Try invalid phone number format",
        "3. Try wrong OTP (not 123456)",
        "4. Test network error simulation",
        "5. Verify error messages display correctly"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Test Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          HeyBo Chatbot Widget - Complete Flow Testing
        </h1>
        <p className="text-gray-600 mb-6">
          Test all user flows from authentication to checkout. The widget includes development mode pre-fills for easy testing.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Development Mode Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pre-filled login: demo@heybo.sg / demo123</li>
            <li>• Pre-filled phone: +65 9123 4567</li>
            <li>• Pre-filled OTP: 123456</li>
            <li>• Mock data for all components</li>
            <li>• Error simulation for testing</li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => setShowWidget(!showWidget)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {showWidget ? 'Hide Widget' : 'Show Widget'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset Test
          </button>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testScenarios.map((scenario, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{scenario.title}</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              {scenario.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Design System Compliance Status */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Design System Compliance Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">✅ Implemented</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HeyBo color tokens and CSS variables</li>
                <li>• Proper widget namespacing (.heybo-chatbot-)</li>
                <li>• Development mode pre-fills</li>
                <li>• Comprehensive error handling</li>
                <li>• Two-pane layout system</li>
                <li>• Mobile responsive design</li>
                <li>• Complete user flows</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700">🔄 In Progress</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full CSS isolation implementation</li>
                <li>• 8px grid system enforcement</li>
                <li>• Touch target optimization</li>
                <li>• Advanced accessibility features</li>
                <li>• Performance optimizations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Container */}
      {showWidget && (
        <ChatbotWidget
          position="bottom-right"
          theme="light"
          className="z-50"
        />
      )}

      {/* Mock Parent Website Styles */}
      <style jsx global>{`
        /* Simulate parent website styles that could conflict */
        .parent-website-styles {
          font-family: 'Comic Sans MS', cursive;
          color: purple;
          background: yellow;
        }
        
        /* Test that our widget styles don't leak */
        button {
          /* This should not affect our widget buttons */
          background: red !important;
        }
        
        /* Our widget should be isolated from these styles */
        .heybo-chatbot-widget {
          /* Widget isolation should prevent inheritance */
        }
      `}</style>
    </div>
  );
}
