import React, { useCallback, useContext, useEffect, useState } from "react";
import { Bolt, Clock, Info, Oven, Pause, Search, Spinner, Sync, User } from "../icon";
import { Link } from "react-router-dom";
import { Recipe, Status } from "../type";
import { categories, normalizedCategories, transformTime, wait } from "../utils";
import { database, INGREDIENTS_COLLECTION, RECIPES_COLLECTION } from "../firebase/configuration";
import { Input, useInput } from "../Common/Input";
import { IngredientContext } from "../IngredientProvider";
import { useCombobox } from "downshift";
import { collection, getDocs, query, orderBy, limit, startAfter, where, DocumentData, Query } from "firebase/firestore";

interface RecipeCardProps extends Recipe {
  name: string;
}
const RecipeCard: React.FunctionComponent<RecipeCardProps> = ({
  id,
  name,
  categories: recipeCategories,
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
      <div className="px-6 pb-4 pt-2 text-center">
        {categories
          .filter(category => recipeCategories.includes(category))
          .map(category => {
            return (
              <span
                key={category}
                className="inline-block bg-pink-600 rounded-full px-2 py-1 text-sm font-semibold text-white mr-2 mt-2"
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
  const [searchType, setSearchType] = useState<"BY_TITLE" | "BY_INGREDIENT">("BY_TITLE");
  const [paginate, setPaginate] = useState("");
  const [runSearch, setRunSearch] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const LIMIT = process.env.NODE_ENV === "development" ? 2 : 20;
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
  const nameInput = useInput();

  const search = useCallback(() => {
    if (status === "LOADING") return;
    setRecipes([]);
    setPaginate("");
    setRunSearch(true);
  }, [status]);

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
    const getRecipeFromRecipes = async () => {
      const ref = collection(database, RECIPES_COLLECTION);
      let first: Query<DocumentData, DocumentData>;
      if (nameInput.value || selectedCategories.length > 0) {
        const whereClause = where(
          "search",
          "array-contains-any",
          [nameInput.value.toLowerCase(), ...selectedCategories].filter(Boolean)
        );
        first = query(ref, whereClause, orderBy("name"), limit(LIMIT), startAfter(paginate));
      } else {
        first = query(ref, orderBy("name"), limit(LIMIT), startAfter(paginate));
      }

      const snapshot = await getDocs(first);
      return snapshot.docs.map(recipe => {
        return {
          ...recipe.data(),
          id: recipe.id
        } as Recipe;
      });
    };

    const getRecipeFromIngredients = async () => {
      const ref = collection(database, INGREDIENTS_COLLECTION);
      const first = query(ref, where("name", "==", searchIngredient));
      const snapshot = await getDocs(first);
      const data = snapshot.docs[0].data();
      const recipes: Recipe[] = [];
      for (const key in data) {
        if (key === "name") continue;
        recipes.push({ id: key, ...data[key] });
      }
      return recipes;
    };

    Promise.all([
      searchType === "BY_INGREDIENT" && searchIngredient ? getRecipeFromIngredients() : getRecipeFromRecipes(),
      wait(1500)
    ])
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
  }, [paginate, runSearch, searchIngredient, searchType, nameInput.value, LIMIT, selectedCategories]);
  return (
    <>
      <div className="mb-3 mt-3 flex justify-center">
        {searchType === "BY_INGREDIENT" ? (
          <div className="w-1/5 relative" {...getComboboxProps()}>
            {/*<Input id="search-by-name" {...nameInput} label="Name" placeholder="Name" />*/}
            <div className="">
              <Input
                label={
                  <>
                    Ingredient
                    <Sync
                      className="fill-current w-3 h-3 inline-block text-purple-500 ml-1 cursor-pointer"
                      onClick={() => {
                        setSearchType("BY_TITLE");
                      }}
                    />
                  </>
                }
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
        ) : (
          <div>
            <Input
              label={
                <>
                  Name
                  <Sync
                    className="fill-current w-3 h-3 inline-block text-purple-500 ml-1 cursor-pointer"
                    onClick={() => {
                      setSearchType("BY_INGREDIENT");
                    }}
                  />
                </>
              }
              id={`search-by-name`}
              placeholder="Tiramisu"
              {...nameInput}
              onKeyUp={async event => {
                if (event.key === "Enter") {
                  search();
                }
              }}
            />
          </div>
        )}
        <div className="flex items-end">
          <button
            className={`bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center mb-3 ${
              status === "LOADING" ? "opacity-50" : ""
            }`}
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
      {searchType === "BY_TITLE" && (
        <div className="px-6 pt-2 mb-4 text-center flex justify-center">
          {normalizedCategories.map(category => {
            return (
              <span
                onClick={() => {
                  setSelectedCategories(
                    selectedCategories.includes(category.id)
                      ? selectedCategories.filter(selectedCategory => selectedCategory !== category.id)
                      : [...selectedCategories, category.id]
                  );
                  search();
                }}
                key={category.id}
                className={`relative inline-flex items-center rounded-full px-2 py-1 text-sm font-semibold mr-2 mt-2 border-2 border-solid border-pink-600 cursor-pointer
                  ${
                    selectedCategories.includes(category.id)
                      ? "bg-pink-600 text-white hover:text-pink-600 hover:bg-white"
                      : "text-pink-600 hover:text-white hover:bg-pink-600"
                  }`}
              >
                {category.title}
              </span>
            );
          })}
        </div>
      )}
      {recipes.length > 0 && (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6 mt-6 px-3">
          {recipes.map(recipe => (
            <RecipeCard {...recipe} key={recipe.id} />
          ))}
        </div>
      )}
      {status !== "LOADING" && recipes.length === 0 && (
        <div
          className="flex items-center justify-center bg-orange-500 text-white text-sm font-bold px-4 py-3 mb-6"
          role="alert"
        >
          <Info />
          <p>No recipe found.</p>
        </div>
      )}
      {status !== "FINISHED" && recipes.length > 0 && (
        <div className="text-center mb-6">
          <button
            className={`bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center ${
              status === "LOADING" ? "opacity-50" : ""
            }`}
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
