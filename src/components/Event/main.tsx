import * as StyledEvent from "./tw";
import { event } from "@/interfaces/index";
import { DateService } from "@/utils/Date";
import { useHoverEvent, useStorage, useTransitionStyle } from "./logic";
import {
  useEventDispatch,
  useEventState,
  useGetEventFamily,
} from "@/hooks/useEventsState";
import { useTemporaryEventDispatcher } from "@/context/temporaryEvents";
//import { useCtxKeyBuffer } from "@/context/keyBuffer";
//import { useSetEventSelected } from "@/context/eventSelected";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EventCard, EventTail } from "./eventCard";
import { useGethDeleteEvent } from "@/api/handlers";
import { Context } from "@/hooks/useIsDragging";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { useDnDEventRef, useSetDnDEventRef } from "@/context/dndEventRef";
import { useSetEventSelected } from "@/context/eventSelected";
import { nullEvent } from "@/customTypes";

export const Event = ({ event, index }: { event: event; index: number }) => {
  const eventRef = useRef<HTMLDivElement>();

  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  const week = DateService.GetWeekRangeOf(event.start);
  //week.from = event.start;
  const eventsOfWeek = useEventState(week);
  useLayoutEffect(() => {
    if (typeof eventRef.current !== "undefined") {
      event.mutable = {
        height: `${eventRef.current.clientHeight}px`,
        eventRef: eventRef.current,
        index: index, //!Corrected bug: was using event.end wich is zero
      };
    }
  }, [event]);

  useEffect(() => {
    if (typeof event.mutable === "object") {
      const sameRow = eventsOfWeek
        .filter((e) => {
          if (
            typeof e.mutable === "object" &&
            typeof event.mutable === "object"
          ) {
            return e.mutable.index === event.mutable.index;
          }
        }) //!Bug solved: e.mutable is undefined
        .filter((e) => e.id > 0);
      const allH = sameRow.map((r) => {
        if (typeof r.mutable === "object") {
          return r.mutable.eventRef.clientHeight;
        } else {
          return 0;
        }
      });

      const maxH = Math.max(...allH);
      const newState = { height: `${maxH}px` };

      if (typeof event.mutable === "object") {
        event.mutable.height = newState.height;
      }
      setState(newState);
    }
  }, [event]);

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parentEvent] = useGetEventFamily(event);

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
  const { isSelected, ...eventUpdater } = useStorage(event);

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    8
  );

  //const dayRef = useRef<Element>();
  const { setIsDragging } = Context.useIsDragging();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  const setDnDEventRef = useSetDnDEventRef();
  const dndEvent = useDnDEventRef();

  const [localIsDragging, setLocalIsDragging] = useState(false);

  const hOnDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    direction: number
  ) => {
    e.stopPropagation();
    const parentCopy: event = {
      ...parentEvent,
    };
    if (typeof parentEvent.mutable === "object") {
      parentCopy.mutable = { ...parentEvent.mutable };
      parentCopy.mutable.bubble = direction;
    }
    //!ISSUE: parentEvent isn't available in other context consumers (e.g: useOnDragEnter) after firing this dispatch order:
    //temporaryEventDispatcher(parentEvent);
    console.warn("drag start", parentCopy);
    setDnDEventRef(parentCopy);
    setTimeout(() => {
      eventDispatcher({
        type: "tonull",
        payload: [{ ...event }],
        callback: pushDaysDispatcher,
      });

      //setLocalIsDragging(true);
    }, 1000);
  };
  const hOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDnDEventRef(nullEvent());
    ////setLocalIsDragging(false);
    eventDispatcher({
      type: "fromnull",
      payload: [{ ...dndEvent }],
      callback: pushDaysDispatcher,
    });
  };

  return (
    <>
      {isSelected && (
        <div
          className="absolute z-1 top-0 left-0 w-screen h-screen bg-[rgba(100,100,100,0.5)]"
          onMouseDown={(e) => {
            e.currentTarget.blur();
            e.stopPropagation();
          }}
        ></div>
      )}
      <StyledEvent.TWflexContainer
        $hidde={localIsDragging}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.code === "Delete") {
            hDelete();
          }
        }}
        {...mouseHover}
        draggable={"true"}
        onDragStart={(e) => {
          hOnDragStart(e, 0);
        }}
        onDragEnd={hOnDragEnd}
        onMouseUp={() => {
          console.log("mouse up");
          //e.stopPropagation();
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
            <EventCard event={event} style={eventInlineStyle.static} />
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
            title={`Drag here to extend ${event.client}'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              hOnDragStart(e, -1);
            }}
            onDragEnd={hOnDragEnd}
          >
            {"+"}
          </StyledEvent.TWextend_Left>
        )}
        {!isSelected && (
          <StyledEvent.TWextend
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              hOnDragStart(e, 1);
            }}
            onDragEnd={hOnDragEnd}
          >
            {"+"}
          </StyledEvent.TWextend>
        )}

        <StyledEvent.TWplaceholder
          key={"p" + event.id}
          style={state}
          onMouseDown={() => {
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
  const [parent] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  useLayoutEffect(() => {
    if (typeof eventRef.current !== "undefined") {
      event.mutable = {
        height: `${eventRef.current.clientHeight}px`,
        eventRef: eventRef.current,
        index: typeof parent.mutable === "object" ? parent.mutable.index : 0, //!Corrected bug: was using event.end wich is zero
      };
    }
    const h0 =
      typeof parent.mutable === "object" ? parent.mutable.height : "0px";
    const h1 = parseInt(h0.split("px")[0]);
    const newState = { height: `${h1}px` };
    setState(newState);
  }, []);

  const h0 = parent.mutable?.height || state.height;
  const h1 = parseInt(h0.split("px")[0]);
  const newState = { height: `${h1}px` };

  //
  return (
    <StyledEvent.TWflexContainer $hidde={false} ref={eventRef}>
      <StyledEvent.TWplaceholder style={newState}>
        {event.id + " : " + event.mutable?.index}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};

export const EventOff = ({ event }: { event: event }) => {
  const state = { height: "0px" };

  //const week = DateService.GetWeekRangeOf(event.start);
  //week.from = event.start;
  //const eventsOfWeek = useEventState(week);

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parentEvent] = useGetEventFamily(event);

  //drag and drop
  //const temporaryEvent = useTemporaryEvent();
  //const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const setDnDEventRef = useSetDnDEventRef();
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
  const { isSelected, ...eventUpdater } = useStorage(event);

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    8
  );

  //const dayRef = useRef<Element>();

  return (
    <>
      <StyledEvent.TWflexContainer
        $hidde={false}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.code === "Delete") {
            hDelete();
          }
        }}
        {...mouseHover}
        //draggable={"true"}
        // onDragStart={(e) => {
        //   e.stopPropagation();
        //   console.log("On drag start from Center", parentEvent);
        //   const copyOfParent: event = { ...parentEvent };
        //   if (typeof copyOfParent.mutable === "object") {
        //     copyOfParent.mutable.bubble = 1;
        //   }
        //   //temporaryEventDispatcher(parentEvent);
        //   setDnDEventRef(parentEvent);
        // }}
        // onDragOver={(e) => {
        //   console.log("on drag over", e.target);
        // }}
      >
        <StyledEvent.TWtextContent
          $isChildren={isChildren}
          $isHover={hover}
          style={eventInlineStyle.dinamic}
          key={event.id}
          $cells={spreadCells}
          title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
          $client={event.client.toLowerCase()}
          {...eventUpdater}
        >
          {!isChildren ? (
            <EventCard event={event} style={eventInlineStyle.static} />
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
            title={`Drag here to extend ${event.client}'s job`}
            //   draggable={"true"}
            //   onDragStart={(e) => {
            //     e.stopPropagation();
            //     console.log("On drag start from Left", parentEvent);
            //     const copyOfParent: event = { ...parentEvent };
            //     if (typeof copyOfParent.mutable === "object") {
            //       copyOfParent.mutable.bubble = -1;
            //     }
            //     //temporaryEventDispatcher(parentEvent);
            //     setDnDEventRef(parentEvent);
            //   }}
          >
            {"+"}
          </StyledEvent.TWextend_Left>
        )}
        {!isSelected && (
          <StyledEvent.TWextend
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}'s job`}
            //  draggable={"true"}
            //  onDragStart={(e) => {
            //    e.stopPropagation();
            //    console.log("On drag start from Right x", parentEvent);
            //    //const copyOfParent: event = { ...parentEvent };
            //    //if (typeof copyOfParent.mutable === "object") {
            //    //  copyOfParent.mutable.bubble = 1;
            //    //}
            //    console.log("storing", parentEvent);
            //    //temporaryEventDispatcher(parentEvent);
            //    setDnDEventRef(parentEvent);
            //  }}
          >
            {"+"}
          </StyledEvent.TWextend>
        )}

        <StyledEvent.TWplaceholder
          key={"p" + event.id}
          style={state}
          onMouseDown={() => {
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
