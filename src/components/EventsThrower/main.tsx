import { MemoEvent } from "../../components/Event/main";
import { useEventState } from "../../hooks/useEventsState";
import { bubblingAlgo } from "../../components/EventsThrower/bubblingAlgoUtils";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = (propTypes): JSX.Element =>
{
    const dayEvents = useEventState(propTypes.day);

    const dayOff = dayEvents.find((event) => event.client === "Unavailable");

    const isLocked = typeof dayOff !== "undefined" && dayOff.client.includes("Unavailable");

    const dayEventsFiltered = isLocked ? [dayOff] : dayEvents;

    if (dayEventsFiltered.length === 0)
    {
        return <></>;
     }

    const sortedEvents = bubblingAlgo(dayEventsFiltered);
    const genKey = (index:number, event:jh.event) => `${index}-${event.id}-${event.type}`;

    return (
        <div className="flex flex-col my-10 gap-4">
        {
            sortedEvents
            .map((event, position) => <MemoEvent key={genKey(position, event)} event={event} index={position}/>)
        }
        </div>
  );
};

export const MemoEventsThrower = EventsThrower;