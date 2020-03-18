import React, { useCallback, useEffect, useState } from "react";
import { database, INGREDIENTS_LIST__COLLECTION } from "./firebase/configuration";

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
      .collection(INGREDIENTS_LIST__COLLECTION)
      .get()
      .then(snapshot => {
        setIngredients(snapshot.docs.map(ingredient => ingredient.data().name));
      });
  }, []);

  const refresh = useCallback(() => {
    return database
      .collection(INGREDIENTS_LIST__COLLECTION)
      .get()
      .then(snapshot => {
        setIngredients(snapshot.docs.map(ingredient => ingredient.data().name));
      });
  }, []);

  return <IngredientContext.Provider value={{ ingredients, refresh }}>{children}</IngredientContext.Provider>;
};
