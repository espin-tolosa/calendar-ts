//*	useUserSession, commited at April 28, 2022
//
//	Context provider for useToken custom hook,
//	just wraps the boilerplate around react context
//

import { useContext, createContext } from "react";
import { composition } from "@/interfaces";
import { useToken } from "./useToken";
import { Token } from "@/classes/token";

// * Create and export context
const cUserSession = createContext(Token.null());
cUserSession.displayName = "Context: User Session";

export function useUserSession() {
  return useContext(cUserSession);
}

// * Create and export provider
export const UserSession: composition = (PropTypes) => {
  const token = useToken();

  return (
    <cUserSession.Provider value={token}>
      {PropTypes.children}
    </cUserSession.Provider>
  );
};
