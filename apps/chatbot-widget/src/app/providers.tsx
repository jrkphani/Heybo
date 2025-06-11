"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { ErrorBoundary, ChatbotErrorFallback } from "@/components/error/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on network errors in development
          if (process.env.NODE_ENV === 'development' && error instanceof Error && error.message?.includes('NetworkError')) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          // Add headers for HeyBo authentication
          headers() {
            return {
              'x-heybo-brand': 'heybo',
            };
          },
          // Handle network errors gracefully in development
          fetch(url, options) {
            return fetch(url, {
              ...options,
              // Add timeout to prevent hanging requests
              signal: AbortSignal.timeout(10000), // 10 second timeout
            }).catch(error => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('tRPC fetch error (development):', error.message);
              }
              throw error;
            });
          },
        }),
      ],
    })
  );

  return (
    <ErrorBoundary fallback={ChatbotErrorFallback}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
