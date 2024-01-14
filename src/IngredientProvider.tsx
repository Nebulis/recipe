import React, { useCallback, useEffect, useState } from "react";
import { database, INGREDIENTS_LIST_COLLECTION } from "./firebase/configuration";
import { collection, doc, getDoc } from "firebase/firestore";

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
    const ref = collection(database, INGREDIENTS_LIST_COLLECTION);
    const first = doc(ref, "ingredients");
    getDoc(first).then(snapshot => {
      setIngredients(
        snapshot
          .data()!
          .value.map((ingredient: string) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1))
          .sort()
      );
    });
  }, []);

  const refresh = useCallback(() => {
    const ref = collection(database, INGREDIENTS_LIST_COLLECTION);
    const first = doc(ref, "ingredients");
    return getDoc(first).then(snapshot => {
      setIngredients(
        snapshot
          .data()!
          .value.map((ingredient: string) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1))
          .sort()
      );
    });
  }, []);

  return <IngredientContext.Provider value={{ ingredients, refresh }}>{children}</IngredientContext.Provider>;
};
