"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

interface ChatbotWidgetProps {
  className?: string;
}

export function ChatbotWidget({ className }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading the chatbot widget
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    
    // Analytics integration for HeyBo
    if (typeof window !== 'undefined' && (window as any).heyboAnalytics) {
      (window as any).heyboAnalytics.track('chatbot_toggled', {
        state: !isOpen ? 'opened' : 'closed',
        website: 'tokyo-yokocho'
      });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`heybo-chatbot-widget fixed z-[9999] ${className}`}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="group fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-[9999]"
          aria-label="Open HeyBo Assistant"
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <MessageCircle className="h-7 w-7 text-white" />
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20"></div>
            {/* AI indicator */}
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Widget Overlay */}
      {isOpen && (
        <>
          {/* Mobile: Full Screen Overlay */}
          <div className="md:hidden fixed inset-0 bg-white z-[9998] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">HeyBo Assistant</h3>
                  <p className="text-xs opacity-90">AI-powered ordering</p>
                </div>
              </div>
              <button
                onClick={toggleWidget}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
              <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 max-w-[80%]">
                        <p className="text-gray-700 text-sm">
                          Hey there! 👋 I'm your HeyBo assistant. I notice you're browsing Tokyo Yokocho - I can help you find similar delicious bowls or create something custom just for you!
                        </p>
                        <div className="mt-3 space-y-2">
                          <button className="w-full text-left px-3 py-2 bg-white border border-orange-200 rounded-md text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                            🥣 Build a custom bowl
                          </button>
                          <button className="w-full text-left px-3 py-2 bg-white border border-orange-200 rounded-md text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                            🔍 Find similar bowls
                          </button>
                          <button className="w-full text-left px-3 py-2 bg-white border border-orange-200 rounded-md text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                            📋 View HeyBo menu
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Ask me anything about bowls..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Floating Widget */}
          <div className="hidden md:block fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-[9998] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HeyBo Assistant</h3>
                  <p className="text-xs opacity-90">AI-powered ordering</p>
                </div>
              </div>
              <button
                onClick={toggleWidget}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-full pb-20 bg-gradient-to-b from-gray-50 to-white">
              {/* Messages Area */}
              <div className="p-4 h-full overflow-y-auto">
                <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-orange-200 rounded-lg px-4 py-3 shadow-sm max-w-[85%]">
                      <p className="text-gray-700 text-sm">
                        Hey! 👋 I'm HeyBo's AI assistant. I see you're checking out Tokyo Yokocho - great choice! I can help you find similar delicious bowls or create something custom.
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <button className="text-left px-3 py-2 bg-orange-50 border border-orange-200 rounded-md text-xs text-gray-700 hover:bg-orange-100 transition-colors">
                          🥣 Build a custom bowl
                        </button>
                        <button className="text-left px-3 py-2 bg-orange-50 border border-orange-200 rounded-md text-xs text-gray-700 hover:bg-orange-100 transition-colors">
                          🔍 Find similar to Tori Sasaki
                        </button>
                        <button className="text-left px-3 py-2 bg-orange-50 border border-orange-200 rounded-md text-xs text-gray-700 hover:bg-orange-100 transition-colors">
                          📋 View HeyBo menu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask about bowls..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all">
                    <MessageCircle className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 