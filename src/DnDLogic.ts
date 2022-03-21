import { BeforeCapture, DragUpdate, DropResult } from "react-beautiful-dnd";

import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { event } from "@interfaces/index";
import { DaysFrom } from "./utils/Date";
import { useRef } from "react";

import { useIsDragging } from "./hooks/useIsDragging";
import { useEventsStatusDispatcher } from "./hooks/useEventsStatus";

import { fetchEvent } from "./utils/fetchEvent";
import { CustomValues } from "@/customTypes";
import { EventClass } from "./classes/event";

export namespace DnD {
  export function composeEventDndId(event: event) {
    return JSON.stringify(event);
  }

  export function retrieveDraggableId(event: string) {
    return JSON.parse(event) as event;
  }
}

export const useEventsDnD = () => {
  const allEvents = useEventState();
  const eventStartDragging = useRef<event>(CustomValues.nullEvent);
  const draggableBackup = useRef<event>(CustomValues.nullEvent);
  const dispatchHoveringId = useEventsStatusDispatcher();
  const isDragging = useIsDragging();
  const eventDispatcher = useEventDispatch();
  const onBeforeCapture = (result: BeforeCapture): void => {
    const { draggableId, mode } = result;
    console.log("------------------------------------------------------------");
    console.log("onBeforeCapture");
    console.log(draggableId);
    console.log(mode);
    //
    const event = DnD.retrieveDraggableId(draggableId);

    eventStartDragging.current = CustomValues.nullEvent;

    // I store the initial event as a backup, so I can restablish it if query fails
    draggableBackup.current = event;

    dispatchHoveringId(event.id);
    isDragging.setState(true);
  };

  const onDragUpdate = (result: DragUpdate) => {
    //const { mode, source, type, combine, destination, draggableId } = result;
    const { destination, draggableId } = result;
    if (!destination) return;
    const parentEvent = JSON.parse(draggableId);
    const end = destination.droppableId.split(":")[0];

    console.log("------------------------------------------------------------");
    console.log("onDragUpdate");
    console.log(parentEvent);
    console.log(end);
    //console.log(mode); FLUID
    //console.log(source);
    //console.log(type);
    //console.log(combine);
    //console.log(destination);
    //console.log(draggableId);

    // if (!destination) return;
    // const event = DnD.retrieveDraggableId(draggableId);
    // console.log(event);
    // eventStartDragging.current = event;
    // const end = destination.droppableId;
    // const spread = DaysFrom(event.start, end);
    // if (spread < 0) return;

    eventDispatcher({
      type: "replacebyid",
      payload: [{ ...parentEvent, end }],
    });
    const fetchResultPUT = fetchEvent("PUT", { ...parentEvent, end });
    //isDragging.setState(false);
    //dispatchHoveringId(0);

    fetchResultPUT
      .then((res) => {
        if (res.status !== 203) {
          throw Error("Error code differs from expected");
        }
      })
      .catch(() => {
        console.log("restoring", draggableBackup.current);
        eventDispatcher({
          type: "replacebyid",
          payload: [draggableBackup.current],
        });
        draggableBackup.current = CustomValues.nullEvent;
      });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const parentEvent = JSON.parse(draggableId);
    const end = destination.droppableId.split(":")[0];

    console.log("------------------------------------------------------------");
    console.log("onDragEnd");
    console.log(parentEvent);
    console.log(end); // {index: 0, droppableId: "fullDate of current droppable day"}
    //console.log(mode); FLUID
    //console.log(reason); DROP
    ////console.log(source); // {index: event.id, droppableId: "fullDate of current Monday"}
    //console.log(type); DEFAULT
    //console.log(combine); null
    //if (eventStartDragging.current.id === 0) return;

    //const end = destination.droppableId;
    //const event = EventClass.getParentEventFrom(allEvents, source.index);
    //const spread = DaysFrom(event.start, end);
    //const endTarget = DaysFrom(eventStartDragging.current.end, end);

    //if (spread < 0) return;
    //if (endTarget === 0) return;

    //    const newEvent = { ...parentEvent, end };
    //    eventDispatcher({
    //      type: "replacebyid",
    //      payload: [{ ...parentEvent, end }],
    //    });

    //    const fetchResultPUT = fetchEvent("PUT", newEvent);
    //    isDragging.setState(false);
    //    dispatchHoveringId(0);
    //
    //    fetchResultPUT
    //      .then((res) => {
    //        if (res.status !== 203) {
    //          throw Error("Error code differs from expected");
    //        }
    //      })
    //      .catch(() => {
    //        console.log("restoring", draggableBackup.current);
    //        eventDispatcher({
    //          type: "replacebyid",
    //          payload: [draggableBackup.current],
    //        });
    //        draggableBackup.current = CustomValues.nullEvent;
    //      });
  };

  return {
    handlers: {
      onBeforeCapture,
      onDragUpdate,
      onDragEnd,
    },
  };
};
