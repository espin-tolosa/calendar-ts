import * as tw_Day from "@components/Day/tw";
import { event } from "@interfaces/index";
import { Event } from "@components/Event/main";

export const Day = ({ day, events }: { day: number; events: Array<event> }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;

  //day-off
  const top = day <= 5 && day >= 3 ? true : false;

  //TODO: Create a Context

  return (
    <tw_Day.sizedContainer
      $top={top}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <tw_Day.header>
        <tw_Day.daySpot>{dayPadd}</tw_Day.daySpot>
      </tw_Day.header>
      {events
        .filter((event) => event.start === String(day))
        .map((event) => (
          <Event key={event.id} {...event}></Event>
        ))}
    </tw_Day.sizedContainer>
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
