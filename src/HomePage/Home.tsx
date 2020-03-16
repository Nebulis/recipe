import React, { useEffect, useState } from "react";
import { Bolt, Clock, Oven, Pause, Spinner, User } from "../icon";
import { Link } from "react-router-dom";
import { Recipe, Status } from "../type";
import { transformTime, wait } from "../utils";
import { database, RECIPES_COLLECTION } from "../firebase/configuration";

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
      className="w-full mx-auto max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl transition duration-150 ease-in transform hover:scale-105 flex flex-col"
    >
      <img className="w-full object-cover h-48" src={imageUrl} alt="recipe" />
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
              className="inline-block bg-pink-600 rounded-full px-2 py-1 text-sm font-semibold text-white mr-2"
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
  const [status, setStatus] = useState<Status>("LOADING");
  const [recipes, setRecipes] = useState<Recipe[]>([
    // {
    //   calories: 511,
    //   categories: ["Midi", "Soir"],
    //   cookTime: 20,
    //   createdAt: 1212,
    //   imageUrl: "https://recipe-lma.s3.ap-southeast-1.amazonaws.com/46805ef1-e3da-4b10-a182-7b019c917a18",
    //   name: "Escalope de dinde grillée et fondue de poireau à la moutarde",
    //   prepareTime: 20,
    //   restTime: 0,
    //   serves: 2,
    //   steps: [
    //     "Portez à ébullition une casserole d’eau et faites cuire les tagliatelle 12 à 14 min pour des pâtes al dente ou fondantes.",
    //     "Dans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif. Pelez et émincez l'échalote et le poireau. Faites les revenir 7 min jusqu'à ce qu'ils soient tendres. Salez, poivrez. A mi-cuisson, ajoutez un fond d'eau et couvrez pour accélérer la cuisson. En fin de cuisson, s'il reste un peu d'eau, mettez sur feu vif pour la faire évaporer.",
    //     "Ajoutez le fromage frais et la moutarde. Mélangez bien.",
    //     "Faites cuire les escalopes de dinde. "
    //   ],
    //   id: "escalope-de-dinde-grillée-et-fondue-de-poireau-à-la-moutarde"
    // }
  ]);
  // console.log(JSON.stringify(recipes));

  useEffect(() => {
    const timer = wait(1000);
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
      })
      .then(() => timer)
      .then(() => {
        setStatus("SUCCESS")
      });
  }, []);
  return (
    <>
      {status === "SUCCESS" ? (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6 mt-6 px-3">
          {recipes.map(recipe => (
            <RecipeCard {...recipe} key={recipe.id} />
          ))}
        </div>
      ) : (
        <div className="text-center mb-6 mt-6 ">
          <Spinner className="fill-current w-16 h-16 fa-spin mx-auto" />
        </div>
      )}
    </>
  );
};
