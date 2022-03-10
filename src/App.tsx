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

import { fetchEvent_App } from "./utils/fetchEvent";

export default function App() {
  //Contexts
  //const [month, setMonth] = useState(0);
  const isDragging = useIsDragging();

  const { value } = useUserSession();
  const eventDispatcher = useEventDispatch();
  const allEvents = useEventState();
  //const controllerState = useControllerState();
  const dispatchHoveringId = useEventsStatusDispatcher();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventStartDragging = useRef<event>({
    id: 0,
    client: "",
    job: "",
    start: "1970-01-01",
    end: "1970-01-01",
  });

  {
    /*this code is forcing enter in the calendar automatically*/
  }

  const eventSelected = useEventSelected();
  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();

  useEffect(() => {
    const hOnKeyDown = (e: any) => {
      if (eventSelected && e.key === "Delete") {
        // TODO: check if is valid event
        //if (!isValidEvent) {
        //  return;
        //}
        const result = fetchEvent_App("DELETE", eventSelected!);
        result.then((res) => {
          if (res.status === 204) {
            eventDispatcher({
              type: "deletebyid",
              payload: [eventSelected!],
            });
            dispatchController({
              type: "setController",
              payload: { id: 0, client: "", job: "" },
            });
            dispatchControllerDates({
              type: "clearDates",
            });
          }
        });

        setEventController(null);
      } else if (e.key === "Escape") {
        const getUnusedId = () => {
          //TODO: create a temporary state fot un-fetched events. In the middle, 1 is reserved id for temporal events
          // I just recover the last id from the array as it is already sorted by id and adds one
          //const lastId = eventState[eventState.length - 1].id + 1;
          const lastId = 100000;
          return lastId;
        };
        setEventController(null);
        eventDispatcher({
          type: "deletebyid",
          payload: [{ ...eventSelected!, id: getUnusedId() }], //TODO: delete temporary event state with un-fetched events, like press Esc before Save a new event
        });

        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
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
        const event = allEvents.find(
          (e) =>
            e.id === parseInt(result.draggableId.split(":")[0]) &&
            e.start === result.draggableId.split(":")[1]
        )!;
        eventStartDragging.current = {
          id: 0,
          client: "",
          job: "",
          start: "",
          end: "",
        };
        dispatchHoveringId(event.id);
        isDragging.setState(true);
      }}
      onDragUpdate={(result) => {
        const { source, destination } = result;
        const event = allEvents.find(
          (e) => e.id === parseInt(result.draggableId.split(":")[0])
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

        const fetchResultPUT = fetchEvent_App("PUT", newEvent);
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
