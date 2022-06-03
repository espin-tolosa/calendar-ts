import jwt_decode from "jwt-decode";
import { nullToken } from "@/customTypes";
import { encodedTokenFromAPI, token } from "@/interfaces";
import { checkObjectValidKeys, nameAndType } from "@/patterns/reflection";

// This function wraps jwt_decode to create a nothrow function that allways gives you a token either valid or empty (null)
//TODO (001) this function highly coupled to definition of encodedTokenFromAPI
//it should be moved to some encodedTokenFromAPI class and take a dependency from jwt_decode
//someone could think this:
//that dependency should follow an interface to allow easy interchangabillity if in the future
//a new library for decode jwt appears.
//but in fact it is not needed, because the library provide us a way to specify the return type
//as long as we provide a string as input. So the coupling introduced by consume directly from this library is low.

export function safeDecodeJWT(encodedToken: encodedTokenFromAPI): token {
  try {
    const token = jwt_decode<token>(encodedToken.data);
    //Check decoded token match all the fields of an empty token
    const { data, ...header } = nullToken();
    const validHeader = checkObjectValidKeys(nameAndType(header), token);
    const validData = checkObjectValidKeys(nameAndType(data), token.data);
    if (!validHeader || !validData) {
      return nullToken(); //checked
    }
    return { ...token, data: { ...token.data } };
  } catch {
    return nullToken(); //checked
  }
}
