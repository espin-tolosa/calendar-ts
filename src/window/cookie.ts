import { nullEncodedToken } from "../customTypes";
import { encodedTokenFromAPI, isEncodedToken } from "../interfaces";

const hDecodeURI = (cookie: string): encodedTokenFromAPI => {
  if (!cookie) {
    return nullEncodedToken();
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(cookie);
  } catch {
    return nullEncodedToken();
  }

  if (decoded === "") {
    return nullEncodedToken();
  }

  let encodedToken: encodedTokenFromAPI;
  try {
    encodedToken = JSON.parse(decoded);
  } catch {
    return nullEncodedToken();
  }

  // This line parses the outcoming cookie to check if it fits the current implementation of the API which sends an object as: {data: "..."}
  // if the parsed cookie doesn't fit this object an nullEncodedToken is returned
  if (!isEncodedToken(encodedToken)) {
    return nullEncodedToken();
  }

  return { ...encodedToken };
};

function readCookiesBody() {
  const cookies = window.document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[1]);

  return cookies;
}

function parseURITokens(encodedTokens: string[]) {
  return encodedTokens
    .map(hDecodeURI)
    .filter((encodedToken) => encodedToken.data !== "");
}
//Tested on describe: "Testing window api read encoded tokens"
export namespace DocumentIO {
  //This function read all cookies from the document and returns non-empty parsed objects as {data: "encoded token..."}

  export function readTokens() {
    const tokenCookies = readCookiesBody();
    return parseURITokens(tokenCookies);
  }

  export function readCookiesName() {
    return window.document.cookie
      .split(";")
      .filter((cookie) => cookie !== "")
      .map((cookie) => cookie.split("=")[0]);
  }

  export function deleteAllCookies() {
    const cookiesName = DocumentIO.readCookiesName();
    cookiesName.map((name) => DocumentIO.deleteCookie(name));
  }

  export function deleteCookie(name: string) {
    //! TL;DR
    //	https://stackoverflow.com/questions/2959010/how-to-get-the-domain-value-for-a-cookie-in-javascript
    //	The cookie metadata like path, domain and expires are not visible to site code (neither to JavaScript nor to the server-side).
    //	You can only access cookies from the same domain (this includes subdomains). Obviously doing otherwise would be a security concern.
    //	To only remove a cookie at any subdomain level, what you could do is try to remove the cookie at every possible level of specificity, eg:

    //	Blank spaces left just for readability in this example:

    //	document.cookie= 'foo=;domain=           example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';
    //	document.cookie= 'foo=;domain=    domain.example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';
    //	document.cookie= 'foo=;domain=sub.domain.example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';

    //! Note about legacy:
    //	in production env (https://jhdiary.com), the backend emitts the following cookies:
    //
    //	- PHPSESSID: Domain=jhdiary.com
    //	- TOKENHASH: Domain=.jhdiary.com
    //
    //	so in order to delete all cookies I've tried to just delete them by preceding a dot before domain name
    //	it seems to work in development env so I presume it will also work in production env
    const legacy = ".";

    const location = legacy + window.document.location.host.split(":")[0];

    window.document.cookie = `${name}=; Domain=${location}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  //map handler
}
