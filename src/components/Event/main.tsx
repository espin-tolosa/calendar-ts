import { createRef, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";
import { DateService } from "../../utils/Date";
import { useHoverEvent, useStyles } from "../../components/Event/logic";
import { useEventState, useGetEventFamily } from "../../hooks/useEventsState";
import { EventCard, EventTail } from "../../components/Event/eventCard";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { DragHandlers } from "./dragHandlers";
import { Placeholder } from "./placeholder";
import { useToken } from "@/hooks/useToken";

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

  const user = useToken();

  if (user.isValid() && !user.isAuth()) {
    if (style?.dinamic) {
      style.dinamic =
        user.user() === event.client
          ? style.dinamic
          : { background: "lightgray", color: "transparent" };
    }
    if (style?.static) {
      style.static =
        user.user() === event.client
          ? style.static
          : { background: "lightgray" };
    }
  }

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
                textArea={textArea}
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
          <Placeholder
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

export const SpanHolders = ({
  event,
  id,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: EventHolder) => {
  const [parent, closestTail, family] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ height: string }>({ height: "0px" });

  useLayoutEffect(() => {
    if (eventRef.current != null) {
      event.mutable = {
        dragDirection: "none",
        eventRef: eventRef.current,
        index:
          typeof closestTail.mutable === "object"
            ? closestTail.mutable.index
            : 0, //!Corrected bug: was using event.end wich is zero
      };
    }
  }, [event]);

  const week = DateService.GetWeekRangeOf(event.start);
  const eventsOfWeek = useEventState(week);

  useLayoutEffect(() => {
    if (!hasMutable(event)) {
      return;
    }

    const sameRow = eventsOfWeek
      .filter((e): e is Required<jh.event> => hasMutable(e))
      .filter((e) => parseInt(event.end) === e.mutable.index)
      .filter((e) => e.type === "roothead");

    const allH = sameRow.map((r): number => {
      return hasMutable(r) ? r.mutable.eventRef.clientHeight : 0;
    });

    const maxH = Math.max(
      ...allH,
      closestTail.mutable?.eventRef.clientHeight ?? 0
    );
    const newState = { height: `${maxH}px` };

    setStyle(newState);
  }, [eventRef.current, event, textArea, textEvent]);

  return (
    <StyledEvent.TWplaceholder style={style} ref={eventRef}>
      {event.id + " : " + event.mutable?.index}
    </StyledEvent.TWplaceholder>
  );
};

//export const MemoEventHolder = memo(EventHolder);
export const MemoEventHolder = SpanHolders;

const hasMutable = (e: jh.event): e is Required<jh.event> =>
  typeof e.mutable === "object";
