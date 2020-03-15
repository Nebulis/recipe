import React, { useEffect, useState } from "react";
import { database, RECIPES_COLLECTION } from "../firebase/configuration";
import { Clock, Oven, Pause, User, Bolt } from "../icon";
import { Link } from "react-router-dom";

interface Recipe {
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

const transformTime = (time: number) => {
  return time ? `${time} mins` : "-";
};

interface RecipeCardProps extends Recipe {
  name: string;
}
const RecipeCard: React.FunctionComponent<RecipeCardProps> = ({
  id,
  name,
  categories,
  imageUrl,
  serves,
  prepareTime,
  cookTime,
  restTime,
  calories
}) => {
  return (
    <Link
      to={`/recipe/${id}`}
      className="mx-auto max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl transition duration-150 ease-in transform hover:scale-105 flex flex-col"
    >
      <img className="w-full" src={imageUrl} alt="Sunset in the mountains" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-center">{name}</div>
      </div>
      <div className="flex mt-auto">
        <div className="w-1/5 flex flex-col items-center">
          <User className="fill-current w-4 h-4" />
          {serves}
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <Clock className="fill-current w-4 h-4" />
          {transformTime(prepareTime)}
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <Oven className="fill-current w-4 h-4" />
          {transformTime(cookTime)}
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <Pause className="fill-current w-4 h-4" />
          {transformTime(restTime)}
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <Bolt className="fill-current w-4 h-4" />
          {calories}
        </div>
      </div>
      <div className="px-6 py-4 text-center">
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
    </Link>
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
