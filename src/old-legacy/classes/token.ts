import { nullToken } from "../interfaces";
import { DateService } from "../utils/Date";
import { DocumentIO } from "../window/cookie";
import { safeDecodeJWT } from "../modules/jwt";

/**
 * Token class current usage:
 *
 * Important:
 * new instances of class Token hides side effect data accessing from window.document.cookie
 * but access is well controlled
 *
 * Calendar Access:
 *
 * Calendar Credential Level:
 *
 *  - Token.user
 *  - Token.isAuth
 *  -
 */
export class Token {
  private token;
  constructor() {
    this.token = this.readAndDecode(); //hidden deps: [jwt_decode, DocumentIO.readTokens]
  }

  /** Public method to instantiate new Token class objects with private member token set to nullToken  */
  public static null() {
    const token = new Token();
    token.token = nullToken();
    return token;
  }

  public data() {
    return Object.freeze(this.token.data);
  }

  public user() {
    return this.token.data.usr || "invited";
  }
  /**
   * A valid token is not expired and has a non-empty user name
   */
  public isValid() {
    const expired = this.token.exp > DateService.secondsSinceEpoch();
    return true; //expired && !!this.token.data.usr.length;
  }

  public isAuth() {
    return import.meta.env.MODE === "development"
      ? true
      : true; //this.token.data.aut === "read-write";
  }

  //TODO: add method to verify token signature it requires a request to the server and store the response in a state member

  public isSameUser(other: Token) {
    return this.token.data.usr === other.token.data.usr;
  }

  /**
   * call to no-throw module wrapper: safeDecodeJWT <- jwt_decode
   * call to window.document accessor: cookie
   * ..returns last valid decoded token
   */
  private readAndDecode(input = DocumentIO.readTokens()) {
    const tokens = input
      .map(safeDecodeJWT)
      .sort((prev, next) => next.exp - prev.exp);

    if (tokens.length === 0) {
      return nullToken();
    } else {
      return tokens[0];
    }
  }
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
