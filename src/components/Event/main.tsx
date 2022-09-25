import { createRef, useContext, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";
import { DateService } from "../../utils/Date";
import { useHoverEvent, useStyles } from "../../components/Event/logic";
import { useEventState, useGetEventFamily } from "../../hooks/useEventsState";
import { EventCard } from "../../components/Event/eventCard";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { DragHandlers } from "./dragHandlers";
import { Placeholder } from "./placeholder";
import { textAreaCtx } from "../Month/components/CurrentDays";
import { isPlaceholder } from "@/utils/ValidateEvent";
import { sendEndReferencesToPlaceholders } from "../EventsThrower/sendReferencesToPlaceholders";
import { EventClass } from "@/classes/event";

export interface Event {
  event: jh.event;
  index: number;
}

/**
 * Event interactive component, expected functions
 */
export const Event = ({event, index}: Event) =>
{
    const eventRef = useRef<HTMLDivElement>();

  //--------------------------------------------

  const isChildren = event.type === "tailhead";
  //edit mode

  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const { hover } = useHoverEvent(event);

  // Style hook for state transitions
  const clientsStyles = useClientsStyles();

  //TODO: make this a function
  const color = clientsStyles.response?.colors[event.client] || {
    primary: "#a9a29d",
    secondary: "#a9a29d",
  };

  const style = useStyles(isChildren, hover, event, color.primary);

  //TODO: avoid magic numbers
  const maxDayAvailable = DateService.GetDateNextDay(event.start, 5);
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    DateService.DaysFrom(event.start, maxDayAvailable)
  );

  const allEvents = useEventState();

  if(isPlaceholder(event))
  {
    return (<MemoEventHolder event={event}/>)
  }

  sendEndReferencesToPlaceholders(allEvents, event, index);

    const cssStyle= {
        dinamic: event.client !== "MISC" ? (style?.dinamic || {}) : {background: "lightgray"},
        static: event.client !== "MISC" ? (style?.static || {}) : {background: "lightgray"}
    }

    const id=EventClass.eventID(event.id, event.type)

    return (

    <DragHandlers event={event} spread={spreadCells}>
    <>
        <StyledEvent.TWtextContent id={id} style={cssStyle.dinamic} ref={eventRef}
            $isChildren={isChildren} $isHover={hover} $cells={spreadCells} $client={event.client.toLowerCase()}>

        {!isChildren ?
            <EventCard event={event} refNode={createRef()} style={cssStyle.static}/>
            :
            <EventTail/>
        }
        </StyledEvent.TWtextContent>

        <Placeholder index={index} event={event} eventRef={eventRef}/>
    </>
    </DragHandlers>
  );
};

const EventTail = () =>
{
    return <div title="event tail" className="h-5"/>;
};
//export const MemoEvent = memo(Event);
export const MemoEvent = Event;

interface EventHolder {
  event: jh.event;
}

const EventHolder = ({event}: EventHolder) =>
{
    const [parent, closestTail] = useGetEventFamily(event);
    const eventRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<{ height: string }>({ height: "0px" });
    const {textArea, textEvent} = useContext(textAreaCtx) as jh.textArea;
    //!Corrected bug: was using event.end wich is zero
    
    useLayoutEffect(() =>
    {
        if (eventRef.current != null)
        {
            const closestIndex = typeof closestTail.mutable === "object" ? closestTail.mutable.index : 0;
            event.mutable = {dragDirection: "none", eventRef: eventRef.current, index: closestIndex};
        }

    }, [eventRef, eventRef.current, event, textArea, textEvent]);

    const week = DateService.GetWeekRangeOf(event.start);
    const eventsOfWeek = useEventState(week);

    useLayoutEffect(() =>
    {
        if (!EventClass.hasMutable(event))
        {
            return;
        }

        const sameRow = eventsOfWeek
            .filter((e) => e.type === "roothead")
            .filter((e): e is Required<jh.event> => EventClass.hasMutable(e))
            .filter((e) => EventClass.hasMutable(parent) && parent.mutable.index === e.mutable.index)
            .map((r): number => EventClass.hasMutable(r) ? r.mutable.eventRef.clientHeight : 0);

        const maxH = Math.max(...sameRow);
        const newState = { height: `${maxH}px` };

        setStyle(newState);

    }, [eventRef, eventRef.current, event, textArea, textEvent]);

  return (<StyledEvent.TWplaceholder className="" style={style} ref={eventRef}/>);
};

//const MemoEventHolder = memo(EventHolder);
const MemoEventHolder = EventHolder;