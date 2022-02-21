import { useState, useContext, createContext } from "react";
import { composition } from "@/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";

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

  const fakeLogin = (payload: SubmitHandler<FieldValues>) => {
    if (
      (payload.arguments.user === "samuel" &&
        payload.arguments.password === "freesolo") ||
      (payload.arguments.user === "thomas" &&
        payload.arguments.password === "admin") ||
      (payload.arguments.user === "james" &&
        payload.arguments.password === "admin")
    ) {
      dispatch(true);
    }
  };

  const fetchLogin = (payload: any) => {
    const data = new FormData();
    data.append("json", JSON.stringify(payload));

    fetch("/backend/routes/login.api.php", {
      method: "POST",
      body: data,
    }).then((res) => {
      res.status === 201 ? dispatch(true) : dispatch(false);
    });
  };

  const clearLoginSession = () => {
    const payload = { user: "", password: "" };
    fetchLogin(payload);
  };

  return (
    <cUserSession.Provider
      value={{ value, dispatch, fetchLogin, clearLoginSession }}
    >
      {children}
    </cUserSession.Provider>
  );
};

// * Aux functions, needs revisit and add to backend SameSite=Lax
function isCookie(name: string) {
  return document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    ? true
    : false;
}

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

export function deleteSession() {
  const cookiesExpired = document.cookie.split("; ").map((c) => {
    return `${c.trimStart()} ;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  });

  cookiesExpired.forEach((c) => {
    document.cookie = c;
  });
}
