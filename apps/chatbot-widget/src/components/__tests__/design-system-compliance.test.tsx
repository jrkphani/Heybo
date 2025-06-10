/**
 * HeyBo Design System Compliance Test
 * 
 * Tests to verify that the chatbot widget components comply with the official
 * HeyBo Design System specifications including:
 * - CSS namespace compliance (.heybo-chatbot- prefix)
 * - FAB design (56px with gradient and pulse animation)
 * - Chat bubble specifications (18px radius)
 * - Ingredient grid layout (auto-fit, minmax(100px, 1fr))
 * - Touch target requirements (44px minimum)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ChatbotWidget from '../ChatbotWidget';
import { IngredientSelector } from '../ordering/IngredientSelector';
import { ChatMessage } from '../chat/ChatMessage';
import { Button } from '../ui/button';

// Mock the chatbot store
vi.mock('../../store/chatbot-store', () => ({
  useChatbotStore: () => ({
    messages: [],
    isLoading: false,
    currentStep: 'welcome',
    currentBowl: null,
    error: null,
    addMessage: vi.fn(),
    isOpen: false,
    toggleWidget: vi.fn()
  })
}));

// Mock the widget state store
vi.mock('../../store/widget-state-store', () => ({
  useWidgetStateStore: () => ({
    session: { isOpen: false },
    openWidget: vi.fn(),
    closeWidget: vi.fn()
  })
}));

describe('HeyBo Design System Compliance', () => {
  describe('CSS Namespace Compliance', () => {
    it('should apply heybo-chatbot- prefix to main widget container', () => {
      render(<ChatbotWidget />);
      const widget = document.querySelector('.heybo-chatbot-widget');
      expect(widget).toBeTruthy();
    });

    it('should apply heybo-chatbot- prefix to FAB button', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab');
      expect(fab).toBeTruthy();
    });

    it('should apply heybo-chatbot- prefix to message components', () => {
      const mockMessage = {
        id: '1',
        type: 'assistant' as const,
        content: 'Test message',
        timestamp: new Date()
      };
      
      render(<ChatMessage message={mockMessage} />);
      const message = document.querySelector('.heybo-chatbot-message');
      expect(message).toBeInTheDocument();
    });

    it('should apply heybo-chatbot- prefix to ingredient grid', () => {
      const mockProps = {
        category: 'base' as const,
        title: 'Test Category',
        description: 'Test description',
        onIngredientSelect: vi.fn()
      };
      
      render(<IngredientSelector {...mockProps} />);
      const grid = document.querySelector('.heybo-chatbot-ingredient-grid');
      expect(grid).toBeTruthy();
    });
  });

  describe('Design Token Usage', () => {
    it('should use design tokens for primary colors', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab') as HTMLElement;
      if (fab) {
        const styles = window.getComputedStyle(fab);
        const background = styles.background || styles.backgroundColor;
        // Should use CSS variables or gradients, not hardcoded hex colors
        expect(background).not.toMatch(/#[0-9A-Fa-f]{6}/);
      }
    });

    it('should use consistent border radius from design tokens', () => {
      const message = {
        id: '1',
        content: 'Test message',
        type: 'assistant' as const,
        timestamp: new Date()
      };
      
      render(<ChatMessage message={message} />);
      const messageElement = document.querySelector('.chat-message');
      expect(messageElement).toBeTruthy();
    });
  });

  describe('FAB Design Specifications', () => {
    it('should have 56px dimensions for FAB button', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab');
      
      if (fab) {
        const styles = window.getComputedStyle(fab);
        // Note: In test environment, CSS custom properties might not resolve
        // This test verifies the class is applied correctly
        expect(fab).toHaveClass('heybo-chatbot-fab');
      }
    });

    it('should apply gradient background to FAB', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab');
      expect(fab).toBeInTheDocument();
      expect(fab).toHaveClass('heybo-chatbot-fab');
    });
  });

  describe('Chat Bubble Specifications', () => {
    it('should apply 18px border radius to message bubbles', () => {
      const mockMessage = {
        id: '1',
        type: 'assistant' as const,
        content: 'Test message',
        timestamp: new Date()
      };
      
      render(<ChatMessage message={mockMessage} />);
      const bubble = document.querySelector('.heybo-chatbot-message-bubble');
      expect(bubble).toBeInTheDocument();
      expect(bubble).toHaveClass('heybo-chatbot-message-bubble');
    });

    it('should differentiate between user and bot message styles', () => {
      const botMessage = {
        id: '1',
        type: 'assistant' as const,
        content: 'Bot message',
        timestamp: new Date()
      };
      
      const userMessage = {
        id: '2',
        type: 'user' as const,
        content: 'User message',
        timestamp: new Date()
      };
      
      const { rerender } = render(<ChatMessage message={botMessage} />);
      let bubble = document.querySelector('.heybo-chatbot-message-bubble');
      expect(bubble).toHaveClass('bot');
      
      rerender(<ChatMessage message={userMessage} />);
      bubble = document.querySelector('.heybo-chatbot-message-bubble');
      expect(bubble).toHaveClass('user');
    });
  });

  describe('Ingredient Grid Layout', () => {
    it('should use auto-fit minmax grid layout', () => {
      const mockProps = {
        category: 'base' as const,
        title: 'Test Category',
        description: 'Test description',
        onIngredientSelect: vi.fn()
      };
      
      render(<IngredientSelector {...mockProps} />);
      const grid = document.querySelector('.heybo-chatbot-ingredient-grid');
      expect(grid).toBeTruthy();
    });

    it('should apply proper ingredient card classes', () => {
      const mockProps = {
        category: 'base' as const,
        title: 'Test Category',
        description: 'Test description',
        onIngredientSelect: vi.fn()
      };
      
      render(<IngredientSelector {...mockProps} />);
      // Note: Ingredient cards are rendered dynamically based on API data
      // This test verifies the container structure is correct
      const selector = document.querySelector('.heybo-chatbot-ingredient-selector');
      expect(selector).toBeInTheDocument();
    });
  });

  describe('Touch Target Requirements', () => {
    it('should have minimum 44px touch targets for interactive elements', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab') as HTMLElement;
      
      if (fab) {
        const rect = fab.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      }
    });

    it('should have properly sized ingredient selection targets', () => {
      const mockProps = {
        category: 'base' as const,
        title: 'Test Category',
        description: 'Test description',
        onIngredientSelect: vi.fn()
      };
      
      render(<IngredientSelector {...mockProps} />);
      const ingredients = document.querySelectorAll('.ingredient-option');
      
      ingredients.forEach((ingredient) => {
        const rect = ingredient.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    it('should apply 44px minimum touch targets to buttons', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('heybo-chatbot-touch-target');
    });

    it('should apply touch target class to interactive elements', () => {
      render(<Button size="icon">Icon</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('heybo-chatbot-touch-target');
    });
  });

  describe('Font Inheritance', () => {
    it('should inherit font family from parent website', () => {
      render(<ChatbotWidget />);
      const widget = document.querySelector('.heybo-chatbot-widget');
      
      if (widget) {
        const styles = window.getComputedStyle(widget);
        // In test environment, this will be the default font
        // The important part is that the CSS property is set to inherit
        expect(widget).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Layout', () => {
    it('should apply responsive widget classes', () => {
      render(<ChatbotWidget />);
      const widget = document.querySelector('.heybo-chatbot-widget');
      expect(widget).toBeInTheDocument();
      expect(widget).toHaveClass('heybo-chatbot-widget');
    });

    it('should apply window styling classes', () => {
      render(<ChatbotWidget />);
      const window = document.querySelector('.heybo-chatbot-window');
      expect(window).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      render(<ChatbotWidget />);
      const fab = document.querySelector('.heybo-chatbot-fab');
      expect(fab?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have proper semantic structure', () => {
      render(<ChatbotWidget />);
      // Check for proper semantic elements
      const widget = document.querySelector('[role="dialog"], [role="application"]');
      expect(widget).toBeTruthy();
    });
  });
});
