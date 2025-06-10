// Mock data for HeyBo Chatbot Widget
import type {
  HeyBoIngredient,
  BowlComposition,
  Location,
  User,
  RecentOrder,
  FavoriteItem,
  MLRecommendation
} from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+65 9123 4567",
    type: "registered",
    preferences: {
      dietaryRestrictions: ["vegetarian"],
      allergens: ["nuts"],
      spiceLevel: "medium",
      proteinPreference: "plant-based"
    },
    lastOrderedLocation: "location-1"
  },
  {
    id: "user-2", 
    name: "Guest User",
    phone: "+65 8765 4321",
    type: "guest",
    preferences: {
      dietaryRestrictions: [],
      allergens: ["dairy"],
      spiceLevel: "mild",
      proteinPreference: "any"
    }
  }
];

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: "location-1",
    name: "Marina Bay Sands",
    address: "10 Bayfront Ave, Singapore 018956",
    type: "outlet",
    coordinates: { lat: 1.2834, lng: 103.8607 },
    operatingHours: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "22:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "08:00", close: "21:00" }
    },
    isActive: true,
    estimatedWaitTime: "5-7 mins"
  },
  {
    id: "location-2",
    name: "Raffles Place MRT",
    address: "6 Raffles Quay, Singapore 048580",
    type: "station",
    coordinates: { lat: 1.2840, lng: 103.8520 },
    operatingHours: {
      monday: { open: "06:30", close: "23:00" },
      tuesday: { open: "06:30", close: "23:00" },
      wednesday: { open: "06:30", close: "23:00" },
      thursday: { open: "06:30", close: "23:00" },
      friday: { open: "06:30", close: "23:00" },
      saturday: { open: "07:00", close: "23:00" },
      sunday: { open: "07:00", close: "22:00" }
    },
    isActive: true,
    estimatedWaitTime: "3-5 mins"
  },
  {
    id: "location-3",
    name: "Orchard Central",
    address: "181 Orchard Rd, Singapore 238896",
    type: "outlet",
    coordinates: { lat: 1.3006, lng: 103.8400 },
    operatingHours: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "10:00", close: "21:00" }
    },
    isActive: true,
    estimatedWaitTime: "6-8 mins"
  }
];

// Mock Ingredients - Bases
export const mockBases: HeyBoIngredient[] = [
  {
    id: "base-1",
    name: "Brown Rice",
    category: "base",
    subcategory: "grains",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 150,
      protein: 3,
      carbs: 31,
      fat: 1,
      fiber: 2,
      sodium: 5
    },
    weight: 120,
    price: 0, // Base price included
    description: "Nutty, wholesome brown rice - our signature base",
    imageUrl: "/ingredients/brown-rice.jpg"
  },
  {
    id: "base-2", 
    name: "Tri-Colour Quinoa",
    category: "base",
    subcategory: "grains",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 180,
      protein: 6,
      carbs: 32,
      fat: 3,
      fiber: 3,
      sodium: 8
    },
    weight: 100,
    price: 200, // +$2.00
    description: "Protein-packed superfood quinoa blend",
    imageUrl: "/ingredients/quinoa.jpg"
  },
  {
    id: "base-3",
    name: "Cauliflower Lentil Rice", 
    category: "base",
    subcategory: "grains",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 120,
      protein: 5,
      carbs: 20,
      fat: 2,
      fiber: 4,
      sodium: 10
    },
    weight: 110,
    price: 150, // +$1.50
    description: "Low-carb cauliflower rice with protein-rich lentils",
    imageUrl: "/ingredients/cauliflower-lentil-rice.jpg"
  }
];

