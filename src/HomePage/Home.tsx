import React, { useContext, useEffect, useState } from "react";
import { Bolt, Clock, Oven, Pause, Search, Spinner, User } from "../icon";
import { Link } from "react-router-dom";
import { Recipe, Status } from "../type";
import { transformTime, wait } from "../utils";
import { database, INGREDIENTS_COLLECTION, RECIPES_COLLECTION } from "../firebase/configuration";
import { Input } from "../Common/Input";
import { IngredientContext } from "../IngredientProvider";
import { useCombobox } from "downshift";

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
  const [status, setStatus] = useState<Status>("INITIAL");
  const [paginate, setPaginate] = useState("");
  const [runSearch, setRunSearch] = useState(true);
  // const nameInput = useInput();
  const LIMIT = 20;
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

  const search = () => {
    setRecipes([]);
    setPaginate("");
    setRunSearch(true);
  };

  const { ingredients } = useContext(IngredientContext);
  const [inputItems, setInputItems] = useState(ingredients);
  const {
    isOpen,
    closeMenu,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue: searchIngredient
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue = "" }) => {
      const selection = ingredients
        .filter(ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 20);
      // add the current item if he's not in the list
      setInputItems(selection.length > 0 ? selection : [inputValue]);
    },
    onSelectedItemChange: search
  });

  useEffect(() => {
    if (!runSearch) return;
    setStatus("LOADING");
    const getRecipeFromRecipes = () =>
      database
        .collection(RECIPES_COLLECTION)
        .orderBy("name")
        .startAfter(paginate)
        .limit(LIMIT)
        .get()
        .then(snapshot => {
          return snapshot.docs.map(recipe => {
            return {
              ...recipe.data(),
              id: recipe.id
            } as Recipe;
          });
        });

    const getRecipeFromIngredients = () =>
      database
        .collection(INGREDIENTS_COLLECTION)
        .where("name", "==", searchIngredient)
        .get()
        .then(snapshot => {
          const data = snapshot.docs[0].data();
          const recipes: Recipe[] = [];
          for (const key in data) {
            if (key === "name") continue;
            recipes.push({ id: key, ...data[key] });
          }
          return recipes;
        });

    Promise.all([searchIngredient ? getRecipeFromIngredients() : getRecipeFromRecipes(), wait(1500)])
      .then(([fetchedRecipes]) => {
        setRecipes(recipes => {
          return [...recipes, ...fetchedRecipes];
        });
        return fetchedRecipes.length;
      })
      .then(length => {
        setRunSearch(false);
        if (length === LIMIT) {
          setStatus("SUCCESS");
        } else {
          setStatus("FINISHED");
        }
      });
  }, [paginate, runSearch, searchIngredient]);
  return (
    <>
      <div className="mb-6 mt-3 flex justify-center">
        <div className="w-1/5 relative" {...getComboboxProps()}>
          {/*<Input id="search-by-name" {...nameInput} label="Name" placeholder="Name" />*/}
          <div className="">
            <Input
              label="Ingredient"
              id={`search-by-ingredient`}
              placeholder="Tomato"
              {...getInputProps()}
              onKeyUp={async event => {
                if (event.key === "Enter") {
                  closeMenu();
                  search();
                }
              }}
            />
          </div>
          <div
            className="w-full overflow-y-auto bg-gray-400 absolute z-50 -mt-3"
            {...getMenuProps()}
            style={{ maxHeight: "10rem" }}
          >
            {isOpen &&
              inputItems.map((item, index) => (
                <div
                  className={`pl-4 py-2 border-b border-gray-100 border-solid ${
                    highlightedIndex === index ? "bg-purple-700 text-white bold" : ""
                  }`}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item}
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-end">
          <button
            className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center mb-3"
            style={{ height: "46px" }}
            onClick={() => {
              search();
            }}
            disabled={status === ("LOADING" as Status)}
          >
            {status === ("LOADING" as Status) ? (
              <>
                <Spinner className="w-6 h-6 fa-spin mr-2" />
                Search
              </>
            ) : (
              <>
                <Search className="w-6 h-6 mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6 mt-6 px-3">
        {recipes.map(recipe => (
          <RecipeCard {...recipe} key={recipe.id} />
        ))}
      </div>
      {status !== "FINISHED" && (
        <div className="text-center mb-6">
          <button
            className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center"
            onClick={() => {
              setPaginate(recipes[recipes.length - 1].name);
              setRunSearch(true);
            }}
            disabled={status === ("LOADING" as Status)}
          >
            {status === ("LOADING" as Status) ? (
              <>
                <Spinner className="w-6 h-6 fa-spin mr-2" />
                Loading
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </>
  );
};
