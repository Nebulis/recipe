import React, { useCallback, useState } from "react";
import {
  database,
  INGREDIENTS_COLLECTION,
  INGREDIENTS_LIST_COLLECTION,
  RECIPES_COLLECTION
} from "./firebase/configuration";
import { Recipe, RecipeIngredient, RecipeWithIngredient, Unit } from "./type";
import { arrayUnion, collection, deleteField, doc, getDoc, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import { generateSearch, normalize } from "./utils";

const initialRecipes: { [key: string]: RecipeWithIngredient } = {
  // "test-tit-cheri": {
  //   id: "test-tit-cheri",
  //   calories: 200,
  //   categories: ["Matin", "Midi", "Soir", "Cookeo", "Batch"],
  //   cookTime: 1,
  //   createdAt: { seconds: 1584601396, nanoseconds: 946000000 },
  //   imageUrl: "https://recipe-lma.s3.ap-southeast-1.amazonaws.com/1b79bcb5-e272-49be-adf7-830562683b28",
  //   name: "0A TEST TIT CHERIiii",
  //   prepareTime: 150,
  //   restTime: 11,
  //   search: ["tes", "test", "tit", "che", "cher", "cheri", "cherii", "cheriii", "cheriiii"],
  //   serves: 10,
  //   steps: ["Coupezzzzsd sd", " mélangez"],
  //   ingredients: [
  //     { id: "carotte", name: "Carotte", quantity: 2, unit: "Piece" },
  //     { id: "escalope-de-poulet", name: "Escalope de Poulet", quantity: 200, unit: "Gramme" },
  //     // { id: "", name: "", quantity: 0, unit: "Gramme" }
  //   ]
  // }
};

interface RecipeContextType {
  loadRecipe: (id: string) => Promise<RecipeWithIngredient>;
  getRecipe: (id: string) => RecipeWithIngredient | undefined;
  updateRecipe: <T extends keyof Recipe>(
    id: string,
    key: T,
    value: Recipe[T],
    elements: {
      ingredients: RecipeIngredient[];
      categories: string[];
      name: string;
    }
  ) => Promise<RecipeWithIngredient>;
  updateIngredient: (id: string, ingredientId: string, quantity: number, unit: Unit) => Promise<RecipeWithIngredient>;
  addIngredient: (id: string, name: string, quantity: number, unit: Unit) => Promise<RecipeWithIngredient>;
  deleteIngredient: (id: string, ingredientId: string) => Promise<RecipeWithIngredient>;
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
  },
  updateIngredient: () => {
    throw new Error("Not implemented");
  },
  addIngredient: () => {
    throw new Error("Not implemented");
  },
  deleteIngredient: () => {
    throw new Error("Not implemented");
  }
});

// TODO How to use onSnapshot ? :)
export const RecipeProvider: React.FunctionComponent = ({ children }) => {
  const [recipes, setRecipes] = useState<{ [key: string]: RecipeWithIngredient }>(initialRecipes);

  const getRecipe = useCallback((id: string) => recipes[id], [recipes]);
  const updateIngredient = useCallback(
    (id: string, ingredientId: string, quantity: number, unit: Unit) => {
      const ref = doc(database, RECIPES_COLLECTION, id, INGREDIENTS_COLLECTION, ingredientId);
      return updateDoc(ref, { quantity, unit }).then(() => {
        const newIngregients = recipes[id].ingredients.map(ingredient => {
          if (ingredient.id === ingredientId) {
            return {
              ...ingredient,
              quantity,
              unit
            };
          } else {
            return ingredient;
          }
        });
        const newRecipe = {
          ...recipes[id],
          ingredients: newIngregients
        };
        setRecipes({ ...recipes, [id]: newRecipe });
        return newRecipe;
      });
    },
    [recipes]
  );
  const addIngredient = useCallback(
    (id: string, name: string, quantity: number, unit: Unit) => {
      const batch = writeBatch(database);
      const ingredientId = normalize(name);
      const { steps: _, search: _2, ingredients: _3, ...recipeForIngredients } = recipes[id];
      batch.set(doc(database, RECIPES_COLLECTION, id, INGREDIENTS_COLLECTION, ingredientId), {
        name,
        quantity,
        unit
      });
      batch.set(
        doc(database, INGREDIENTS_COLLECTION, ingredientId),
        { name, [id]: recipeForIngredients },
        { merge: true }
      );
      // TODO need to update the cache on new ingredient
      batch.update(doc(database, INGREDIENTS_LIST_COLLECTION, "ingredients"), {
        value: arrayUnion(name)
      });
      return batch.commit().then(() => {
        const newRecipe = {
          ...recipes[id],
          ingredients: [
            ...recipes[id].ingredients,
            {
              id: ingredientId,
              name,
              quantity,
              unit
            }
          ]
        };
        setRecipes({ ...recipes, [id]: newRecipe });
        return newRecipe;
      });
    },
    [recipes]
  );
  const deleteIngredient = useCallback(
    (id: string, ingredientId: string) => {
      const batch = writeBatch(database);
      batch.delete(doc(database, RECIPES_COLLECTION, id, INGREDIENTS_COLLECTION, ingredientId));
      batch.update(doc(database, INGREDIENTS_COLLECTION, ingredientId), {
        [id]: deleteField()
      });
      return batch.commit().then(() => {
        const newIngredients = recipes[id].ingredients.filter(ingredient => ingredient.id !== ingredientId);
        const newRecipe = {
          ...recipes[id],
          ingredients: newIngredients
        };
        setRecipes({ ...recipes, [id]: newRecipe });
        return newRecipe;
      });
    },
    [recipes]
  );

  const updateRecipe = useCallback(
    (
      id: string,
      key: string,
      value: any,
      {
        ingredients,
        categories,
        name
      }: {
        ingredients: RecipeIngredient[];
        categories: string[];
        name: string;
      }
    ) => {
      const batch = writeBatch(database);
      batch.update(doc(database, RECIPES_COLLECTION, id), { [key]: value });
      if (key === "name" || key === "categories") {
        batch.update(doc(database, RECIPES_COLLECTION, id), { search: generateSearch(name, categories) });
      }
      ingredients.forEach(ingredient => {
        batch.update(doc(database, INGREDIENTS_COLLECTION, ingredient.id), { [`${id}.${key}`]: value });
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
        getDoc(doc(collection(database, RECIPES_COLLECTION), id)),
        getDocs(collection(database, RECIPES_COLLECTION, id, INGREDIENTS_COLLECTION))
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

  return (
    <RecipeContext.Provider
      value={{ updateRecipe, loadRecipe, getRecipe, updateIngredient, deleteIngredient, addIngredient }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
