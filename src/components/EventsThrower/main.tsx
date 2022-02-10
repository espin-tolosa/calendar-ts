import { Event, EventHolder } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsApi";
import { event } from "@/interfaces";
import {
  bubblingAlgo,
  isPlaceholder,
} from "@components/EventsThrower/bubblingAlgoUtils";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const dayEvents = useEventState(day);
  const allEvents = useEventState();
  if (dayEvents.length === 0) {
    return <></>;
  }

  const sortedEvents = bubblingAlgo(dayEvents);

  return (
    <>
      {sortedEvents.map((event, index) => {
        if (isPlaceholder(event)) {
          return <EventHolder key={event.id} {...event}></EventHolder>;
        }
        const foundEvents =
          allEvents.filter((placeholder) => placeholder.id === -event.id) || [];
        foundEvents.map((placeholder) => (placeholder.end = String(index)));
        if (foundEvents.length > 0) {
        }
        return <Event key={event.id} {...event}></Event>;
      })}
    </>
  );
};
