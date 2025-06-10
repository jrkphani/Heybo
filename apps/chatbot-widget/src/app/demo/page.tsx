'use client';

import React from 'react';
import {
  LuluIcon,
  LuluIconSmall,
  LuluIconMedium,
  LuluIconLarge,
  LuluIconXL,
  LuluIconHero
} from '../../components/icons/LuluIcon';
import {
  HeyBoLogo,
  HeyBoIcon,
  LuluText,
  HeyBoLuluBrand,
  HEYBO_ASSETS
} from '../../components/brand/HeyBoAssets';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function ChatbotDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HeyBo Chatbot Widget Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our AI-powered chatbot with integrated mock APIs. 
            Click the orange button in the bottom-right corner to start!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Features with Mock APIs</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Real authentication flow with OTP
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Dynamic ingredient loading by location
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Live availability checking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                ML-powered recommendations
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Session-based cart management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Order history and favorites
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Test</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                Click the chat button to open the widget
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                Enter any phone number for OTP authentication
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                Use OTP "123456" to verify (mock)
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                Explore all features with realistic API responses
              </li>
            </ol>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-3">🧪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock APIs</h3>
            <p className="text-sm text-gray-600">
              All backend services simulated with realistic data and responses
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Development</h3>
            <p className="text-sm text-gray-600">
              Frontend development without waiting for backend implementation
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Transition</h3>
            <p className="text-sm text-gray-600">
              Simple switch from mock to real APIs when backend is ready
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Try?
          </h2>
          <p className="text-gray-600 mb-6">
            The chatbot widget is now active with full mock API integration. 
            Look for the orange chat button in the bottom-right corner!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>💬 Live Chat</span>
            <span>🔐 Authentication</span>
            <span>🛒 Cart Management</span>
            <span>📊 Real Data</span>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">🔧 Developer Info</h4>
          <p className="text-blue-800 text-sm mb-2">
            Environment: <strong>{process.env.NODE_ENV}</strong><br/>
            Mock APIs: <strong>{process.env.NEXT_PUBLIC_USE_MOCK_API || 'true'}</strong>
          </p>
          <p className="text-blue-700 text-xs">
            Check the browser console for API call logs and responses
          </p>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}
