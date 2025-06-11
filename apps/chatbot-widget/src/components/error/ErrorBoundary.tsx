'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HeyBo Chatbot Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <div className="heybo-chatbot-error-boundary">
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-sm text-red-600 text-center mb-4">
          LULU encountered an unexpected error. Don't worry, we're working to fix it!
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-4 p-3 bg-red-100 rounded text-xs text-red-700 max-w-full overflow-auto">
            <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
            {error.stack && (
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
            )}
          </details>
        )}
        <button
          onClick={retry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('HeyBo Chatbot Error:', error, errorInfo);
    // You can add error reporting service here
  };
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Specific error fallback for the chatbot widget
export function ChatbotErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <div className="heybo-chatbot-widget heybo-chatbot-error">
      <div className="flex flex-col items-center justify-center h-full p-6 bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg">
        <div className="w-16 h-16 bg-[var(--heybo-primary-100)] rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🥣</span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--heybo-primary-800)] mb-2">
          LULU is taking a quick break
        </h3>
        <p className="text-sm text-[var(--heybo-primary-600)] text-center mb-4">
          Our AI assistant is experiencing some technical difficulties. Please try again in a moment.
        </p>
        <div className="flex gap-3">
          <button
            onClick={retry}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Restart LULU
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[var(--heybo-primary-600)] text-[var(--heybo-primary-600)] rounded-lg hover:bg-[var(--heybo-primary-50)] transition-colors"
          >
            Refresh Page
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 p-3 bg-[var(--heybo-primary-100)] rounded text-xs text-[var(--heybo-primary-700)] max-w-full overflow-auto">
            <summary className="cursor-pointer font-medium">Technical Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
