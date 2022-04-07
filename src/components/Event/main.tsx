import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useHoverEvent, useStorage, useTransitionStyle } from "./logic";
import { useEventState, useGetEventFamily } from "@/hooks/useEventsState";
import { useTemporaryEventDispatcher } from "@/globalStorage/temporaryEvents";
//import { useCtxKeyBuffer } from "@/globalStorage/keyBuffer";
//import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { EventCard, EventTail } from "./eventCard";
import { useGethDeleteEvent } from "@/api/handlers";
//import { usePostQuery } from "@/api/queries";

export const Event = ({ event, index }: { event: event; index: number }) => {
  const eventRef = useRef<HTMLDivElement>();

  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  const week = DateService.GetWeekRangeOf(event.start);
  //week.from = event.start;
  const eventsOfWeek = useEventState(week);
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: index, //!Corrected bug: was using event.end wich is zero
    };
  }, [event]);

  useEffect(() => {
    const sameRow = eventsOfWeek
      .filter((e) => e.mutable!.index === event.mutable!.index)
      .filter((e) => e.id > 0);
    const allH = sameRow.map((r) => r.mutable!.eventRef.clientHeight);
    const maxH = Math.max(...allH);
    const newState = { height: `${maxH}px` };

    event.mutable!.height = newState.height;
    setState(newState);
  }, [event]);

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parentEvent, family] = useGetEventFamily(event);

  //drag and drop
  //const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  //const eventDispatcher = useEventDispatch();
  //keybuffer to detect when control keyword is pressed
  //const keyBuffer = useCtxKeyBuffer();

  //const setEventController = useSetEventSelected();
  const hDelete = useGethDeleteEvent(event);

  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const { hover, ...mouseHover } = useHoverEvent(event);

  // Style hook for state transitions
  const eventInlineStyle = useTransitionStyle(isChildren, hover, event);

  // Database storage logic
  const { isSelected, isFocus, jobInput, ...eventUpdater } = useStorage(event);

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    8
  );

  const dayRef = useRef<Element>();

  return (
    <>
      <StyledEvent.TWflexContainer
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.code === "Delete") {
            hDelete();
          }
        }}
        draggable={"true"}
        {...mouseHover}
        onDragStart={(e) => {
          e.stopPropagation();
          console.log("On drag start from Center", parentEvent);
          const copyOfParent: event = { ...parentEvent };
          copyOfParent.mutable!.bubble = 0;
          temporaryEventDispatcher(parentEvent);
        }}
      >
        <StyledEvent.TWtextContent
          $isChildren={isChildren}
          ref={eventRef}
          $isHover={hover}
          style={eventInlineStyle.dinamic}
          key={event.id}
          $cells={spreadCells}
          title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
          $client={event.client.toLowerCase()}
          {...eventUpdater}
        >
          {!isChildren ? (
            <EventCard
              event={event}
              isHover={hover}
              style={eventInlineStyle.static}
            />
          ) : (
            <EventTail event={event} />
          )}
        </StyledEvent.TWtextContent>
        {
          //DnD Logic
        }
        {!isSelected && (
          <StyledEvent.TWextend_Left
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}\'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              e.stopPropagation();
              console.log("On drag start from Left", parentEvent);
              const copyOfParent: event = { ...parentEvent };
              copyOfParent.mutable!.bubble = -1;
              temporaryEventDispatcher(parentEvent);
            }}
          >
            {"+"}
          </StyledEvent.TWextend_Left>
        )}
        {!isSelected && (
          <StyledEvent.TWextend
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}\'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              e.stopPropagation();
              console.log("On drag start from Right", parentEvent);
              const copyOfParent: event = { ...parentEvent };
              copyOfParent.mutable!.bubble = 1;
              temporaryEventDispatcher(parentEvent);
            }}
          >
            {"+"}
          </StyledEvent.TWextend>
        )}

        <StyledEvent.TWplaceholder
          key={"p" + event.id}
          style={state}
          onMouseDown={(e) => {
            //const x = e.clientX;
            //const y = e.clientY;
            //const el = document.elementsFromPoint(x, y);
            //const dayDiv = el.find((e) => e.id.includes("day"));
            //console.log("Clicked on placeholder", dayDiv);
          }}
        >
          {"placeholder"}
        </StyledEvent.TWplaceholder>
      </StyledEvent.TWflexContainer>
    </>
  );
};

export const EventHolder = ({ event }: { event: event }) => {
  const [parent, family] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: parent.mutable?.index!, //!Corrected bug: was using event.end wich is zero
    };
    const h0 = parent.mutable?.height || "0px";
    const h1 = parseInt(h0.split("px")[0]);
    const newState = { height: `${h1}px` };
    setState(newState);
  }, []);

  const h0 = parent.mutable?.height || state.height;
  const h1 = parseInt(h0.split("px")[0]);
  const newState = { height: `${h1}px` };

  //
  return (
    <StyledEvent.TWflexContainer ref={eventRef}>
      <StyledEvent.TWplaceholder style={newState}>
        {event.id + " : " + event.mutable?.index}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
