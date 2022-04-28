import { useContext, createContext } from "react";
import { composition } from "@/interfaces";
import { useToken } from "./useToken";
import { Token } from "@/classes/token";

// * 1. Context interface and default value
interface IUserSession {
  token: Token;
}

const defaultValue: IUserSession = {
  token: Token.null(),
};

// * 2. Create and export context
const cUserSession = createContext<IUserSession>(defaultValue);
export function useUserSession() {
  return useContext(cUserSession);
}

// * 3. Create and export provider
export const UserSession: composition = ({ children }) => {
  const token = useToken();
  return (
    <cUserSession.Provider
      value={{
        token,
      }}
    >
      {children}
    </cUserSession.Provider>
  );
};
