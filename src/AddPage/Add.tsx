import React, { SelectHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import {
  database,
  INGREDIENTS_COLLECTION,
  INGREDIENTS_LIST__COLLECTION,
  RECIPES_COLLECTION
} from "../firebase/configuration";
import { Image, Info, Plus, Save, Spinner, Times } from "../icon";
import { firestore } from "firebase";
import { useCombobox } from "downshift";
import { Status } from "../type";
import { units, wait } from "../utils";
import { IngredientContext } from "../IngredientProvider";
import { Input, useInput } from "../Common/Input";
import { useHistory } from "react-router-dom";

const categories = ["Matin", "Midi", "Soir", "Cookeo", "Batch"];

interface SelectProps extends SelectHTMLAttributes<any> {
  label: string;
  id: string;
  error?: string;
  options: string[];
}
const Select: React.FunctionComponent<SelectProps> = ({ label, id, options, onChange, value }) => {
  return (
    <>
      <label className="inline-flex uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id={id}
          onChange={onChange}
          value={value}
        >
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </>
  );
};

interface IngredientType {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface IngredientProps {
  onIngredientUpdate: (ingredient: IngredientType) => void;
  name: string;
  quantity: string;
  unit: string;
  id: string;
  ingredientNumber: number;
  deleteIngredient: () => void;
  addIngredient: () => void;
}

const Ingredient: React.FunctionComponent<IngredientProps> = ({
  onIngredientUpdate,
  name,
  quantity,
  unit,
  id,
  ingredientNumber,
  deleteIngredient,
  addIngredient
}) => {
  const { ingredients } = useContext(IngredientContext);
  const [inputItems, setInputItems] = useState(ingredients);
  const quantityInput = useInput({ value: quantity });
  const unitInput = useInput({ value: unit });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue
  } = useCombobox({
    initialInputValue: name,
    items: inputItems,
    onInputValueChange: ({ inputValue = "" }) => {
      const selection = ingredients
        .filter(ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 20);
      // add the current item if he's not in the list
      setInputItems(selection.length > 0 ? selection : [inputValue]);
    }
  });

  useEffect(() => {
    setInputItems(ingredients);
  }, [ingredients]);

  useEffect(() => {
    if (name !== inputValue || quantity !== quantityInput.value || unit !== unitInput.value) {
      onIngredientUpdate({
        id,
        name: inputValue,
        quantity: quantityInput.value,
        unit: unitInput.value
      });
    }
  }, [inputValue, name, onIngredientUpdate, quantity, quantityInput.value, unit, unitInput.value, id]);
  return (
    <>
      <div className="relative w-full sm:pr-0 sm:w-2/3 mb-6 sm:mb-0" {...getComboboxProps()}>
        <div className="">
          <Input
            label={
              <>
                Ingredient
                <Plus
                  className="fill-current w-3 h-3 inline-block text-green-500 ml-1 cursor-pointer"
                  onClick={event => {
                    event.preventDefault();
                    addIngredient();
                  }}
                />
                <Times
                  className="fill-current w-3 h-3 inline-block text-red-500 ml-1 cursor-pointer"
                  onClick={event => {
                    event.preventDefault();
                    deleteIngredient();
                  }}
                />
              </>
            }
            id={`ingredient-name-${ingredientNumber}`}
            placeholder="Tomato"
            {...getInputProps()}
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
      <div className="w-1/2 sm:w-1/6 pl-0 pr-3 sm:pl-6 sm:pr-3 mb-6 sm:mb-0">
        <Input label="Quantity" id={`ingredient-quantity-${ingredientNumber}`} placeholder="4" {...quantityInput} />
      </div>
      <div className="w-1/2 sm:w-1/6 pl-3 pr-0 mb-6 sm:mb-0">
        <Select label="Unit" id={`ingredient-unit-${ingredientNumber}`} options={units} {...unitInput} />
      </div>
    </>
  );
};

const createRandomId = () => `${Date.now()}-${Math.random() * 100000000 + 1}`;
const createStep = (): StepType => ({
  id: createRandomId(),
  step: ""
});
interface StepType {
  id: string;
  step: string;
}
interface StepProps {
  onStepUpdate: (step: StepType) => void;
  addStep: () => void;
  deleteStep: () => void;
  step: StepType;
  stepNumber: number;
}
const Step: React.FunctionComponent<StepProps> = ({ onStepUpdate, step, stepNumber, addStep, deleteStep }) => {
  const stepInput = useInput({ value: step.step });

  useEffect(() => {
    if (stepInput.value !== step.step) {
      onStepUpdate({ step: stepInput.value, id: step.id });
    }
  }, [onStepUpdate, step.step, step.id, stepInput.value]);
  return (
    <>
      <div className="w-full px-3 mb-6 md:mb-0">
        <Input
          label={
            <>
              Step {stepNumber}{" "}
              <Plus
                className="fill-current w-3 h-3 inline-block text-green-500 ml-1 cursor-pointer"
                onClick={event => {
                  event.preventDefault();
                  addStep();
                }}
              />
              <Times
                className="fill-current w-3 h-3 inline-block text-red-500 ml-1 cursor-pointer"
                onClick={event => {
                  event.preventDefault();
                  deleteStep();
                }}
              />
            </>
          }
          id={step.id}
          placeholder="Fold whipped cream into mascarpone cream mixture.."
          {...stepInput}
        />
      </div>
    </>
  );
};

const initialUnit = "Gramme";
const normalize = (value: string) => value.toLowerCase().replace(/ /g, "-");
export const Add = () => {
  const nameInput = useInput({ value: "" });
  const caloriesInput = useInput({ value: "" });
  const prepareTimeInput = useInput({ value: "" });
  const cookTimeInput = useInput({ value: "" });
  const restTimeInput = useInput({ value: "" });
  const servesInput = useInput({ value: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<IngredientType[]>([
    // { name: "Tomato", quantity: "6", unit: initialUnit },
    // { name: "Apple", quantity: "3", unit: "l" }
  ]);
  const [steps, setSteps] = useState<StepType[]>([]);
  const [status, setStatus] = useState<Status>("INITIAL");
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const { refresh } = useContext(IngredientContext);
  const { push } = useHistory();

  // use effect to reset correctly steps and ingredients, otherwise if using setSteps([""])
  // react reuses the first Step component that exists and merge the new value with it
  // which causes an issue => the previous Step is still available and a second one is created because of onStepUpdate
  // the same happens with setIngredients
  useEffect(() => {
    if (steps.length === 0) {
      setSteps([createStep()]);
    }
  }, [steps]);
  useEffect(() => {
    if (recipeIngredients.length === 0) {
      setRecipeIngredients([{ name: "", quantity: "", unit: initialUnit, id: createRandomId() }]);
    }
  }, [recipeIngredients]);

  // handle status
  useEffect(() => {
    // hide success bar after 5s
    if (status === "SUCCESS") {
      wait(5000).then(() => setStatus("INITIAL"));
    }
  }, [status]);

  const handleFiles = (files: FileList | null) => {
    if (fileRef.current && files && files.length === 1) {
      setImageFile(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <>
      {status === "SUCCESS" && (
        <div
          className="flex items-center justify-center bg-green-500 text-white text-sm font-bold px-4 py-3"
          role="alert"
        >
          <Info />
          <p>Recipe has been added.</p>
        </div>
      )}
      <form className="w-full max-w-4xl mx-auto mb-6">
        <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
          <span className="border-b-2 border-pink-600">General</span>
        </h1>
        <div className="flex flex-wrap mb-6 flex-col md:flex-row">
          <input
            accept=".jpg, .jpeg, .png"
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={event => handleFiles(event.target.files)}
          />
          <div
            className="px-3 cursor-pointer w-40 h-40 self-center items-center justify-center flex"
            onClick={() => fileRef.current && fileRef.current.click()}
          >
            {imageUrl ? <img src={imageUrl} alt="Recipe" /> : <Image className="fill-current w-full h-full" />}
          </div>
          <div className="flex-grow flex">
            <div className=" w-10/12 px-3 justify-center flex flex-col">
              <Input label="Name" id="name" placeholder="Tiramisu" {...nameInput} />
            </div>
            <div className=" w-2/12 px-3 justify-center flex flex-col">
              <Input label="Calories" id="calories" placeholder="2500" {...caloriesInput} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-1/2 md:w-1/4 px-3 mb-6 md:mb-0">
            <Input label="Prepare time (minuts)" id="prepare-time" placeholder="45" {...prepareTimeInput} />
          </div>
          <div className="w-1/2 md:w-1/4 px-3 mb-6 md:mb-0">
            <Input label="Cook time (minuts)" id="cook-time" placeholder="240" {...cookTimeInput} />
          </div>
          <div className="w-1/2 md:w-1/4 px-3 mb-6 md:mb-0">
            <Input label="Rest time (minuts)" id="rest-time" placeholder="20" {...restTimeInput} />
          </div>
          <div className="w-1/2 md:w-1/4 px-3 mb-6 md:mb-0">
            <Input label="Serves" id="serves" placeholder="2" {...servesInput} />
          </div>
        </div>
        <div className="flex flex-wrap mb-6 justify-center">
          {categories.map(category => (
            <button
              className={`bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 ${
                selectedCategories.includes(category)
                  ? "text-white bg-pink-900 hover:bg-pink-800"
                  : "hover:bg-purple-700 hover:text-white text-purple-700"
              }`}
              key={category}
              onClick={event => {
                event.preventDefault();
                if (selectedCategories.includes(category)) {
                  setSelectedCategories(selectedCategories.filter(c => c !== category));
                } else {
                  setSelectedCategories([...selectedCategories, category]);
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
          <span className="border-b-2 border-pink-600">Ingredients</span>
        </h1>
        <div className="flex flex-wrap mb-6 flex justify-center px-3 sm:pr-3">
          {recipeIngredients.map((ingredient, index) => {
            return (
              <Ingredient
                key={ingredient.id}
                {...ingredient}
                ingredientNumber={index}
                addIngredient={() => {
                  setRecipeIngredients([
                    ...recipeIngredients.slice(0, index + 1),
                    { id: createRandomId(), name: "", quantity: "", unit: initialUnit },
                    ...recipeIngredients.slice(index + 1)
                  ]);
                }}
                deleteIngredient={() => {
                  setRecipeIngredients([...recipeIngredients.slice(0, index), ...recipeIngredients.slice(index + 1)]);
                }}
                onIngredientUpdate={ingredient => {
                  // automatically add a new ingredient if a change happen to the last displayed ingredient (which is supposed to be empty)
                  if (
                    index === recipeIngredients.length - 1 &&
                    (ingredient.name || ingredient.quantity || ingredient.unit !== initialUnit)
                  ) {
                    setRecipeIngredients([
                      ...recipeIngredients.slice(0, index),
                      ingredient,
                      { id: createRandomId(), name: "", quantity: "", unit: initialUnit }
                    ]);
                  } else {
                    setRecipeIngredients([
                      ...recipeIngredients.slice(0, index),
                      ingredient,
                      ...recipeIngredients.slice(index + 1)
                    ]);
                  }
                }}
              />
            );
          })}
        </div>

        <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
          <span className="border-b-2 border-pink-600">Steps</span>
        </h1>
        <div className="flex flex-wrap mb-6 flex justify-center">
          {steps.map((step, index) => {
            return (
              <Step
                key={step.id}
                step={step}
                stepNumber={index + 1}
                addStep={() => {
                  setSteps([...steps.slice(0, index + 1), createStep(), ...steps.slice(index + 1)]);
                }}
                deleteStep={() => {
                  setSteps([...steps.slice(0, index), ...steps.slice(index + 1)]);
                }}
                onStepUpdate={step => {
                  // automatically add a new step if a change happen to the last displayed step (which is supposed to be empty)
                  if (index === steps.length - 1 && step) {
                    setSteps([...steps.slice(0, index), step, createStep()]);
                  } else {
                    setSteps([...steps.slice(0, index), step, ...steps.slice(index + 1)]);
                  }
                }}
              />
            );
          })}
        </div>
        <div className="text-center">
          <button
            className="bg-transparent font-semibold py-2 px-3 border hover:border-transparent rounded mx-1 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center"
            onClick={async event => {
              event.preventDefault();
              setStatus("LOADING");
              if (!imageFile) {
                throw new Error("You forgot the image ...");
              }
              const data = new FormData();
              data.append("file", imageFile);
              const imageUrl = await fetch(`https://us-central1-recipes-ebe53.cloudfunctions.net/upload`, {
                method: "POST",
                body: data,
                headers: {
                  Accept: "application/json"
                }
              })
                .then(res => res.json())
                .then(res => res.url);

              if (!imageUrl) {
                throw new Error("The url received from AWS is empty");
              }

              const timer = wait(2000);

              const recipeId = normalize(nameInput.value);
              const recipe = {
                name: nameInput.value,
                prepareTime: Number(prepareTimeInput.value),
                cookTime: Number(cookTimeInput.value),
                restTime: Number(restTimeInput.value),
                serves: Number(servesInput.value),
                calories: Number(caloriesInput.value),
                categories: selectedCategories,
                createdAt: firestore.FieldValue.serverTimestamp(),
                imageUrl,
                steps: steps.map(step => step.step).filter(Boolean) // remove empty steps
              };
              const { steps: _, ...recipeForIngredients } = recipe;

              const batch = database.batch();
              // add the recipe
              const recipeRef = database.collection(RECIPES_COLLECTION).doc(recipeId);
              batch.set(recipeRef, recipe);

              recipeIngredients
                .filter(recipeIngredient => !!recipeIngredient.name) // remove empty ingredients of the recipe
                .map(({ name, unit, quantity }) => {
                  return {
                    name,
                    unit,
                    quantity: Number(quantity)
                  };
                })
                .forEach(ingredient => {
                  const ingredientId = normalize(ingredient.name);

                  // add the ingredients in the recipe
                  const recipeIngredientRef = recipeRef.collection(INGREDIENTS_COLLECTION).doc(ingredientId);
                  batch.set(recipeIngredientRef, ingredient);

                  // add the recipe to the ingredient collection
                  const ingredientRef = database.collection(INGREDIENTS_COLLECTION).doc(ingredientId);
                  batch.set(
                    ingredientRef,
                    { name: ingredient.name, [recipeId]: recipeForIngredients },
                    { merge: true }
                  );

                  // add the ingredient
                  const ingredientListRef = database.collection(INGREDIENTS_LIST__COLLECTION).doc(ingredientId);
                  batch.set(ingredientListRef, { name: ingredient.name });
                });
              batch
                .commit()
                .then(() => {
                  // make sure it takes at least 2 seconds so that the waiting time is somehow fixed
                  return timer;
                })
                .then(async _ => {
                  await refresh();
                  setStatus("SUCCESS");
                  nameInput.onChange({ target: { value: "" } });
                  prepareTimeInput.onChange({ target: { value: "" } });
                  cookTimeInput.onChange({ target: { value: "" } });
                  restTimeInput.onChange({ target: { value: "" } });
                  servesInput.onChange({ target: { value: "" } });
                  caloriesInput.onChange({ target: { value: "" } });
                  setSelectedCategories([]);
                  setSteps([]);
                  setRecipeIngredients([]);
                  setImageUrl("");
                  setImageFile(undefined);
                  if (fileRef.current) {
                    fileRef.current.value = "";
                  }
                  await wait(700);
                  push(`/recipe/${recipeId}`);
                });
            }}
          >
            {status === "LOADING" ? <Spinner className="fill-current w-4 h-4 mr-2 fa-spin" /> : <Save />}
            Add Recipe
          </button>
        </div>
      </form>
    </>
  );
};
