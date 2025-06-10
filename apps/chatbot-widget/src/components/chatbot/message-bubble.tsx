"use client";

import { cn } from "@heybo/ui/utils";
import { Avatar, AvatarFallback } from "@heybo/ui/avatar";
import { Button } from "@heybo/ui/button";
import { MessageType } from "@heybo/types";

interface MessageBubbleProps {
  message: MessageType;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.type === 'bot';
  
  return (
    <div className={cn(
      "flex gap-3 max-w-[85%]",
      isBot ? "justify-start" : "justify-end ml-auto"
    )}>
      {/* Bot Avatar */}
      {isBot && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-primary-500 text-white text-xs">
            HB
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-2",
        isBot ? "items-start" : "items-end"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl max-w-sm break-words",
          isBot 
            ? "bg-white border border-gray-200 text-gray-900 rounded-bl-sm" 
            : "bg-primary-500 text-white rounded-br-sm"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {/* Message Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 max-w-sm">
            {message.actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs rounded-full border-gray-300",
                  "hover:bg-primary-50 hover:border-primary-300",
                  "transition-colors duration-200"
                )}
                onClick={() => {
                  // Handle action click
                  if (action.type === 'quick_reply') {
                    // Trigger quick reply
                    console.log('Quick reply:', action.value);
                  }
                }}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div className="text-xs text-gray-500 px-1">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}
