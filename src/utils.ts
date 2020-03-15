export const transformTime = (time: number) => {
  return time ? `${time} mins` : "-";
};

export const transformUnit = (quantity: number, unit: string) => {
  if (unit === "Gramme") {
    return `${quantity}g`;
  } else if (unit === "Litre") {
    return `${quantity}l`;
  }
  return `${quantity}`;
};

export const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};
