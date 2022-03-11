import jwt_decode from "jwt-decode";
type EncodedToken = {
  data: string | undefined;
};
interface MyToken {
  name: string;
  exp: number;
  data: { iss: string; usr: string; aut: string; rus: string };
  // whatever else is in the JWT.
}

const nullToken: MyToken = {
  name: "",
  exp: 0,
  data: { iss: "", usr: "", aut: "", rus: "" },
};

export const useToken = () => {
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
  const allTokens = tokenCookies.map((cookie): EncodedToken => {
    if (!cookie) {
      return { data: undefined };
    }

    let decoded: string = "";
    try {
      decoded = decodeURIComponent(cookie);
    } catch (e: any) {
      //catch type must be any, Typescript doesn't allow to specify type as URIError
      console.error("URIError", e instanceof URIError); // true
      console.error(e.message); // "malformed URI sequence"
      console.error(e.name); // "URIError"
      console.error(e.fileName); // "Scratchpad/1"
      console.error(e.lineNumber); // 2
      console.error(e.columnNumber); // 2
      console.error(e.stack); // "@Scratchpad/2:2:3\n"
    }

    if (!decoded) {
      return { data: undefined };
    }

    let token: EncodedToken = { data: undefined };
    try {
      token = JSON.parse(decoded);
    } catch (e: any) {
      console.error("JSON parse SyntaxError", e instanceof SyntaxError);
      console.error(e.message);
      console.error(e.name);
      console.error(e.fileName);
      console.error(e.lineNumber);
      console.error(e.columnNumber);
      console.error(e.stack);
    }

    return token;
  });
  try {
    return jwt_decode<MyToken>(allTokens.at(0)?.data || "");
  } catch (e: any) {
    console.error("JWT decode error no token supplied");
    return nullToken;
  }
};
