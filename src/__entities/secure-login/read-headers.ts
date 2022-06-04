import { safeDecodeJWT } from "@/modules/jwt";
import { DateService } from "@/utils/Date";

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
  private readonly token: token;

  constructor() {
    this.source = new LoadJWT();
    this.token = this.source.copy();
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
    return this.isValid() && this.token.data.aut === dicLevelsFromAPI[level];
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
    const cookies = Document.Cookie.readBodies();
    this.encodedTokens = parseURITokens(cookies);
  }

  /**
   * Checks whether some data has been rescued from cookies, but it don't see
   * if the data will ended creating valid data in later encoded steps.
   */
  public isEmpty(): boolean {
    return this.encodedTokens.length === 0;
  }

  public copy(): token {
    const tokens = this.encodedTokens
      .map((token) => safeDecodeJWT({ data: token }))
      .sort((prev, next) => {
        return next.exp - prev.exp;
      });

    if (tokens.length === 0) {
      return Object.freeze({
        exp: 0,
        aud: "",
        data: { iss: "", uid: "", usr: "", aut: "none", rus: "" },
      });
    } else {
      return tokens[0] as token;
    }
  }
}
//! These are things that depends on the Backend API
//TODO ref:crentalize-external-methods-and-types-from-API
//I need a place to gather all interfaces needed to comunicate with my API
//as long as now they run independently, so a change in API implementation
//must be manually reflected in all affected parts of client service
type encodedTokenFromAPI = { data: string };
interface token {
  exp: number;
  aud: string;
  data: tokenData;
}
type APIauthenticationLevels = "read-write" | "read";
type InternalNonAuthenticationLevel = "none";

//TODO ref:ts-avoid-possible-type-union-collision
//If spec in API changes in future, the client just rely it won't make use of
//any Internal spec keyword which is not desirable.
type AuthLevels = APIauthenticationLevels | InternalNonAuthenticationLevel;

interface tokenData {
  iss: string;
  uid: string;
  usr: string;
  aut: AuthLevels;
  rus: string;
}
const dicLevelsFromAPI: {
  rw: APIauthenticationLevels;
  r: APIauthenticationLevels;
} = {
  rw: "read-write",
  r: "read",
};
//!--------------------------------------------------

namespace Document {
  export namespace Cookie {
    export function readBodies(): string[] {
      const cookies = window.document.cookie;

      if (typeof cookies !== "string") {
        return [""];
      }

      return cookies.split(";").map((cookie) => cookie.trim().split("=")[1]);
    }
  }
}

const hDecodeURI = (cookie: string): string => {
  try {
    const decoded = window.decodeURIComponent(cookie);
    const encodedToken = JSON.parse(decoded) as encodedTokenFromAPI;

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

function parseURITokens(encodedTokens: string[]): Array<string> {
  return encodedTokens
    .map(hDecodeURI)
    .filter((encodedToken) => Boolean(encodedToken.length));
}

//! Testing
export default {
  loadjwt: () => new LoadJWT(),
  credentials: () => new Credentials(),
};
