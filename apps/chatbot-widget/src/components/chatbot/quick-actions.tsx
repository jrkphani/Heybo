"use client";

import { Button } from "@heybo/ui/button";
import { cn } from "@heybo/ui/utils";

interface QuickAction {
  label: string;
  action: string;
  emoji?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onAction: (action: string) => void;
  className?: string;
}

export function QuickActions({ actions, onAction, className }: QuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onAction(action.action)}
          className={cn(
            "text-sm rounded-full border-gray-300 bg-white",
            "hover:bg-primary-50 hover:border-primary-300",
            "transition-all duration-200 hover:scale-105",
            "text-gray-700 hover:text-primary-700"
          )}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
