"use client";

import { cn } from "@heybo/ui/utils";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%] justify-start">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-medium">HB</span>
      </div>
      
      {/* Typing Animation */}
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
            "[animation-delay:-0.3s]"
          )} />
          <div className={cn(
            "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
            "[animation-delay:-0.15s]"
          )} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
