import React, { FunctionComponent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeIngredient, RecipeWithIngredient, Status, Unit } from "../type";
import { Bolt, Clock, Lock, LockOpen, Oven, Pause, Plus, Save, Spinner, Times, User } from "../icon";
import { categories, transformTime, transformUnit, units, wait } from "../utils";
import { RecipeContext } from "../RecipeProvider";
import { Input, Select, Textarea, useInput } from "../Common/Input";
import { IngredientContext } from "../IngredientProvider";
import { useCombobox } from "downshift";

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
      className={`${className} whitespace-pre-line ${
        edit ? "p-1 border-pink-600 border-2 border-dashed cursor-pointer" : ""
      }`}
    >
      {displayedValue || value}
    </span>
  );
};
const EditableIngredient: FunctionComponent<{
  edit: boolean;
  ingredient: RecipeIngredient;
  className?: string;
  onAdd: (name: string, quantity: number, unit: string) => Promise<any>;
  onUpdate: (quantity: number, unit: string) => Promise<any>;
  onDelete: () => void;
  onNew: () => void;
}> = ({ ingredient, edit, className = "", onUpdate, onDelete, onNew, onAdd }) => {
  const [status, setStatus] = useState<Status>("INITIAL");
  const quantityInput = useInput({ value: String(ingredient.quantity) });
  const unitInput = useInput({ value: ingredient.unit });
  const isNew = ingredient.id === "";
  const { ingredients } = useContext(IngredientContext);
  const [inputItems, setInputItems] = useState(ingredients);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue
  } = useCombobox({
    initialInputValue: ingredient.name,
    items: inputItems,
    onInputValueChange: ({ inputValue = "" }) => {
      const selection = ingredients
        .filter(ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 20);
      // add the current item if he's not in the list
      setInputItems(selection.length > 0 ? selection : [inputValue]);
    }
  });

  const addOrUpdate = async () => {
    setStatus("LOADING");
    if (isNew) {
      await Promise.all([onAdd(inputValue, Number(quantityInput.value), unitInput.value), wait(500)]);
    } else {
      await Promise.all([onUpdate(Number(quantityInput.value), unitInput.value), wait(500)]);
      setStatus("SUCCESS"); // on onAdd this trigger no op error from React
    }
  };

  return edit ? (
    <div className="flex flex-wrap flex justify-center px-3 sm:pr-3">
      <div className="relative w-1/2 sm:pr-0 sm:mb-0" {...getComboboxProps()}>
        <div className="">
          <Input
            inputClassName={`appearance-none block w-full text-black border rounded-l py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
              isNew ? "bg-white" : "bg-gray-100 opacity-50"
            }`}
            onKeyUp={async event => {
              if (event.key === "Enter") {
                event.preventDefault();
                addOrUpdate();
              }
            }}
            disabled={!isNew}
            label={
              <>
                Ingredient
                <Plus
                  className="fill-current w-3 h-3 inline-block text-green-500 ml-1 cursor-pointer"
                  onClick={event => {
                    event.preventDefault();
                    onNew();
                  }}
                />
                <Times
                  className="fill-current w-3 h-3 inline-block text-red-500 ml-1 cursor-pointer"
                  onClick={async event => {
                    event.preventDefault();
                    setStatus("LOADING");
                    wait(300).then(() => onDelete());
                  }}
                />
              </>
            }
            id={`ingredient-name-${ingredient.id}`}
            placeholder="Tomato"
            {...getInputProps()}
          />
        </div>
        <div
          className="w-full overflow-y-auto bg-gray-400 absolute z-50"
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
      <div className="w-2/12">
        <Input
          label="Quantity"
          id={`ingredient-quantity-${ingredient.id}`}
          placeholder="4"
          {...quantityInput}
          autoFocus
          onKeyUp={async event => {
            if (event.key === "Enter") {
              event.preventDefault();
              addOrUpdate();
            }
          }}
          inputClassName="appearance-none block w-full bg-white text-gray-700 border rounded-l py-3 px-4 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div className="w-3/12">
        <Select
          label="Unit"
          id={`ingredient-unit-${ingredient.id}`}
          options={units}
          {...unitInput}
          selectClassName="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="flex items-end">
        <button
          className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded-r border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center"
          onClick={async event => {
            event.preventDefault();
            addOrUpdate();
          }}
          style={{ height: "46px" }}
        >
          {status === "LOADING" ? <Spinner className="w-6 h-6 fa-spin" /> : <Save className="w-6 h-6" />}
        </button>
      </div>
    </div>
  ) : (
    <span className={`${className} ${edit ? "p-1 border-pink-600 border-2 border-dashed cursor-pointer" : ""}`}>
      {transformUnit(ingredient.quantity, ingredient.unit)} {ingredient.name}
    </span>
  );
};

