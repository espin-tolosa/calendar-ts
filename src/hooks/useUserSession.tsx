import { useState, useContext, createContext } from "react";
import { composition } from "@/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { api } from "@/static/apiRoutes";

// * 1. Create context: Logged

const value = () => false;
const dispatch: (update: boolean) => void = () => {};
//const fakeLogin: (payload: SubmitHandler<FieldValues>) => void = () => {};
//const fetchLogin: (payload: SubmitHandler<FieldValues>) => void = () => {};
const clearLoginSession: () => void = () => {};
const fetchLogin: (payload: any) => void = () => {};

const cUserSession = createContext({
  value,
  dispatch,
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
  const [state, setState] = useState(isPHPSession() && isToken());

  // * Dispatcher closure wrapping setState:
  // * case dispatch true:	updates login status
  // * case dispatch false:	updates login status and clear all cookies coming from login api
  const value = () => state;
  const dispatch = (value: boolean) => {
    setState(() => {
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
        dispatch(isPHPSession() && isToken());
      });
  };

  const clearLoginSession = () => {
    const nullUser = { user: "", password: "" };
    fetchLogin(nullUser);
  };

  return (
    <cUserSession.Provider
      value={{ value, dispatch, fetchLogin, clearLoginSession }}
    >
      {children}
    </cUserSession.Provider>
  );
};

function isToken() {
  return getCookie("token") === "" ? false : true;
}
function isPHPSession() {
  return getCookie("phpsession") === "" ? false : true;
}

function getCookie(name: string) {
  const [phpsession, token] = document.cookie.split(" ");

  if (name === "phpsession") {
    return phpsession ? phpsession : "";
  } else if (name === "token") {
    return token ? token : "";
  } else {
    return "";
  }
}

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
