import { Event } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsApi";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const events = useEventState();

  return (
    <>
      {events
        .filter((event) => {
          //     console.log(event.start, day);

          return event.start === day;
        })
        .map((event) => (
          <Event key={event.id} {...event}></Event>
        ))}
    </>
  );
};
