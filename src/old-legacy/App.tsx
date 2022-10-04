import { LayoutMain } from "./layouts/Main";
import Login from "./components/Login/main";
import { useUserSession } from "./hooks/useUserSession";
import { DragAndDropTouch } from "./window/touch";
import { useEffect } from "react";
import { useEventState } from "./hooks/useEventsState";

DragAndDropTouch();
declare global {
  interface Window {
    Debug: Record<string, unknown | undefined> | undefined;
  }
}

export function App() {
  const token = useUserSession();

  const events = useEventState();
  useEffect(() => {
    window.Debug = {};
    window.Debug.EventState = function () {
      events.forEach((e) => {
        console.log(e.mutable);
      });
    };
    return () => {
      if (window.Debug === undefined) {
        return;
      }
      window.Debug.EventState = undefined;
      window.Debug = undefined;
    };
  }, [events]);

  const isValid = true;
    //import.meta.env.MODE === "development" ? true : token.isValid();
  return isValid ? <LayoutMain /> : <Login />;
}
