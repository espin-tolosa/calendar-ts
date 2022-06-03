import { encodedTokenFromAPI, token } from "@/interfaces";
import { safeDecodeJWT_parallel } from "@/modules/jwt";
namespace Document {
  export namespace Cookie {
    export function readBodies(): string[] {
      return window.document.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("=")[1]);
    }
  }
}

const hDecodeURI = (cookie: string): encodedTokenFromAPI | undefined => {
  if (!cookie) {
    return undefined;
  }

  let decoded: string;
  try {
    decoded = window.decodeURIComponent(cookie);
  } catch {
    return undefined;
  }

  if (decoded === "") {
    return undefined;
  }

  try {
    const encodedToken = JSON.parse(decoded) as encodedTokenFromAPI;
    // This line parses the outcoming cookie to check if it fits the current implementation of the API which sends an object as: {data: "..."}
    // if the parsed cookie doesn't fit this object an nullEncodedToken is returned
    //!if (!checkObjectValidKeys(nameAndType(nullEncodedToken), encodedToken)) {
    //!return undefined;
    //!}

    return encodedToken;
  } catch (e) {
    return undefined;
  }
};

function parseURITokens(encodedTokens: string[]) {
  return encodedTokens.map(hDecodeURI).filter((encodedToken) => !encodedToken);
}

export class TokenEncoded {
  private readonly state?: token;

  constructor() {
    const cookies = Document.Cookie.readBodies();
    const result = parseURITokens(cookies);

    //TODO (002): this is proposed to be part of final Token class
    const tokens = result.map(safeDecodeJWT_parallel).sort((prev, next) => {
      return next.exp - prev.exp;
    });

    if (tokens.every((token) => token !== undefined) && tokens.length === 0) {
      this.state = undefined;
    } else {
      this.state = tokens[0] as token;
    }
  }

  /**
   * Checks whether some data has been rescued from cookies, but it don't see
   * if the data will ended creating valid data in later encoded steps.
   */
  public isEmpty(): boolean {
    return this.state === undefined;
  }
}
