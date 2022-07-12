import jwt_decode from "jwt-decode";
import { nullToken } from "../customTypes";
import { encodedTokenFromAPI, isData, isToken, token } from "../interfaces";

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
  const validHeader = isToken(token);
  const validData = isData(token.data);

  if (!validHeader || !validData) {
    return nullToken(); //checked
  }

  //Check-passed and return a valid token
  return { ...token, data: { ...token.data } };
}
