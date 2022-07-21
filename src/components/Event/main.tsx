import { createRef, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";
import { DateService } from "../../utils/Date";
import { useHoverEvent, useStyles } from "../../components/Event/logic";
import { useGetEventFamily } from "../../hooks/useEventsState";
import { EventCard, EventTail } from "../../components/Event/eventCard";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { DragHandlers } from "./dragHandlers";
import { Placeholder_Debug } from "./placeholder";

interface Event {
  event: jh.event;
  index: number;

  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  textEvent: number;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
}

export function eventID(id: number, role: string, subcomponent: string) {
  return `event:${role}:${id}:${subcomponent}`;
}

/**
 * Event interactive component, expected functions
 */
export const Event = ({
  event,
  index,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: Event) => {
  const eventRef = useRef<HTMLDivElement>();

  //week.from = event.start;

  //--------------------------------------------

  const isChildren = event.type === "tailhead";
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
              <EventCard
                event={event}
                refNode={createRef()}
                style={style?.static || {}}
                setTextArea={setTextArea}
                setTextEvent={setTextEvent}
              />
            ) : (
              <EventTail event={event} />
            )}
          </StyledEvent.TWtextContent>
          {
            //!In charged of root spacing
          }
          <Placeholder_Debug
            index={index}
            event={event}
            eventRef={eventRef}
            textArea={textArea}
            setTextArea={setTextArea}
            textEvent={textEvent}
            setTextEvent={setTextEvent}
          />
        </>
      </DragHandlers>
    </>
  );
};

//export const MemoEvent = memo(Event);
export const MemoEvent = Event;

interface EventHolder {
  event: jh.event;
  id: string;

  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  textEvent: number;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
}

export const EventHolder = ({
  event,
  id,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: EventHolder) => {
  const [force, setForce] = useState(0);
  const [parent] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  const [style, setStyle] = useState({ height: "2rem" });
  //const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  useLayoutEffect(() => {
    if (typeof eventRef.current !== "undefined") {
      const h0 =
        typeof parent.mutable === "object"
          ? parseInt(parent.mutable.height.split("px")[0])
          : eventRef.current.clientHeight;
      const newState = { height: `${h0}` };
      //const newState = { height: `${h0}px` };
      event.mutable = {
        height: newState.height,
        eventRef: eventRef.current,
        index: typeof parent.mutable === "object" ? parent.mutable.index : 0, //!Corrected bug: was using event.end wich is zero
      };
    }
  }, [eventRef.current, event, event.mutable, force]);

  useLayoutEffect(() => {
    if (force === 0 && typeof event.mutable === "object") {
      setTimeout(() => {
        setForce(1);
      }, 100);
    }
  }, [event.mutable]);

  const isChildren = event.type === "tailholder";
  const tailState = { height: "1rem" };

  useLayoutEffect(() => {
    //debugger;
    if (textEvent === event.id) {
      setStyle({ height: `${textArea}px` });
    } else {
      const result = isChildren
        ? tailState.height
        : event.mutable?.height || "9rem";
      if (event.client === "BDM") {
        // debugger;
      }
      setStyle({ height: `${result}px` });
    }
  }, [force, textArea, textEvent, event.job]);

  if (isChildren) {
    return (
      <div className="bg-blue-200">
        <StyledEvent.TWflexContainer_Holder ref={eventRef}>
          <StyledEvent.TWplaceholder style={style}>
            {event.id + " : " + event.mutable?.index}
          </StyledEvent.TWplaceholder>
        </StyledEvent.TWflexContainer_Holder>
      </div>
    );
  } else {
    return (
      <div className="bg-red-200">
        <StyledEvent.TWflexContainer_Holder ref={eventRef}>
          <StyledEvent.TWplaceholder style={style}>
            {event.id + " : " + event.mutable?.index}
          </StyledEvent.TWplaceholder>
        </StyledEvent.TWflexContainer_Holder>
      </div>
    );
  }
};

//export const MemoEventHolder = memo(EventHolder);
export const MemoEventHolder = EventHolder;
