import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";
import { DragDropContext } from "react-beautiful-dnd";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { api } from "@/static/apiRoutes";
import { event } from "@interfaces/index";
import { DaysFrom } from "./utils/Date";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useEventSelected,
  useSetEventSelected,
} from "./components/Controller/main";
import { useControllerDispatch } from "./hooks/useController";

import { useControllerDispatchDates } from "./hooks/useControllerDate";
import { useIsDragging } from "./hooks/useIsDragging";
import { useEventsStatusDispatcher } from "./hooks/useEventsStatus";

import { fetchEvent } from "./utils/fetchEvent";
import { useGethCancel, useGethDeleteEvent } from "./api/handlers";
import { CustomValues } from "@/customTypes";

export default function App() {
  //Contexts
  //const [month, setMonth] = useState(0);
  const isDragging = useIsDragging();
  const draggableType = useRef("");

  const { value } = useUserSession();
  const eventDispatcher = useEventDispatch();

  const allEvents = useEventState();
  //const controllerState = useControllerState();
  const dispatchHoveringId = useEventsStatusDispatcher();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventStartDragging = useRef<event>(CustomValues.nullEvent);

  {
    /*this code is forcing enter in the calendar automatically*/
  }

  const eventSelected = useEventSelected();
  const dispatchController = useControllerDispatch();

  const hCancel = useGethCancel();
  const hDelete = useGethDeleteEvent();

  useEffect(() => {
    const hOnKeyDown = (e: any) => {
      if (eventSelected && e.key === "Delete") {
        hDelete();
      } else if (e.key === "Escape") {
        hCancel();
      } else if (!isNaN(parseInt(e.key))) {
        const jobField = document.getElementById("job");
        const selectField = document.querySelector("select");

        if (jobField !== document.activeElement) {
          dispatchController({
            type: "setClient",
            payload: {
              client: `Client_${e.key}`,
            },
          });
          selectField?.focus();
        }
      } else if (e.key === "Tab") {
        const selectField = document.getElementById("select");
        const jobField = document.getElementById("job");
        //const save = document.getElementById("save");
        //TODO: state machine to traverse each editable option of the controller
        if ("job" === document.activeElement?.id) {
          jobField?.focus();
        } else {
          selectField?.focus();
        }
      }
    };

    document.querySelector("html")?.addEventListener("keydown", hOnKeyDown);
    return () => {
      document
        .querySelector("html")
        ?.removeEventListener("keydown", hOnKeyDown);
    };
  }, [eventSelected]);

  return !value() ? (
    <Login />
  ) : (
    <DragDropContext
      onBeforeCapture={(result) => {
        console.log("Result", result);
        const [id, date] = result.draggableId.split(":");
        const event = allEvents.find(
          (e) => e.id === parseInt(id) && e.start === date
        )!;
        eventStartDragging.current = CustomValues.nullEvent;
        dispatchHoveringId(event.id);
        isDragging.setState(true);
      }}
      onDragUpdate={(result) => {
        const { source, destination, draggableId } = result;

        const event = allEvents.find(
          (e) => e.id === parseInt(draggableId.split(":")[0])
        )!;
        eventStartDragging.current = event;
        const spread = DaysFrom(event.start, destination?.droppableId!);
        const isRewind = DaysFrom(event.end, destination?.droppableId!) < 0;
        if (!destination) return;
        if (spread < 0) return;
        if (isRewind) return;
        const newEvent = {
          id: event.id,
          client: event.client,
          job: event.job,
          start: event.start,
          end: destination?.droppableId!,
        };

        eventDispatcher({
          type: "replacebyid",
          payload: [newEvent],
        });
      }}
      onDragEnd={(result) => {
        console.log("on drag end", eventStartDragging);
        if (eventStartDragging.current.id === 0) return;
        const { source, destination } = result;

        if (destination === null) return;

        const event = allEvents.find((e) => e.id === source.index)!;
        const spread = DaysFrom(event.start, destination?.droppableId!);
        const endTarget = DaysFrom(
          eventStartDragging.current.end,
          destination?.droppableId!
        );

        if (spread < 0) return;
        if (endTarget === 0) return;

        const newEvent = {
          id: event.id,
          client: event.client,
          job: event.job,
          start: event.start,
          end: destination?.droppableId!,
        };

        const fetchResultPUT = fetchEvent("PUT", newEvent);
        isDragging.setState(false);
        dispatchHoveringId(0);

        fetchResultPUT
          .then((res) => {
            if (res.status !== 203) {
              throw new Error("Error code differs from expected");
            }
            const newEvent = {
              id: event.id,
              client: event.client,
              job: event.job,
              start: event.start,
              end: destination?.droppableId!,
            };
            eventDispatcher({
              type: "replacebyid",
              payload: [newEvent],
            });
          })
          .catch(() => {
            eventDispatcher({
              type: "replacebyid",
              payload: [eventStartDragging.current],
            });
          });
      }}
    >
      <Codelink />
    </DragDropContext>
  );
}
