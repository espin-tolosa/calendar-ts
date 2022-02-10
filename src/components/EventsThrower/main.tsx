import { Event, EventHolder } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsApi";
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
  //No events in a day fast exit
  if (dayEvents.length === 0) {
    return <></>;
  }

  const sortedEvents = bubblingAlgo(dayEvents);

  return (
    <>
      {sortedEvents.map((event, position) => {
        const keyValue = Math.abs(event.id);
        if (isPlaceholder(event)) {
          return (
            <EventHolder key={`p-${keyValue}`} event={event}></EventHolder>
          );
        }
        //Mutable instruction for global state of events
        sendEndReferencesToPlaceholders(allEvents, event, position);
        return <Event key={`e-${keyValue}`} event={event}></Event>;
      })}
    </>
  );
};
