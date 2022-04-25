import jwt_decode from "jwt-decode";
import { DateService } from "@/utils/Date";
import { encodedTokenFromAPI, token } from "@/interfaces";
import {
  parseURITokens,
  recoverEncodedTokensFromCookies,
} from "@/io/cookieStorage";
import { CustomValues } from "@/customTypes";

//This class recieves any data from external api and returns a parsed valid object of either type:
// - CustomType.null...
// - Valid Object
export namespace ExternalParser {
  //any because In fact encodedToken from external api could be anything
  //even when actually its type is encodedTokenFromAPI I might change in future
  export function fromTokenPHP(encodedToken: encodedTokenFromAPI) {
    //Full tested
    const checkValid =
      typeof encodedToken == "object" && "data" in encodedToken;
    if (!checkValid) {
      return CustomValues.nullToken(); //checked
    }

    try {
      const token = jwt_decode<token>(encodedToken.data);
      if (
        typeof token === "object" &&
        "exp" in token &&
        typeof token.exp === "number" &&
        "aud" in token &&
        typeof token.aud === "string" &&
        typeof token.data === "object" &&
        "iss" in token.data &&
        typeof token.data.iss === "string" &&
        "usr" in token.data &&
        typeof token.data.usr === "string" &&
        "aut" in token.data &&
        typeof token.data.aut === "string" &&
        "rus" in token.data &&
        typeof token.data.rus === "string"
      ) {
        const filteredToken: token = {
          exp: token.exp,
          aud: token.aud,
          data: {
            iss: token.data.iss,
            usr: token.data.usr,
            aut: token.data.aut,
            rus: token.data.rus,
          },
        };
        return filteredToken; //checked
      } else {
        return CustomValues.nullToken(); //checked
      }
    } catch {
      return CustomValues.nullToken(); //checked
    }
  }
}

/**
 * Token class current usage:
 *
 * Calendar Access:
 *  - new Token: to emitt null Tokens
 *  - Token.getToken(): to retrieve and decode a token from document.cookie
 *
 * Calendar Credential Level:
 *  - Token.user
 *  - Token.isAuth
 *  -
 */

export class Token {
  private token;
  constructor(token = CustomValues.nullToken()) {
    this.token = token;
  }

  // Is valid token just do some checks in any found token
  public isValid() {
    const expired = this.token.exp > DateService.secondsSinceEpoch();
    return expired && !!this.token.data.usr.length;
  }

  public user() {
    return this.token.data.usr || "invited";
  }

  public isAuth() {
    return this.token.data.aut === "read-write";
  }

  public isSamePerson(other: Token) {
    const sameAuth = this.isAuth() === other.isAuth();
    const sameName = this.user() === other.user();

    return sameAuth && sameName;
  }

  public createTokenFromCookies = () => {
    const tokenCookies = recoverEncodedTokensFromCookies();
    const tokensPull = parseURITokens(tokenCookies);
    return tokensPull;
  };

  public decodeTokens = (tokensPull: Array<encodedTokenFromAPI>) => {
    const parsedToken: Array<token> = tokensPull
      .map(ExternalParser.fromTokenPHP)
      .sort((prev, next) => prev.exp - next.exp);
    return parsedToken;
  };

  public static getToken = () => {
    const tokenCookies = recoverEncodedTokensFromCookies();
    const tokensPull = parseURITokens(tokenCookies);
    //Mapping all remaining cookies of type JWT Token to decode and parse them
    // It should be only one, but if cookies deletion failed could be more

    try {
      const decodedTokens: Array<Token> = tokensPull.map((encodeToken) => {
        return new Token(jwt_decode<token>(encodeToken.data || ""));
      });

      //Sort tokens giving the bigger exp date in the first position of the array
      const sortedTokens = decodedTokens.sort(
        (prev, next) => next.token.exp - prev.token.exp
      );
      if (!sortedTokens[0].isValid()) {
        throw Error("Invalid token");
      }

      return sortedTokens[0];
    } catch {
      return new Token(); //returns an empty token
    }
  };
}

// DONE
// I need to create a class that recieve a token and have some methods, like isValidToken, and get name and auth level for some user.
// this class will consumed in custom hook useToken here:
// const token /* class */ = jwt_decode<MyToken>(allTokens.at(0)?.data || "");
// and other consumers of useToken will have access to the public method of the token class

// TODO
// In other hand I need to fix a bug in custom hook useUserSession, because the way to check if a user is logged in the system is buggy
// actually it checks the existence of two cookies, which are presumibly emitted by our trusted server, but in fact the content of those cookies
// is not checked so the can be created by any malware. In second instance it won't represent a big deal because this check done in Login component
// is re-checked in the right way within the Topnav component, which then detects the discordance and clear the session and remove the cookies.
// Even if a malware user patch the Topnav component to access the calendar with fake cookies, the server is checking each request and if it detects
// that it is an untrusted token setted in the cookies header it will send a response to erase the cookies in the browser and also reject the request.
// Could a user hack the server sendind many cookies or other unknown methods? I don't know, It is a topic for future discussion, but in principle
// the system is designed to expect a cookie named with a hash that changes each 24h, so even when a user sends back a trusted token, it won't be
// recognized by the server after 00:00:00h of the next day he recieve it by login in the system.
