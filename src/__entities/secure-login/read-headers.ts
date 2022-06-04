import { safeDecodeJWT } from "@/modules/jwt";
import { DateService } from "@/utils/Date";

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
      return window.document.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("=")[1]);
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

export interface CredentialsMethodsForPresentationLayer {
  isValid(): boolean;
  isAuth(level: "rw" | "r"): boolean;
  showUser(): string;
}

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
    const expired = this.token.exp > DateService.secondsSinceEpoch();
    return expired && Boolean(this.token.data.usr.length);
  }

  /**
   * Check authenticated level of the user
   */
  public isAuth(level: "rw" | "r"): boolean {
    return this.isValid() && this.token.data.aut === dicLevelsFromAPI[level];
  }

  //TODO ref:apply-solid-in-show-user
  // This method violates Single Responsability Principle
  // I would needed another entity to deal with presentation bussines logic
  // instead of having this "invited" state deep nested in Credentials

  /**
   * !deprecated:
   * Gives information to the presentation layer ready to use
   */
  public showUser() {
    return this.token.data.usr || "invited";
  }

  /**
   * !deprecated:
   * Check if a friend token has the same id of the current one
   * friend name is choosen to hint that private fields are accessible
   * whithin the same class
   */
  public isSameUser(friend: Credentials): boolean {
    return this.token.data.uid === friend.token.data.uid;
  }
}

//! Testing
export default {
  loadjwt: () => new LoadJWT(),
  credentials: () => new Credentials(),
};
