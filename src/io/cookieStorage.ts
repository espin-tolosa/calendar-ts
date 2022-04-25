//type EncodedToken = string | undefined;
//TODO: make a function isJWTToken to filter cookies exactly
//All captured cookies are filtered to remove session cookies
//there is no other way to get token cookies.
//By design emitted tokens change its name randomly each 24hours
//so there is no easy pattern in there. In fact yes it is, anyone could
//make a function called isJWTToken matching some sort of JWT pattern

import { CustomTypes, CustomValues } from "@/customTypes";

export const recoverEncodedTokensFromCookies = () => {
  const cookies = window.document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => {
      const cookieName = cookie.split("=")[0];
      return cookieName !== "PHPSESSID";
    })
    .map((cookie) => cookie.split("=")[1]);

  return cookies;
};

export const parseURITokens = (encodedTokens: string[]) => {
  const tokensPull = encodedTokens.map(decodeURIhandler);

  return tokensPull;
};

const decodeURIhandler = (cookie: string) => {
  type encodedTokenFromAPI = { data: string };
  if (!cookie) {
    return { data: "" } as encodedTokenFromAPI;
  }

  let decoded: string = "";
  try {
    decoded = decodeURIComponent(cookie);
  } catch (e: any) {
    console.error("URIError", e instanceof URIError);
  }

  if (!decoded) {
    return { data: "" } as encodedTokenFromAPI;
  }

  let token = CustomValues.nullEncodedToken(); //{data: ""}
  try {
    token = JSON.parse(decoded);
  } catch (e: any) {
    console.error("JSON parse SyntaxError", e instanceof SyntaxError);
  }

  return token;
};
