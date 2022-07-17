import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";
import { DateService } from "../../utils/Date";
import { useHoverEvent, useStyles } from "../../components/Event/logic";
import {
  useEventDispatch,
  useEventState,
  useGetEventFamily,
} from "../../hooks/useEventsState";
import { EventCard, EventTail } from "../../components/Event/eventCard";
import { useGethDeleteEvent } from "../../api/handlers";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { useDnDEventRef, useSetDnDEventRef } from "../../context/dndEventRef";
import { nullEvent } from "../../interfaces";
import { useClientsStyles } from "../../context/useFetchClientStyle";

export function eventID(id: number, role: string, subcomponent: string) {
  return `event:${role}:${id}:${subcomponent}`;
}

/**
 * Event interactive component, expected functions
 *
 */
export const Event = ({ event, index }: { event: jh.event; index: number }) => {
  const eventRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<{ height: string }>({ height: "0px" });

  useLayoutEffect(() => {
    if (typeof eventRef.current !== "undefined") {
      event.mutable = {
        height: `${eventRef.current.clientHeight}px`,
        eventRef: eventRef.current,
        index: index, //!Corrected bug: was using event.end wich is zero
      };
    }
  });

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
          const size = r.mutable.eventRef.getBoundingClientRect();
          const H = size.height + 10; //pading
          return H;
        } else {
          return 100;
        }
      });

      const maxH = Math.max(...allH);
      const newState = { height: `${maxH}px` };

      if (typeof event.mutable === "object") {
        event.mutable.height = newState.height;
      }
      setState(newState);
    }
  }, [event.mutable?.height, event]);

  const [parentEvent] = useGetEventFamily(event);
  const hDelete = useGethDeleteEvent(event);
  const week = DateService.GetWeekRangeOf(event.start);
  const eventsOfWeek = useEventState(week);
  //week.from = event.start;

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode

  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const { hover, ...mouseHover } = useHoverEvent(event);

  // Style hook for state transitions
  const clientsStyles = useClientsStyles();

  //TODO: make this a function
  const color = clientsStyles.response?.colors[event.client] || {
    primary: "#abcabc",
    secondary: "#aaaaaa",
  };

  const style = useStyles(isChildren, hover, event, color.primary);

  //TODO: avoid magic numbers
  const maxDayAvailable = DateService.GetDateNextDay(event.start, 5);
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    DateService.DaysFrom(event.start, maxDayAvailable)
  );

  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  const setDnDEventRef = useSetDnDEventRef();
  const dndEvent = useDnDEventRef();

  const hOnDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    direction: number
  ) => {
    e.stopPropagation();
    const parentCopy: jh.event = { ...parentEvent };
    if (typeof parentEvent.mutable === "object") {
      parentCopy.mutable = { ...parentEvent.mutable };
      if (typeof parentCopy.mutable === "object") {
        parentCopy.mutable.bubble = direction;
      }
    }
    //!ISSUE: parentEvent isn't available in other context consumers (e.g: useOnDragEnter) after firing this dispatch order:
    //temporaryEventDispatcher(parentEvent);
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
    //setLocalIsDragging(false);
    eventDispatcher({
      type: "fromnull",
      payload: [{ ...dndEvent }],
      callback: pushDaysDispatcher,
    });
  };

  return (
    <>
      <StyledEvent.TWflexContainer
        id={eventID(event.id, "master", "eventListener")}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.ctrlKey && e.code === "Delete") {
            hDelete();
          }
        }}
        {...mouseHover}
        onDragStart={(e) => {
          hOnDragStart(e, 0);
        }}
        onDragEnd={hOnDragEnd}
      >
        <StyledEvent.TWtextContent
          id={eventID(event.id, "master", "sizeAndPosition")}
          ref={eventRef}
          $isChildren={isChildren}
          $isHover={hover}
          style={style?.dinamic}
          $cells={spreadCells}
          title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
          $client={event.client.toLowerCase()}
        >
          {!isChildren ? (
            <EventCard event={event} style={style?.static || {}} />
          ) : (
            <EventTail event={event} />
          )}
        </StyledEvent.TWtextContent>
        {
          //DnD Logic
        }
        {
          <StyledEvent.TWextend_Left
            $cells={spreadCells}
            title={`Drag here to extend ${event.client}'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              hOnDragStart(e, -1);
            }}
            onDragEnd={hOnDragEnd}
          >
            {"+"}
          </StyledEvent.TWextend_Left>
        }
        {
          <StyledEvent.TWextend
            $cells={spreadCells}
            title={`Drag here to extend ${event.client}'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              hOnDragStart(e, 1);
            }}
            onDragEnd={hOnDragEnd}
          >
            {"+"}
          </StyledEvent.TWextend>
        }

        <StyledEvent.TWplaceholder style={state}>
          {"placeholder"}
        </StyledEvent.TWplaceholder>
      </StyledEvent.TWflexContainer>
    </>
  );
};

export const EventHolder = ({ event }: { event: jh.event }) => {
  const [force, setForce] = useState(0);
  const [parent] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  //const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  // useLayoutEffect(() => {
  if (typeof eventRef.current !== "undefined") {
    const h0 =
      typeof parent.mutable === "object" ? parent.mutable.height : "0px";
    const h1 = parseInt(h0.split("px")[0]);
    const newState = { height: `${h1}px` };
    event.mutable = {
      //height: `${eventRef.current.clientHeight}px`,
      height: newState.height,
      eventRef: eventRef.current,
      index: typeof parent.mutable === "object" ? parent.mutable.index : 0, //!Corrected bug: was using event.end wich is zero
    };
  }

  useLayoutEffect(() => {
    if (force === 0) {
      setForce(1);
    }
  }, []);

  return (
    <StyledEvent.TWflexContainer ref={eventRef}>
      <StyledEvent.TWplaceholder style={{ height: event.mutable?.height }}>
        {event.id + " : " + event.mutable?.index}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
