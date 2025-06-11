'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Scale, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import '../../styles/heybo-design-tokens.css';

interface WeightWarningSystemProps {
  currentWeight: number;
  maxWeight?: number;
  warningThreshold?: number;
  onWeightExceeded?: (weight: number) => void;
  onWarningDismiss?: () => void;
  className?: string;
}

interface WeightStatus {
  level: 'safe' | 'warning' | 'exceeded';
  message: string;
  color: string;
  icon: React.ReactNode;
}

export function WeightWarningSystem({
  currentWeight,
  maxWeight = 900, // HeyBo specification: 900g max
  warningThreshold = 720, // HeyBo specification: 80% threshold (720g)
  onWeightExceeded,
  onWarningDismiss,
  className
}: WeightWarningSystemProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [hasShownExceeded, setHasShownExceeded] = useState(false);

  // Calculate weight status
  const getWeightStatus = (): WeightStatus => {
    if (currentWeight >= maxWeight) {
      return {
        level: 'exceeded',
        message: `Bowl weight limit exceeded! Current: ${currentWeight}g (Max: ${maxWeight}g)`,
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />
      };
    } else if (currentWeight >= warningThreshold) {
      return {
        level: 'warning',
        message: `Bowl is getting heavy! Current: ${currentWeight}g (${Math.round((currentWeight / maxWeight) * 100)}% of limit)`,
        color: 'text-[var(--heybo-primary-600)] bg-[var(--heybo-primary-50)] border-[var(--heybo-primary-200)]',
        icon: <Scale className="w-5 h-5 text-[var(--heybo-primary-600)]" />
      };
    } else {
      return {
        level: 'safe',
        message: `Bowl weight: ${currentWeight}g (${Math.round((currentWeight / maxWeight) * 100)}% of ${maxWeight}g limit)`,
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <Scale className="w-5 h-5 text-green-600" />
      };
    }
  };

  const weightStatus = getWeightStatus();
  const progressPercentage = Math.min((currentWeight / maxWeight) * 100, 100);

  // Handle weight threshold notifications
  useEffect(() => {
    if (currentWeight >= maxWeight && !hasShownExceeded) {
      setShowWarning(true);
      setHasShownExceeded(true);
      onWeightExceeded?.(currentWeight);
    } else if (currentWeight >= warningThreshold && !hasShownWarning && currentWeight < maxWeight) {
      setShowWarning(true);
      setHasShownWarning(true);
    }
  }, [currentWeight, maxWeight, warningThreshold, hasShownWarning, hasShownExceeded, onWeightExceeded]);

  // Reset warnings when weight drops significantly
  useEffect(() => {
    if (currentWeight < warningThreshold - 50) { // 50g buffer to prevent flickering
      setHasShownWarning(false);
      setHasShownExceeded(false);
      setShowWarning(false);
    }
  }, [currentWeight, warningThreshold]);

  const handleDismissWarning = () => {
    setShowWarning(false);
    onWarningDismiss?.();
  };

  const getProgressBarColor = () => {
    if (weightStatus.level === 'exceeded') return 'bg-red-500';
    if (weightStatus.level === 'warning') return 'bg-[var(--heybo-primary-500)]';
    return 'bg-green-500';
  };

  return (
    <div className={cn("heybo-chatbot-weight-warning-system", className)}>
      {/* Weight Progress Bar */}
      <div className="heybo-chatbot-weight-progress mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {weightStatus.icon}
            <span className="text-sm font-medium text-gray-700">Bowl Weight</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {currentWeight}g / {maxWeight}g
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full transition-colors duration-300", getProgressBarColor())}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0g</span>
          <span className="text-[var(--heybo-primary-600)]">{warningThreshold}g warning</span>
          <span className="text-red-600">{maxWeight}g max</span>
        </div>
      </div>

      {/* Weight Status Indicator */}
      <div className={cn(
        "heybo-chatbot-weight-status p-3 rounded-lg border text-sm",
        weightStatus.color
      )}>
        <div className="flex items-center space-x-2">
          {weightStatus.icon}
          <span className="font-medium">{weightStatus.message}</span>
        </div>
        
        {weightStatus.level === 'warning' && (
          <div className="mt-2 text-xs opacity-80">
            Consider removing some ingredients to stay within the optimal range.
          </div>
        )}
        
        {weightStatus.level === 'exceeded' && (
          <div className="mt-2 text-xs opacity-80">
            Please remove some ingredients before proceeding. Heavy bowls may affect quality.
          </div>
        )}
      </div>

      {/* Warning Modal/Toast */}
      <AnimatePresence>
        {showWarning && (weightStatus.level === 'warning' || weightStatus.level === 'exceeded') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="heybo-chatbot-weight-warning-modal fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className={cn(
              "p-4 rounded-lg border shadow-lg",
              weightStatus.level === 'exceeded'
                ? "bg-red-50 border-red-200"
                : "bg-[var(--heybo-primary-50)] border-[var(--heybo-primary-200)]"
            )}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {weightStatus.level === 'exceeded' ? (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Scale className="w-6 h-6 text-[var(--heybo-primary-600)]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium text-sm",
                    weightStatus.level === 'exceeded' ? "text-red-800" : "text-[var(--heybo-primary-800)]"
                  )}>
                    {weightStatus.level === 'exceeded' ? 'Weight Limit Exceeded!' : 'Bowl Getting Heavy!'}
                  </h4>

                  <p className={cn(
                    "text-sm mt-1",
                    weightStatus.level === 'exceeded' ? "text-red-700" : "text-[var(--heybo-primary-700)]"
                  )}>
                    Current weight: {currentWeight}g
                    {weightStatus.level === 'exceeded'
                      ? ` (${currentWeight - maxWeight}g over limit)`
                      : ` (${Math.round((currentWeight / maxWeight) * 100)}% of limit)`
                    }
                  </p>

                  <p className={cn(
                    "text-xs mt-2",
                    weightStatus.level === 'exceeded' ? "text-red-600" : "text-[var(--heybo-primary-600)]"
                  )}>
                    {weightStatus.level === 'exceeded'
                      ? 'Please remove some ingredients to proceed.'
                      : 'Consider your remaining ingredient choices carefully.'
                    }
                  </p>
                </div>
                
                <button
                  onClick={handleDismissWarning}
                  className={cn(
                    "flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors",
                    weightStatus.level === 'exceeded' ? "text-red-600" : "text-[var(--heybo-primary-600)]"
                  )}
                  aria-label="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for weight tracking
export function useWeightTracking(initialWeight: number = 0) {
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const [weightHistory, setWeightHistory] = useState<number[]>([initialWeight]);

  const addWeight = (weight: number) => {
    const newWeight = currentWeight + weight;
    setCurrentWeight(newWeight);
    setWeightHistory(prev => [...prev, newWeight]);
  };

  const removeWeight = (weight: number) => {
    const newWeight = Math.max(0, currentWeight - weight);
    setCurrentWeight(newWeight);
    setWeightHistory(prev => [...prev, newWeight]);
  };

  const setWeight = (weight: number) => {
    setCurrentWeight(weight);
    setWeightHistory(prev => [...prev, weight]);
  };

  const resetWeight = () => {
    setCurrentWeight(0);
    setWeightHistory([0]);
  };

  const canAddWeight = (additionalWeight: number, maxWeight: number = 900) => {
    return (currentWeight + additionalWeight) <= maxWeight;
  };

  const getWeightStatus = (maxWeight: number = 900, warningThreshold: number = 720) => {
    if (currentWeight >= maxWeight) return 'exceeded';
    if (currentWeight >= warningThreshold) return 'warning';
    return 'safe';
  };

  return {
    currentWeight,
    weightHistory,
    addWeight,
    removeWeight,
    setWeight,
    resetWeight,
    canAddWeight,
    getWeightStatus
  };
}
