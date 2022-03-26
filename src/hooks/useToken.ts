import { Token } from "@/classes/token";
import { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState(Token.getToken());
  //
  const updateTokenIfChangesNameOrValidity = () => {
    const currentToken = Token.getToken();
    if (!currentToken.isSamePerson(token)) {
      setToken(currentToken);
    }
    if (!currentToken.isValid()) {
      setToken(Token.nullToken); //this is not needed as the component will unmount
    }
  };

  // This effect long polling keep track of a valid token
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    intervalId = setInterval(updateTokenIfChangesNameOrValidity, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!token.isValid()) {
      window.alert("Expired Credentials");
      //setSessionIsToClean(true);
    }
  }, [token]);

  return token;
};
