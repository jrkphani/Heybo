'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  MoreVertical,
  Loader2,
  ChefHat,
  ShoppingCart,
  Star
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { cn } from '../../lib/utils';
import type {
  ChatMessage,
  MessageType,
  MessageStatus,
  EmbeddedUIComponent,
  BowlPreviewData,
  QuickActionsData,
  IngredientGridData,
  OrderSummaryData
} from '../../types';
import '../../styles/heybo-design-tokens.css';

interface ChatMessagesV2Props {
  messages?: ChatMessage[];
  showTypingIndicator?: boolean;
  enableReactions?: boolean;
  enableEmbeddedUI?: boolean;
  maxHeight?: string;
  onMessageAction?: (messageId: string, action: string) => void;
  onEmbeddedUIInteraction?: (messageId: string, data: any) => void;
  className?: string;
}

export function ChatMessagesV2({
  messages: propMessages,
  showTypingIndicator = false,
  enableReactions = true,
  enableEmbeddedUI = true,
  maxHeight = '400px',
  onMessageAction,
  onEmbeddedUIInteraction,
  className
}: ChatMessagesV2Props) {
  const { messages: storeMessages, isTyping, addMessage } = useChatbotStore();
  const { currentBreakpoint } = useLayoutStore();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [visibleActions, setVisibleActions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use prop messages if provided, otherwise use store messages
  const messages = propMessages || storeMessages;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle message reactions
  const handleReaction = useCallback((messageId: string, reaction: 'like' | 'dislike') => {
    onMessageAction?.(messageId, `reaction:${reaction}`);
  }, [onMessageAction]);

  // Handle message copying
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  }, []);

  // Get message status icon
  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Get message type icon
  const getMessageTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'assistant':
        return <Bot className="w-4 h-4 text-heybo-primary" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Bot className="w-4 h-4 text-heybo-primary" />;
    }
  };

  // Render embedded UI components
  const renderEmbeddedUI = (component: EmbeddedUIComponent, messageId: string) => {
    switch (component.type) {
      case 'bowl-preview':
        const bowlData = component.data as BowlPreviewData;
        return (
          <div className="bg-heybo-primary-50 border border-heybo-primary-200 rounded-lg p-4 mt-3">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-6 h-6 text-heybo-primary" />
              <div className="flex-1">
                <h4 className="font-medium text-heybo-primary-800">Bowl Preview</h4>
                <p className="text-sm text-heybo-primary-600">{bowlData.name || 'Custom Bowl'}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-heybo-primary-800">
                  ${bowlData.price ? (bowlData.price / 100).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-heybo-primary-600">
                  {bowlData.weight || 0}g
                </div>
              </div>
            </div>
            {component.interactive && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => onEmbeddedUIInteraction?.(messageId, { action: 'edit', data: component.data })}
                  className="px-3 py-1 text-xs bg-white border border-heybo-primary-300 text-heybo-primary-700 rounded hover:bg-heybo-primary-50 transition-colors"
                >
                  Edit Bowl
                </button>
                <button
                  onClick={() => onEmbeddedUIInteraction?.(messageId, { action: 'add-to-cart', data: component.data })}
                  className="px-3 py-1 text-xs bg-heybo-primary text-white rounded hover:bg-heybo-primary-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        );

      case 'quick-actions':
        const quickActionsData = component.data as QuickActionsData;
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {quickActionsData.actions?.map((action, index: number) => (
              <button
                key={index}
                onClick={() => onEmbeddedUIInteraction?.(messageId, { action: 'quick-action', data: action })}
                className="px-3 py-1 text-sm bg-heybo-primary-100 text-heybo-primary-700 rounded-full hover:bg-heybo-primary-200 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        );

      case 'ingredient-grid':
        const ingredientData = component.data as IngredientGridData;
        return (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {ingredientData.ingredients?.slice(0, 4).map((ingredient, index: number) => (
              <button
                key={index}
                onClick={() => onEmbeddedUIInteraction?.(messageId, { action: 'select-ingredient', data: ingredient })}
                className="p-2 text-xs bg-gray-50 border border-gray-200 rounded hover:bg-heybo-primary-50 hover:border-heybo-primary-200 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">{ingredient.name}</div>
                <div className="text-gray-600">{ingredient.nutritionalInfo?.calories || 0} cal</div>
              </button>
            ))}
          </div>
        );

      case 'order-summary':
        const orderData = component.data as OrderSummaryData;
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Order Summary</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ${(orderData.total / 100).toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {orderData.items?.map((item, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.bowl.name}</span>
                  <span className="text-gray-900">${(item.bowl.totalPrice / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {component.interactive && (
              <button
                onClick={() => onEmbeddedUIInteraction?.(messageId, { action: 'checkout', data: component.data })}
                className="w-full mt-3 px-4 py-2 bg-heybo-primary text-white rounded hover:bg-heybo-primary-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render typing indicator
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start space-x-3 mb-4"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-heybo-primary-100 flex items-center justify-center">
          <Bot className="w-4 h-4 text-heybo-primary" />
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">HeyBo is typing...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Render individual message
  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    const showActions = visibleActions === message.id;

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "flex items-start space-x-3 mb-4",
          isUser && "flex-row-reverse space-x-reverse",
          isSystem && "justify-center"
        )}
      >
        {!isSystem && (
          <div className="flex-shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isUser ? "bg-blue-100" : "bg-heybo-primary-100"
            )}>
              {getMessageTypeIcon(message.type)}
            </div>
          </div>
        )}

        <div className={cn(
          "flex-1 max-w-[80%]",
          isUser && "max-w-[80%]",
          isSystem && "max-w-[60%]"
        )}>
          <div className={cn(
            "rounded-lg px-4 py-3 shadow-sm relative group",
            isUser 
              ? "bg-blue-500 text-white ml-auto" 
              : isSystem
                ? "bg-yellow-50 border border-yellow-200 text-yellow-800 text-center"
                : "bg-white border border-gray-200"
          )}>
            {/* Message content */}
            <div className="prose prose-sm max-w-none">
              {typeof message.content === 'string' ? (
                <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div>{message.content}</div>
              )}
            </div>

            {/* Message metadata */}
            <div className={cn(
              "flex items-center justify-between mt-2 text-xs",
              isUser ? "text-blue-100" : "text-gray-500"
            )}>
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              {message.status && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon(message.status)}
                </div>
              )}
            </div>

            {/* Message actions */}
            {!isSystem && enableReactions && (
              <div className={cn(
                "absolute -bottom-2 flex items-center space-x-1 transition-opacity",
                isUser ? "-left-2" : "-right-2",
                showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <button
                  onClick={() => handleReaction(message.id, 'like')}
                  className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
                  title="Like message"
                >
                  <ThumbsUp className="w-3 h-3 text-gray-600 hover:text-green-600" />
                </button>
                <button
                  onClick={() => handleReaction(message.id, 'dislike')}
                  className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Dislike message"
                >
                  <ThumbsDown className="w-3 h-3 text-gray-600 hover:text-red-600" />
                </button>
                <button
                  onClick={() => handleCopyMessage(typeof message.content === 'string' ? message.content : '')}
                  className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Embedded UI components */}
          {enableEmbeddedUI && message.embeddedUI && renderEmbeddedUI(message.embeddedUI, message.id)}
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn("heybo-chat-messages-v2 flex flex-col", className)}
      style={{ maxHeight }}
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Bot className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              Hi! I'm your HeyBo assistant. How can I help you build the perfect bowl today?
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Typing indicator */}
            <AnimatePresence>
              {(showTypingIndicator || isTyping) && <TypingIndicator />}
            </AnimatePresence>
          </>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// Export message utilities for use in other components
export const createQuickActionsMessage = (actions: Array<{ label: string; action: string; data?: any }>) => ({
  id: `quick-actions-${Date.now()}`,
  type: 'assistant' as MessageType,
  content: 'What would you like to do?',
  embeddedUI: {
    type: 'quick-actions' as const,
    data: { actions },
    interactive: true
  },
  timestamp: Date.now(),
  status: 'sent' as MessageStatus
});

export const createBowlPreviewMessage = (bowlData: any) => ({
  id: `bowl-preview-${Date.now()}`,
  type: 'assistant' as MessageType,
  content: 'Here\'s your bowl so far:',
  embeddedUI: {
    type: 'bowl-preview' as const,
    data: bowlData,
    interactive: true
  },
  timestamp: Date.now(),
  status: 'sent' as MessageStatus
});

export const createOrderSummaryMessage = (orderData: any) => ({
  id: `order-summary-${Date.now()}`,
  type: 'assistant' as MessageType,
  content: 'Ready to checkout?',
  embeddedUI: {
    type: 'order-summary' as const,
    data: orderData,
    interactive: true
  },
  timestamp: Date.now(),
  status: 'sent' as MessageStatus
}); 