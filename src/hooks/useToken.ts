//*	useToken, commited at April 27, 2022
//
//	is a long-polling service reading from window.document.cookie a valid token
//	it exposes the class Token wich has some public methods to access data from token
//

import { Token } from "@/classes/token";
import { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState(() => new Token());

  // This effect long polling keep track of a valid token and the user name of the current token
  useEffect(() => {
    //Update Token when: user changes | token expires
    const updateToken = () => {
      const current = new Token();
      const userChanged = !current.isSameUser(token);
      const tokenGetInvalid = token.isValid() && !current.isValid();
      if (userChanged || tokenGetInvalid) {
        setToken(current);
      }
    };

    const intervalId = setInterval(updateToken, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  return token;
};
