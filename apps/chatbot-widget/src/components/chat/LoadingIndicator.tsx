'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex gap-3 max-w-full justify-start">
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{
          background: 'var(--heybo-primary-gradient)',
          borderRadius: '50%',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em'
        }}
      >
        O
      </div>

      {/* Loading Message */}
      <div className="flex flex-col max-w-[85%] items-start">
        {/* Typing Indicator */}
        <div
          className="bg-white/90 border border-heybo-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: 'var(--heybo-primary-500)',
                  borderRadius: '50%' 
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: 'var(--heybo-primary-500)',
                  borderRadius: '50%' 
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: 'var(--heybo-primary-500)',
                  borderRadius: '50%' 
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.4
                }}
              />
            </div>
            <span className="text-xs text-heybo-text-muted ml-2">HeyBo is typing...</span>
          </div>
        </div>

        {/* Timestamp placeholder */}
        <div className="text-xs text-heybo-text-muted mt-1 px-1">
          Just now
        </div>
      </div>
    </div>
  );
}
