import { useContext } from "react";
import { EventsProvider } from "@/context/eventState";
import { Event } from "@components/Event/main";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const events = useContext(EventsProvider);

  return (
    <>
      {events
        .filter((event) => event.start === day)
        .map((event) => (
          <Event key={event.id} {...event}></Event>
        ))}
    </>
  );
};
/*
const ThrowEventsArray2 = ({ day }: { day: string }) => {
  const events = useContext(EventsProvider);

  return (
    <>
      {events
        .filter((event) => event.start === day)
        .map((event) => (
          <Event key={event.id} {...event}></Event>
        ))}
    </>
  );
};
*/