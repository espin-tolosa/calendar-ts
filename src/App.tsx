import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";

export default function App() {
  const userSession = useUserSession();

  {
    /*this code is forcing enter in the calendar automatically*/
  }
  return userSession.value() ? <Login /> : <Codelink />;
}
//Correct code:
//return !userSession.value() ? <Login /> : <Codelink />;
