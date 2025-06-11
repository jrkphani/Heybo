'use client';

import React, { useState, useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';

// Import shadcn-chatbot-kit components
import { 
  ChatContainer, 
  ChatForm, 
  ChatMessages 
} from '../ui/chat';
import { MessageInput } from '../ui/message-input';
import { MessageList } from '../ui/message-list';
import { HeyBoPromptSuggestions } from './HeyBoPromptSuggestions';

// Import navigation components
import { NavigationHeader } from '../navigation/NavigationHeader';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { TwoPaneLayout } from '../layout/TwoPaneLayout';

// Import existing content components for right pane
import { ContentRouter } from '../navigation/ContentRouter';

interface HeyBoChatInterfaceProps {
  className?: string;
}

export function HeyBoChatInterface({ className }: HeyBoChatInterfaceProps) {
  const {
    messages,
    isLoading,
    currentStep,
    addMessage,
    user
  } = useChatbotStore();

  const {
    isDualPane,
    isMobileView,
    navigation
  } = useLayoutStore();

  // Local state for chat input
  const [input, setInput] = useState('');
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Convert chatbot store messages to shadcn-chatbot-kit format
  const formattedMessages = messages.map((msg, index) => ({
    id: `msg-${index}`,
    role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content,
    createdAt: new Date()
  }));

  const lastMessage = formattedMessages.at(-1);
  const isEmpty = formattedMessages.length === 0;
  const isTyping = lastMessage?.role === "user";

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    
    if (!input.trim() || isLoading) return;

    // Add user message to store
    addMessage({
      content: input.trim(),
      type: 'user'
    });

    // Clear input
    setInput('');
  }, [input, isLoading, addMessage]);

  // Handle suggestion append with action mapping
  const handleAppend = useCallback((message: { role: "user"; content: string }) => {
    addMessage({
      content: message.content,
      type: 'user'
    });

    // Map specific messages to actions for better UX flow
    const messageToActionMap: Record<string, string> = {
      'I want to create a custom grain bowl': 'create-bowl',
      'Show me my favorite bowls': 'favorites',
      'I want to reorder my last bowl': 'previous-order'
    };

    const action = messageToActionMap[message.content];
    if (action) {
      // Trigger the same logic as the original welcome action handler
      handleWelcomeAction(action);
    }
  }, [addMessage]);

  // Welcome action handler (simplified version of the original)
  const handleWelcomeAction = useCallback((action: string) => {
    const { setCurrentStep, selectedLocation } = useChatbotStore.getState();

    switch (action) {
      case 'create-bowl':
        if (!selectedLocation) {
          setTimeout(() => {
            addMessage({
              content: 'Perfect! Let\'s create your custom bowl. First, I need to know your pickup location.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setTimeout(() => {
            addMessage({
              content: 'Great! Let me create some personalized suggestions for you, or you can build from scratch.',
              type: 'assistant'
            });
            setCurrentStep('ml-suggestions-starting-point');
          }, 500);
        }
        break;
      case 'favorites':
        if (!selectedLocation) {
          setTimeout(() => {
            addMessage({
              content: 'Great! Let me first help you select a pickup location, then I\'ll show your favorites.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('favorites');
        }
        break;
      case 'previous-order':
        if (!selectedLocation) {
          setTimeout(() => {
            addMessage({
              content: 'Perfect! Let me first help you select a pickup location, then I\'ll show your recent orders.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('recent-orders');
        }
        break;
      default:
        // Handle other messages as general chat
        setTimeout(() => {
          addMessage({
            content: 'I\'m here to help you order delicious grain bowls! You can create a custom bowl, view your favorites, or reorder a previous meal.',
            type: 'assistant'
          });
        }, 500);
    }
  }, [addMessage]);

  // Handle stop (if needed)
  const handleStop = useCallback(() => {
    // Implement stop functionality if needed
    console.log('Stop generation requested');
  }, []);

  // Chat suggestions for HeyBo
  const chatSuggestions = [
    "What's in your signature bowls?",
    "Do you have vegan options?",
    "How much does delivery cost?",
    "What are your opening hours?"
  ];

  // Render single pane layout for mobile/small screens
  if (!isDualPane || isMobileView) {
    return (
      <div className={cn("heybo-chatbot-chat-interface flex flex-col h-full", className)}>
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer className="h-full heybo-chatbot-chat">
            {isEmpty ? (
              <HeyBoPromptSuggestions
                label={`Welcome back${user?.name ? `, ${user.name}` : ''}!`}
                append={handleAppend}
                suggestions={chatSuggestions}
              />
            ) : (
              <ChatMessages messages={formattedMessages}>
                <MessageList
                  messages={formattedMessages}
                  isTyping={isTyping}
                />
              </ChatMessages>
            )}

            <ChatForm
              className="mt-auto"
              isPending={isLoading || isTyping}
              handleSubmit={handleSubmit}
            >
              {({ files, setFiles }) => (
                <MessageInput
                  value={input}
                  onChange={handleInputChange}
                  allowAttachments={false} // Disable file attachments as requested
                  stop={handleStop}
                  isGenerating={isLoading}
                  placeholder="Type your message..."
                />
              )}
            </ChatForm>
          </ChatContainer>
        </div>

        {/* Bottom Navigation */}
        <NavigationMenu className="border-t border-[var(--heybo-border-light)]" />
      </div>
    );
  }

  // Render dual pane layout for larger screens
  return (
    <div className={cn("heybo-chatbot-chat-interface h-full", className)}>
      <TwoPaneLayout
        leftPaneContent={
          <div className="flex flex-col h-full">
            {/* Navigation Header */}
            <NavigationHeader />

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden">
              <ChatContainer className="h-full heybo-chatbot-chat">
                {isEmpty ? (
                  <HeyBoPromptSuggestions
                    label={`Welcome back${user?.name ? `, ${user.name}` : ''}!`}
                    append={handleAppend}
                    suggestions={chatSuggestions}
                  />
                ) : (
                  <ChatMessages messages={formattedMessages}>
                    <MessageList
                      messages={formattedMessages}
                      isTyping={isTyping}
                    />
                  </ChatMessages>
                )}

                <ChatForm
                  className="mt-auto"
                  isPending={isLoading || isTyping}
                  handleSubmit={handleSubmit}
                >
                  {({ files, setFiles }) => (
                    <MessageInput
                      value={input}
                      onChange={handleInputChange}
                      allowAttachments={false} // Disable file attachments as requested
                      stop={handleStop}
                      isGenerating={isLoading}
                      placeholder="Type your message..."
                    />
                  )}
                </ChatForm>
              </ChatContainer>
            </div>

            {/* Bottom Navigation */}
            <NavigationMenu className="border-t border-[var(--heybo-border-light)]" />
          </div>
        }
        rightPaneContent={
          <ContentRouter />
        }
      />
    </div>
  );
}
