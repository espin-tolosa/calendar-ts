//TODO: Test this
export function deleteCookies() {
  const recoveredCookies: Array<string> = window.document.cookie.split(";");
  const cookiesWithExpirationDateAttached = recoveredCookies.map((cookie) => {
    return `${cookie
      .trimStart()
      .trimEnd()} ;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  });

  cookiesWithExpirationDateAttached.forEach((expiredCookie) => {
    window.document.cookie = expiredCookie;
  });
}
