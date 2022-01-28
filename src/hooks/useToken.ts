import { useState } from "react";

export function useToken() {
  return useState(isCookie("PHPSESSID"));
}

function isCookie(name: string) {
  return document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    ? true
    : false;
}

export function deleteSession() {
  const cookiesExpired = document.cookie.split("; ").map((c) => {
    return `${c.trimStart()} ;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  });

  cookiesExpired.forEach((c) => {
    document.cookie = c;
  });
}
