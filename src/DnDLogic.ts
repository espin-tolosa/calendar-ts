import { BeforeCapture, DragUpdate, DropResult } from "react-beautiful-dnd";

import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { event } from "@interfaces/index";
import { DaysFrom } from "./utils/Date";
import { useRef } from "react";

import { useIsDragging } from "./hooks/useIsDragging";
import { useEventsStatusDispatcher } from "./hooks/useEventsStatus";

import { fetchEvent } from "./utils/fetchEvent";
import { CustomValues } from "@/customTypes";

export const useEventsDnD = () => {
  const allEvents = useEventState();
  const eventStartDragging = useRef<event>(CustomValues.nullEvent);
  const draggableBackup = useRef<event>(CustomValues.nullEvent);
  const dispatchHoveringId = useEventsStatusDispatcher();
  const isDragging = useIsDragging();
  const eventDispatcher = useEventDispatch();
  const onBeforeCapture = (result: BeforeCapture) => {
    console.log("Result", result);
    const [id, date] = result.draggableId.split(":");
    console.log("draggable id", result.draggableId);

    console.log("State before filter childrens", allEvents);
    const allEventsNoChild = allEvents.filter((e) => e.job !== "#isChildren");
    console.log("State after filter children", allEventsNoChild);

    const event = allEventsNoChild.find((e) => e.id === parseInt(id))!;
    eventStartDragging.current = CustomValues.nullEvent;

    // I store the initial event as a backup, so I can restablish it if query fails
    draggableBackup.current = event;

    dispatchHoveringId(event.id);
    isDragging.setState(true);
  };

  const onDragUpdate = (result: DragUpdate) => {
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
  };

  const onDragEnd = (result: DropResult) => {
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
    eventDispatcher({
      type: "replacebyid",
      payload: [newEvent],
    });

    const fetchResultPUT = fetchEvent("PUT", newEvent);
    isDragging.setState(false);
    dispatchHoveringId(0);

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

  return {
    handlers: {
      onBeforeCapture,
      onDragUpdate,
      onDragEnd,
    },
  };
};
