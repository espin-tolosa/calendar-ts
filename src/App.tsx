import "@/index.css";
import { LayoutMain } from "@/layouts/Main";
import Login from "@/components/Login/main";
import { useUserSession } from "./hooks/useUserSession";
import { DragAndDropTouch } from "./window/touch";

DragAndDropTouch();

export function App() {
  const token = useUserSession();

  return token.isValid() ? <LayoutMain /> : <Login />;
}
