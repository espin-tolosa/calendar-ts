import { LayoutMain } from "./layouts/Main";
import Login from "./components/Login/main";
import { useUserSession } from "./hooks/useUserSession";
import { DragAndDropTouch } from "./window/touch";

DragAndDropTouch();

export function App() {
  const token = useUserSession();

  const isValid =
    import.meta.env.MODE === "development" ? true : token.isValid();
  return isValid ? <LayoutMain /> : <Login />;
}
