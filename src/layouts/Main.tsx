import { LayoutMaster } from "../layouts/Master";
import { LayoutHeader } from "../layouts/Header";
import * as tw_Layouts from "../layouts/tw";
import { useKeyboardShortcuts } from "../hooks/useKeyListeners";
import { useLayoutEffect, useRef } from "react";
import { useOnDragEnter } from "../components/Day/logic";
import { useDnDEventRef } from "../context/dndEventRef";

export const LayoutMain = () => {
  const onDragEnter = useOnDragEnter();
  const dndEvent = useDnDEventRef();
  useKeyboardShortcuts();
  const onDate = useRef("");

  const hOnDragEnter = (e: DragEvent) => {
    const componentsQuery = window.document.elementsFromPoint(
      e.clientX,
      e.clientY
    );

    //Recover the first day component encountered
    const dayDiv = componentsQuery.find((e) => e.id.includes("day"));

    //Check whether or not the cursor is over a Day subcomponent
    if (typeof dayDiv === "undefined" || typeof onDragEnter === "undefined") {
      return;
    }

    //Extract fullDate info from Day subcomponent's id
    const date = dayDiv.id.split(":")[1];

    //Check whether or not the cursor is over the current date being already registered
    if (date === onDate.current) {
      return;
    }
    onDate.current = date;

    onDragEnter(date, dndEvent);
  };

  useLayoutEffect(() => {
    if (typeof dndEvent === "undefined") {
      return;
    }

    window.document.addEventListener("dragover", hOnDragEnter);
    return () => {
      window.document.removeEventListener("dragover", hOnDragEnter);
    };
  }, [onDate, onDragEnter, dndEvent]);
  return (
    <tw_Layouts.TWapp id={"app"}>
      {/*header-layout*/}

      <LayoutHeader />

      {/*main-layout: layout-grid*/}
      <LayoutMaster />
    </tw_Layouts.TWapp>
  );
};
