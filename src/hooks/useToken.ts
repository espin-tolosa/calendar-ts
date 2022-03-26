import { Token } from "@/classes/token";
import { useCallback, useEffect, useRef, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState(Token.getToken());
  //
  const isSetTimeOut = useRef(false);
  //
  const updateTokenIfChangesNameOrValidity = useCallback(() => {
    const currentToken = Token.getToken();
    if (!currentToken.isValid()) {
      setToken(Token.nullToken); //this is not needed as the component will unmount
    }
  }, [setToken]);

  // This effect long polling keep track of a valid token
  // if the token gets invalid it sets to nullToken and clear the interval polling
  // as a result of update the state: token, the component that is consuming the hook
  // will refresh and it allows this component to taken action in base of that change
  // This is used by Topnav to keep track of a valid token, and in case of deletion,
  // Topnav component is encharged to
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isSetTimeOut.current) {
      isSetTimeOut.current = true; //block this thread
      intervalId = setInterval(updateTokenIfChangesNameOrValidity, 1000);
    }

    return () => {
      if (!intervalId) {
        return;
      }
      if (!token.isValid()) {
        window.alert("Expired Credentials");
      }
      //setSessionIsToClean(true);
      clearInterval(intervalId);
    };
  }, [token]);

  return token;
};
