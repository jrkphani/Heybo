// Enhanced Create Your Own Flow Component for New Layout System
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Clock,
  Scale,
  AlertCircle,
  Sparkles,
  Plus,
  Minus,
  Heart,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { IngredientSelector } from './IngredientSelector';
import { DietaryPreferences } from './DietaryPreferences';
import { WeightWarningDialog } from './WeightWarningDialog';
import { BowlPreviewV2 } from '../bowl/BowlPreviewV2';
import { apiClient, apiUtils } from '../../lib/api-client';
import { cn } from '../../lib/utils';
import type { 
  IngredientCategory, 
  DietaryRestriction, 
  Allergen,
  HeyBoIngredient,
  BowlComposition,
  Location 
} from '../../types';

interface CreateYourOwnFlowV2Props {
  onBowlComplete?: () => void;
  onAddToCart?: () => void;
  onSaveFavorite?: () => void;
  className?: string;
}

type CYOStep = 
  | 'welcome' 
  | 'dietary-preferences' 
  | 'base' 
  | 'protein' 
  | 'sides' 
  | 'sauce' 
  | 'garnish' 
  | 'review';

interface StepDefinition {
  id: CYOStep;
  title: string;
  description: string;
  required: boolean;
  emoji: string;
  tips: string[];
}

