//type EncodedToken = string | undefined;
//TODO: make a function isJWTToken to filter cookies exactly
//All captured cookies are filtered to remove session cookies
//there is no other way to get token cookies.
//By design emitted tokens change its name randomly each 24hours
//so there is no easy pattern in there. In fact yes it is, anyone could
//make a function called isJWTToken matching some sort of JWT pattern

import { nullEncodedToken } from "@/customTypes";
import { encodedTokenFromAPI } from "@/interfaces";
import { checkObjectValidKeys, nameAndType } from "@/patterns/reflection";

export const recoverEncodedTokensFromCookies = () => {
  const cookies = window.document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[1]);

  return cookies;
};

export const parseURITokens = (encodedTokens: string[]) => {
  const tokensPull = encodedTokens.map(decodeURIhandler);

  return tokensPull;
};

const decodeURIhandler = (cookie: string): encodedTokenFromAPI => {
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

  if (!checkObjectValidKeys(nameAndType(nullEncodedToken), encodedToken)) {
    return nullEncodedToken();
  }

  return { ...encodedToken };
};
