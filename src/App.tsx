import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";

export default function App() {
  const userSession = useUserSession();

  return !userSession.value() ? <Login /> : <Codelink />;
}
