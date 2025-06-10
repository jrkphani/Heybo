import { z } from 'zod'

// HeyBo Ingredient Schema
export const HeyBoIngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['base', 'protein', 'greens', 'toppings', 'sauce', 'garnish']),
  subcategory: z.string().optional(),
  available: z.boolean(),
  price: z.number(),
  weight: z.number(), // in grams
  allergens: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(), // vegan, vegetarian, gluten-free, etc.
})

export type HeyBoIngredient = z.infer<typeof HeyBoIngredientSchema>

// Bowl Composition Schema
export const BowlCompositionSchema = z.object({
  base: HeyBoIngredientSchema, // Required
  protein: HeyBoIngredientSchema.optional(), // Optional for HeyBo
  sides: z.array(HeyBoIngredientSchema).max(3), // Max 3
  totalWeight: z.number().max(900), // Max 900g
})

export type BowlComposition = z.infer<typeof BowlCompositionSchema>

// Session Schema
export const SessionSchema = z.object({
  session_id: z.string(),
  user_id: z.string().optional(),
  user_type: z.enum(['registered', 'guest', 'unauthenticated']),
  device_id: z.string(),
  created_at: z.string(),
  last_activity: z.string(),
  expires_at: z.string(),
  user_current_step: z.string(),
  order_time: z.string().optional(),
  pickup_location_type: z.enum(['station', 'outlet']).optional(),
  location: z.string().optional(),
  selections: z.array(z.any()),
  cart: z.array(z.any()),
  preferences: z.record(z.any()),
})

export type Session = z.infer<typeof SessionSchema>
