"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@heybo/ui/button";
import { Card } from "@heybo/ui/card";
import { ChatInterface } from "./chat-interface";
import { cn } from "@heybo/ui/utils";

interface HeyBoChatbotWidgetProps {
  className?: string;
  onOrderStart?: () => void;
  onOrderComplete?: (order: any) => void;
  inheritStyles?: boolean;
}

export function HeyBoChatbotWidget({
  className,
  onOrderStart,
  onOrderComplete,
  inheritStyles = true,
}: HeyBoChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    
    // Analytics integration
    if (typeof window !== 'undefined' && (window as any).heyboAnalytics) {
      (window as any).heyboAnalytics.track('chatbot_toggled', {
        state: !isOpen ? 'opened' : 'closed'
      });
    }
  };

  return (
    <div className={cn('heybo-chatbot-widget', className)}>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={toggleWidget}
          className={cn(
            "heybo-chatbot-fab",
            "fixed bottom-6 right-6 w-14 h-14 rounded-full",
            "bg-gradient-to-r from-primary-500 to-primary-600",
            "hover:from-primary-600 hover:to-primary-700",
            "shadow-lg hover:shadow-xl transition-all duration-200",
            "z-50"
          )}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="sr-only">Open HeyBo Assistant</span>
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className={cn(
          "heybo-chatbot-container",
          "fixed bottom-6 right-6 w-96 h-[500px]",
          "shadow-2xl border-0 overflow-hidden z-50",
          "md:w-96 md:h-[500px]",
          // Mobile: Full screen
          "max-md:fixed max-md:inset-0 max-md:w-full max-md:h-full max-md:rounded-none"
        )}>
          {/* Header */}
          <div className={cn(
            "heybo-chatbot-header",
            "bg-gradient-to-r from-primary-500 to-primary-600",
            "text-white p-4 flex items-center justify-between"
          )}>
            <div>
              <h3 className="font-semibold text-lg">HeyBo Assistant</h3>
              <p className="text-sm opacity-90">Order your perfect grain bowl</p>
            </div>
            <Button
              onClick={toggleWidget}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close assistant</span>
            </Button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              onOrderStart={onOrderStart}
              onOrderComplete={onOrderComplete}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
