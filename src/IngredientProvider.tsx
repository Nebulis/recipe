import React, { useCallback, useEffect, useState } from "react";
import { database, INGREDIENTS_LIST_COLLECTION } from "./firebase/configuration";

interface IngredientContextType {
  ingredients: string[];
  refresh: () => Promise<any>;
}
export const IngredientContext = React.createContext<IngredientContextType>({
  ingredients: [],
  refresh: () => Promise.resolve()
});

export const IngredientProvider: React.FunctionComponent = ({ children }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  // load ingredients
  useEffect(() => {
    database
      .collection(INGREDIENTS_LIST_COLLECTION)
      .doc("ingredients")
      .get()
      .then(snapshot => {
        setIngredients(
          snapshot.data()!.value.map((ingredient: string) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)).sort()
        );
      });
  }, []);

  const refresh = useCallback(() => {
    return database
      .collection(INGREDIENTS_LIST_COLLECTION)
      .doc("ingredients")
      .get()
      .then(snapshot => {
        setIngredients(
          snapshot.data()!.value.map((ingredient: string) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)).sort()
        );
      });
  }, []);

  return <IngredientContext.Provider value={{ ingredients, refresh }}>{children}</IngredientContext.Provider>;
};
