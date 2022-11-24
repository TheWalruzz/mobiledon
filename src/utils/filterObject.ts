export const filterObject = <T, U extends Record<string, T>>(
  obj: U,
  callback: (item: T, key: keyof U) => boolean,
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => callback(val, key)),
  );
};

export const filterDefinedKeys = <T, U extends Record<string, T>>(obj: U) => {
  return filterObject(obj, (item) => item !== undefined);
};
