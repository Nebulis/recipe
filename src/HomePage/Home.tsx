import React, { useEffect, useState } from "react";
import { database, RECIPES_COLLECTION } from "../firebase/configuration";

interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  categories: string[];
}

interface RecipeCardProps extends Recipe {
  name: string;
}
const RecipeCard: React.FunctionComponent<RecipeCardProps> = ({ name, categories, imageUrl }) => {
  return (
    <div className="mx-auto max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={imageUrl} alt="Sunset in the mountains" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
      </div>
      <div className="px-6 py-4">
        {categories.map(category => {
          return (
            <span
              key={category}
              className="inline-block bg-pink-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2"
            >
              {category}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Home: React.FunctionComponent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    database
      .collection(RECIPES_COLLECTION)
      .orderBy("name")
      .limit(20)
      .get()
      .then(snapshot => {
        console.log(snapshot.docs);
        setRecipes(
          // @ts-ignore
          snapshot.docs.map(recipe => {
            return {
              ...recipe.data(),
              id: recipe.id
            };
          })
        );
      });
  }, []);
  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6 mt-6 px-3">
      {recipes.map(recipe => (
        <RecipeCard {...recipe} key={recipe.id} />
      ))}
    </div>
  );
};
