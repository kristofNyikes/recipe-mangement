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

export const tags = [
  "BREAKFAST",
  "BRUNCH",
  "LUNCH",
  "DINNER",
  "SNACK",
  "DESSERT",
  "APPETIZER",
  "SIDE_DISH",
  "SOUP",
  "SALAD",
  "SAUCE",
  "DRINK",

  "HUNGARIAN",
  "ITALIAN",
  "MEXICAN",
  "AMERICAN",
  "FRENCH",
  "GREEK",
  "SPANISH",
  "INDIAN",
  "THAI",
  "JAPANESE",
  "CHINESE",
  "KOREAN",
  "MIDDLE_EASTERN",

  "VEGETARIAN",
  "VEGAN",
  "PESCATARIAN",
  "GLUTEN_FREE",
  "DAIRY_FREE",
  "LOW_CARB",
  "HIGH_PROTEIN",

  "QUICK",
  "EASY",
  "MEAL_PREP",
  "MAKE_AHEAD",
  "FREEZER_FRIENDLY",
  "ONE_POT",
  "SHEET_PAN",
  "SLOW_COOKER",
  "PRESSURE_COOKER",
  "AIR_FRYER",
  "GRILLED",
  "BAKED",
  "NO_BAKE",

  "COMFORT_FOOD",
  "WEEKDAY",
  "PARTY",
  "HOLIDAY",
  "SUMMER",
  "WINTER",
  "SPICY",
  "SWEET",
] as const;

export type Tag = (typeof tags)[number];

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
  tags: Tag[];
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
