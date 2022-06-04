import { DateService } from "@/utils/Date";
import jwt_decode from "jwt-decode";
import { checkObjectValidKeys, nameAndType } from "@/patterns/reflection";

/**
 * ! Public Interfece to comunicate Credentials utility with UserRepresentation
 */
export interface CredentialsMethodsForPresentationLayer {
  isValid(): boolean;
  isAuth(level: "rw" | "r"): boolean;
  showUser(): string;
}

/**
 * ! Class Credentials
 * Gives utilities to process credentials given by server after user log-in
 */
export class Credentials implements CredentialsMethodsForPresentationLayer {
  private readonly source: LoadJWT;
  private readonly token: PHP.decodedToken;

  constructor() {
    this.source = new LoadJWT();
    this.token = this.source.decode();
  }

  /**
   * A valid token is not expired and has a non-empty user name
   */
  public isValid(): boolean {
    const expired = this.token.exp < DateService.secondsSinceEpoch();
    const emptyUser = this.token.data.usr.length === 0;
    const unauthorized = this.token.data.aut === "none";
    const untargeted = this.token.data.rus.length === 0;
    return !expired && !emptyUser && !unauthorized && !untargeted;
  }

  /**
   * Check authenticated level of the user
   */
  public isAuth(level: "rw" | "r"): boolean {
    return this.isValid() && this.token.data.aut === PHP.dicAuthLevels[level];
  }

  /**
   * Gives information to the presentation layer ready to use
   */
  public showUser() {
    return this.isValid() ? this.token.data.usr : "invited";
  }
}
/**
 * ! Private Class LoadJWT
 * Fence against external services needed to proccess jwt from html-headers
 * It deals with non-own resources such as COOKIE-API, JWT-DECODE, SERVER-TYPES
 * and protects the run-time from one of those services throwing errors.
 */

class LoadJWT {
  private readonly encodedTokens: Array<string>;

  constructor() {
    const cookies = HeaderAPIs.getHeaders();
    this.encodedTokens = HeaderAPIs.parseURITokens(cookies);
  }

  /**
   * Checks whether some data has been rescued from cookies, but it don't see
   * if the data will ended creating valid data in later encoded steps.
   */
  public isEmpty(): boolean {
    return this.encodedTokens.length === 0;
  }

  /**
   * Decode headers to return the newer credentials bundle in an typed object
   */
  public decode(): PHP.decodedToken {
    const tokens = this.encodedTokens
      .map((token) => safeDecodeJWT({ data: token }))
      .sort((prev, next) => {
        if (prev === undefined || next === undefined) {
          return 0;
        }

        return next.exp - prev.exp;
      });

    if (tokens.length === 0) {
      return this.empty() as PHP.decodedToken;
    } else {
      return tokens[0] as PHP.decodedToken;
    }
  }

  /**
   * Gives an object with all fields nulled, which is useful as type template
   */
  public template() {
    return this.empty();
  }
  public empty() {
    return {
      exp: 0,
      aud: "",
      data: Object.freeze({ iss: "", uid: "", usr: "", aut: "none", rus: "" }),
    };
  }
}

/**
 * ! Interfaces, Types and Dictionaries of PHP Server
 * Defines all interfaces needed to process emmitted credentials from server.
 *
 * TODO: introduce-php-ts-middleware-type-system
 * ! Warning: It needs to manually follow any change in the server specification
 */
namespace PHP {
  export interface encodedToken {
    data: string;
  }
  export interface decodedToken {
    exp: number;
    aud: string;
    //TODO: inconsistent-read-only-type-utility-applied
    //as a developer I don't have control over where I've setted this property
    //and why I expect collisions with readonly members class but doesn't
    data: Readonly<tokenData>;
  }
  export interface tokenData {
    iss: string;
    uid: string;
    usr: string;
    aut: authLevel;
    rus: string;
  }
  export const dicAuthLevels: {
    rw: authLevel;
    r: authLevel;
  } = {
    rw: "read-write",
    r: "read",
  };
  type authLevel = "read-write" | "read" | "none";
}

/**
 * Functions dealing with Window Document JS APIS in relation to headers access
 */
namespace HeaderAPIs {
  export function parseURITokens(encodedTokens: string[]): Array<string> {
    const hDecodeURI = (cookie: string): string => {
      try {
        const decoded = window.decodeURIComponent(cookie);
        const encodedToken = JSON.parse(decoded) as PHP.encodedToken;

        //TODO ref:restore-method-check-encoded
        //During the refactor, this check wasn't possible to do so its disabled.
        //!if (!checkObjectValidKeys(nameAndType(nullEncodedToken), encodedToken)) {
        //!return undefined;
        //!}

        return encodedToken.data;
      } catch (e) {
        return "";
      }
    };
    return encodedTokens
      .map(hDecodeURI)
      .filter((encodedToken) => Boolean(encodedToken.length));
  }
  export function getHeaders(): string[] {
    // Cookie API
    const cookies = window.document.cookie;

    //Run-time check to avoid some API corruption that wont return string type
    if (typeof cookies !== "string") {
      return [];
    }

    return cookies.split(";").map((cookie) => cookie.trim().split("=")[1]);
  }
}

/**
 * Decode tokens using given server types, protecting against run-time erros
 */
function safeDecodeJWT(
  encoded: PHP.encodedToken
): PHP.decodedToken | undefined {
  try {
    const token = jwt_decode<PHP.decodedToken>(encoded.data);
    //Check decoded token match all the fields of an empty token
    const { data, ...header } = {
      exp: 0,
      aud: "",
      data: { iss: "", uid: "", usr: "", aut: "none", rus: "" },
    };
    const validHeader = checkObjectValidKeys(nameAndType(header), token);
    const validData = checkObjectValidKeys(nameAndType(data), token.data);
    if (!validHeader || !validData) {
      return undefined; //checked
    }
    return { ...token, data: { ...token.data } };
  } catch {
    return undefined; //checked
  }
}

//! Testing
export default {
  loadjwt: () => new LoadJWT(),
  credentials: () => new Credentials(),
};
