export const transformTime = (time: number) => {
  return time ? `${time} mins` : "-";
};

export const transformUnit = (quantity: number, unit: string) => {
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
