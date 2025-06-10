'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useWidgetStateStore } from '../../store/widget-state-store';
import '../../styles/heybo-design-tokens.css';

interface ProgressiveUILevel {
  id: string;
  level: 'simple' | 'intermediate' | 'complex' | 'review';
  trigger: string;
  component: React.ReactNode;
  description: string;
}

interface ProgressiveUIDisclosureProps {
  levels: ProgressiveUILevel[];
  currentTrigger: string;
  onLevelChange?: (level: ProgressiveUILevel) => void;
  className?: string;
}

export function ProgressiveUIDisclosure({
  levels,
  currentTrigger,
  onLevelChange,
  className
}: ProgressiveUIDisclosureProps) {
  const { conversation, ui } = useWidgetStateStore();
  const [currentLevel, setCurrentLevel] = useState<ProgressiveUILevel | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Determine current UI level based on trigger and conversation state
  useEffect(() => {
    const matchingLevel = levels.find(level => level.trigger === currentTrigger);
    if (matchingLevel && matchingLevel !== currentLevel) {
      setCurrentLevel(matchingLevel);
      onLevelChange?.(matchingLevel);
    }
  }, [currentTrigger, levels, currentLevel, onLevelChange]);

  // Auto-expand based on user interaction patterns
  useEffect(() => {
    const completedSteps = conversation.completedSteps.length;
    const shouldShowAdvanced = completedSteps >= 2 || conversation.currentStep === 'review';
    setShowAdvancedOptions(shouldShowAdvanced);
  }, [conversation.completedSteps, conversation.currentStep]);

  const levelVariants = {
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
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    }
  };

  if (!currentLevel) return null;

  return (
    <div className={cn(
      "heybo-progressive-ui",
      "bg-white border border-gray-200 rounded-xl overflow-hidden",
      "shadow-sm",
      className
    )}>
      {/* Current Level Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel.id}
          variants={levelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-4"
        >
          {/* Level Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LevelIcon level={currentLevel.level} />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {getLevelTitle(currentLevel.level)}
                </h4>
                <p className="text-xs text-gray-600">
                  {currentLevel.description}
                </p>
              </div>
            </div>
            
            {/* Level Progression Indicator */}
            <div className="flex items-center gap-1">
              {levels.map((level, index) => (
                <div
                  key={level.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    level.id === currentLevel.id 
                      ? "bg-orange-500" 
                      : index < levels.findIndex(l => l.id === currentLevel.id)
                        ? "bg-orange-300"
                        : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Current Level Component */}
          <div className="mb-4">
            {currentLevel.component}
          </div>

          {/* Progressive Disclosure Controls */}
          {currentLevel.level !== 'complex' && (
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => setExpandedLevel(
                  expandedLevel === currentLevel.id ? null : currentLevel.id
                )}
                className={cn(
                  "flex items-center justify-between w-full",
                  "text-sm text-orange-600 hover:text-orange-700",
                  "transition-colors"
                )}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Need more options?
                </span>
                {expandedLevel === currentLevel.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {expandedLevel === currentLevel.id && (
                  <motion.div
                    variants={expandVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      <AdvancedOptionsPreview 
                        currentLevel={currentLevel.level}
                        onUpgrade={() => {
                          const nextLevelIndex = levels.findIndex(l => l.id === currentLevel.id) + 1;
                          if (nextLevelIndex < levels.length) {
                            const nextLevel = levels[nextLevelIndex];
                            if (nextLevel) {
                              setCurrentLevel(nextLevel);
                            }
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Smart Navigation Suggestions */}
      {showAdvancedOptions && (
        <div className="bg-orange-50 border-t border-orange-200 p-3">
          <SmartNavigationSuggestions 
            currentStep={conversation.currentStep}
            completedSteps={conversation.completedSteps}
          />
        </div>
      )}
    </div>
  );
}

// Level icon component
function LevelIcon({ level }: { level: ProgressiveUILevel['level'] }) {
  const iconClass = "w-4 h-4";
  
  switch (level) {
    case 'simple':
      return <div className={cn(iconClass, "bg-green-500 rounded-full")} />;
    case 'intermediate':
      return <div className={cn(iconClass, "bg-yellow-500 rounded-full")} />;
    case 'complex':
      return <div className={cn(iconClass, "bg-orange-500 rounded-full")} />;
    case 'review':
      return <div className={cn(iconClass, "bg-blue-500 rounded-full")} />;
    default:
      return <div className={cn(iconClass, "bg-gray-400 rounded-full")} />;
  }
}

// Get level title
function getLevelTitle(level: ProgressiveUILevel['level']): string {
  switch (level) {
    case 'simple': return 'Quick Selection';
    case 'intermediate': return 'More Options';
    case 'complex': return 'Full Customization';
    case 'review': return 'Review & Confirm';
    default: return 'Selection';
  }
}

// Advanced options preview component
function AdvancedOptionsPreview({ 
  currentLevel, 
  onUpgrade 
}: { 
  currentLevel: ProgressiveUILevel['level'];
  onUpgrade: () => void;
}) {
  const getPreviewText = () => {
    switch (currentLevel) {
      case 'simple':
        return 'See all ingredients, nutrition info, and portion controls';
      case 'intermediate':
        return 'Access detailed customization, allergen filters, and preparation options';
      default:
        return 'Unlock premium features and advanced controls';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 mb-1">
            {getPreviewText()}
          </p>
          <p className="text-xs text-gray-500">
            Upgrade to see more options
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className={cn(
            "bg-orange-500 text-white text-xs py-2 px-3 rounded-lg",
            "hover:bg-orange-600 transition-colors",
            "flex items-center gap-1"
          )}
        >
          Upgrade
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// Smart navigation suggestions component
function SmartNavigationSuggestions({ 
  currentStep, 
  completedSteps 
}: { 
  currentStep: string;
  completedSteps: string[];
}) {
  const getSuggestions = () => {
    if (completedSteps.length >= 3) {
      return [
        { text: 'Skip to checkout', action: 'checkout' },
        { text: 'Save as favorite', action: 'save' }
      ];
    } else if (currentStep === 'protein') {
      return [
        { text: 'Skip protein (vegetarian)', action: 'skip-protein' },
        { text: 'Double protein', action: 'double-protein' }
      ];
    } else {
      return [
        { text: 'Use previous order', action: 'previous-order' },
        { text: 'Surprise me', action: 'random' }
      ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <div>
      <p className="text-xs text-orange-700 font-medium mb-2">
        Smart suggestions based on your progress:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className={cn(
              "text-xs bg-white text-orange-600 border border-orange-200",
              "px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            )}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
}
