export const units = [
  "G",
  "DKG",
  "KG",
  "ML",
  "CL",
  "L",
  "TSP",
  "TBSP",
  "CUP",
  "PINCH",
  "PIECE",
] as const;

export type Unit = (typeof units)[number];

export interface Ingredient {
  name: string;
  amount: number | null;
  unit: Unit | null;
  note: string | null;
  stepNumber?: number;
}

export interface Step {
  stepNumber: number;
  text: string;
}

export interface RecipeSeed {
  title: string;
  description?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface Recipe {
  title: string;
  slug: string;
  description: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  isFavorite: boolean;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface RecipeCardProps {
  title: string;
  slug: string;
  description?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
}

export interface RecipeEditorProps {
  initialRecipe?: Recipe;
  slug?: string;
}

export type RecipeSortBy = "title" | "createdAt" | "updatedAt";

export interface RecipeSummary {
  title: string;
  slug: string;
  prepTime: number;
  cookTime: number;
  servings: number;
}
