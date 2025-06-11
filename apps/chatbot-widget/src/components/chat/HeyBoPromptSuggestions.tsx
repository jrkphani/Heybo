'use client';

import React from 'react';
import { ChefHat, Heart, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeyBoPromptSuggestionsProps {
  label?: string;
  append: (message: { role: "user"; content: string }) => void;
  suggestions?: string[];
  className?: string;
}

export function HeyBoPromptSuggestions({
  label = "How can I help you today?",
  append,
  suggestions,
  className
}: HeyBoPromptSuggestionsProps) {
  // Default HeyBo-specific suggestions with icons
  const defaultSuggestions = [
    {
      id: 'create-bowl',
      title: 'Create my personal bowl',
      description: 'Build a custom grain bowl',
      icon: ChefHat,
      message: 'I want to create a custom grain bowl'
    },
    {
      id: 'favorites',
      title: 'Pull up my favourites',
      description: 'Quick access to saved bowls',
      icon: Heart,
      message: 'Show me my favorite bowls'
    },
    {
      id: 'previous-order',
      title: 'Order my previous bowl',
      description: 'Reorder your last meal',
      icon: Clock,
      message: 'I want to reorder my last bowl'
    }
  ];

  const handleSuggestionClick = (message: string) => {
    append({ role: "user", content: message });
  };

  return (
    <div className={cn("heybo-chatbot-prompt-suggestions space-y-6 p-6", className)}>
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)]">
          {label}
        </h2>
        <p className="text-sm text-[var(--heybo-text-secondary)]">
          Choose one of these options to get started
        </p>
      </div>

      {/* HeyBo Action Cards */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto">
        {defaultSuggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.message)}
            className="heybo-chatbot-suggestion-card p-6 bg-white border border-gray-200 rounded-xl hover:border-[var(--heybo-primary-300)] hover:shadow-md transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--heybo-primary-50)] flex items-center justify-center group-hover:bg-[var(--heybo-primary-100)] transition-colors">
              <suggestion.icon className="w-6 h-6 text-[var(--heybo-primary-600)]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h3>
            <p className="text-sm text-gray-500">{suggestion.description}</p>
          </button>
        ))}
      </div>

      {/* Additional Text Suggestions (if provided) */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--heybo-text-secondary)] text-center">
            Or try these quick questions:
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="heybo-chatbot-quick-suggestion text-xs px-3 py-1.5 bg-[var(--heybo-primary-50)] text-[var(--heybo-primary-700)] rounded-full hover:bg-[var(--heybo-primary-100)] transition-colors border border-[var(--heybo-primary-200)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
