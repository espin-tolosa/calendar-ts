type primitiveTypes =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "object"
  | "symbol"
  | "undefined";

type kv = {
  name: PropertyKey;
  type: primitiveTypes;
};

// Function created to tell TS allow us the use object prototype in order to avoid: 'prop in obj' as it scope is broader than 'obj.hasOwnProperty(prop)'
// references:
//	- difference between 'in' vs 'hasOwnProperty':	https://stackoverflow.com/a/13633027/11231828
//	- implementation of hasOwnProperty in TS:				https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

// This function could recieve anything as object is intended to come from outside, so even if I type object as object I can't remove the first check because it is checking the run-time
export function checkObjectValidKeys(propsToCheck: Array<kv>, object: unknown) {
  //Run-time check
  if (object === null || typeof object !== "object") {
    return false;
  }

  return propsToCheck
    .map(
      (k) => hasOwnProperty(object, k.name) && typeof object[k.name] === k.type
    )
    .every((check) => check);
}

// This is a helper function that create the expected array of key-values of {prop-type} for the object we want to check
// by using a reference object from the library, usually it takes a null object
// return and Array of key-value pairs with the name and the type of each field of an object
export const nameAndType = (object: object) =>
  Object.entries(object).map((k) => ({
    name: k[0],
    type: typeof k[1],
  }));
