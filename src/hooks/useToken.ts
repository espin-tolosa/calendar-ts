import { Token } from "@/classes/token";
import React, { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState(Token.getToken());

  // This effect long polling keep track of a valid token and the user name of the current token
  useEffect(() => {
    const updateTokenIfChangesNameOrValidity = () => {
      const currentToken = Token.getToken();
      //Change the name of the person if the token name changes
      // TODO: user shouldbe identified by its id, as user name it's not unique: Change name tracking by id Id tracking whenever the token reflect this information, so after a backend commit
      if (!currentToken.isSamePerson(token)) {
        setToken(currentToken);
      }
      //Set to null Token if current token is not valid
      if (!currentToken.isValid()) {
        setToken(new Token());
      }
    };
    //Set a time interval to perform last two checks
    const intervalId = setInterval(updateTokenIfChangesNameOrValidity, 1000);
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
