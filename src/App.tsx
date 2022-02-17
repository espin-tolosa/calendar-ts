import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";

export default function App() {
  const { value } = useUserSession();

  {
    /*this code is forcing enter in the calendar automatically*/
  }
  return !value() ? <Login /> : <Codelink />;
}
