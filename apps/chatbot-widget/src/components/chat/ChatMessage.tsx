'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.type === 'assistant';
  const isSystem = message.type === 'system';

  // Animation variants
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  // System messages (like notifications)
  if (isSystem) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center my-2"
      >
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "heybo-chatbot-message",
        "flex gap-3 max-w-full",
        isAssistant ? "bot justify-start" : "user justify-end"
      )}
    >
      {/* Avatar - Only for assistant messages */}
      {isAssistant && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: 'var(--heybo-primary-gradient)',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          O
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isAssistant ? "items-start" : "items-end"
      )}>
        {/* Message Bubble - Official 18px radius specification */}
        <div className={cn(
          "heybo-chatbot-message-bubble",
          isAssistant ? "bot" : "user"
        )}>
          {/* Message text with basic formatting */}
          <div className="whitespace-pre-wrap break-words">
            {formatMessageContent(message.content)}
          </div>

          {/* Metadata content (like ingredient cards, location cards, etc.) */}
          {message.metadata && (
            <div className="mt-3">
              <MessageMetadata metadata={message.metadata} />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-gray-500 mt-1 px-1",
          isAssistant ? "text-left" : "text-right"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {/* User Avatar - Only for user messages */}
      {!isAssistant && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'var(--heybo-background-secondary)' }}
        >
          <User className="w-4 h-4" style={{ color: 'var(--heybo-text-primary)' }} />
        </div>
      )}
    </motion.div>
  );
}

// Helper function to format message content with basic markdown-like formatting
function formatMessageContent(content: string): React.ReactNode {
  // Simple emoji and formatting support
  const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|🥣|🍽️|⭐|✅|❌|🔥|💪|🌱)/g);
  
  return parts.map((part, index) => {
    // Bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // Italic text
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    
    // Emojis - add slight spacing
    if (/^[🥣🍽️⭐✅❌🔥💪🌱]$/.test(part)) {
      return (
        <span key={index} className="mx-0.5">
          {part}
        </span>
      );
    }
    
    return part;
  });
}

// Helper function to format timestamp
function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Same day
  if (now.toDateString() === timestamp.toDateString()) {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Different day
  return timestamp.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Component to render message metadata (ingredient cards, etc.)
function MessageMetadata({ metadata }: { metadata: any }) {
  // Handle different types of metadata
  if (metadata.actionType === 'show-main-menu') {
    return null; // Main menu buttons are handled by ActionButtons component
  }
  
  if (metadata.bowlData) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 mt-2">
        <div className="text-xs text-gray-600 mb-1">Bowl Preview</div>
        <div className="text-sm font-medium">{metadata.bowlData.name || 'Custom Bowl'}</div>
        {metadata.bowlData.totalPrice && (
          <div className="text-xs text-gray-600">
            ${(metadata.bowlData.totalPrice / 100).toFixed(2)}
          </div>
        )}
      </div>
    );
  }
  
  if (metadata.locationData) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 mt-2">
        <div className="text-xs text-gray-600 mb-1">Selected Location</div>
        <div className="text-sm font-medium">{metadata.locationData.name}</div>
        <div className="text-xs text-gray-600">{metadata.locationData.address}</div>
      </div>
    );
  }
  
  if (metadata.ingredientData) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 mt-2">
        <div className="text-xs text-gray-600 mb-1">Ingredients</div>
        <div className="flex flex-wrap gap-1">
          {metadata.ingredientData.slice(0, 3).map((ingredient: any, index: number) => (
            <span key={index} className="text-xs bg-white px-2 py-1 rounded">
              {ingredient.name}
            </span>
          ))}
          {metadata.ingredientData.length > 3 && (
            <span className="text-xs text-gray-500">
              +{metadata.ingredientData.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }
  
  return null;
}
