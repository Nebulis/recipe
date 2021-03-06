import React, { useContext, useEffect, useState } from "react";
import { IngredientContext } from "../IngredientProvider";
import { useCombobox } from "downshift";
import { Input } from "../Common/Input";
import { Info, Save, Spinner } from "../icon";
import {
  database,
  INGREDIENTS_COLLECTION,
  INGREDIENTS_LIST_COLLECTION,
  RECIPES_COLLECTION
} from "../firebase/configuration";
import { normalize, wait } from "../utils";
import * as firebase from 'firebase/app';
import { Status } from "../type";

interface IngredientCombobox {
  label: string;
  id: string;
  ingredients: string[];
  onValueChange: (value: string) => void;
}
const IngredientCombobox: React.FunctionComponent<IngredientCombobox> = ({ ingredients, label, onValueChange, id }) => {
  const [fromItems, setFromItems] = useState(ingredients);
  const {
    isOpen,
    closeMenu,
    getMenuProps,
    getInputProps,
    // getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue
  } = useCombobox({
    items: fromItems,
    onInputValueChange: ({ inputValue = "" }) => {
      const selection = ingredients
        .filter(ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 20);
      // add the current item if he's not in the list
      setFromItems(selection.length > 0 ? selection : [inputValue]);
    }
  });
  useEffect(() => {
    onValueChange(inputValue);
  }, [inputValue, onValueChange]);
  return (
    <>
      <div className="">
        <Input
          label={label}
          id={id}
          placeholder="Tomato"
          {...getInputProps()}
          onKeyUp={async event => {
            if (event.key === "Enter") {
              closeMenu();
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
          fromItems.map((item, index) => (
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
    </>
  );
};

export const Admin = () => {
  const { ingredients } = useContext(IngredientContext);
  const [status, setStatus] = useState<Status>("INITIAL");
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    // const fn = async () => {
    //   const ingredientFrom = await database
    //     .collection(INGREDIENTS_COLLECTION)
    //     .doc("aubergine")
    //     .get()
    //     .then(snapshot => snapshot.data());
    //   database
    //     .collection(INGREDIENTS_COLLECTION)
    //     .doc("aubergineeeee")
    //     .set(ingredientFrom!);
    //   const ingredientTo = await database
    //     .collection(INGREDIENTS_COLLECTION)
    //     .doc("blanc-de-poulet")
    //     .get()
    //     .then(snapshot => snapshot.data());
    //
    //   database
    //     .collection(INGREDIENTS_COLLECTION)
    //     .doc("blanc-de-poulettttttt")
    //     .set(ingredientTo!);
    // };
    // fn();
  }, []);

  // handle status
  useEffect(() => {
    // hide success bar after 5s
    if (status === "SUCCESS") {
      wait(5000).then(() => setStatus("INITIAL"));
    }
  }, [status]);
  return (
    <div>
      {status === "SUCCESS" && (
        <div
          className="flex items-center justify-center bg-green-500 text-white text-sm font-bold px-4 py-3"
          role="alert"
        >
          <Info />
          <p>Ingredient has been updated.</p>
        </div>
      )}
      {status === "ERROR" && error && (
        <div
          className="flex items-center justify-center bg-red-500 text-white text-sm font-bold px-4 py-3"
          role="alert"
        >
          <Info />
          <p>{error}</p>
        </div>
      )}
      <h1 className="text-center uppercase mt-2 text-xl text-pink-600 mb-6">
        <span className="border-b-2 border-pink-600">Rename ingredients</span>
      </h1>
      <div className="w-full flex flex-col md:flex-row xl:w-3/4 mx-auto ">
        <div className="w-full md:w-2/5 relative px-4">
          <IngredientCombobox
            id="from-ingredient"
            label="From"
            ingredients={ingredients}
            onValueChange={value => {
              setFrom(value);
            }}
          />
        </div>
        <div className="md:w-2/5 relative px-4">
          <IngredientCombobox
            id="to-ingredient"
            label="To"
            ingredients={ingredients}
            onValueChange={value => {
              setTo(value);
            }}
          />
        </div>
        <div className="flex px-4 mt-4 flex-grow">
          <button
            className={`bg-transparent font-semibold py-2 border hover:border-transparent rounded mb-3 border-pink-800 text-white bg-pink-900 hover:bg-pink-800 inline-flex items-center justify-center mt-auto w-full ${
              status === "LOADING" ? "opacity-50" : ""
            }`}
            disabled={status === ("LOADING" as Status)}
            style={{ height: "46px" }}
            onClick={async () => {
              setStatus("LOADING");
              const batch = database.batch();

              const normalizedFrom = normalize(from);
              const normalizedTo = normalize(to);

              // fetch FROM ingredient
              const ingredientFrom = await database
                .collection(INGREDIENTS_COLLECTION)
                .doc(normalizedFrom)
                .get()
                .then(snapshot => snapshot.data());

              if (!ingredientFrom) {
                setStatus("ERROR");
                setError(`Ingredient ${from} you want to update does not exist`);
                return;
              }
              // fetch TO ingredient
              const ingredientTo = await database
                .collection(INGREDIENTS_COLLECTION)
                .doc(normalizedTo)
                .get()
                .then(snapshot => snapshot.data());

              // transfer recipes fromIngredient from to toIngredient
              const ingredientRefTo = database.collection(INGREDIENTS_COLLECTION).doc(normalizedTo);
              const ingredientRefFrom = database.collection(INGREDIENTS_COLLECTION).doc(normalizedFrom);
              const { name, ...recipes } = ingredientFrom;

              if (ingredientTo) {
                batch.update(ingredientRefTo, recipes);
              } else {
                batch.set(ingredientRefTo, { ...ingredientFrom, name: to });
              }

              // delete fromIngredient
              batch.delete(ingredientRefFrom); // this is suspicious .... :) shouldnt it run BEFORE ??

              // rename ingredient in recipes
              for (const recipe in recipes) {
                const recipeIngredientFromRef = database
                  .collection(RECIPES_COLLECTION)
                  .doc(recipe)
                  .collection(INGREDIENTS_COLLECTION)
                  .doc(normalizedFrom);
                const recipeIngredientToRef = database
                  .collection(RECIPES_COLLECTION)
                  .doc(recipe)
                  .collection(INGREDIENTS_COLLECTION)
                  .doc(normalizedTo);

                const recipeIngredient = await recipeIngredientFromRef.get().then(snapshot => snapshot.data());

                batch.set(recipeIngredientToRef, { ...recipeIngredient, name: to });
                batch.delete(recipeIngredientFromRef); // this is suspicious .... :) shouldnt it run BEFORE ??
              }

              // remove FROM from the list
              batch.update(database.collection(INGREDIENTS_LIST_COLLECTION).doc("ingredients"), {
                value: firebase.firestore.FieldValue.arrayRemove(from)
              });

              // add TO to the list
              if (!ingredientTo) {
                batch.update(database.collection(INGREDIENTS_LIST_COLLECTION).doc("ingredients"), {
                  value: firebase.firestore.FieldValue.arrayUnion(to)
                });
              }

              batch
                .commit()
                .then(() => {
                  setStatus("SUCCESS");
                  setFrom("");
                  setTo("");
                })
                .catch(error => {
                  setStatus("ERROR");
                  setError(error);
                });
            }}
          >
            {status === "LOADING" ? <Spinner className="fill-current w-4 h-4 mr-2 fa-spin" /> : <Save />}
            Change
          </button>
        </div>
      </div>
    </div>
  );
};
