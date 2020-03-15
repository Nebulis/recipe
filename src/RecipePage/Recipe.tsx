import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeWithIngredient, Status } from "../type";
import { database, INGREDIENTS_COLLECTION, RECIPES_COLLECTION } from "../firebase/configuration";
import { Bolt, Clock, Oven, Pause, Spinner, User } from "../icon";
import { transformTime, transformUnit, wait } from "../utils";

export const Recipe: React.FunctionComponent = () => {
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeWithIngredient>();
  const [status, setStatus] = useState<Status>("LOADING");
  //   {
  //   id: "escalope-de-dinde-grillée-et-fondue-de-poireau-à-la-moutarde",
  //   calories: 511,
  //   categories: ["Midi", "Soir"],
  //   cookTime: 20,
  //   createdAt: { seconds: 1584201505, nanoseconds: 101000000 },
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
  //   ingredients: [
  //     { id: "escalopes-de-dinde", name: "Escalopes de dinde", quantity: 2, unit: "Piece" },
  //     { id: "fromage-frais", name: "Fromage frais", quantity: 100, unit: "Gramme" },
  //     { id: "moutarde", name: "Moutarde", quantity: 15, unit: "Gramme" },
  //     { id: "poireau", name: "Poireau", quantity: 1, unit: "Piece" },
  //     { id: "tagliatelle", name: "Tagliatelle", quantity: 150, unit: "Gramme" },
  //     { id: "échalote", name: "Échalote", quantity: 1, unit: "Piece" }
  //   ]
  // }

  useEffect(() => {
    const timer = wait(1000);
    Promise.all([
      database
        .collection(RECIPES_COLLECTION)
        .doc(params.id)
        .get(),
      database
        .collection(RECIPES_COLLECTION)
        .doc(params.id)
        .collection(INGREDIENTS_COLLECTION)
        .get(),
      timer
    ]).then(([recipeSnapshot, ingredientsSnapshot]) => {
      setRecipe({
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
      });
      setStatus("SUCCESS");
    });
  }, [params]);

  return (
    <>
      {status === "SUCCESS" && recipe ? (
        <div className="w-full flex flex-col mx-auto mb-6 px-4 lg:w-10/12 lg:px-0">
          <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
            <span className="border-b-2 border-pink-600">{recipe.name}</span>
          </h1>
          <div className="mb-6">
            <img src={recipe.imageUrl} className="h-64 w-full object-cover" />
          </div>
          <div className="bg-gray-200 border-t-4 border-purple-700 p-4 mb-6 flex">
            <div className="w-1/5 flex flex-col items-center">
              <User className="fill-current w-4 h-4" />
              {recipe.serves}
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Clock className="fill-current w-4 h-4" />
              {transformTime(recipe.prepareTime)}
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Oven className="fill-current w-4 h-4" />
              {transformTime(recipe.cookTime)}
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Pause className="fill-current w-4 h-4" />
              {transformTime(recipe.restTime)}
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Bolt className="fill-current w-4 h-4" />
              {recipe.calories}
            </div>
          </div>
          <div className="flex w-full flex-col md:flex-row">
            <div className="bg-gray-200 border-t-4 border-purple-700 p-4 mb-6 w-full md:w-2/6 md:mr-3 md:mb-0">
              {recipe.ingredients.map(ingredient => {
                return (
                  <div key={ingredient.id} className="mb-2">
                    {transformUnit(ingredient.quantity, ingredient.unit)} {ingredient.name}
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-200 border-t-4 border-purple-700 md:ml-3 w-full md:w-4/6 p-4">
              {recipe.steps.map((step, index) => (
                <div key={index} className="mb-6 flex">
                  <div className="mr-3 -mt-1">
                    <span className="bg-purple-700 p-1 text-white font-bold rounded-full h-8 w-8 inline-flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6 mt-6 ">
          <Spinner className="fill-current w-16 h-16 fa-spin mx-auto" />
        </div>
      )}
    </>
  );
};
