export type Unit =
  | "G"
  | "DKG"
  | "KG"
  | "ML"
  | "CL"
  | "L"
  | "TSP"
  | "TBSP"
  | "CUP"
  | "PINCH"
  | "PIECE";

export interface Ingredient {
  name: string;
  amount?: number;
  unit?: Unit;
  note?: string;
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
