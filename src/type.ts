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
  unit: Unit;
}

export interface RecipeWithIngredient extends Recipe {
  ingredients: RecipeIngredient[];
}

export type Status = "INITIAL" | "LOADING" | "SUCCESS" | "ERROR";

export type Unit = "Gramme" | "Kg" | "Litre" | "Cl" | "Ml" | "C. à Soupe" | "C. à Café" | "Piece";
