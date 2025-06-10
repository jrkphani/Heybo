// Shared types for HeyBo API
export interface HeyBoIngredient {
  id: string
  name: string
  category: string
  available: boolean
  price: number
}

export interface BowlComposition {
  base: HeyBoIngredient
  protein?: HeyBoIngredient
  sides: HeyBoIngredient[]
  totalWeight: number
}
