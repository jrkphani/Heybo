'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  RefreshCw, 
  Phone, 
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import type { ErrorState, SessionWarning } from '../../types';
import { cn } from '../../lib/utils';

interface ErrorDisplayProps {
  errors: ErrorState[];
  warnings?: SessionWarning[];
  onDismissError?: (errorId: string) => void;
  onDismissWarning?: (warningType: string) => void;
  onRetryError?: (errorId: string) => void;
  onExecuteAction?: (actionId: string, action: () => void) => void;
  onRetry?: (errorId: string) => void;
  className?: string;
}

export function ErrorDisplay({ 
  errors, 
  warnings, 
  onDismissError, 
  onDismissWarning, 
  onRetryError,
  onExecuteAction,
  onRetry,
  className
}: ErrorDisplayProps) {
  const getErrorIcon = (severity: string, category: string) => {
    if (category === 'network') {
      return <WifiOff className="w-5 h-5" />;
    }
    
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      case 'low':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getErrorColors = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'high':
        return {
          bg: 'bg-[var(--heybo-primary-50)]',
          border: 'border-[var(--heybo-primary-200)]',
          text: 'text-[var(--heybo-primary-800)]',
          icon: 'text-[var(--heybo-primary-500)]',
          button: 'bg-[var(--heybo-primary-600)] hover:bg-[var(--heybo-primary-700)]'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-500',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'timeout':
        return <Clock className="w-5 h-5" />;
      case 'conflict':
        return <AlertTriangle className="w-5 h-5" />;
      case 'storage':
        return <AlertCircle className="w-5 h-5" />;
      case 'sync':
        return <Wifi className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const formatTimeRemaining = (timeRemaining?: number) => {
    if (!timeRemaining) return '';
    
    const minutes = Math.ceil(timeRemaining / (60 * 1000));
    return minutes > 1 ? `${minutes} minutes` : '1 minute';
  };

  return (
    <div className={cn("heybo-chatbot-error-display space-y-2", className)}>
      {/* Session Warnings */}
      <AnimatePresence>
        {warnings?.map((warning, index) => (
          <motion.div
            key={`warning-${warning.type}-${index}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="text-amber-500 flex-shrink-0 mt-0.5">
                {getWarningIcon(warning.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      {warning.message}
                    </p>
                    {warning.timeRemaining && (
                      <p className="text-xs text-amber-600 mt-1">
                        Time remaining: {formatTimeRemaining(warning.timeRemaining)}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onDismissWarning?.(warning.type)}
                    className="ml-2 text-amber-400 hover:text-amber-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {warning.actions && warning.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {warning.actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => onExecuteAction?.(action.id, action.action)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          action.primary
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.filter(error => !error.resolved).map((error) => {
          const colors = getErrorColors(error.severity);
          
          return (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                  {getErrorIcon(error.severity, error.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${colors.text}`}>
                        {error.userMessage}
                      </p>
                      
                      {error.category && (
                        <p className={`text-xs ${colors.text} opacity-75 mt-1 capitalize`}>
                          {error.category.replace('_', ' ')} error
                        </p>
                      )}
                      
                      {error.retryCount > 0 && (
                        <p className={`text-xs ${colors.text} opacity-75 mt-1`}>
                          Retry attempt {error.retryCount} of {error.maxRetries}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onDismissError?.(error.id)}
                      className={`ml-2 ${colors.icon} opacity-50 hover:opacity-75 transition-opacity`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Error Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {error.recoverable && error.retryCount < error.maxRetries && (
                      <button
                        onClick={() => onRetryError?.(error.id)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium text-white rounded transition-colors ${colors.button}`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                    
                    {error.recoveryActions?.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => onExecuteAction?.(action.id, action.action)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          action.primary
                            ? `text-white ${colors.button}`
                            : `${colors.text} bg-white border ${colors.border} hover:bg-gray-50`
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                    
                    {error.severity === 'critical' && (
                      <button
                        onClick={() => onExecuteAction?.(
                          'contact_support',
                          () => {
                            // Implementation for contacting support
                            window.open('tel:+6512345678', '_self');
                          }
                        )}
                        className="flex items-center space-x-1 px-3 py-1 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contact Support</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Network Status Indicator */}
      <NetworkStatusIndicator />
    </div>
  );
}

function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-800 text-white rounded-lg p-3"
      >
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">
            You're offline. Some features may be limited.
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
