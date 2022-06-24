import jwt_decode from "jwt-decode";
import { nullToken } from "@/customTypes";
import { encodedTokenFromAPI, token } from "@/interfaces";
import { checkObjectValidKeys, nameAndType } from "@/patterns/reflection";

// This function wraps jwt_decode to create a nothrow function that allways gives you a token either valid or empty (null)
export function safeDecodeJWT(encodedToken: encodedTokenFromAPI) {
  const checkValid = typeof encodedToken == "object" && "data" in encodedToken;
  if (!checkValid) {
    return nullToken(); //checked
  }

  let token: token;
  try {
    token = jwt_decode<token>(encodedToken.data);
  } catch {
    return nullToken(); //checked
  }
  //Check decoded token match all the fields of an empty token
  const { data, ...header } = nullToken();
  const validHeader = checkObjectValidKeys(nameAndType(header), token);
  const validData = checkObjectValidKeys(nameAndType(data), token.data);

  console.log("Valid Header", validHeader, token);

  console.log("Valir Data", validData, token.data);
  if (!validHeader || !validData) {
    return nullToken(); //checked
  }

  //Check-passed and return a valid token
  return { ...token, data: { ...token.data } };
}
