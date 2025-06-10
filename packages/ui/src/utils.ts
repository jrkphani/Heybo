import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Food service specific utilities
export function formatWeight(grams: number): string {
  return `${grams}g`;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getDietaryIndicator(dietary: string[]): string {
  const indicators = [];
  if (dietary.includes('vegan')) indicators.push('🌱');
  if (dietary.includes('gluten-free')) indicators.push('GF');
  if (dietary.includes('spicy')) indicators.push('🌶️');
  return indicators.join(' ');
}

// Color utilities for ingredient categories
export function getCategoryColor(category: string): string {
  const colors = {
    base: 'border-l-grain',
    protein: 'border-l-primary-500',
    greens: 'border-l-healthy',
    toppings: 'border-l-secondary-500',
    sauce: 'border-l-blue-500',
    garnish: 'border-l-purple-500',
  };
  return colors[category as keyof typeof colors] || 'border-l-gray-300';
}
