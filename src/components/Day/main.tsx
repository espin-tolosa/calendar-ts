import { useContext } from "react";
import { EventsProvider } from "@/context/eventState";
import * as StyledDay from "@components/Day/tw";
import { Event } from "@components/Event/main";

export const Day = ({ day }: { day: number }) => {
  const events = useContext(EventsProvider);
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;

  //day-off
  const top = day <= 5 && day >= 3 ? true : false;

  return (
    <StyledDay.TWsizedContainer
      $top={top}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <StyledDay.TWheader>
        <StyledDay.TWdaySpot>{dayPadd}</StyledDay.TWdaySpot>
      </StyledDay.TWheader>
      {events
        .filter((event) => event.start === String(day))
        .map((event) => (
          <Event key={event.id} {...event}></Event>
        ))}
    </StyledDay.TWsizedContainer>
  );
};

/*
interface EventProps {
	date: string;
}

const ThrowEventsArray: React.FC<EventProps> = ({ date }): JSX.Element => {
	const { events } = useContext(EventsCtx);

	return (
		<>
			{events
				.filter((event) => event.start.includes(date))
				.map((event) => (
					<Event {...e}></Event>
				))}
		</>
	);
};
*/
