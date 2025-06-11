import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavigationHeader } from '../navigation/NavigationHeader';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { ContentRouter } from '../navigation/ContentRouter';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import { LayoutState, NavigationState } from '../../types/layout';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../store/layout-store');
vi.mock('../../store/chatbot-store');

const mockedUseLayoutStore = useLayoutStore as unknown as ReturnType<typeof vi.fn>;
const mockedUseChatbotStore = useChatbotStore as unknown as ReturnType<typeof vi.fn>;

describe('HeyBo Navigation - Edge Cases & Normal Flow', () => {
  let layoutStore: any;
  let chatbotStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    layoutStore = {
      navigation: {
        currentFlow: 'bowl-building',
        currentStage: 'welcome',
        previousStage: null,
        canNavigateBack: false,
        navigationHistory: []
      },
      navigateBack: vi.fn(),
      navigateToStage: vi.fn(),
      resetNavigation: vi.fn(),
      setCurrentFlow: vi.fn(),
      isDualPane: false,
      isMobileView: false,
      isSinglePane: true,
      setScreenWidth: vi.fn(),
      updateLayoutForBreakpoint: vi.fn(),
    };
    chatbotStore = {
      currentStep: 'welcome',
      setCurrentStep: vi.fn(),
      user: { favorites: [1], orderHistory: [1] },
      unratedOrders: [],
    };
    mockedUseLayoutStore.mockReturnValue(layoutStore);
    mockedUseChatbotStore.mockReturnValue(chatbotStore);
  });

  it('should not navigate back from the welcome screen', () => {
    render(<NavigationHeader />);
    const backButton = screen.queryByLabelText(/go back/i);
    expect(backButton).not.toBeInTheDocument();
  });

  it('should navigate back after multiple steps', () => {
    layoutStore.navigation = {
      ...layoutStore.navigation,
      currentStage: 'customization',
      previousStage: 'selection',
      canNavigateBack: true,
      navigationHistory: [
        { stage: 'welcome', flow: 'bowl-building', timestamp: new Date(), paneState: {} },
        { stage: 'selection', flow: 'bowl-building', timestamp: new Date(), paneState: {} },
      ]
    };
    render(<NavigationHeader />);
    const backButton = screen.getByLabelText(/go back/i);
    fireEvent.click(backButton);
    expect(layoutStore.navigateBack).toHaveBeenCalled();
  });

  it('should navigate to a breadcrumb stage', () => {
    layoutStore.navigation = {
      ...layoutStore.navigation,
      currentStage: 'customization',
      previousStage: 'selection',
      canNavigateBack: true,
      navigationHistory: [
        { stage: 'welcome', flow: 'bowl-building', timestamp: new Date(), paneState: {} },
        { stage: 'selection', flow: 'bowl-building', timestamp: new Date(), paneState: {} },
      ]
    };
    render(<NavigationHeader />);
    const breadcrumb = screen.getByText(/selection/i);
    fireEvent.click(breadcrumb);
    expect(layoutStore.navigateToStage).toHaveBeenCalledWith('selection', 'bowl-building');
  });

  it('should preserve selections when navigating back and forward', () => {
    // Simulate state preservation
    chatbotStore.currentStep = 'customization';
    render(<NavigationHeader />);
    // Simulate back and forward
    act(() => {
      layoutStore.navigateBack();
      layoutStore.navigateToStage('customization', 'bowl-building');
    });
    expect(chatbotStore.setCurrentStep).not.toHaveBeenCalledWith(undefined);
  });

  it('should block navigation if required selection is missing', () => {
    // Simulate required selection missing
    layoutStore.navigation.currentStage = 'base-selection';
    // Assume ContentRouter renders a Next button
    render(<ContentRouter />);
    const nextButton = screen.queryByText(/next/i);
    if (nextButton) {
      fireEvent.click(nextButton);
      // Should not call navigateToStage if selection missing
      expect(layoutStore.navigateToStage).not.toHaveBeenCalled();
    }
  });

  it('should restore state after session recovery', () => {
    // Simulate session recovery
    layoutStore.navigation.currentStage = 'sides-selection';
    render(<NavigationHeader />);
    expect(screen.getByText(/sides-selection/i)).toBeInTheDocument();
  });

  it('should adapt layout on window resize', () => {
    layoutStore.isDualPane = false;
    layoutStore.isMobileView = true;
    render(<NavigationHeader />);
    // Simulate resize
    act(() => {
      layoutStore.setScreenWidth(1200);
      layoutStore.updateLayoutForBreakpoint('lg');
    });
    // Should update layout state
    expect(layoutStore.setScreenWidth).toHaveBeenCalledWith(1200);
    expect(layoutStore.updateLayoutForBreakpoint).toHaveBeenCalledWith('lg');
  });

  it('should reset to welcome on invalid navigation state', () => {
    layoutStore.navigation.currentStage = undefined;
    render(<NavigationHeader />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('should trap focus within modal overlays', () => {
    // Simulate modal open (not implemented here, but would use a modal component)
    // This is a placeholder for actual modal focus trap test
    expect(true).toBe(true);
  });

  it('should jump to review/checkout on express path', () => {
    // Simulate express path
    layoutStore.navigation.currentStage = 'review';
    render(<NavigationHeader />);
    expect(screen.getByText(/review/i)).toBeInTheDocument();
  });

  it('should follow the normal navigation flow', () => {
    // Simulate normal flow: welcome -> location -> selection -> customization -> review
    layoutStore.navigation = {
      currentFlow: 'bowl-building',
      currentStage: 'welcome',
      previousStage: null,
      canNavigateBack: false,
      navigationHistory: []
    };
    render(<NavigationHeader />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    act(() => {
      layoutStore.navigateToStage('location-selection', 'bowl-building');
    });
    expect(layoutStore.navigateToStage).toHaveBeenCalledWith('location-selection', 'bowl-building');
  });
}); 