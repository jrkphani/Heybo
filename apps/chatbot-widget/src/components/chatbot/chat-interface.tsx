"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@heybo/ui/button";
import { Input } from "@heybo/ui/input";
import { ScrollArea } from "@heybo/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { QuickActions } from "./quick-actions";
import { useChatbotStore } from "@/lib/stores/chatbot-store";
import { trpc } from "@/lib/trpc";

interface ChatInterfaceProps {
  onOrderStart?: () => void;
  onOrderComplete?: (order: any) => void;
}

export function ChatInterface({ onOrderStart, onOrderComplete }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, currentStep, addMessage, setCurrentStep } = useChatbotStore();
  
  // tRPC mutations
  const processMessage = trpc.chat.processMessage.useMutation({
    onSuccess: (response) => {
      addMessage({
        id: Date.now().toString(),
        content: response.message,
        type: 'bot',
        timestamp: new Date(),
        actions: response.actions,
      });
      setIsTyping(false);
      
      if (response.nextStep) {
        setCurrentStep(response.nextStep);
      }
    },
    onError: () => {
      addMessage({
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble right now. Please try again.",
        type: 'bot',
        timestamp: new Date(),
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = async () => {
    if (!message.trim() || processMessage.isPending) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date(),
    });
    
    setMessage("");
    setIsTyping(true);
    
    // Process message
    processMessage.mutate({
      message,
      currentStep,
      sessionId: 'temp-session-id', // Replace with actual session management
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: 'welcome',
        content: "Hey there! 👋 I'm your HeyBo assistant. I'm here to help you create the perfect warm grain bowl. What can I help you with today?",
        type: 'bot',
        timestamp: new Date(),
        actions: [
          { type: 'quick_reply', text: 'Build a bowl', value: 'create_bowl' },
          { type: 'quick_reply', text: 'Recent orders', value: 'recent_orders' },
          { type: 'quick_reply', text: 'Recommendations', value: 'recommendations' },
          { type: 'quick_reply', text: 'Help', value: 'help' },
        ],
      });
    }
  }, [messages.length, addMessage]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 chat-scroll" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {currentStep === 'welcome' && (
        <div className="px-4 pb-2">
          <QuickActions
            actions={[
              { label: "🥣 Create Your Bowl", action: "create_bowl" },
              { label: "🔄 Recent Orders", action: "recent_orders" },
              { label: "⭐ Favorites", action: "favorites" },
              { label: "🤖 AI Recommendations", action: "ml_recommendations" },
            ]}
            onAction={handleQuickAction}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-gray-300 focus:border-primary-500"
            disabled={processMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || processMessage.isPending}
            size="icon"
            className="rounded-full bg-primary-500 hover:bg-primary-600"
          >
            {processMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
