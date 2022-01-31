import { useState, useContext, createContext } from "react";
import { composition } from "@/interfaces";

/* 1. Create context: Logged */

const value = () => false;
const dispatch: (update: boolean) => void = () => {};

const cUserSession = createContext({ value, dispatch });

/* 2. Export context handler */

//dep: src/App.tsx:												uses the value to decide wether to render <Login> or <Calendar>
//dep: src/components/Topnav/main.tsx:		uses the dispatcher to close the session
//dep: src/pages/Login/Login.tsx:					uses the dispatcher to open the session
export function useUserSession() {
  return useContext(cUserSession);
}

/* 3. Export context component */

// dep: src/main.tsx
export const UserSession: composition = ({ children }) => {
  const [state, setState] = useState(isCookie("PHPSESSID"));

  // closure that wraps the state and setState to add some functionallities
  const value = () => state;
  const dispatch = (value: boolean) => {
    setState((prev) => {
      prev && deleteSession();
      return value;
    });
  };

  return (
    <cUserSession.Provider value={{ value, dispatch }}>
      {children}
    </cUserSession.Provider>
  );
};

// Aux functions, needs revisit and add to backend SameSite=Lax

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
    console.log("cookiesExpired", c);
    document.cookie = c;
  });
}
