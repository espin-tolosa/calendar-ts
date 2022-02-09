import { Event, EventHolder } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsApi";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const dayEvents = useEventState(day);
  const allEvents = useEventState();
  if (dayEvents.length === 0) {
    return <></>;
  }

  //allEvents: the global state of events componsed by event objects
  //dayEvents: the events of the day filtered from the global state
  //merged: placeholder of spreaded events sorted by it target position (end) attribute

  const merged = dayEvents
    .filter((e) => e.id < 0)
    .sort((prev, next) => parseInt(prev.end) - parseInt(next.end));

  const rootEvents = dayEvents.filter((e) => e.id > 0); //separate the real events of that day

  rootEvents.map((c) => {
    merged.push(c);

    let bubblingIndex = merged.length - 1;
    let bubbling = true;

    while (
      bubblingIndex !== 0 &&
      merged.length > 1 &&
      merged[bubblingIndex - 1].id < 0 &&
      parseInt(merged[bubblingIndex - 1].end) > bubblingIndex - 1
    ) {
      //swap
      [merged[bubblingIndex - 1], merged[bubblingIndex]] = [
        merged[bubblingIndex],
        merged[bubblingIndex - 1],
      ];
      bubblingIndex--;
    }
  });

  //console.log("Before", filterEvents);
  //const cleanEvents = filterEvents.filter((e) => e.id > 0);
  // console.log("Before push", cleanEvents);
  // const placeHolderEvents = filterEvents.filter((e) => e.id < 0);
  // console.log("Length", cleanEvents.length + placeHolderEvents.length);
  // const merge = new Array(cleanEvents.length + placeHolderEvents.length).fill(
  //   () => events[0]
  // ); // simulate a null event
  // placeHolderEvents.forEach((p) => {
  //   merge[parseInt(p.end)] = p;
  // });

  // cleanEvents.forEach((c, index) => {
  //   const emptyIndex = merge.findIndex((m) => m.id === 0);
  //   if (emptyIndex > 0) {
  //     merge[emptyIndex] = c;
  //   }
  // });
  // Separar events from placeholders, then insert placeholder at index positions targeted by end value in the cleaned events array

  //	for(let j = sortEvents.length-1; j === 0; j--)
  //	{
  //		if(sortEvents[j].id < 0)
  //		{
  //			const target = parseInt(sortEvents[j].end);
  //			if(target < j)
  //		}
  //	}

  return (
    <>
      {merged.map((event, index) => {
        if (event.id > 0) {
          console.info(`Event ${event.id} is placed at position: ${index}`);
          const foundEvents =
            allEvents.filter((placeholder) => placeholder.id === -event.id) ||
            [];
          foundEvents.map((placeholder) => (placeholder.end = String(index)));
          if (foundEvents.length > 0) {
            console.info("Found events", foundEvents);
          }
          return <Event key={event.id} {...event}></Event>;
        } else {
          return <EventHolder key={event.id} {...event}></EventHolder>;
        }
      })}
    </>
  );
};
