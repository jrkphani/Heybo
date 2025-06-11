'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Clock, 
  Heart, 
  Sparkles, 
  Brain,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';

export function ActionButtons() {
  const {
    currentStep,
    setCurrentStep,
    addMessage,
    messages,
    user
  } = useChatbotStore();

  // Check if we should show action buttons based on the last message
  const lastMessage = messages[messages.length - 1];
  const shouldShowActions = lastMessage?.metadata?.actionType || currentStep === 'welcome';

  if (!shouldShowActions) return null;

  // Animation variants for buttons
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  // Handle button clicks
  const handleAction = (action: string, label: string) => {
    // Add user message
    addMessage({
      content: label,
      type: 'user'
    });

    // Handle different actions
    switch (action) {
      case 'signature-bowls':
        setCurrentStep('signature-bowls');
        setTimeout(() => {
          addMessage({
            content: "Great choice! Here are our signature bowls, crafted by our chefs:",
            type: 'assistant',
            metadata: { actionType: 'show-signature-bowls' }
          });
        }, 500);
        break;

      case 'recent-orders':
        if (!user) {
          setCurrentStep('authentication');
          setTimeout(() => {
            addMessage({
              content: "I'd love to show you your recent orders! Please sign in first:",
              type: 'assistant',
              metadata: { actionType: 'show-auth-options' }
            });
          }, 500);
        } else {
          setCurrentStep('recent-orders');
          setTimeout(() => {
            addMessage({
              content: "Here are your recent orders. Would you like to reorder any of these?",
              type: 'assistant',
              metadata: { actionType: 'show-recent-orders' }
            });
          }, 500);
        }
        break;

      case 'favorites':
        if (!user) {
          setCurrentStep('authentication');
          setTimeout(() => {
            addMessage({
              content: "I'd love to show you your favorites! Please sign in first:",
              type: 'assistant',
              metadata: { actionType: 'show-auth-options' }
            });
          }, 500);
        } else {
          setCurrentStep('favorites');
          setTimeout(() => {
            addMessage({
              content: "Here are your favorite bowls:",
              type: 'assistant',
              metadata: { actionType: 'show-favorites' }
            });
          }, 500);
        }
        break;

      case 'create-your-own':
        setCurrentStep('location-selection');
        setTimeout(() => {
          addMessage({
            content: "Perfect! Let's create your custom bowl. First, where would you like to pick up your order?",
            type: 'assistant',
            metadata: { actionType: 'show-locations' }
          });
        }, 500);
        break;

      case 'ml-recommendations':
        setCurrentStep('ml-recommendations');
        setTimeout(() => {
          addMessage({
            content: "Let me create some personalized recommendations for you based on your preferences...",
            type: 'assistant'
          });
          
          // Simulate ML processing
          setTimeout(() => {
            addMessage({
              content: "Here are some bowls I think you'll love:",
              type: 'assistant',
              metadata: { actionType: 'show-ml-recommendations' }
            });
          }, 2000);
        }, 500);
        break;

      case 'login-registered':
        addMessage({
          content: "Please enter your email and password, or use the login link sent to your device.",
          type: 'assistant',
          metadata: { actionType: 'show-login-form' }
        });
        break;

      case 'login-guest':
        addMessage({
          content: "Please enter your mobile number to receive an OTP:",
          type: 'assistant',
          metadata: { actionType: 'show-otp-form' }
        });
        break;

      default:
        console.log('Unknown action:', action);
    }
  };

  // Render different button sets based on current step and action type
  const renderActionButtons = () => {
    const actionType = lastMessage?.metadata?.actionType;

    // Main menu buttons
    if (actionType === 'show-main-menu' || currentStep === 'welcome') {
      return (
        <div className="heybo-chatbot-action-buttons">
          <ActionButton
            icon={<Utensils className="w-4 h-4" />}
            label="Signature Bowls"
            description="Chef-crafted favorites"
            onClick={() => handleAction('signature-bowls', 'Show me signature bowls')}
            variant="primary"
          />
          
          <ActionButton
            icon={<Clock className="w-4 h-4" />}
            label="Recent Orders"
            description="Reorder your favorites"
            onClick={() => handleAction('recent-orders', 'Show my recent orders')}
            variant="secondary"
          />
          
          <ActionButton
            icon={<Heart className="w-4 h-4" />}
            label="My Favorites"
            description="Your saved bowls"
            onClick={() => handleAction('favorites', 'Show my favorites')}
            variant="secondary"
          />
          
          <ActionButton
            icon={<Sparkles className="w-4 h-4" />}
            label="Create Your Own"
            description="Build from scratch"
            onClick={() => handleAction('create-your-own', 'I want to create my own bowl')}
            variant="accent"
          />
          
          <ActionButton
            icon={<Brain className="w-4 h-4" />}
            label="AI Recommendations"
            description="Personalized for you"
            onClick={() => handleAction('ml-recommendations', 'Show me AI recommendations')}
            variant="secondary"
          />
        </div>
      );
    }

    // Authentication options
    if (actionType === 'show-auth-options') {
      return (
        <div className="grid grid-cols-1 gap-2">
          <ActionButton
            icon={<User className="w-4 h-4" />}
            label="I have an account"
            description="Sign in with email"
            onClick={() => handleAction('login-registered', 'I have an account')}
            variant="primary"
          />
          
          <ActionButton
            icon={<Phone className="w-4 h-4" />}
            label="Guest checkout"
            description="Continue with mobile number"
            onClick={() => handleAction('login-guest', 'Continue as guest')}
            variant="secondary"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {renderActionButtons()}
    </motion.div>
  );
}

// Individual action button component
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  selected?: boolean;
}

function ActionButton({ 
  icon, 
  label, 
  description, 
  onClick, 
  variant = 'secondary',
  disabled = false,
  selected = false
}: ActionButtonProps) {
  const buttonVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  const variantClasses = {
    primary: "text-heybo-primary border-heybo-primary hover:bg-heybo-primary/5",
    secondary: "bg-white/80 backdrop-blur-sm text-heybo-primary border-heybo-border hover:bg-white hover:border-heybo-primary/30",
    accent: "text-heybo-primary border-heybo-secondary hover:bg-heybo-secondary/10"
  };

  const getVariantStyles = () => {
    if (variant === 'primary' && selected) {
      return { 
        background: 'var(--heybo-primary-500)', 
        color: 'var(--heybo-text-inverse)',
        border: 'var(--heybo-border-primary)'
      };
    }
    if (variant === 'accent' && selected) {
      return { 
        background: 'var(--heybo-secondary-500)', 
        color: 'var(--heybo-text-inverse)',
        border: 'var(--heybo-border-secondary)'
      };
    }
    if (disabled) {
      return { 
        background: 'var(--heybo-background-muted)', 
        color: 'var(--heybo-text-muted)',
        border: 'var(--heybo-border-muted)'
      };
    }
    return { 
      background: 'var(--heybo-background-primary)',
      color: 'var(--heybo-text-primary)',
      border: 'var(--heybo-border-default)'
    };
  };

  return (
    <motion.button
      variants={buttonVariants}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 text-left transition-all duration-200",
        "flex items-center space-x-3",
        "focus:outline-none focus:ring-2 focus:ring-[#572021] focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "border backdrop-blur-sm"
      )}
      style={{
        ...getVariantStyles(),
        borderColor: variant === 'accent' ? 'var(--heybo-secondary-500)' : variant === 'primary' ? 'var(--heybo-primary-500)' : 'var(--heybo-border-default)',
        borderRadius: 25,
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: '16px',
        letterSpacing: '-0.03em'
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className={cn(
            "text-xs mt-0.5 opacity-80"
          )}>
            {description}
          </div>
        )}
      </div>
    </motion.button>
  );
}
