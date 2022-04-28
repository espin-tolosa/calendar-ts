import "@/index.css";
import { LayoutMain } from "@/layouts/Main";
import Login from "@/components/Login/main";
import { useUserSession } from "./hooks/useUserSession";
import { IsDraggingProvider, useIsDragging } from "./hooks/useIsDragging";

export function App() {
  const token = useUserSession();
  const { isDragging } = useIsDragging();

  console.log("Rendering App");
  return !token.isValid() ? (
    <Login />
  ) : (
    <IsDraggingProvider isDragging={isDragging}>
      <LayoutMain />
    </IsDraggingProvider>
  );
}
