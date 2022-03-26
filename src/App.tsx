import "@/index.css";
import { LayoutMain } from "@/layouts/Main";
import Login from "@/components/Login/main";
import { useUserSession } from "./hooks/useUserSession";

export default function App() {
  const { isUserLogged } = useUserSession();

  return !isUserLogged ? <Login /> : <LayoutMain />;
}