// Mock Proteins
export const mockProteins: HeyBoIngredient[] = [
  {
    id: "protein-1",
    name: "Roasted Lemongrass Chicken",
    category: "protein",
    subcategory: "poultry",
    isAvailable: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 180,
      protein: 25,
      carbs: 2,
      fat: 8,
      fiber: 0,
      sodium: 320
    },
    weight: 80,
    price: 0, // Included in base price
    description: "Tender chicken marinated in aromatic lemongrass",
    imageUrl: "/ingredients/lemongrass-chicken.jpg"
  },
  {
    id: "protein-2",
    name: "Char-Grilled Steak",
    category: "protein", 
    subcategory: "beef",
    isAvailable: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 220,
      protein: 28,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 280
    },
    weight: 85,
    price: 300, // +$3.00
    description: "Premium beef steak, perfectly char-grilled",
    imageUrl: "/ingredients/char-grilled-steak.jpg"
  },
  {
    id: "protein-3",
    name: "Baked Salmon",
    category: "protein",
    subcategory: "seafood", 
    isAvailable: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ["fish"],
    nutritionalInfo: {
      calories: 200,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 250
    },
    weight: 75,
    price: 350, // +$3.50
    description: "Fresh Atlantic salmon, oven-baked to perfection",
    imageUrl: "/ingredients/baked-salmon.jpg"
  },
  {
    id: "protein-4",
    name: "Falafels",
    category: "protein",
    subcategory: "plant-based",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ["gluten"],
    nutritionalInfo: {
      calories: 160,
      protein: 8,
      carbs: 15,
      fat: 9,
      fiber: 4,
      sodium: 180
    },
    weight: 70,
    price: 0, // Included in base price
    description: "Crispy Mediterranean chickpea falafels",
    imageUrl: "/ingredients/falafels.jpg"
  }
];

// Mock Sides
export const mockSides: HeyBoIngredient[] = [
  {
    id: "side-1",
    name: "Roasted Pumpkin Wedge",
    category: "sides",
    subcategory: "vegetables",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 45,
      protein: 1,
      carbs: 11,
      fat: 0,
      fiber: 3,
      sodium: 5
    },
    weight: 60,
    price: 0,
    description: "Sweet roasted pumpkin with herbs",
    imageUrl: "/ingredients/roasted-pumpkin.jpg"
  },
  {
    id: "side-2",
    name: "Charred Corn",
    category: "sides",
    subcategory: "vegetables",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 80,
      protein: 3,
      carbs: 18,
      fat: 1,
      fiber: 2,
      sodium: 10
    },
    weight: 50,
    price: 0,
    description: "Sweet corn kernels with smoky char",
    imageUrl: "/ingredients/charred-corn.jpg"
  },
  {
    id: "side-3",
    name: "Oriental Cabbage Salad",
    category: "sides",
    subcategory: "vegetables",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 25,
      protein: 1,
      carbs: 5,
      fat: 0,
      fiber: 2,
      sodium: 15
    },
    weight: 40,
    price: 0,
    description: "Crisp cabbage with Asian-inspired dressing",
    imageUrl: "/ingredients/cabbage-salad.jpg"
  },
  {
    id: "side-4",
    name: "Grilled Mushrooms",
    category: "sides",
    subcategory: "vegetables",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 35,
      protein: 3,
      carbs: 5,
      fat: 1,
      fiber: 2,
      sodium: 8
    },
    weight: 45,
    price: 0,
    description: "Savory grilled mixed mushrooms",
    imageUrl: "/ingredients/grilled-mushrooms.jpg"
  },
  {
    id: "side-5",
    name: "Onsen Egg",
    category: "sides",
    subcategory: "protein",
    isAvailable: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ["eggs"],
    nutritionalInfo: {
      calories: 70,
      protein: 6,
      carbs: 1,
      fat: 5,
      fiber: 0,
      sodium: 70
    },
    weight: 50,
    price: 150, // +$1.50
    description: "Perfectly soft-cooked Japanese-style egg",
    imageUrl: "/ingredients/onsen-egg.jpg"
  }
];

// Mock Sauces
export const mockSauces: HeyBoIngredient[] = [
  {
    id: "sauce-1",
    name: "Purple Sweet Potato Dip",
    category: "sauce",
    subcategory: "dips",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 45,
      protein: 1,
      carbs: 8,
      fat: 2,
      fiber: 1,
      sodium: 120
    },
    weight: 30,
    price: 0,
    description: "Creamy purple sweet potato dip with herbs",
    imageUrl: "/ingredients/purple-sweet-potato-dip.jpg"
  },
  {
    id: "sauce-2",
    name: "Green Goddess",
    category: "sauce",
    subcategory: "dressings",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 60,
      protein: 1,
      carbs: 2,
      fat: 6,
      fiber: 0,
      sodium: 180
    },
    weight: 25,
    price: 0,
    description: "Fresh herb and avocado-based dressing",
    imageUrl: "/ingredients/green-goddess.jpg"
  },
  {
    id: "sauce-3",
    name: "Beetroot Miso",
    category: "sauce",
    subcategory: "dressings",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: ["soy"],
    nutritionalInfo: {
      calories: 40,
      protein: 2,
      carbs: 6,
      fat: 1,
      fiber: 1,
      sodium: 220
    },
    weight: 25,
    price: 0,
    description: "Umami-rich beetroot and miso blend",
    imageUrl: "/ingredients/beetroot-miso.jpg"
  }
];

