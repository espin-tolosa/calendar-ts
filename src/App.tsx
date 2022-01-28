import { useContext } from "react";

import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useToken } from "./hooks/useToken";
import { CtxLogged } from "./hooks/useToken";

export default function App() {
  // const [isLogged, setIsLogged] = useToken();
  const isLogged = useContext(CtxLogged);
  console.log("logged", isLogged);
  //const CtxsetIsLogged = createContext(setIsLogged);

  return !isLogged ? <Login /> : <Codelink />;
}

/*
ReactDOM.render(
  <React.StrictMode>
    {!isLogged ? (
      <Login />
    ) : (
      <>
        <Codelink />
      </>
    )}
  </React.StrictMode>,
  document.getElementById("root")
);
*/
