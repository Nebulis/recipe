import React, {
  ChangeEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  useEffect,
  useState
} from "react";

const categories = ["Matin", "Midi", "Soir", "Cookeo", "Batch"];

interface InputProps extends InputHTMLAttributes<any> {
  label: string;
  id: string;
  error?: string;
}
const Input: React.FunctionComponent<InputProps> = ({
  label,
  id,
  error,
  placeholder,
  ...rest
}) => {
  return (
    <>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${
          error ? "border-red-500" : ""
        }`}
        id={id}
        type="text"
        placeholder={placeholder}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs italic">${error}</p>}
    </>
  );
};

interface SelectProps extends SelectHTMLAttributes<any> {
  label: string;
  id: string;
  error?: string;
  options: string[];
}
const Select: React.FunctionComponent<SelectProps> = ({
  label,
  id,
  options,
  onChange,
  value
}) => {
  return (
    <>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={id}
      >
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
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </>
  );
};

const useInput = ({ value: initialValue = "" } = {}) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return { value, onChange };
};

interface IngredientType {
  name: string;
  quantity: string;
  unit: string;
}

interface IngredientProps {
  onIngredientUpdate: (ingredient: IngredientType) => void;
  name: string;
  quantity: string;
  unit: string;
  ingredientNumber: number;
}
const Ingredient: React.FunctionComponent<IngredientProps> = ({
  onIngredientUpdate,
  name,
  quantity,
  unit,
  ingredientNumber
}) => {
  const ingredientInput = useInput({ value: name });
  const quantityInput = useInput({ value: quantity });
  const unitInput = useInput({ value: unit });

  useEffect(() => {
    onIngredientUpdate({
      name: ingredientInput.value,
      quantity: quantityInput.value,
      unit: unitInput.value
    });
  }, [
    ingredientInput.value,
    onIngredientUpdate,
    quantityInput.value,
    unitInput.value
  ]);
  return (
    <>
      <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
        <Input
          label="Ingredient"
          id={`ingredient-name-${ingredientNumber}`}
          placeholder="Tomato"
          {...ingredientInput}
        />
      </div>
      <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
        <Input
          label="Quantity"
          id={`ingredient-quantity-${ingredientNumber}`}
          placeholder="4"
          {...quantityInput}
        />
      </div>
      <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
        <Select
          label="Unit"
          id={`ingredient-unit-${ingredientNumber}`}
          options={["G", "L"]}
          {...unitInput}
        />
      </div>
    </>
  );
};
interface StepProps {
  onStepUpdate: (step: string) => void;
  step: string;
  stepNumber: number;
}
const Step: React.FunctionComponent<StepProps> = ({
  onStepUpdate,
  step,
  stepNumber
}) => {
  const stepInput = useInput({ value: step });

  useEffect(() => {
    onStepUpdate(stepInput.value);
  }, [onStepUpdate, stepInput.value]);
  return (
    <>
      <div className="w-full px-3 mb-6 md:mb-0">
        <Input
          label={`Step ${stepNumber}`}
          id={`step-${stepNumber}`}
          placeholder="Fold whipped cream into mascarpone cream mixture.."
          {...stepInput}
        />
      </div>
    </>
  );
};

const initialUnit = "G";

// Photo Ingrédients - Recette
export const Add = () => {
  const titleInput = useInput();
  const prepareTimeInput = useInput();
  const cookTimeInput = useInput();
  const restTimeInput = useInput();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientType[]>([
    { name: "", quantity: "", unit: initialUnit }
  ]);
  const [steps, setSteps] = useState<string[]>([""]);
  return (
    <form className="w-full max-w-4xl mx-auto">
      <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
        <span className="border-b-2 border-pink-600">General</span>
      </h1>
      <div className="flex flex-wrap mb-6">
        <div className="w-full px-3">
          <Input
            label="Title"
            id="title"
            placeholder="Tiramisu"
            {...titleInput}
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Input
            label="Prepare time (minuts)"
            id="prepare-time"
            placeholder="45"
            {...prepareTimeInput}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Input
            label="Cook time (minuts)"
            id="cook-time"
            placeholder="240"
            {...cookTimeInput}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Input
            label="Rest time (minuts)"
            id="rest-time"
            placeholder="20"
            {...restTimeInput}
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-6 flex justify-center">
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
                setSelectedCategories(
                  selectedCategories.filter(c => c !== category)
                );
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
      <div className="flex flex-wrap mb-6 flex justify-center">
        {ingredients.map((ingredient, index) => {
          return (
            <Ingredient
              key={index}
              {...ingredient}
              ingredientNumber={index}
              onIngredientUpdate={ingredient => {
                // automatically add a new ingredient if a change happen to the last displayed ingredient (which is supposed to be empty)
                if (
                  index === ingredients.length - 1 &&
                  (ingredient.name ||
                    ingredient.quantity ||
                    ingredient.unit !== initialUnit)
                ) {
                  setIngredients([
                    ...ingredients.slice(0, index),
                    ingredient,
                    { name: "", quantity: "", unit: initialUnit }
                  ]);
                } else {
                  setIngredients([
                    ...ingredients.slice(0, index),
                    ingredient,
                    ...ingredients.slice(index + 1)
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
              key={index}
              step={step}
              stepNumber={index + 1}
              onStepUpdate={step => {
                // automatically add a new step if a change happen to the last displayed step (which is supposed to be empty)
                if (index === steps.length - 1 && step) {
                  setSteps([...steps.slice(0, index), step, ""]);
                } else {
                  setSteps([
                    ...steps.slice(0, index),
                    step,
                    ...steps.slice(index + 1)
                  ]);
                }
              }}
            />
          );
        })}
      </div>

      {/*<button*/}
      {/*  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"*/}
      {/*  onClick={event => {*/}
      {/*    event.preventDefault();*/}
      {/*    console.log(ingredients);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Button*/}
      {/*</button>*/}
    </form>
  );
};
