'use client';

import React, { useEffect, useRef } from 'react';
import { useChatbotStore } from '../../store/chatbot-store';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ActionButtons } from './ActionButtons';
import { LoadingIndicator } from './LoadingIndicator';
import { BowlPreview } from '../bowl/BowlPreview';
import { WelcomeScreen } from './WelcomeScreen';
import { cn } from '../../lib/utils';

export function ChatInterface() {
  const {
    messages,
    isLoading,
    currentStep,
    currentBowl,
    error,
    addMessage
  } = useChatbotStore();

  const sendMessage = (content: string) => {
    addMessage({
      content,
      type: 'user'
    });
  };

  const handleWelcomeAction = (action: string) => {
    switch (action) {
      case 'create-bowl':
        sendMessage('I want to create a custom grain bowl');
        break;
      case 'favorites':
        sendMessage('Show me my favorite bowls');
        break;
      case 'previous-order':
        sendMessage('I want to reorder my last bowl');
        break;
      case 'signature':
        sendMessage('Show me your signature bowls');
        break;
      case 'recent':
        sendMessage('Show me my recent orders');
        break;
      case 'faq':
        sendMessage('I have some questions');
        break;
      default:
        sendMessage(`Help me with ${action}`);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isLoading]);

  // Show bowl preview for certain steps
  const shouldShowBowlPreview = currentBowl && (
    currentStep === 'bowl-building' ||
    currentStep === 'ingredient-selection' ||
    currentStep === 'bowl-review'
  );

  return (
    <div className="heybo-chatbot-interface">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10"
        style={{
          maxHeight: '460px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--heybo-border-muted) transparent',
          paddingBottom: '100px'
        }}
      >
        {/* Welcome state - show when no messages */}
        {messages.length === 0 && !isLoading && (
          <div className="absolute inset-0">
            <WelcomeScreen onActionSelect={handleWelcomeAction} userName="Guest" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && <LoadingIndicator />}

        {/* Action buttons for current step */}
        <ActionButtons />

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bowl Preview - Fixed at bottom when building */}
      {shouldShowBowlPreview && (
        <div className="border-t border-heybo-border bg-white/80 backdrop-blur-sm p-3 relative z-10">
          <BowlPreview
            bowl={currentBowl}
            compact={true}
            showProgress={true}
          />
        </div>
      )}

      {/* Chat Input */}
      <div className="relative z-20">
        <ChatInput />
      </div>
    </div>
  );
}

// Custom scrollbar styles
const scrollbarStyles = `
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .chat-messages::-webkit-scrollbar-thumb {
    background: var(--heybo-border-default);
    border-radius: 3px;
  }
  
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: var(--heybo-border-primary);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}
