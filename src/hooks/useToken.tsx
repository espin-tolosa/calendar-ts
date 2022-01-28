import React, {
  useState,
  useContext,
  createContext,
  ReactChild,
  ReactText,
} from "react";

const CtxLogged = createContext(false);
const CtxSetLogged = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {
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
export function UserLoggedContext(children: React.ReactNode) {
  const [logged, setLogged] = useState(isCookie("PHPSESSID"));
  return (
    <CtxLogged.Provider value={logged}>
      <CtxSetLogged.Provider value={setLogged}>
        {children}
      </CtxSetLogged.Provider>
    </CtxLogged.Provider>
  );
}

//export const ContextLogginProvider = ()=>{
//	return(
//
//		)
//	}

/*
	<CtxLogged.Provider value={false}>
		<CtxSetLogged.Provider
			value={() => {
				console.log("Logged!!");
			}}
		>
			<App />
		</CtxSetLogged.Provider>
	</CtxLogged.Provider>
*/

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
