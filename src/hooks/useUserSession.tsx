import { useState, useContext, createContext } from "react";
import { composition, loginForm } from "@/interfaces";
import { api } from "@/static/apiRoutes";
import { Token } from "@/classes/token";

// * 1. Create context: Logged

const isUserLogged: boolean = false;
const isUserLoggedDispatcher: (update: boolean) => void = () => {};
//const fakeLogin: (payload: SubmitHandler<FieldValues>) => void = () => {};
//const fetchLogin: (payload: SubmitHandler<FieldValues>) => void = () => {};
const clearLoginSession: () => void = () => {};
const fetchLogin: (payload: any) => void = () => {};

const cUserSession = createContext({
  isUserLogged,
  isUserLoggedDispatcher,
  fetchLogin,
  clearLoginSession,
});

// * 2. Export context handler

// * dep: src/App.tsx:											uses the value to decide wether to render <Login> or <Calendar>
// * dep: src/components/Topnav/main.tsx:		uses the dispatcher to close the session
// * dep: src/pages/Login/Login.tsx:				uses the dispatcher to open the session
export function useUserSession() {
  return useContext(cUserSession);
}

// * 3. Export context component

// * dep: src/main.tsx
export const UserSession: composition = ({ children }) => {
  const myToken = new Token();
  const [isUserLogged, setIsLogged] = useState(myToken.isValid());

  // * Dispatcher closure wrapping setState:
  // * case dispatch true:	updates login status
  // * case dispatch false:	updates login status and clear all cookies coming from login api
  const isUserLoggedDispatcher = (value: boolean) => {
    setIsLogged(() => {
      !value && deleteSession();
      return value;
    });
  };

  const fetchLogin = (payload: any) => {
    const data = new FormData();
    data.append("json", JSON.stringify(payload));

    fetch(api.routes.login, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.status !== 201) {
          throw Error(`Error code: ${res.status}`);
        }
      })
      .catch(() => {
        deleteSession();
      })
      .finally(() => {
        const myToken = new Token();
        isUserLoggedDispatcher(myToken.isValid());
      });
  };

  const clearLoginSession = () => {
    const nullForm: loginForm = { user: "", password: "" };
    fetchLogin(nullForm);
  };

  return (
    <cUserSession.Provider
      value={{
        isUserLogged,
        isUserLoggedDispatcher,
        fetchLogin,
        clearLoginSession,
      }}
    >
      {children}
    </cUserSession.Provider>
  );
};

/**
 * Side effect function to remove cookies emmited by the server, targets:
 * - PHPSESSIONID
 * - Hashed Token
 */
function deleteSession() {
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
