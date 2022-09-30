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

    const { hover } = useHoverEvent(event);
    const clientsStyles = useClientsStyles();
    const color = clientsStyles.response?.colors[event.client];
    const style = useStyles(hover, event, color?.primary ?? "#ffffff" );

    //TODO: move event dto which eventually will be a class object of the model
    const eventLong = EventClass.maxSpread(event);

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
    const isChildren = event.type === "tailhead";

    return (

    <DragHandlers event={event}
    //! START COMMENT
    spread={eventLong}
    //! END COMMENT
    >
    <>
        <StyledEvent.TWtextContent id={id} style={cssStyle.dinamic} ref={eventRef}
            $isChildren={isChildren} $isHover={hover} $cells={eventLong} $client={event.client.toLowerCase()}>

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
            .filter((e) => e.type.includes("head"))
            .filter((e): e is Required<jh.event> => EventClass.hasMutable(e))
            .filter((e) => EventClass.hasMutable(parent) && parent.mutable.index === e.mutable.index)
            .map((r): number => EventClass.hasMutable(r) ? r.mutable.eventRef.clientHeight : 0);

        const maxH = Math.max(...sameRow);
        const newState = { height: `${maxH}px` };

        setStyle(newState);

    }, [eventRef, eventRef.current, event, textArea, textEvent]);

  return (<StyledEvent.TWplaceholder style={style} title={`${event.id}`} ref={eventRef} />);
};

const MemoEventHolder = EventHolder;
