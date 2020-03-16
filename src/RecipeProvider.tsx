import React, { useCallback, useState } from "react";
import { database, INGREDIENTS_COLLECTION, RECIPES_COLLECTION } from "./firebase/configuration";
import { RecipeWithIngredient } from "./type";

interface RecipeContextType {
  loadRecipe: (id: string) => Promise<RecipeWithIngredient>;
  getRecipe: (id: string) => RecipeWithIngredient | undefined;
}
export const RecipeContext = React.createContext<RecipeContextType>({
  getRecipe: () => {
    throw new Error("Not implemented");
  },
  loadRecipe: () => {
    throw new Error("Not implemented");
  }
});

export const RecipeProvider: React.FunctionComponent = ({ children }) => {
  const [recipes, setRecipes] = useState<{ [key: string]: RecipeWithIngredient }>({});

  const getRecipe = useCallback((id: string) => recipes[id], [recipes]);
  const loadRecipe = useCallback(
    (id: string) => {
      return Promise.all([
        database
          .collection(RECIPES_COLLECTION)
          .doc(id)
          .get(),
        database
          .collection(RECIPES_COLLECTION)
          .doc(id)
          .collection(INGREDIENTS_COLLECTION)
          .get()
      ]).then(([recipeSnapshot, ingredientsSnapshot]) => {
        const recipe: RecipeWithIngredient = {
          // @ts-ignore
          id: recipeSnapshot.id,
          // @ts-ignore
          ...recipeSnapshot.data(),
          // @ts-ignore
          ingredients: ingredientsSnapshot.docs.map(ingredient => {
            return {
              id: ingredient.id,
              ...ingredient.data()
            };
          })
        };
        setRecipes({ ...recipes, [id]: recipe });
        return recipe;
      });
    },
    [recipes]
  );

  return <RecipeContext.Provider value={{ loadRecipe, getRecipe }}>{children}</RecipeContext.Provider>;
};
