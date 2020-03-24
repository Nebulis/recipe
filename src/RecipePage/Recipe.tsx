import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeWithIngredient, Status } from "../type";
import { Bolt, Clock, Lock, LockOpen, Oven, Pause, Save, Spinner, User } from "../icon";
import { categories, transformTime, transformUnit, wait } from "../utils";
import { RecipeContext } from "../RecipeProvider";
import { Input, Textarea, useInput } from "../Common/Input";

const EditableInput: FunctionComponent<{
  edit: boolean;
  id: string;
  value: string;
  displayedValue?: string;
  className?: string;
  onUpdate: (value: string) => Promise<any>;
}> = ({ id, edit, className = "", value, displayedValue, onUpdate }) => {
  const [displayInput, setDisplayInput] = useState(false);

  const [status, setStatus] = useState<Status>("INITIAL");
  const inputValue = useInput({ value });
  return displayInput ? (
    <div className="text-left flex">
      <Input
        id={id}
        {...inputValue}
        autoFocus
        onKeyUp={async event => {
          if (event.key === "Enter") {
            event.preventDefault();
            setStatus("LOADING");
            await Promise.all([onUpdate(inputValue.value), wait(500)]);
            setDisplayInput(false);
            setStatus("SUCCESS");
          }
        }}
        inputClassName="appearance-none block w-full bg-white text-gray-700 border rounded-l py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
      />
      <button
        className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded-r border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center mb-3"
        onClick={async event => {
          event.preventDefault();
          setStatus("LOADING");
          await Promise.all([onUpdate(inputValue.value), wait(500)]);
          setDisplayInput(false);
          setStatus("SUCCESS");
        }}
      >
        {status === "LOADING" ? <Spinner className="w-6 h-6 fa-spin" /> : <Save className="w-6 h-6" />}
      </button>
    </div>
  ) : (
    <span
      onClick={() => {
        if (edit) {
          setDisplayInput(true);
        }
      }}
      className={`${className} ${edit ? "p-1 border-pink-600 border-2 border-dashed cursor-pointer" : ""}`}
    >
      {displayedValue || value}
    </span>
  );
};
const EditableTextarea: FunctionComponent<{
  edit: boolean;
  id: string;
  value: string;
  displayedValue?: string;
  className?: string;
  onUpdate: (value: string) => Promise<any>;
}> = ({ id, edit, className = "", value, displayedValue, onUpdate }) => {
  const [displayInput, setDisplayInput] = useState(false);

  const [status, setStatus] = useState<Status>("INITIAL");
  const inputValue = useInput({ value });
  return displayInput ? (
    <div className="text-left flex">
      <Textarea
        id={id}
        {...inputValue}
        autoFocus
        onKeyUp={async event => {
          if (event.key === "Enter") {
            event.preventDefault();
            setStatus("LOADING");
            await Promise.all([onUpdate(inputValue.value), wait(500)]);
            setDisplayInput(false);
            setStatus("SUCCESS");
          }
        }}
        onKeyPress={event => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
        inputClassName="appearance-none block w-full bg-white text-gray-700 border rounded-l py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
      />
      <button
        className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded-r border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center mb-3"
        onClick={async event => {
          event.preventDefault();
          setStatus("LOADING");
          await Promise.all([onUpdate(inputValue.value), wait(500)]);
          setDisplayInput(false);
          setStatus("SUCCESS");
        }}
      >
        {status === "LOADING" ? <Spinner className="w-6 h-6 fa-spin" /> : <Save className="w-6 h-6" />}
      </button>
    </div>
  ) : (
    <span
      onClick={() => {
        if (edit) {
          setDisplayInput(true);
        }
      }}
      className={`${className} ${edit ? "p-1 border-pink-600 border-2 border-dashed cursor-pointer" : ""}`}
    >
      {displayedValue || value}
    </span>
  );
};

export const Recipe: React.FunctionComponent = () => {
  const params = useParams<{ id: string }>();
  const { loadRecipe, getRecipe, updateRecipe } = useContext(RecipeContext);
  const [edit, setEdit] = useState(false);
  const [recipe, setRecipe] = useState<RecipeWithIngredient | undefined>(getRecipe(params.id));
  const [status, setStatus] = useState<Status>(recipe ? "SUCCESS" : "LOADING");
  const [updateCategory, setUpdateCategory] = useState("");

  useEffect(() => {
    if (!recipe) {
      const timer = wait(1000);
      Promise.all([loadRecipe(params.id), timer]).then(([recipe]) => {
        setRecipe(recipe);
        setStatus("SUCCESS");
      });
    }
  }, [getRecipe, loadRecipe, params.id, recipe]);

  return (
    <>
      {status === "SUCCESS" && recipe ? (
        <div className="w-full flex flex-col mx-auto mb-6 px-4 lg:w-10/12 lg:px-0">
          <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6 relative">
            <EditableInput
              id="recipe-name"
              edit={edit}
              value={recipe.name}
              className="border-b-2 border-pink-600"
              onUpdate={value => {
                return updateRecipe(params.id, "name", value).then(recipe => {
                  setRecipe(recipe);
                });
              }}
            />
            {edit ? (
              <LockOpen
                className="absolute w-6 h-6 text-black right-0 top-0 mt-1 cursor-pointer"
                onClick={() => {
                  setEdit(false);
                }}
              />
            ) : (
              <Lock
                className="absolute w-6 h-6 text-black right-0 top-0 mt-1 cursor-pointer"
                onClick={() => {
                  setEdit(true);
                }}
              />
            )}
          </h1>
          <div className="mb-6">
            <img src={recipe.imageUrl} className="h-64 w-full object-cover" alt="recipe" />
          </div>
          <div className="bg-gray-200 border-t-4 border-purple-700 p-4 flex">
            <div className="w-1/5 flex flex-col items-center">
              <User className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-serves"
                edit={edit}
                value={String(recipe.serves)}
                onUpdate={value => {
                  return updateRecipe(params.id, "serves", Number(value)).then(recipe => {
                    setRecipe(recipe);
                  });
                }}
              />
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Clock className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-prepareTime"
                edit={edit}
                value={String(recipe.prepareTime)}
                displayedValue={transformTime(recipe.prepareTime)}
                onUpdate={value => {
                  return updateRecipe(params.id, "prepareTime", Number(value)).then(recipe => {
                    setRecipe(recipe);
                  });
                }}
              />
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Oven className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-cookTime"
                edit={edit}
                value={String(recipe.cookTime)}
                displayedValue={transformTime(recipe.cookTime)}
                onUpdate={value => {
                  return updateRecipe(params.id, "cookTime", Number(value)).then(recipe => {
                    setRecipe(recipe);
                  });
                }}
              />
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Pause className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-restTime"
                edit={edit}
                value={String(recipe.restTime)}
                displayedValue={transformTime(recipe.restTime)}
                onUpdate={value => {
                  return updateRecipe(params.id, "restTime", Number(value)).then(recipe => {
                    setRecipe(recipe);
                  });
                }}
              />
            </div>
            <div className="w-1/5 flex flex-col items-center">
              <Bolt className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-calories"
                edit={edit}
                value={String(recipe.calories)}
                onUpdate={value => {
                  return updateRecipe(params.id, "calories", Number(value)).then(recipe => {
                    setRecipe(recipe);
                  });
                }}
              />
            </div>
          </div>

          <div className="px-6 pt-2 mb-4 text-center flex justify-center">
            {categories.map(category => {
              return (
                <span
                  key={category}
                  onClick={() => {
                    if (!edit) return;
                    setUpdateCategory(category);
                    let newCategories: string[] = [];
                    if (recipe.categories.includes(category)) {
                      newCategories = recipe.categories.filter(c => c !== category);
                    } else {
                      newCategories = [category].concat(recipe.categories);
                    }
                    return Promise.all([updateRecipe(params.id, "categories", newCategories), wait(700)]).then(
                      ([recipe]) => {
                        setRecipe(recipe);
                        setUpdateCategory("");
                      }
                    );
                  }}
                  className={`relative inline-flex items-center rounded-full px-2 py-1 text-sm font-semibold text-white mr-2 mt-2 border-2 border-solid border-pink-600  
                  ${edit ? "cursor-pointer" : ""}
                  ${recipe.categories.includes(category) ? "bg-pink-600" : ""}
                  ${!edit && !recipe.categories.includes(category) ? "hidden" : ""}
                  ${
                    edit && !recipe.categories.includes(category)
                      ? "text-pink-600 hover:bg-pink-600 hover:text-white"
                      : ""
                  }${edit && recipe.categories.includes(category) ? "hover:text-pink-600 hover:bg-white" : ""}`}
                >
                  {updateCategory === category && <Spinner className="w-4 h-4 fa-spin mr-2" />}
                  {category}
                </span>
              );
            })}
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
                  <div className="flex-grow">
                    <EditableTextarea
                      id={`step-${index}`}
                      edit={edit}
                      value={step}
                      className="inline-block w-full"
                      onUpdate={value => {
                        return updateRecipe(params.id, "steps", [
                          ...recipe.steps.slice(0, index),
                          value,
                          ...recipe.steps.slice(index + 1)
                        ]).then(recipe => {
                          setRecipe(recipe);
                        });
                      }}
                    />
                  </div>
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
