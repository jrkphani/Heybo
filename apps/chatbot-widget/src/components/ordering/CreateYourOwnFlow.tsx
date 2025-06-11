'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { IngredientSelector } from './IngredientSelector';
import { DietaryPreferences } from './DietaryPreferences';
import { WeightWarningDialog } from './WeightWarningDialog';
import { cn } from '../../lib/utils';
import type { IngredientCategory, DietaryRestriction, Allergen } from '../../types';

interface CreateYourOwnFlowProps {
  onBowlComplete: () => void;
  className?: string;
}

type CYOStep = 'dietary-preferences' | 'base' | 'protein' | 'sides' | 'sauce' | 'garnish' | 'review';

export function CreateYourOwnFlow({ onBowlComplete, className }: CreateYourOwnFlowProps) {
  const { 
    currentBowl, 
    addMessage, 
    setCurrentStep,
    setBowlBase,
    setBowlProtein,
    addBowlSide,
    setBowlSauce,
    setBowlGarnish,
    calculateBowlWeight,
    calculateBowlPrice,
    validateBowl
  } = useChatbotStore();

  const [cyoStep, setCyoStep] = useState<CYOStep>('dietary-preferences');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [weightWarningType, setWeightWarningType] = useState<'approaching' | 'exceeded'>('approaching');

  const steps: { id: CYOStep; title: string; description: string; required: boolean }[] = [
    { id: 'dietary-preferences', title: 'Dietary Preferences', description: 'Tell us about your dietary needs', required: false },
    { id: 'base', title: 'Choose Base', description: 'Select your grain foundation', required: true },
    { id: 'protein', title: 'Add Protein', description: 'Pick your protein (optional)', required: false },
    { id: 'sides', title: 'Select Sides', description: 'Choose up to 3 sides', required: false },
    { id: 'sauce', title: 'Pick Sauce', description: 'Add flavor with sauce', required: false },
    { id: 'garnish', title: 'Add Garnish', description: 'Finish with garnish', required: false },
    { id: 'review', title: 'Review Bowl', description: 'Final review and customization', required: false }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === cyoStep);
  const currentStepData = steps[currentStepIndex]!;

  // Weight checking constants
  const MAX_WEIGHT = 900; // grams
  const WARNING_THRESHOLD = 720; // 80% of max weight

  const checkWeightWarning = () => {
    const currentWeight = calculateBowlWeight();

    if (currentWeight >= MAX_WEIGHT) {
      setWeightWarningType('exceeded');
      setShowWeightWarning(true);
      return true;
    } else if (currentWeight >= WARNING_THRESHOLD) {
      setWeightWarningType('approaching');
      setShowWeightWarning(true);
      return true;
    }

    return false;
  };

  const handleDietaryPreferencesComplete = (restrictions: DietaryRestriction[], allergenList: Allergen[]) => {
    setDietaryRestrictions(restrictions);
    setAllergens(allergenList);
    
    addMessage({
      content: `I have ${restrictions.length > 0 ? restrictions.join(', ') : 'no'} dietary restrictions and ${allergenList.length > 0 ? allergenList.join(', ') : 'no'} allergies`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: 'Perfect! I\'ll filter ingredients based on your preferences. Let\'s start with your base.',
        type: 'assistant'
      });
      setCyoStep('base');
    }, 500);
  };

  const handleIngredientSelect = (ingredient: any, category: IngredientCategory) => {
    switch (category) {
      case 'base':
        setBowlBase(ingredient);
        addMessage({
          content: `I'll have ${ingredient.name} as my base`,
          type: 'user'
        });
        setTimeout(() => {
          addMessage({
            content: `Great choice! ${ingredient.name} is a nutritious base. Now let's add some protein.`,
            type: 'assistant'
          });
          setCyoStep('protein');
        }, 500);
        break;
      
      case 'protein':
        setBowlProtein(ingredient);
        addMessage({
          content: `Add ${ingredient.name} as my protein`,
          type: 'user'
        });
        setTimeout(() => {
          addMessage({
            content: `Excellent! ${ingredient.name} will add great flavor. Let's choose some sides.`,
            type: 'assistant'
          });
          setCyoStep('sides');
        }, 500);
        break;
      
      case 'sides':
        addBowlSide(ingredient);
        addMessage({
          content: `Add ${ingredient.name} to my bowl`,
          type: 'user'
        });

        // Check weight after adding side
        setTimeout(() => {
          checkWeightWarning();
        }, 100);

        // Don't auto-advance for sides since they can select multiple
        break;
      
      case 'sauce':
        setBowlSauce(ingredient);
        addMessage({
          content: `I'll have ${ingredient.name} sauce`,
          type: 'user'
        });
        setTimeout(() => {
          addMessage({
            content: `Perfect! ${ingredient.name} will tie everything together. Let's add a garnish to finish.`,
            type: 'assistant'
          });
          setCyoStep('garnish');
        }, 500);
        break;
      
      case 'garnish':
        setBowlGarnish(ingredient);
        addMessage({
          content: `Finish with ${ingredient.name}`,
          type: 'user'
        });
        setTimeout(() => {
          addMessage({
            content: `Beautiful! Your bowl is complete. Let's review your creation.`,
            type: 'assistant'
          });
          setCyoStep('review');
        }, 500);
        break;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        setCyoStep(nextStep.id);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) {
        setCyoStep(prevStep.id);
      }
    }
  };

  const handleComplete = () => {
    addMessage({
      content: 'My bowl looks perfect! Add it to cart.',
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: 'Awesome! Your custom bowl has been added to your cart. Would you like to add more items or proceed to checkout?',
        type: 'assistant'
      });
      setCurrentStep('cart-review');
      onBowlComplete();
    }, 500);
  };

  const renderStepContent = () => {
    switch (cyoStep) {
      case 'dietary-preferences':
        return (
          <DietaryPreferences className="heybo-chatbot-cyo-flow"
            onComplete={handleDietaryPreferencesComplete}
            initialRestrictions={dietaryRestrictions}
            initialAllergens={allergens}
          />
        );
      
      case 'base':
        return (
          <IngredientSelector
            category="base"
            title="Choose Your Base"
            description="Select the foundation for your bowl"
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'base')}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
            required={true}
          />
        );
      
      case 'protein':
        return (
          <IngredientSelector
            category="protein"
            title="Add Protein"
            description="Choose your protein (optional)"
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'protein')}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
            required={false}
          />
        );
      
      case 'sides':
        return (
          <IngredientSelector
            category="sides"
            title="Select Sides"
            description="Choose up to 3 sides to complete your bowl"
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'sides')}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
            required={false}
            multiple={true}
            maxSelections={3}
          />
        );
      
      case 'sauce':
        return (
          <IngredientSelector
            category="sauce"
            title="Pick Your Sauce"
            description="Add flavor with your choice of sauce"
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'sauce')}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
            required={false}
          />
        );
      
      case 'garnish':
        return (
          <IngredientSelector
            category="garnish"
            title="Add Garnish"
            description="Finish your bowl with a garnish"
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'garnish')}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
            required={false}
          />
        );
      
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Bowl</h3>
              <p className="text-gray-600">Your custom creation is ready!</p>
            </div>
            
            {/* Bowl summary would go here */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🥣</div>
                <div className="font-medium text-gray-900">Your Custom Bowl</div>
                <div className="text-sm text-gray-600 mt-1">
                  Weight: {calculateBowlWeight()}g | Price: ${(calculateBowlPrice() / 100).toFixed(2)}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleComplete}
              className="w-full bg-[var(--heybo-primary-600)] text-white py-3 rounded-lg font-medium hover:bg-[var(--heybo-primary-700)] transition-colors"
            >
              Add to Cart
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Weight Warning Dialog */}
      <WeightWarningDialog
        isOpen={showWeightWarning}
        currentWeight={calculateBowlWeight()}
        maxWeight={MAX_WEIGHT}
        bowl={currentBowl || {}}
        warningType={weightWarningType}
        onContinue={() => setShowWeightWarning(false)}
        onModify={() => {
          setShowWeightWarning(false);
          // Could navigate to review step or specific ingredient removal
        }}
        onClose={() => setShowWeightWarning(false)}
      />

      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-[var(--heybo-primary-600)]" />
            <h2 className="font-semibold text-gray-900">Create Your Own</h2>
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[var(--heybo-primary-600)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Current Step Info */}
        <div className="mt-3">
          <div className="font-medium text-gray-900">{currentStepData.title}</div>
          <div className="text-sm text-gray-600">{currentStepData.description}</div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={cyoStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {cyoStep !== 'dietary-preferences' && cyoStep !== 'review' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
