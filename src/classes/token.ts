import jwt_decode, { InvalidTokenError } from "jwt-decode";
import { DateService } from "@/utils/Date";
import { token } from "@/interfaces";
type EncodedToken = {
  data: string | undefined;
};

export class Token {
  constructor(token: token) {
    this.token = token;
  }
  private token: token;

  public static nullToken = new Token({
    name: "",
    exp: 0,
    data: { iss: "", usr: "", aut: "", rus: "" },
  });

  // Is valid token just do some checks in any found token
  public isValid() {
    const secondsSinceEpoch = DateService.secondsSinceEpoch();

    return this.token.exp > secondsSinceEpoch && this.token.data.usr !== "";
  }

  public expires() {
    return this.token.exp;
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

  public static getToken = () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

    //All captured cookies are filtered to remove session cookies
    //there is no other way to get token cookies.
    //By design emitted tokens change its name randomly each 24hours
    //so there is no easy pattern in there. In fact yes it is, anyone could
    //make a function called isJWTToken matching some sort of JWT pattern
    //TODO: make a function isJWTToken to filter cookies exactly
    const tokenCookies: Array<string | undefined> = cookies
      .filter((cookie) => {
        const cookieName = cookie.split("=").at(0);
        return cookieName !== "PHPSESSID";
      })
      .map((cookie) => cookie.split("=").at(1));

    //Mapping all remaining cookies of type JWT Token to decode and parse them
    // It should be only one, but if cookies deletion failed could be more
    const tokensPull = tokenCookies.map((cookie): EncodedToken => {
      if (!cookie) {
        return { data: undefined };
      }

      let decoded: string = "";
      try {
        decoded = decodeURIComponent(cookie);
      } catch (e: any) {
        //catch type must be any, Typescript doesn't allow to specify type as URIError
        console.error("URIError", e instanceof URIError); // true
      }

      if (!decoded) {
        return { data: undefined };
      }

      let token: EncodedToken = { data: undefined };
      try {
        token = JSON.parse(decoded);
      } catch (e: any) {
        console.error("JSON parse SyntaxError", e instanceof SyntaxError);
      }

      return token;
    });

    try {
      const decodedTokens: Array<Token> = tokensPull.map((encodeToken) => {
        return new Token(jwt_decode<token>(encodeToken.data || ""));
      });

      //Sort tokens giving the bigger exp date in the first position of the array
      const sortedTokens = decodedTokens.sort(
        (prev, next) => next.expires() - prev.expires()
      );
      if (!sortedTokens[0].isValid()) {
        throw Error("Invalid token");
      }

      return sortedTokens[0];
    } catch (token: any) {
      return Token.nullToken;
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