// Mock Garnishes
export const mockGarnishes: HeyBoIngredient[] = [
  {
    id: "garnish-1",
    name: "Mixed Seeds",
    category: "garnish",
    subcategory: "seeds",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: ["sesame"],
    nutritionalInfo: {
      calories: 50,
      protein: 2,
      carbs: 2,
      fat: 4,
      fiber: 2,
      sodium: 5
    },
    weight: 10,
    price: 0,
    description: "Crunchy mix of sunflower and sesame seeds",
    imageUrl: "/ingredients/mixed-seeds.jpg"
  },
  {
    id: "garnish-2",
    name: "Lime Wedge",
    category: "garnish",
    subcategory: "citrus",
    isAvailable: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    nutritionalInfo: {
      calories: 5,
      protein: 0,
      carbs: 2,
      fat: 0,
      fiber: 0,
      sodium: 0
    },
    weight: 15,
    price: 0,
    description: "Fresh lime wedge for extra zing",
    imageUrl: "/ingredients/lime-wedge.jpg"
  }
];

// Combine all ingredients
export const mockIngredients: HeyBoIngredient[] = [
  ...mockBases,
  ...mockProteins,
  ...mockSides,
  ...mockSauces,
  ...mockGarnishes
];

// Mock Signature Bowls
export const mockSignatureBowls: BowlComposition[] = [
  {
    id: "signature-1",
    name: "Kampong Table",
    description: "Roasted lemongrass chicken, mixed grains, basil tofu, onsen egg, oriental cabbage salad, lime wedge with Purple Sweet Potato Dip & Green Goddess",
    base: mockBases[0]!, // Brown Rice
    protein: mockProteins[0]!, // Lemongrass Chicken
    extraProtein: [],
    sides: [mockSides[2]!, mockSides[4]!], // Cabbage Salad, Onsen Egg
    extraSides: [],
    sauce: mockSauces[0]!, // Purple Sweet Potato Dip
    garnish: mockGarnishes[1]!, // Lime Wedge
    totalWeight: 380,
    totalPrice: 1690, // $16.90
    isSignature: true,
    imageUrl: "/bowls/kampong-table.jpg",
    tags: ["High Protein", "Asian Fusion"],
    rating: 4.8,
    prepTime: "6 mins",
    calories: 1048,
    isPopular: true
  },
  {
    id: "signature-2",
    name: "Muscle Beach",
    description: "Sous-vide chicken breast, tri-colour quinoa, charred broccoli, carrot salad, avocado, mixed seeds with Purple Sweet Potato Dip & Yuzu Soy",
    base: mockBases[1]!, // Tri-Colour Quinoa
    protein: mockProteins[0]!, // Chicken (representing sous-vide)
    extraProtein: [],
    sides: [mockSides[0]!, mockSides[1]!], // Roasted Pumpkin, Charred Corn
    extraSides: [],
    sauce: mockSauces[0]!, // Purple Sweet Potato Dip
    garnish: mockGarnishes[0]!, // Mixed Seeds
    totalWeight: 420,
    totalPrice: 1850, // $18.50
    isSignature: true,
    imageUrl: "/bowls/muscle-beach.jpg",
    tags: ["High Protein", "Fitness"],
    rating: 4.9,
    prepTime: "6 mins",
    calories: 814,
    isPopular: true
  },
  {
    id: "signature-3",
    name: "Shibuya Nights",
    description: "Baked salmon, green soba, onsen egg, grilled mushrooms, oriental cabbage salad, furikake with Avocado Edamame Dip & Beetroot Miso",
    base: mockBases[2]!, // Cauliflower Lentil Rice
    protein: mockProteins[2]!, // Baked Salmon
    extraProtein: [],
    sides: [mockSides[3]!, mockSides[4]!, mockSides[2]!], // Mushrooms, Onsen Egg, Cabbage
    extraSides: [],
    sauce: mockSauces[2]!, // Beetroot Miso
    garnish: mockGarnishes[0]!, // Mixed Seeds (representing furikake)
    totalWeight: 365,
    totalPrice: 1650, // $16.50
    isSignature: true,
    imageUrl: "/bowls/shibuya-nights.jpg",
    tags: ["Omega-3", "Japanese"],
    rating: 4.8,
    prepTime: "6 mins",
    calories: 592,
    isPopular: false
  }
];