export function CreateYourOwnFlowV2({ 
  onBowlComplete, 
  onAddToCart,
  onSaveFavorite,
  className 
}: CreateYourOwnFlowV2Props) {
  const { 
    currentBowl, 
    user,
    addMessage, 
    setCurrentStep,
    setBowlBase,
    setBowlProtein,
    addBowlSide,
    removeBowlSide,
    setBowlSauce,
    setBowlGarnish,
    calculateBowlWeight,
    calculateBowlPrice,
    validateBowl,
    resetBowl
  } = useChatbotStore();

  const { navigation, navigateToStage } = useLayoutStore();

  const [cyoStep, setCyoStep] = useState<CYOStep>('welcome');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [weightWarningType, setWeightWarningType] = useState<'approaching' | 'exceeded'>('approaching');
  const [selectedSides, setSelectedSides] = useState<HeyBoIngredient[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // API integration state
  const [availableIngredients, setAvailableIngredients] = useState<{
    bases: HeyBoIngredient[];
    proteins: HeyBoIngredient[];
    sides: HeyBoIngredient[];
    sauces: HeyBoIngredient[];
    garnishes: HeyBoIngredient[];
  }>({
    bases: [],
    proteins: [],
    sides: [],
    sauces: [],
    garnishes: []
  });
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [ingredientAvailability, setIngredientAvailability] = useState<Record<string, boolean>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Enhanced step definitions
  const steps: StepDefinition[] = [
    { 
      id: 'welcome', 
      title: 'Welcome to Bowl Builder', 
      description: 'Let\'s create your perfect grain bowl!', 
      required: false,
      emoji: '👋',
      tips: ['Take your time to explore options', 'You can always go back and change selections']
    },
    { 
      id: 'dietary-preferences', 
      title: 'Dietary Preferences', 
      description: 'Tell us about your dietary needs', 
      required: false,
      emoji: '🥗',
      tips: ['This helps us filter ingredients', 'You can skip this step if you prefer']
    },
    { 
      id: 'base', 
      title: 'Choose Your Base', 
      description: 'Select your grain foundation', 
      required: true,
      emoji: '🌾',
      tips: ['Brown rice is our most popular base', 'Quinoa adds extra protein', 'Mix bases for variety']
    },
    { 
      id: 'protein', 
      title: 'Add Protein', 
      description: 'Pick your protein source', 
      required: false,
      emoji: '🥩',
      tips: ['Grilled chicken is a classic choice', 'Try tofu for plant-based protein', 'Double protein for extra satisfaction']
    },
    { 
      id: 'sides', 
      title: 'Select Sides', 
      description: 'Choose up to 3 delicious sides', 
      required: false,
      emoji: '🥕',
      tips: ['Mix colors for nutrition', 'Roasted vegetables add great flavor', 'Fresh options provide crunch']
    },
    { 
      id: 'sauce', 
      title: 'Pick Your Sauce', 
      description: 'Add flavor with the perfect sauce', 
      required: false,
      emoji: '🥄',
      tips: ['Tahini is our signature sauce', 'Spicy options add heat', 'Light sauces keep it fresh']
    },
    { 
      id: 'garnish', 
      title: 'Add Finishing Touch', 
      description: 'Complete with a garnish', 
      required: false,
      emoji: '✨',
      tips: ['Fresh herbs brighten the bowl', 'Seeds add texture', 'Keep it simple or go bold']
    },
    { 
      id: 'review', 
      title: 'Review Your Bowl', 
      description: 'Final review and customization', 
      required: false,
      emoji: '👀',
      tips: ['Check the weight and price', 'Make any final adjustments', 'Save as favorite for next time']
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === cyoStep);
  const currentStepData = steps[currentStepIndex]!;
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  // Weight checking constants
  const MAX_WEIGHT = 900; // grams
  const WARNING_THRESHOLD = 720; // 80% of max weight

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  // Update navigation state when step changes
  useEffect(() => {
    if (cyoStep === 'welcome') {
      navigateToStage('welcome', 'bowl-building');
    } else if (cyoStep === 'review') {
      navigateToStage('review', 'bowl-building');
    } else {
      navigateToStage('building', 'bowl-building');
    }
  }, [cyoStep, navigateToStage]);

  const initializeData = async () => {
    try {
      // Get session ID from localStorage or create new session
      let storedSessionId = localStorage.getItem('heybo_session_id');
      if (!storedSessionId && user) {
        const session = await apiClient.session.create(user.id);
        storedSessionId = session.sessionId;
        localStorage.setItem('heybo_session_id', storedSessionId);
      }
      setSessionId(storedSessionId);

      // Load location and ingredients
      await loadLocationAndIngredients();
    } catch (error) {
      console.error('Failed to initialize data:', error);
      // Continue with empty state - user can still build bowl without API data
    }
  };

  const loadLocationAndIngredients = async () => {
    setLoadingIngredients(true);
    try {
      // Get user's location (for now, use first available location)
      const locations = await apiClient.locations.getAll();
             const selectedLocation = locations[0] || null; // In real app, this would be user-selected
       setCurrentLocation(selectedLocation);

      if (selectedLocation) {
        // Load ingredients for each category
        const [bases, proteins, sides, sauces, garnishes] = await Promise.all([
          apiClient.ingredients.getAll(selectedLocation.id, 'base'),
          apiClient.ingredients.getAll(selectedLocation.id, 'protein'),
          apiClient.ingredients.getAll(selectedLocation.id, 'sides'),
          apiClient.ingredients.getAll(selectedLocation.id, 'sauce'),
          apiClient.ingredients.getAll(selectedLocation.id, 'garnish')
        ]);

        setAvailableIngredients({
          bases,
          proteins,
          sides,
          sauces,
          garnishes
        });

        // Check availability for all ingredients
        const allIngredientIds = [
          ...bases.map(i => i.id),
          ...proteins.map(i => i.id),
          ...sides.map(i => i.id),
          ...sauces.map(i => i.id),
          ...garnishes.map(i => i.id)
        ];

        if (allIngredientIds.length > 0) {
          const availability = await apiClient.ingredients.checkAvailability(
            allIngredientIds, 
            selectedLocation.id
          );
          setIngredientAvailability(availability);
        }

        console.log('✅ Loaded ingredients for location:', selectedLocation.name);
      }
    } catch (error) {
      console.error('Failed to load ingredients:', error);
      // Show user-friendly error but don't block the flow
      addMessage({
        content: 'Unable to load fresh ingredient data. Using cached options.',
        type: 'assistant'
      });
    } finally {
      setLoadingIngredients(false);
    }
  };

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

  const handleStart = () => {
    addMessage({
      content: 'I want to create my own bowl',
      type: 'user'
    });

    addMessage({
      content: 'Perfect! Let\'s build your custom grain bowl step by step.',
      type: 'assistant'
    });

    setCyoStep('dietary-preferences');
  };

  const handleSkipDietary = () => {
    addMessage({
      content: 'Skip dietary preferences',
      type: 'user'
    });

    addMessage({
      content: 'No worries! We\'ll show you all available options.',
      type: 'assistant'
    });

    setCyoStep('base');
  };

  const handleDietaryPreferencesComplete = (restrictions: DietaryRestriction[], allergenList: Allergen[]) => {
    setDietaryRestrictions(restrictions);
    setAllergens(allergenList);

    const restrictionText = restrictions.length > 0 
      ? restrictions.join(', ') 
      : 'No dietary restrictions';
    
    const allergenText = allergenList.length > 0 
      ? allergenList.join(', ') 
      : 'No allergens';

    addMessage({
      content: `Dietary preferences: ${restrictionText}. Allergens to avoid: ${allergenText}`,
      type: 'user'
    });

    addMessage({
      content: 'Got it! I\'ll filter ingredients based on your preferences. Let\'s start with choosing your base.',
      type: 'assistant'
    });

    setCyoStep('base');
  };

  const handleIngredientSelect = async (ingredient: HeyBoIngredient, category: IngredientCategory) => {
    // Check availability first
    if (currentLocation && !ingredientAvailability[ingredient.id]) {
      addMessage({
        content: `Sorry, ${ingredient.name} is currently unavailable at this location.`,
        type: 'assistant'
      });
      return;
    }

    const wasAlreadySelected = currentBowl && currentBowl[category] === ingredient;

    switch (category) {
      case 'base':
        setBowlBase(ingredient);
        break;
      case 'protein':
        setBowlProtein(ingredient);
        break;
      case 'sauce':
        setBowlSauce(ingredient);
        break;
      case 'garnish':
        setBowlGarnish(ingredient);
        break;
      case 'sides':
        const currentSides = selectedSides;
        if (currentSides.find(s => s.id === ingredient.id)) {
          // Remove if already selected
          const newSides = currentSides.filter(s => s.id !== ingredient.id);
          setSelectedSides(newSides);
          removeBowlSide(ingredient.id);
        } else if (currentSides.length < 3) {
          // Add if under limit
          const newSides = [...currentSides, ingredient];
          setSelectedSides(newSides);
          addBowlSide(ingredient);
        } else {
          addMessage({
            content: 'You can only select up to 3 sides. Please remove one first.',
            type: 'assistant'
          });
          return;
        }
        break;
    }

    // Check weight warning
    if (!checkWeightWarning()) {
      // Add user message for ingredient selection
      if (!wasAlreadySelected) {
        addMessage({
          content: `Add ${ingredient.name}`,
          type: 'user'
        });

        addMessage({
          content: `Great choice! ${ingredient.name} has been added to your bowl.`,
          type: 'assistant'
        });
      }
    }
  };

  const handleRemoveSide = (sideId: string) => {
    const newSides = selectedSides.filter(s => s.id !== sideId);
    setSelectedSides(newSides);
    removeBowlSide(sideId);
  };

  const handleNext = () => {
    const nextStepIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCyoStep(steps[nextStepIndex]!.id);
  };

  const handleBack = () => {
    const prevStepIndex = Math.max(currentStepIndex - 1, 0);
    setCyoStep(steps[prevStepIndex]!.id);
  };

  const handleComplete = async () => {
         const validation = validateBowl();
     
     if (!validation.isValid) {
       addMessage({
         content: validation.warnings[0] || 'Please complete your bowl before adding to cart.',
         type: 'assistant'
       });
       return;
     }

    setIsCompleting(true);

    try {
      // Add to cart using API
      if (sessionId && currentLocation && currentBowl && currentBowl.id) {
        // Ensure we have a complete BowlComposition
        const completeBowl: BowlComposition = {
          id: currentBowl.id,
          name: currentBowl.name || 'Custom Bowl',
          description: currentBowl.description || 'Your custom creation',
          base: currentBowl.base!,
          protein: currentBowl.protein,
          sides: currentBowl.sides || [],
          extraSides: currentBowl.extraSides || [],
          extraProtein: currentBowl.extraProtein || [],
          sauce: currentBowl.sauce,
          garnish: currentBowl.garnish,
          totalWeight: currentBowl.totalWeight || calculateBowlWeight(),
          totalPrice: currentBowl.totalPrice || calculateBowlPrice(),
          isSignature: currentBowl.isSignature || false,
          imageUrl: currentBowl.imageUrl,
          tags: currentBowl.tags || [],
          prepTime: currentBowl.prepTime || '5-7 mins',
          calories: currentBowl.calories || 400
        };

        const result = await apiClient.cart.add(sessionId, completeBowl);
        
        if (result.success) {
          addMessage({
            content: 'Perfect! Your custom bowl is ready.',
            type: 'assistant'
          });

          addMessage({
            content: `Bowl added to cart! Total: ${apiUtils.formatPrice(result.cartTotal)}`,
            type: 'assistant'
          });

          if (onAddToCart) {
            onAddToCart();
          }
        } else {
          throw new Error('Failed to add to cart');
        }
      } else {
        // Fallback without API
        addMessage({
          content: 'Perfect! Your custom bowl is ready.',
          type: 'assistant'
        });
        
        if (onBowlComplete) {
          onBowlComplete();
        }
      }
    } catch (error) {
      console.error('Failed to complete bowl:', error);
      addMessage({
        content: 'There was an issue adding your bowl to the cart. Please try again.',
        type: 'assistant'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSaveFavorite = async () => {
    if (!user) {
      addMessage({
        content: 'Please log in to save favorites.',
        type: 'assistant'
      });
      return;
    }

    try {
      if (!currentBowl || !currentBowl.id) {
        throw new Error('Bowl is incomplete');
      }

      const bowlName = `My Custom Bowl - ${new Date().toLocaleDateString()}`;

      // Ensure we have a complete BowlComposition
      const completeBowl: BowlComposition = {
        id: currentBowl.id,
        name: currentBowl.name || bowlName,
        description: currentBowl.description || 'Your custom creation',
        base: currentBowl.base!,
        protein: currentBowl.protein,
        sides: currentBowl.sides || [],
        extraSides: currentBowl.extraSides || [],
        extraProtein: currentBowl.extraProtein || [],
        sauce: currentBowl.sauce,
        garnish: currentBowl.garnish,
        totalWeight: currentBowl.totalWeight || calculateBowlWeight(),
        totalPrice: currentBowl.totalPrice || calculateBowlPrice(),
        isSignature: currentBowl.isSignature || false,
        imageUrl: currentBowl.imageUrl,
        tags: currentBowl.tags || [],
        prepTime: currentBowl.prepTime || '5-7 mins',
        calories: currentBowl.calories || 400
      };

      const result = await apiClient.favorites.add(user.id, completeBowl, bowlName);
      
      if (result.success) {
        addMessage({
          content: 'Bowl saved to your favorites!',
          type: 'assistant'
        });
        
        if (onSaveFavorite) {
          onSaveFavorite();
        }
      } else {
        throw new Error('Failed to save favorite');
      }
    } catch (error) {
      console.error('Failed to save favorite:', error);
      addMessage({
        content: 'Unable to save favorite right now. Please try again later.',
        type: 'assistant'
      });
    }
  };

  const getBowlCompletionStatus = () => {
    if (!currentBowl) return { isComplete: false, missingComponents: [] };
    
    const requiredComponents = ['base'];
    const optionalComponents = ['protein', 'sides', 'sauce', 'garnish'];
    
    const missingRequired = requiredComponents.filter(component => !currentBowl[component as keyof BowlComposition]);
    const hasOptional = optionalComponents.some(component => {
      const value = currentBowl[component as keyof BowlComposition];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });
    
    return {
      isComplete: missingRequired.length === 0,
      hasOptional,
      missingComponents: missingRequired
    };
  };

  const handleStartOver = () => {
    setCyoStep('welcome');
    resetBowl();
    setDietaryRestrictions([]);
    setAllergens([]);
  };

  const canProceed = () => {
    const status = getBowlCompletionStatus();
    return status.isComplete;
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="text-6xl mb-4">🥣</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Create Your Perfect Bowl
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Build a custom grain bowl with fresh ingredients tailored to your taste preferences and dietary needs.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={handleStart}
          className="w-full bg-heybo-primary text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
        >
          <ChefHat className="w-5 h-5 mr-2" />
          Start Building
        </button>
        
        <div className="text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              5-7 mins prep
            </span>
            <span className="flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              Fresh ingredients
            </span>
          </div>
          <p>Endless combinations • Made fresh daily</p>
        </div>
      </div>
    </motion.div>
  );

  const renderProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Bowl Building Progress</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div 
          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={cn(
              "flex flex-col items-center text-xs",
              index <= currentStepIndex ? "text-orange-600" : "text-gray-400"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-xs",
              index <= currentStepIndex 
                ? "bg-orange-100 text-orange-600" 
                : "bg-gray-100 text-gray-400"
            )}>
              {index < currentStepIndex ? (
                <Check className="w-3 h-3" />
              ) : (
                step.emoji
              )}
            </div>
            <span className="hidden sm:block">{step.title.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepHeader = () => (
    <motion.div
      key={cyoStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6"
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3">{currentStepData.emoji}</span>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {currentStepData.description}
          </p>
        </div>
      </div>
      
      {currentStepData.tips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <div className="flex items-start">
            <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-1">Pro Tips:</div>
              <ul className="text-blue-700 space-y-1">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStepContent = () => {
    switch (cyoStep) {
      case 'welcome':
        return renderWelcomeStep();
        
      case 'dietary-preferences':
        return (
          <div className="space-y-4">
            <DietaryPreferences
              onComplete={handleDietaryPreferencesComplete}
              className="mb-4"
            />
            <button
              onClick={handleSkipDietary}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Skip for now
            </button>
          </div>
        );
      
      case 'sides':
        return (
          <div className="space-y-4">
            <IngredientSelector
              category="sides"
              title="Choose Your Sides"
              description="Select up to 3 delicious sides for your bowl"
              onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, 'sides')}
              dietaryRestrictions={dietaryRestrictions}
              allergens={allergens}
              multiple={true}
              maxSelections={3}
            />
            
            {selectedSides.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Selected Sides:</h4>
                <div className="space-y-2">
                  {selectedSides.map((side) => (
                    <div key={side.id} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="text-sm font-medium">{side.name}</span>
                      <button
                        onClick={() => handleRemoveSide(side.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'review':
        const { isComplete, hasOptional, missingComponents } = getBowlCompletionStatus();
        
        return (
          <div className="space-y-6">
            {/* Bowl Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Your Bowl Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium ml-2">{calculateBowlWeight()}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium ml-2">${(calculateBowlPrice() / 100).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="font-medium ml-2">5-7 mins</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={cn(
                    "font-medium ml-2",
                    isComplete ? "text-green-600" : "text-amber-600"
                  )}>
                    {isComplete ? "Complete" : "Needs base"}
                  </span>
                </div>
              </div>
            </div>

            {/* Completion Status */}
            {!isComplete && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-amber-800">Bowl Incomplete</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      You need to select: {missingComponents.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleComplete}
                disabled={!isComplete || isCompleting}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all",
                  isComplete
                    ? "bg-heybo-primary text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
              >
                {isCompleting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <ShoppingCart className="w-5 h-5 mr-2" />
                )}
                {isCompleting ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
              
              {isComplete && (
                <button
                  onClick={handleSaveFavorite}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Save as Favorite
                </button>
              )}
              
              <button
                onClick={handleStartOver}
                className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Start Over
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <IngredientSelector
            category={cyoStep as IngredientCategory}
            title={cyoStep === 'base' ? 'Choose Your Base' : cyoStep === 'protein' ? 'Add Protein' : cyoStep === 'sauce' ? 'Pick Your Sauce' : 'Add Garnish'}
            description={cyoStep === 'base' ? 'Start with your grain foundation' : cyoStep === 'protein' ? 'Power up your bowl' : cyoStep === 'sauce' ? 'Add flavor and moisture' : 'Finish with fresh toppings'}
            onIngredientSelect={(ingredient) => handleIngredientSelect(ingredient, cyoStep as IngredientCategory)}
            dietaryRestrictions={dietaryRestrictions}
            allergens={allergens}
          />
        );
    }
  };

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header with Progress */}
      {cyoStep !== 'welcome' && (
        <div className="p-6 border-b border-gray-200">
          {renderProgressIndicator()}
          {renderStepHeader()}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={cn(
          "p-6",
          cyoStep === 'welcome' && "flex items-center justify-center h-full"
        )}>
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Controls */}
      {cyoStep !== 'welcome' && cyoStep !== 'review' && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                currentStepIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                canProceed()
                  ? "bg-heybo-primary text-white hover:bg-orange-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Weight Warning Dialog */}
      <WeightWarningDialog
        isOpen={showWeightWarning}
        onClose={() => setShowWeightWarning(false)}
        warningType={weightWarningType}
        currentWeight={calculateBowlWeight()}
        maxWeight={MAX_WEIGHT}
        bowl={currentBowl || {}}
        onContinue={() => setShowWeightWarning(false)}
        onModify={() => {
          setShowWeightWarning(false);
          // Could navigate back to a previous step or open modification view
        }}
      />
    </div>
  );
} 