const EditableImage: FunctionComponent<{
  edit: boolean;
  value: string;
  className?: string;
  onUpdate: (value: File) => Promise<any>;
}> = ({ edit, className = "", value, onUpdate }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("INITIAL");

  return (
    <div
      onClick={() => {
        if (edit && fileRef.current) {
          fileRef.current.click();
        }
      }}
      className={`${className} ${edit ? "p-1 border-pink-600 border-2 border-dashed cursor-pointer" : ""}`}
    >
      {status === "LOADING" && (
        <Spinner className="w-6 h-6 fa-spin absolute text-pink-500 w-8 h-8 z-50 bg-white rounded-full" />
      )}
      <img
        src={value}
        className={`h-64 w-full object-cover ${status === "LOADING" ? "opacity-50" : ""}`}
        alt="recipe"
      />
      <input
        accept=".jpg, .jpeg, .png"
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={async event => {
          const files = event.target.files;
          if (fileRef.current && files && files.length === 1) {
            setStatus("LOADING");
            onUpdate(files[0]).then(() => {
              setStatus("SUCCESS");
            });
          }
        }}
      />
    </div>
  );
};

const createRandomId = () => `${Date.now()}-${Math.random() * 100000000 + 1}`;
export const Recipe: React.FunctionComponent = () => {
  const params = useParams<{ id: string }>();
  const { loadRecipe, getRecipe, updateRecipe, updateIngredient, deleteIngredient, addIngredient } = useContext(
    RecipeContext
  );
  const [edit, setEdit] = useState(false);
  const [recipe, setRecipe] = useState<RecipeWithIngredient | undefined>(getRecipe(params.id));
  const [status, setStatus] = useState<Status>(recipe ? "SUCCESS" : "LOADING");
  const [updateCategory, setUpdateCategory] = useState("");
  const [updateStep, setUpdateStep] = useState("");
  const hasNew = recipe?.ingredients.some(ingredient => ingredient.id === "") ?? false;
  const steps = useMemo(() => {
    return (
      recipe?.steps.map(step => {
        return {
          id: createRandomId(),
          step
        };
      }) ?? []
    );
  }, [recipe]);

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
                return updateRecipe(params.id, "name", value, {
                  ingredients: recipe.ingredients,
                  categories: recipe.categories,
                  name: value
                }).then(recipe => {
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
            <EditableImage
              edit={edit}
              value={recipe.imageUrl}
              onUpdate={async file => {
                const paths = recipe.imageUrl.split("/");
                const key = paths[paths.length - 1];
                // upload :)
                await fetch(`https://us-central1-recipes-ebe53.cloudfunctions.net/upload/${key}`, {
                  method: "DELETE",
                  headers: {
                    Accept: "application/json"
                  }
                }).then(res => {
                  if (res.status >= 400) {
                    throw new Error("Unable to delete the image");
                  }
                  return res.json();
                });
                const data = new FormData();
                data.append("file", file);
                const imageUrl = await fetch(`https://us-central1-recipes-ebe53.cloudfunctions.net/upload`, {
                  method: "POST",
                  body: data,
                  headers: {
                    Accept: "application/json"
                  }
                })
                  .then(res => res.json())
                  .then(res => res.url);
                return updateRecipe(recipe.id, "imageUrl", imageUrl, {
                  ingredients: recipe.ingredients,
                  categories: recipe.categories,
                  name: recipe.name
                }).then(recipe => {
                  setRecipe(recipe);
                });
              }}
            />
          </div>
          <div className="bg-gray-200 border-t-4 border-purple-700 p-4 flex">
            <div className="w-1/5 flex flex-col items-center">
              <User className="fill-current w-4 h-4 mb-1" />
              <EditableInput
                id="recipe-serves"
                edit={edit}
                value={String(recipe.serves)}
                onUpdate={value => {
                  return updateRecipe(params.id, "serves", Number(value), {
                    ingredients: recipe.ingredients,
                    categories: recipe.categories,
                    name: recipe.name
                  }).then(recipe => {
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
                  return updateRecipe(params.id, "prepareTime", Number(value), {
                    ingredients: recipe.ingredients,
                    categories: recipe.categories,
                    name: recipe.name
                  }).then(recipe => {
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
                  return updateRecipe(params.id, "cookTime", Number(value), {
                    ingredients: recipe.ingredients,
                    categories: recipe.categories,
                    name: recipe.name
                  }).then(recipe => {
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
                  return updateRecipe(params.id, "restTime", Number(value), {
                    ingredients: recipe.ingredients,
                    categories: recipe.categories,
                    name: recipe.name
                  }).then(recipe => {
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
                  return updateRecipe(params.id, "calories", Number(value), {
                    ingredients: recipe.ingredients,
                    categories: recipe.categories,
                    name: recipe.name
                  }).then(recipe => {
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
                    let newCategories: string[];
                    if (recipe.categories.includes(category)) {
                      newCategories = recipe.categories.filter(c => c !== category);
                    } else {
                      newCategories = [category].concat(recipe.categories);
                    }
                    return Promise.all([
                      updateRecipe(params.id, "categories", newCategories, {
                        ingredients: recipe.ingredients,
                        categories: newCategories,
                        name: recipe.name
                      }),
                      wait(700)
                    ]).then(([recipe]) => {
                      setRecipe(recipe);
                      setUpdateCategory("");
                    });
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
          <div className={`flex w-full flex-col ${edit ? "" : "md:flex-row"}`}>
            <div
              className={`bg-gray-200 border-t-4 border-purple-700 p-4 mb-6 w-full ${
                edit ? "" : "md:w-2/6 md:mr-3 md:mb-0"
              }`}
            >
              {recipe.ingredients.map(ingredient => {
                return (
                  <div key={ingredient.id} className="mb-2">
                    <EditableIngredient
                      edit={edit}
                      ingredient={ingredient}
                      onUpdate={(quantity, unit) => {
                        return updateIngredient(recipe.id, ingredient.id, quantity, unit as Unit).then(recipe => {
                          setRecipe(recipe);
                        });
                      }}
                      onAdd={(name, quantity, unit) => {
                        return addIngredient(recipe.id, name, quantity, unit as Unit).then(recipe => {
                          setRecipe(recipe);
                        });
                      }}
                      onDelete={() => {
                        deleteIngredient(recipe.id, ingredient.id).then(recipe => {
                          setRecipe(recipe);
                        });
                      }}
                      onNew={() => {
                        if (!hasNew) {
                          setRecipe({
                            ...recipe,
                            ingredients: [...recipe.ingredients, { id: "", unit: "Gramme", quantity: 0, name: "" }]
                          });
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className={`bg-gray-200 border-t-4 border-purple-700 w-full p-4 ${edit ? "" : "md:w-4/6 md:ml-3"}`}>
              {steps.map((step, index) => (
                <div key={`${step.id}`} className="mb-6 flex">
                  <div className="mr-3 -mt-1">
                    <span className="bg-purple-700 p-1 text-white font-bold rounded-full h-8 w-8 inline-flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    {edit && (
                      <div className="inline-flex items-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        <Plus
                          className="fill-current w-3 h-3 inline-block text-green-500 ml-1 cursor-pointer"
                          onClick={event => {
                            event.preventDefault();
                            setUpdateStep(step.id);
                            updateRecipe(
                              params.id,
                              "steps",
                              [...recipe.steps.slice(0, index + 1), "", ...recipe.steps.slice(index + 1)],
                              {
                                ingredients: [], // dont need to update the ingredients for step because steps are not saved in ingredients
                                categories: recipe.categories,
                                name: recipe.name
                              }
                            ).then(recipe => {
                              setUpdateStep("");
                              setRecipe(recipe);
                            });
                          }}
                        />
                        <Times
                          className="fill-current w-3 h-3 inline-block text-red-500 ml-1 cursor-pointer"
                          onClick={event => {
                            event.preventDefault();
                            setUpdateStep(step.id);
                            updateRecipe(
                              params.id,
                              "steps",
                              [...recipe.steps.slice(0, index), ...recipe.steps.slice(index + 1)],
                              {
                                ingredients: [], // dont need to update the ingredients for step because steps are not saved in ingredients
                                categories: recipe.categories,
                                name: recipe.name
                              }
                            ).then(recipe => {
                              setUpdateStep("");
                              setRecipe(recipe);
                            });
                          }}
                        />
                        {updateStep === step.id && <Spinner className="w-3 h-3 fa-spin ml-1" />}
                      </div>
                    )}
                    <EditableTextarea
                      id={`step-${step.id}`}
                      edit={edit}
                      value={step.step}
                      className="inline-block w-full"
                      onUpdate={value => {
                        return updateRecipe(
                          params.id,
                          "steps",
                          [...recipe.steps.slice(0, index), value, ...recipe.steps.slice(index + 1)],
                          {
                            ingredients: [], // dont need to update the ingredients for step because steps are not saved in ingredients
                            categories: recipe.categories,
                            name: recipe.name
                          }
                        ).then(recipe => {
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