// Mock Recent Orders
export const mockRecentOrders: RecentOrder[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [{
      id: "item-1",
      bowl: mockSignatureBowls[0]!,
      quantity: 1,
      addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }],
    location: "Raffles Place MRT",
    bowlComposition: mockSignatureBowls[0]!,
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    locationId: "location-1",
    status: "completed",
    totalAmount: 1690,
    rating: null // Not yet rated
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [{
      id: "item-2",
      bowl: {
        ...mockSignatureBowls[1]!,
        // Custom modifications
        extraSides: [mockSides[4]!], // Added onsen egg
      },
      quantity: 1,
      addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }],
    location: "Orchard MRT",
    bowlComposition: {
      ...mockSignatureBowls[1]!,
      // Custom modifications
      extraSides: [mockSides[4]!], // Added onsen egg
      totalPrice: 2000 // Updated price
    },
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    locationId: "location-2",
    status: "completed",
    totalAmount: 2000,
    rating: 5
  },
  {
    id: "order-3",
    userId: "user-1",
    items: [{
      id: "item-3",
      bowl: {
        id: "custom-1",
        name: "My Custom Bowl",
        description: "Custom creation",
        base: mockBases[0]!,
        protein: mockProteins[3]!, // Falafels
        extraProtein: [],
        sides: [mockSides[0]!, mockSides[1]!],
        extraSides: [],
        sauce: mockSauces[1]!,
        garnish: mockGarnishes[0]!,
        totalWeight: 340,
        totalPrice: 1450,
        isSignature: false
      },
      quantity: 1,
      addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }],
    location: "Raffles Place MRT",
    bowlComposition: {
      id: "custom-1",
      name: "My Custom Bowl",
      description: "Custom creation",
      base: mockBases[0]!,
      protein: mockProteins[3]!, // Falafels
      extraProtein: [],
      sides: [mockSides[0]!, mockSides[1]!],
      extraSides: [],
      sauce: mockSauces[1]!,
      garnish: mockGarnishes[0]!,
      totalWeight: 340,
      totalPrice: 1450,
      isSignature: false
    },
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    locationId: "location-1",
    status: "completed",
    totalAmount: 1450,
    rating: 4
  }
];

// Mock Favorite Items
export const mockFavoriteItems: FavoriteItem[] = [
  {
    id: "fav-1",
    userId: "user-1",
    name: "My Perfect Bowl",
    description: "My favorite signature bowl",
    type: "signature",
    rating: 5,
    price: 1690,
    lastOrdered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["protein-rich", "healthy"],
    bowlComposition: mockSignatureBowls[1]!, // Muscle Beach
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isFavorite: true
  },
  {
    id: "fav-2",
    userId: "user-1",
    name: "Veggie Delight",
    description: "My custom plant-based creation",
    type: "custom",
    rating: 4,
    price: 1650,
    lastOrdered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ["vegan", "custom"],
    bowlComposition: {
      id: "custom-fav-1",
      name: "Veggie Delight",
      description: "Plant-based favorite",
      base: mockBases[1]!, // Quinoa
      protein: mockProteins[3]!, // Falafels
      extraProtein: [],
      sides: [mockSides[0]!, mockSides[1]!, mockSides[3]!], // Pumpkin, Corn, Mushrooms
      extraSides: [],
      sauce: mockSauces[1]!, // Green Goddess
      garnish: mockGarnishes[0]!, // Mixed Seeds
      totalWeight: 385,
      totalPrice: 1650,
      isSignature: false
    },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    isFavorite: true
  }
];

