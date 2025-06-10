// Core utilities
export { cn } from "./utils";

// UI Components
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Input } from "./input";
export { Avatar, AvatarImage, AvatarFallback } from "./avatar";
export { ScrollArea, ScrollBar } from "./scroll-area";
export { 
  Dialog, 
  DialogPortal, 
  DialogOverlay, 
  DialogTrigger, 
  DialogClose, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from "./dialog";

// Food Service Specific Components
export { IngredientCard, ingredientCardVariants } from "./ingredient-card";
export { BowlPreview } from "./bowl-preview";
export { NutritionInfo } from "./nutrition-info";
export { CategoryHeader } from "./category-header";

// Types
export type { ButtonProps } from "./button";
export type { CardProps } from "./card";
export type { InputProps } from "./input";
export type { IngredientCardProps } from "./ingredient-card";
