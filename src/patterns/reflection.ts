type primitives =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "object"
  | "symbol"
  | "undefined";

type name = string;

type kv = {
  name: name;
  type: primitives;
};

export function checkObjectValidKeys(keys: Array<kv>, object: any) {
  if (typeof object !== "object") {
    return false;
  }
  return keys
    .map((k) => k.name in object && typeof object[k.name] === k.type)
    .every((check) => check);
}

//return and Array of key-value pairs with the name and the type of each field of an object
export const nameAndType = (object: object) =>
  Object.entries(object).map((k) => ({
    name: k[0],
    type: typeof k[1],
  }));