// Mock ML Recommendations
export const mockMLRecommendations: MLRecommendation[] = [
  {
    id: "ml-rec-1",
    bowlComposition: {
      id: "ml-1",
      name: "AI Protein Power",
      description: "ML-recommended high-protein bowl",
      base: mockBases[1]!, // Quinoa
      protein: mockProteins[1]!, // Steak
      extraProtein: [],
      sides: [mockSides[4]!, mockSides[3]!], // Onsen Egg, Mushrooms
      extraSides: [],
      sauce: mockSauces[0]!, // Purple Sweet Potato
      garnish: mockGarnishes[0]!, // Mixed Seeds
      totalWeight: 395,
      totalPrice: 1950,
      isSignature: false
    },
    confidence: 0.92,
    reasoning: "Based on your preference for high-protein meals and previous orders",
    tags: ["High Protein", "Recommended for You"]
  },
  {
    id: "ml-rec-2",
    bowlComposition: {
      id: "ml-2",
      name: "Balanced Wellness",
      description: "ML-recommended balanced nutrition bowl",
      base: mockBases[2]!, // Cauliflower Lentil Rice
      protein: mockProteins[2]!, // Salmon
      extraProtein: [],
      sides: [mockSides[0]!, mockSides[2]!], // Pumpkin, Cabbage
      extraSides: [],
      sauce: mockSauces[1]!, // Green Goddess
      garnish: mockGarnishes[1]!, // Lime Wedge
      totalWeight: 350,
      totalPrice: 1800,
      isSignature: false
    },
    confidence: 0.87,
    reasoning: "Perfect balance of omega-3, fiber, and fresh vegetables",
    tags: ["Balanced", "Heart Healthy"]
  },
  {
    id: "ml-rec-3",
    bowlComposition: {
      id: "ml-3",
      name: "Plant Power",
      description: "ML-recommended plant-based bowl",
      base: mockBases[0]!, // Brown Rice
      protein: mockProteins[3]!, // Falafels
      extraProtein: [],
      sides: [mockSides[1]!, mockSides[3]!, mockSides[0]!], // Corn, Mushrooms, Pumpkin
      extraSides: [],
      sauce: mockSauces[2]!, // Beetroot Miso
      garnish: mockGarnishes[0]!, // Mixed Seeds
      totalWeight: 375,
      totalPrice: 1550,
      isSignature: false
    },
    confidence: 0.85,
    reasoning: "Plant-based protein with diverse vegetables for optimal nutrition",
    tags: ["Vegan", "High Fiber"]
  }
];

// Mock Chat Messages for different scenarios
export const mockChatScenarios = {
  welcome: [
    {
      id: "msg-1",
      content: "Hi! I'm your HeyBo assistant. I'm here to help you create the perfect warm grain bowl! 🥣",
      type: "assistant" as const,
      timestamp: new Date()
    },
    {
      id: "msg-2",
      content: "What would you like to do today?",
      type: "assistant" as const,
      timestamp: new Date()
    }
  ],

  locationSelection: [
    {
      id: "msg-3",
      content: "Great! Let me help you find the perfect location. I found 3 locations near you:",
      type: "assistant" as const,
      timestamp: new Date()
    }
  ],

  bowlBuilding: [
    {
      id: "msg-4",
      content: "Perfect! Let's build your bowl step by step. First, let's choose your base:",
      type: "assistant" as const,
      timestamp: new Date()
    }
  ],

  mlRecommendations: [
    {
      id: "msg-5",
      content: "Based on your preferences and previous orders, I've created some personalized recommendations for you:",
      type: "assistant" as const,
      timestamp: new Date()
    }
  ]
};

// Mock FAQ responses
export const mockFAQResponses = {
  "nutrition": "All our bowls come with detailed nutritional information. You can view calories, protein, carbs, and allergen information for each ingredient. Would you like me to show you the nutrition facts for a specific bowl?",

  "allergens": "We take allergens seriously! Each ingredient is clearly marked with allergen information including gluten, dairy, nuts, soy, eggs, and seafood. You can filter ingredients by allergens when building your bowl.",

  "delivery": "We offer both pickup and delivery options. Pickup is available at all our locations with 5-7 minute preparation time. Delivery is available through our partner apps in selected areas.",

  "ingredients": "All our ingredients are fresh and sourced daily. We focus on wholesome, natural ingredients with no artificial preservatives. Many of our options are organic and locally sourced when possible.",

  "customization": "Absolutely! You can fully customize any bowl. Choose your base, protein, up to 3 sides, sauce, and garnish. We'll let you know if you're approaching the 900g weight limit.",

  "pricing": "Our bowls start from $12.90 for signature bowls. Custom bowls are priced based on ingredients selected. Premium proteins and some specialty ingredients have additional charges."
};
