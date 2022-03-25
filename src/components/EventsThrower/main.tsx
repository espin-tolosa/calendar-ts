import { Event, EventHolder } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsState";
import { useDayLock } from "@/hooks/useDayLock";
import {
  bubblingAlgo,
  isPlaceholder,
} from "@components/EventsThrower/bubblingAlgoUtils";
import { sendEndReferencesToPlaceholders } from "@components/EventsThrower/sendReferencesToPlaceholders";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const dayEvents = useEventState(day);
  const allEvents = useEventState();
  const lockedDays = useDayLock();
  const isLocked = lockedDays.find((lock) => lock === day) === day;
  //No events in a day fast exit
  if (dayEvents.length === 0 || isLocked) {
    return <></>;
  }

  const sortedEvents = bubblingAlgo(dayEvents);
  console.log("Sorted events", sortedEvents);

  //TODO: style height has be passed from eventRef

  return (
    <div className="flex flex-col gap-1 my-5">
      {sortedEvents.map((event, position) => {
        const keyValue = Math.abs(event.id);
        if (isPlaceholder(event)) {
          return (
            <EventHolder
              key={`p-${keyValue}`}
              event={event}
              style={{ height: event.mutable?.height }}
            ></EventHolder>
          );
        }
        //Mutable instruction for global state of events
        sendEndReferencesToPlaceholders(allEvents, event, position);
        return <Event key={`e-${keyValue}`} event={event}></Event>;
      })}
    </div>
  );
};
