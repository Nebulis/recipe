export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  categories: string[];
  cookTime: number;
  prepareTime: number;
  restTime: number;
  serves: number;
  calories: number;
  createdAt: any;
  steps: string[];
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeWithIngredient extends Recipe {
  ingredients: RecipeIngredient[];
}

export type Status = "INITIAL" | "LOADING" | "SUCCESS" | "ERROR";
