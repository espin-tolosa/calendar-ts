import { memo, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";
import { DateService } from "../../utils/Date";
import { useHoverEvent, useStyles } from "../../components/Event/logic";
import { useGetEventFamily } from "../../hooks/useEventsState";
import { EventCard, EventTail } from "../../components/Event/eventCard";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { DragHandlers } from "./dragHandlers";
import { Placeholder } from "./placeholder";

export function eventID(id: number, role: string, subcomponent: string) {
  return `event:${role}:${id}:${subcomponent}`;
}

/**
 * Event interactive component, expected functions
 */
export const Event = ({ event, index }: { event: jh.event; index: number }) => {
  const eventRef = useRef<HTMLDivElement>();

  //week.from = event.start;

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode

  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const { hover } = useHoverEvent(event);

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

  return (
    <>
      <DragHandlers event={event} spread={spreadCells}>
        <>
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
            //!In charged of root spacing
          }
          <Placeholder index={index} event={event} eventRef={eventRef} />
        </>
      </DragHandlers>
    </>
  );
};

export const MemoEvent = memo(Event);

export const EventHolder = ({ event }: { event: jh.event }) => {
  const [force, setForce] = useState(0);
  const [parent] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  //const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  if (typeof eventRef.current !== "undefined") {
    const h0 =
      typeof parent.mutable === "object"
        ? parseInt(parent.mutable.height.split("px")[0])
        : eventRef.current.clientHeight;
    const newState = { height: `${h0}px` };
    //const newState = { height: `${h0}px` };
    event.mutable = {
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
  const isChildren = event.job.includes("#isChildren");
  const tailState = { height: "3rem" };

  return (
    <StyledEvent.TWflexContainer_Holder ref={eventRef}>
      <StyledEvent.TWplaceholder
        style={isChildren ? tailState : { height: event.mutable?.height }}
      >
        {event.id + " : " + event.mutable?.index}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer_Holder>
  );
};

//export const MemoEventHolder = memo(EventHolder);
export const MemoEventHolder = EventHolder;
