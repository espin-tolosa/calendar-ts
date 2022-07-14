export function isEvent(
  obj: Record<PropertyKey, unknown>
): obj is Record<PropertyKey, unknown> & jh.event {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.hasOwn(obj, "id") &&
    typeof obj["id"] === "number" &&
    Object.hasOwn(obj, "client") &&
    typeof obj["client"] === "string" &&
    Object.hasOwn(obj, "job") &&
    typeof obj["job"] === "string" &&
    Object.hasOwn(obj, "start") &&
    typeof obj["start"] === "string" &&
    Object.hasOwn(obj, "end") &&
    typeof obj["end"] === "string" &&
    Object.hasOwn(obj, "mutable") &&
    typeof obj["mutable"] === "object"
  );
}

export interface loginForm {
  user: string;
  password: string;
}

//Encoded tokens from API are expided within array that parses as this object {data: "encodedToken..."}
export type encodedTokenFromAPI = { data: string };
export function isEncodedToken(
  obj: encodedTokenFromAPI
): obj is encodedTokenFromAPI {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.hasOwn(obj, "data") &&
    typeof obj["data"] === "string"
  );
}

export interface token {
  exp: number;
  aud: string;
  data: tokenData;
}

export interface tokenData {
  iss: string;
  usr: string;
  aut: string;
  rus: string;
}
export function isToken(obj: token): obj is token {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.hasOwn(obj, "exp") &&
    typeof obj["exp"] === "number" &&
    Object.hasOwn(obj, "aud") &&
    typeof obj["aud"] === "string" &&
    Object.hasOwn(obj, "data") &&
    typeof obj["data"] === "object"
  );
}
export function isData(obj: tokenData): obj is tokenData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.hasOwn(obj, "iss") &&
    typeof obj["iss"] === "string" &&
    Object.hasOwn(obj, "usr") &&
    typeof obj["usr"] === "string" &&
    Object.hasOwn(obj, "aut") &&
    typeof obj["aut"] === "string" &&
    Object.hasOwn(obj, "rus") &&
    typeof obj["rus"] === "string"
  );
}

export type setstate<S> = React.Dispatch<React.SetStateAction<S>>;

export type children = { children: React.ReactNode };

export type composition = React.FC<children>;
