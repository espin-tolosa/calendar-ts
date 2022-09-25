import * as StyledEvent from "./tw";
import {
  useEventDispatch,
  useGetEventFamily,
} from "../../hooks/useEventsState";
import { useDnDEventRef, useSetDnDEventRef } from "../../context/dndEventRef";
import { nullEvent } from "../../interfaces";
import { useGethDeleteEvent } from "../../api/handlers";
import { useHoverEvent } from "../../components/Event/logic";
import { EventClass } from "@/classes/event";

export function DragHandlers({
  event,
  spread,
  children,
}: {
  event: jh.event;
  spread: number;
  children: React.ReactElement;
}): JSX.Element {
  const [parentEvent] = useGetEventFamily(event);
  //week.from = event.start;

  //--------------------------------------------
  const hDelete = useGethDeleteEvent(event);
  //week.from = event.start;

  //--------------------------------------------

  //edit mode

  const mouseHover = (({ onMouseEnter, onMouseLeave }) => {
    return {
      onMouseEnter,
      onMouseLeave,
    };
  })(useHoverEvent(event));

  //edit mode
  const eventDispatcher = useEventDispatch();

  const setDnDEventRef = useSetDnDEventRef();
  const dndEvent = useDnDEventRef();

  const hOnDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    direction: jh.dragDirection
  ) => {
    e.stopPropagation();
    const parentCopy: jh.event = { ...parentEvent };
    if (typeof parentEvent.mutable === "object") {
      parentCopy.mutable = { ...parentEvent.mutable };
      if (typeof parentCopy.mutable === "object") {
        parentCopy.mutable.dragDirection = direction;
      }
    }
    //!ISSUE: parentEvent isn't available in other context consumers (e.g: useOnDragEnter) after firing this dispatch order:
    //temporaryEventDispatcher(parentEvent);
    setDnDEventRef(parentCopy);
    setTimeout(() => {
      eventDispatcher({
        type: "tonull",
        payload: [{ ...event }],
      });

      //setLocalIsDragging(true);
    }, 1000);
  };
  const hOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDnDEventRef(nullEvent());
    //setLocalIsDragging(false);
    eventDispatcher({
      type: "fromnull",
      payload: [{ ...dndEvent }],
    });
    //TODO: Able this on mobile, to avoid update event while dragging
    //eventDispatcher({
    //  type: "update",
    //  payload: [{ ...dndEvent }],
    //});
  };
  return (
    <StyledEvent.TWflexContainer
      id={EventClass.eventID(event.id, "master", "eventListener")}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.ctrlKey && e.code === "Delete") {
          hDelete();
        }
      }}
      {...mouseHover}
      onDragStart={(e) => {
        hOnDragStart(e, "none");
      }}
      onDragEnd={hOnDragEnd}
    >
      {children}
      <StyledEvent.TWextend_Left
        $cells={spread}
        title={`Drag here to extend ${event.client}'s job`}
        draggable={"true"}
        onDragStart={(e) => {
          hOnDragStart(e, "backward");
        }}
        onDragEnd={hOnDragEnd}
      >
        {"+"}
      </StyledEvent.TWextend_Left>
      <StyledEvent.TWextend
        $cells={spread}
        title={`Drag here to extend ${event.client}'s job`}
        draggable={"true"}
        onDragStart={(e) => {
          hOnDragStart(e, "forward");
        }}
        onDragEnd={hOnDragEnd}
      >
        {"+"}
      </StyledEvent.TWextend>
    </StyledEvent.TWflexContainer>
  );
}
