import { Unit } from "./type";

export const transformTime = (time: number) => {
  if (time > 60) {
    const hours = Math.floor(time / 60);
    const minuts = time % 60;
    return `${hours}h${minuts || ""}`;
  }
  return time ? `${time}mins` : "-";
};

export const units: Unit[] = [
  "Gramme",
  "Kg",
  "Litre",
  "Cl",
  "Ml",
  "C. à Soupe",
  "C. à Café",
  "Piece",
  "Pincée",
  "Aucune"
];

export const transformUnit = (quantity: number, unit: Unit) => {
  if (unit === "Gramme") {
    return `${quantity}g`;
  } else if (unit === "Kg") {
    return `${quantity}kg`;
  } else if (unit === "Litre") {
    return `${quantity}l`;
  } else if (unit === "Ml") {
    return `${quantity}ml`;
  } else if (unit === "Cl") {
    return `${quantity}cl`;
  } else if (unit === "C. à Soupe") {
    return `${quantity} C. à Soupe`;
  } else if (unit === "C. à Café") {
    return `${quantity} C. à Café`;
  } else if (unit === "Aucune") {
    return "";
  }
  return `${quantity}`;
};

export const wait = (timeout: number): Promise<number> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(timeout);
    }, timeout);
  });
};

export const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD") // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-']/g, " ") // replace - and ' by space
    .replace(/[^a-z ]/g, ""); // keep letter and spaces

export const generateSearch = (value: string, categories: string[]): string[] => {
  const normalizedName = normalizeName(value);
  const searchesByWords = normalizedName
    .split(" ")
    .filter(word => word.length > 2)
    .map(word => {
      // generate search words, we generate only for starting words
      const words = [];
      for (let i = 3; i <= word.length; i++) {
        words.push(word.substring(0, i));
      }
      return words;
    })
    .flat();

  const searchesByNameParts = [];
  for (let i = 3; i <= normalizedName.length; i++) {
    searchesByNameParts.push(normalizedName.substring(0, i));
  }
  return [...searchesByWords, ...categories.map(normalizeCategory), ...searchesByNameParts];
};

export const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/ /g, "-");

export const normalizeCategory = (category: string) =>
  `category-${category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()}`;

export const categories = [
  "Cookeo",
  "Batch",
  "Dessert",
  "Quitoque",
  "Asiatique",
  "Accompagnements",
  "Été",
  "Automne",
  "Hiver",
  "Printemps",
  "Todo"
];
export const normalizedCategories = categories.map(category => ({ id: normalizeCategory(category), title: category }));
