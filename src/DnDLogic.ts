import {
  BeforeCapture,
  DragStart,
  DragUpdate,
  DropResult,
} from "react-beautiful-dnd";

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
  //
  const onDragStart = (result: DragStart): void => {
    const { draggableId } = result;
    const parentEvent = JSON.parse(draggableId);

    eventStartDragging.current = CustomValues.nullEvent;

    // I store the initial event as a backup, so I can restablish it if query fails
    draggableBackup.current = parentEvent;
    dispatchHoveringId(parentEvent.id);
    isDragging.setState(true);

    /*
    const { draggableId, mode } = result;
    //
    const event = DnD.retrieveDraggableId(draggableId);

    eventStartDragging.current = CustomValues.nullEvent;

    // I store the initial event as a backup, so I can restablish it if query fails
    draggableBackup.current = event;

    dispatchHoveringId(event.id);
    isDragging.setState(true);
*/
  };

  const onDragUpdate = (result: DragUpdate) => {
    /*
        const { source, destination, draggableId } = result;

        const event = allEvents.find(
          (e) => e.id === parseInt(draggableId.split(":")[0])
        )!;
        eventStartDragging.current = event;
        const spread = DaysFrom(event.start, destination?.droppableId!);
        if (!destination) return;
        if (spread < 0) return;
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

		*/
    const { destination, draggableId } = result;
    if (!destination) return;
    const parentEvent = JSON.parse(draggableId);
    const [destinationDate, id] = destination.droppableId.split(":");
    const isGoingBack = DaysFrom(parentEvent.start, destinationDate) < 0;
    parentEvent.end = destinationDate;
    if (isGoingBack) {
      parentEvent.start = destinationDate;
    }

    eventDispatcher({
      type: "updateDnD",
      payload: [{ ...parentEvent }],
    });

    fetchEvent("PUT", parentEvent);

    /*
    //const { mode, source, type, combine, destination, draggableId } = result;
    const { destination, draggableId } = result;
    if (!destination) return;
    const parentEvent = JSON.parse(draggableId);
    const end = destination.droppableId.split(":")[0];

    //    eventDispatcher({
    //      type: "update",
    //      payload: [{ ...parentEvent, end }],
    //    });
    fetchEvent("PUT", { ...parentEvent, end });
    //isDragging.setState(false);
    //dispatchHoveringId(0);

    // fetchResultPUT
    //   .then((res) => {
    //     if (res.status !== 203) {
    //       throw Error("Error code differs from expected");
    //     }
    //   })
    //   .catch(() => {
    //     eventDispatcher({
    //       type: "replacebyid",
    //       payload: [draggableBackup.current],
    //     });
    //     draggableBackup.current = CustomValues.nullEvent;
    //   });
		*/
  };
  const onDragEnd = (result: DropResult) => {
    isDragging.setState(false);
    dispatchHoveringId(0);
    draggableBackup.current = CustomValues.nullEvent;
    //const { destination, draggableId } = result;
    //if (!destination) return;
    //const parentEvent = JSON.parse(draggableId);
    //const end = destination.droppableId.split(":")[0];
    //eventDispatcher({
    //  type: "update",
    //  payload: [{ ...parentEvent, end }],
    //});
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
    //        eventDispatcher({
    //          type: "replacebyid",
    //          payload: [draggableBackup.current],
    //        });
    //        draggableBackup.current = CustomValues.nullEvent;
    //      });
  };

  return {
    handlers: {
      onDragStart,
      onDragUpdate,
      onDragEnd,
    },
  };
};

/*
      onBeforeCapture={(result) => {
        const [id, date] = result.draggableId.split(":");

        const allEventsNoChild = allEvents.filter(
          (e) => e.job !== "#isChildren"
        );

        const event = allEventsNoChild.find((e) => e.id === parseInt(id))!;
        eventStartDragging.current = CustomValues.nullEvent;

        // I store the initial event as a backup, so I can restablish it if query fails
        draggableBackup.current = event;

        dispatchHoveringId(event.id);
        isDragging.setState(true);
      }}
      onDragUpdate={(result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const event = allEvents.find(
          (e) => e.id === parseInt(draggableId.split(":")[0])
        )!;
        eventStartDragging.current = event;
        const isGoingBack =
          DaysFrom(event.start, destination?.droppableId!) < 0;
        if (isGoingBack) {
          event.start = destination.droppableId;
        }
        const newEvent = {
          id: event.id,
          client: event.client,
          job: event.job,
          start: event.start,
          end: destination.droppableId,
        };

        eventDispatcher({
          type: "replacebyid",
          payload: [newEvent],
        });
        fetchEvent("PUT", newEvent);
      }}
      onDragEnd={(result) => {
        isDragging.setState(false);
        dispatchHoveringId(0);
        draggableBackup.current = CustomValues.nullEvent;
        //        if (eventStartDragging.current.id === 0) return;
        //        const { source, destination } = result;
        //
        //        if (!destination) return;
        //
        //        const event = allEvents.find((e) => e.id === source.index)!;
        //        const spread = DaysFrom(event.start, destination?.droppableId!);
        //        const endTarget = DaysFrom(
        //          eventStartDragging.current.end,
        //          destination.droppableId
        //        );
        //        if (endTarget === 0) return;
        //
        //        if (spread < 0) {
        //          event.start = destination.droppableId;
        //        }
        //
        //        const newEvent = {
        //          id: event.id,
        //          client: event.client,
        //          job: event.job,
        //          start: event.start,
        //          end: destination?.droppableId!,
        //        };
        //        eventDispatcher({
        //          type: "replacebyid",
        //          payload: [newEvent],
        //        });
        //
        //        const fetchResultPUT = fetchEvent("PUT", newEvent);
        //        isDragging.setState(false);
        //        dispatchHoveringId(0);
        //
        //        fetchResultPUT
        //          .then((res) => {
        //            if (res.status !== 203) {
        //              throw Error("Error code differs from expected");
        //            }
        //          })
        //          .catch(() => {
        //            eventDispatcher({
        //              type: "replacebyid",
        //              payload: [draggableBackup.current],
        //            });
        //            draggableBackup.current = CustomValues.nullEvent;
        //          });
      }}


*/
