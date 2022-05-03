import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";
import { useKeyboardShortcuts } from "@/hooks/useKeyListeners";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useOnDragEnter } from "@/components/Day/logic";

export const LayoutMain = () => {
  const onDragEnter = useOnDragEnter();
  useKeyboardShortcuts();
  const onDate = useRef("");
  useLayoutEffect(() => {
    window.document.addEventListener("dragover", (e) => {
      const componentsQuery = window.document.elementsFromPoint(
        e.clientX,
        e.clientY
      );

      //Recover the first day component encountered
      const dayDiv = componentsQuery.find((e) => e.id.includes("day"));

      //Check whether or not the cursor is over a Day subcomponent
      if (typeof dayDiv === "undefined") {
        return;
      }

      //Extract fullDate info from Day subcomponent's id
      const date = dayDiv.id.split(":")[1];

      //Check whether or not the cursor is over the current date being already registered
      if (date === onDate.current) {
        return;
      }
      onDate.current = date;
      onDragEnter(date);
    });
    //   window.document.addEventListener("touchmove", (e) => {
    //     //Prevent vertical scrolling
    //     e.preventDefault();

    //     const touch = e.touches[0] || e.changedTouches[0];
    //     const x = touch.pageX;
    //     const y = touch.pageY;
    //     window.scroll(x, y);
    //     console.log("Touch", x, y);
    //     const componentsQuery = window.document.elementsFromPoint(x, y);

    //     //Recover the first day component encountered
    //     const dayDiv = componentsQuery.find((e) => e.id.includes("day"));

    //     //Check whether or not the cursor is over a Day subcomponent
    //     if (typeof dayDiv === "undefined") {
    //       return;
    //     }

    //     //Extract fullDate info from Day subcomponent's id
    //     const date = dayDiv.id.split(":")[1];

    //     //Check whether or not the cursor is over the current date being already registered
    //     if (date === onDate.current) {
    //       return;
    //     }
    //     onDate.current = date;
    //     onDragEnter(date);
    //   });
  }, [onDate]);
  return (
    <tw_Layouts.TWapp id={"app"}>
      {/*header-layout*/}
      <LayoutHeader />

      {/*main-layout: layout-grid*/}
      <LayoutMaster />
    </tw_Layouts.TWapp>
  );
};
