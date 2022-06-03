import { encodedTokenFromAPI, token } from "@/interfaces";
import { safeDecodeJWT } from "@/modules/jwt";
import { DateService } from "@/utils/Date";
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
    // This line parses the outcoming cookie to check if it fits the current implementation of the API which sends an object as: {data: "..."}
    // if the parsed cookie doesn't fit this object an nullEncodedToken is returned

    //TODO ref:restore-this-check-encoded
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
    .filter((encodedToken) => !encodedToken.length);
}

export class TokensDocument {
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
    return Boolean(this.encodedTokens.length);
  }

  public decodeLast(): token {
    const tokens = this.encodedTokens
      .map((token) => safeDecodeJWT({ data: token }))
      .sort((prev, next) => {
        return next.exp - prev.exp;
      });

    if (tokens.length === 0) {
      return Object.freeze({
        exp: 0,
        aud: "",
        data: { iss: "", uid: "", usr: "", aut: "", rus: "" },
      });
    } else {
      return tokens[0] as token;
    }
  }
}

export class LastToken {
  private readonly source: TokensDocument;
  private readonly token: token;

  constructor() {
    this.source = new TokensDocument();
    this.token = this.source.decodeLast();
  }

  //TODO ref:class-token-change-data-method
  //proposed to change this method name to copy()
  public data() {
    return Object.freeze(this.token.data);
  }

  //TODO ref:class-token-change-user-method
  //proposed to change this method name by showUser()
  public user() {
    return this.token.data.usr || "invited";
  }
  /**
   * A valid token is not expired and has a non-empty user name
   */
  public isValid(): boolean {
    const expired = this.token.exp > DateService.secondsSinceEpoch();
    return expired && !!this.token.data.usr.length;
  }

  /**
   * Check authenticated level of the user
   */
  public isAuth(level: "read-write" | "read"): boolean {
    return this.isValid() && this.token.data.aut === level;
  }

  /**
   * Check if a friend token has the same id of the current one
   * friend name is choosen to hint that private fields are accessible
   * whithin the same class.
   */
  public isSameUser(friend: LastToken): boolean {
    return this.token.data.uid === friend.token.data.uid;
  }
}
