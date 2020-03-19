import React, { useCallback, useState } from "react";
import { database, INGREDIENTS_COLLECTION, RECIPES_COLLECTION } from "./firebase/configuration";
import { Recipe, RecipeIngredient, RecipeWithIngredient } from "./type";

const initialRecipes: { [key: string]: RecipeWithIngredient } = {};
//   {
//   "carbonade-flamande": {
//     id: "carbonade-flamande",
//     calories: 0,
//     categories: ["Cookeo", "Batch", "Midi", "Soir"],
//     cookTime: 107,
//     createdAt: {
//       seconds: 1584453742,
//       nanoseconds: 246000000
//     },
//     imageUrl: "https://recipe-lma.s3.amazonaws.com/183889d9-6039-4986-a161-8bedd3bb588f",
//     name: "Carbonade Flamande",
//     prepareTime: 30,
//     restTime: 0,
//     serves: 6,
//     steps: ["Cookeo monde doré", "Servir chaud"],
//     ingredients: [
//       {
//         id: "boeuf",
//         name: "Boeuf",
//         quantity: 2,
//         unit: "Piece"
//       },
//       {
//         id: "carotte",
//         name: "Carotte",
//         quantity: 2,
//         unit: "Piece"
//       },
//       {
//         id: "courgette",
//         name: "Courgette",
//         quantity: 5,
//         unit: "Kg"
//       }
//     ]
//   }
// };

interface RecipeContextType {
  loadRecipe: (id: string) => Promise<RecipeWithIngredient>;
  getRecipe: (id: string) => RecipeWithIngredient | undefined;
  updateRecipe: <T extends keyof Recipe>(
    id: string,
    key: T,
    value: Recipe[T],
    ingredients: RecipeIngredient[]
  ) => Promise<RecipeWithIngredient>;
}
export const RecipeContext = React.createContext<RecipeContextType>({
  getRecipe: () => {
    throw new Error("Not implemented");
  },
  loadRecipe: () => {
    throw new Error("Not implemented");
  },
  updateRecipe: () => {
    throw new Error("Not implemented");
  }
});

// TODO How to use onSnapshot ? :)
export const RecipeProvider: React.FunctionComponent = ({ children }) => {
  const [recipes, setRecipes] = useState<{ [key: string]: RecipeWithIngredient }>(initialRecipes);

  const getRecipe = useCallback((id: string) => recipes[id], [recipes]);
  const updateRecipe = useCallback(
    (id: string, key: string, value: any, ingredients: RecipeIngredient[]) => {
      const batch = database.batch();
      batch.update(database.collection(RECIPES_COLLECTION).doc(id), { [key]: value });

      ingredients.forEach(ingredient => {
        batch.update(database.collection(INGREDIENTS_COLLECTION).doc(ingredient.id), { [`${id}.${key}`]: value });
      });
      return batch.commit().then(() => {
        const newRecipe = {
          ...recipes[id],
          [key]: value
        };

        setRecipes({ ...recipes, [id]: newRecipe });
        return newRecipe;
      });
    },
    [recipes]
  );
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

  return <RecipeContext.Provider value={{ updateRecipe, loadRecipe, getRecipe }}>{children}</RecipeContext.Provider>;
};
