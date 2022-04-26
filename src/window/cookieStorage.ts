import { nullEncodedToken } from "@/customTypes";
import { encodedTokenFromAPI } from "@/interfaces";
import { checkObjectValidKeys, nameAndType } from "@/patterns/reflection";

export namespace DocumentIO {
  //This function read all cookies from the document and returns non-empty parsed objects as {data: "encoded token..."}
  export function readCookies() {
    const tokenCookies = arrangeDocumentCookies();
    return parseURITokens(tokenCookies);
  }
}

function arrangeDocumentCookies() {
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

//map handler
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
  } catch (e: any) {
    return nullEncodedToken();
  }

  // This line parses the outcoming cookie to check if it fits the current implementation of the API which sends an object as: {data: "..."}
  // if the parsed cookie doesn't fit this object an nullEncodedToken is returned
  if (!checkObjectValidKeys(nameAndType(nullEncodedToken), encodedToken)) {
    return nullEncodedToken();
  }

  return { ...encodedToken };
};
