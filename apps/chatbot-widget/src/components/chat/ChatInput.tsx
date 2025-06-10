'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockFAQAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    addMessage,
    setLoading,
    currentStep,
    isLoading
  } = useChatbotStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || isSending) return;

    const userMessage = input.trim();
    setInput('');
    setIsSending(true);

    // Add user message
    addMessage({
      content: userMessage,
      type: 'user'
    });

    try {
      // Handle different types of input based on current step
      await handleUserInput(userMessage);
    } catch (error) {
      console.error('Error handling user input:', error);
      addMessage({
        content: "I'm sorry, I encountered an error. Please try again or use the menu options above.",
        type: 'assistant'
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle user input based on context
  const handleUserInput = async (message: string) => {
    setLoading(true);

    try {
      // FAQ handling - check if it's a question
      if (isQuestion(message)) {
        const faqResponse = await mockFAQAPI.searchFAQ(message);
        
        setTimeout(() => {
          addMessage({
            content: faqResponse.answer,
            type: 'assistant'
          });
          
          if (faqResponse.confidence < 0.5) {
            setTimeout(() => {
              addMessage({
                content: "Was this helpful? You can also use the menu options above to place an order.",
                type: 'assistant',
                metadata: { actionType: 'show-main-menu' }
              });
            }, 1000);
          }
        }, 800);
        
        return;
      }

      // Handle specific step contexts
      switch (currentStep) {
        case 'welcome':
          // General conversation or menu request
          if (message.toLowerCase().includes('menu') || message.toLowerCase().includes('order')) {
            setTimeout(() => {
              addMessage({
                content: "I'd be happy to help you order! What would you like to do?",
                type: 'assistant',
                metadata: { actionType: 'show-main-menu' }
              });
            }, 500);
          } else {
            // Try FAQ first, then show menu
            const faqResponse = await mockFAQAPI.searchFAQ(message);
            setTimeout(() => {
              addMessage({
                content: faqResponse.answer,
                type: 'assistant'
              });
              
              setTimeout(() => {
                addMessage({
                  content: "Would you like to place an order?",
                  type: 'assistant',
                  metadata: { actionType: 'show-main-menu' }
                });
              }, 1500);
            }, 800);
          }
          break;

        case 'authentication':
          // Handle login attempts
          if (message.includes('@')) {
            // Email provided
            setTimeout(() => {
              addMessage({
                content: "Thanks! Please check your email for a login link, or enter your password below.",
                type: 'assistant'
              });
            }, 500);
          } else if (/^\+?[\d\s-()]+$/.test(message)) {
            // Phone number provided
            setTimeout(() => {
              addMessage({
                content: "Perfect! I've sent an OTP to your mobile number. Please enter the 6-digit code:",
                type: 'assistant'
              });
            }, 800);
          } else if (/^\d{6}$/.test(message)) {
            // OTP provided
            setTimeout(() => {
              addMessage({
                content: "Great! You're now signed in. Let's continue with your order:",
                type: 'assistant',
                metadata: { actionType: 'show-main-menu' }
              });
            }, 500);
          } else {
            setTimeout(() => {
              addMessage({
                content: "Please provide your email address or mobile number to continue.",
                type: 'assistant'
              });
            }, 500);
          }
          break;

        default:
          // General FAQ handling
          const faqResponse = await mockFAQAPI.searchFAQ(message);
          setTimeout(() => {
            addMessage({
              content: faqResponse.answer,
              type: 'assistant'
            });
          }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if message is a question
  const isQuestion = (message: string): boolean => {
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'which', 'who', 'can', 'do', 'does', 'is', 'are'];
    const lowerMessage = message.toLowerCase();
    
    return (
      message.includes('?') ||
      questionWords.some(word => lowerMessage.startsWith(word)) ||
      lowerMessage.includes('tell me') ||
      lowerMessage.includes('explain')
    );
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const isDisabled = isLoading || isSending;

  return (
    <div className="p-6">
      {/* Input Container with layered design */}
      <div className="relative">
        {/* Outer container */}
        <div
          className="border border-gray-200 p-1"
          style={{
            background: 'var(--heybo-background-secondary)',
            borderRadius: 25
          }}
        >
          <form onSubmit={handleSubmit} className="flex items-center">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Anything"
                disabled={isDisabled}
                className={cn(
                  "w-full px-4 py-3 bg-transparent border-none",
                  "focus:outline-none resize-none overflow-hidden",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-gray-800 placeholder:text-gray-500"
                )}
                style={{
                  maxHeight: '120px',
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: '22px',
                  letterSpacing: '-0.03em',
                  background: 'var(--heybo-background-secondary)',
                  color: 'var(--heybo-text-primary)',
                  border: 'var(--heybo-border-default)',
                }}
                rows={1}
              />
              
              {/* Microphone button */}
              <button
                type="button"
                onClick={() => {/* TODO: Implement voice input */}}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Character count (optional) */}
              {input.length > 100 && (
                <div className="absolute bottom-1 right-12 text-xs text-gray-500">
                  {input.length}/500
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isDisabled}
              className={cn(
                "flex items-center justify-center transition-all duration-200 ml-2",
                "focus:outline-none focus:ring-2 focus:ring-[#572021] focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{
                width: 50,
                height: 50,
                background: input.trim() && !isDisabled ? 'var(--heybo-secondary-500)' : 'var(--heybo-background-muted)',
                borderRadius: 25,
                padding: '11px 13px',
                border: 'var(--heybo-border-default)',
              }}
              aria-label="Send message"
            >
              <Send 
                className="w-6 h-6" 
                style={{ 
                  color: input.trim() && !isDisabled ? 'var(--heybo-text-inverse)' : 'var(--heybo-text-muted)' 
                }} 
              />
            </button>
          </form>
        </div>
      </div>

      {/* Quick suggestions */}
      {input === '' && currentStep === 'welcome' && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "What's in your signature bowls?",
            "Do you have vegan options?",
            "How much does delivery cost?",
            "What are your opening hours?"
          ].map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInput(suggestion)}
              className="text-xs px-3 py-1.5 bg-white/80 text-[#572021] rounded-full hover:bg-white transition-colors border border-[#D7E0DA]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
