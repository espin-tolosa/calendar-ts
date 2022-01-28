/*
import { useContext } from "react";
import React, { MouseEventHandler } from "react";
import { Styles_Bodies_Day } from "@styles/Styled_Day";
import { SimpleCtx } from "@context/formdata";

interface DayProps {
	children: ReactChild | ReactChildren;
  date: string;
}

export const DayMove: React.FC<DayProps> = ({
	date,
  children,
}): JSX.Element => {
	const myCtx = useContext(SimpleCtx);
	
  const [clientform, setClient] = [myCtx.client, myCtx.setClient];
  const [jobform, setJob] = [myCtx.job, myCtx.setJob];
  const hOnClick = () => {
		console.log("Event", date);
    console.log(clientform);
    setJob(date);
  };
  return <Styles_Bodies_Day date={date}>{children}</Styles_Bodies_Day>;
};

*/

import React, {
  useState,
  useContext,
  createContext,
  ReactChild,
  ReactChildren,
  ReactText,
} from "react";

const CtxLogged = createContext(false);
//const CtxSetLogged = createContext<
//  React.Dispatch<React.SetStateAction<boolean>>
//>(() => {
//  console.warn("No context is given:", "CtxSetLogged");
//});
const CtxSetLogged = createContext((status: boolean): void => {
  console.warn("No context is given:", "CtxSetLogged");
});

export function useLogged() {
  return useContext(CtxLogged);
}

export function useSetLogged() {
  return useContext(CtxSetLogged);
}

//export function useToken() {
//	const [logged, setLogged] = useState(isCookie("PHPSESSID"));
//}
interface UserLoggedProps {
  children: ReactChild | ReactChildren;
}
export const UserLoggedContext: React.FC<UserLoggedProps> = ({
  children,
}): JSX.Element => {
  const [logged, setLogged] = useState(isCookie("PHPSESSID"));
  const setSession = (status: boolean) => {
    setLogged((prev) => {
      prev && deleteSession();
      return !prev;
    });
  };

  return (
    <CtxLogged.Provider value={logged}>
      <CtxSetLogged.Provider value={setSession}>
        {children}
      </CtxSetLogged.Provider>
    </CtxLogged.Provider>
  );
};
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
    document.cookie = c;
  });
}
