import { Route } from "wouter";
import * as tw_Layouts from "./layouts/tw";
import { Settings } from "./layouts/Settings";
import { Board } from "./layouts/Board";
import { TopBar } from "./components/TopBar/main";
import { useDebugEvent } from "./hooks/useDebugEvents";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { textAreaCtx } from "./components/Month/components/CurrentDays";
import { useEventDispatch } from "./hooks/useEventsState";
import { useOnDragEnter } from "./components/Day/logic";
import { useDnDEventRef } from "./context/dndEventRef";
import { useKeyboardShortcuts } from "./hooks/useKeyListeners";

function BoardRoute ({user}:{user:string})
{
    const Layout = () => (
        [
            <TopBar key="topbar" user={user} />,
            <Board key="board" />
        ]

    )

    return (
        <>
            {Layout()}
        </>
    )
}

export function App()
{
    useLegacy_DnD();
    return (

        <tw_Layouts.TWapp id={"app"}>

            <Route path="/board/:name">
            {
                ({name}) => BoardRoute({user:name})
            }
            </Route>

            <Route path="/settings" component={Settings} />

        </tw_Layouts.TWapp>

      );
}

const useLegacy_DnD = () =>
{
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
    if (onDate.current === "" || date === onDate.current) {
      onDate.current = date;
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
}