import { Event, EventHolder } from "@components/Event/main";
import { useEventState } from "@/hooks/useEventsState";
import { bubblingAlgo } from "@components/EventsThrower/bubblingAlgoUtils";
import { sendEndReferencesToPlaceholders } from "@components/EventsThrower/sendReferencesToPlaceholders";
import { isPlaceholder, isValidPlaceholder } from "@/utils/ValidateEvent";
import { useEffect, useLayoutEffect } from "react";
import { DateService } from "@/utils/Date";

interface EventProps {
  day: string;
}

export const EventsThrower: React.FC<EventProps> = ({ day }): JSX.Element => {
  const dayEvents = useEventState(day);
  const allEvents = useEventState();
  const weekRange = DateService.GetWeekRangeOf(day);
  const eventsOfWeek = useEventState(weekRange);
  const componentName = "Eventthrown";
  //console.info("Renderer " + componentName + " : " + day);
  useEffect(() => {
    //console.info("Use Effect " + componentName + " : " + day);
  }, []);
  useLayoutEffect(() => {
    //console.info("Use Layout of " + componentName + " : " + day);
  }, []);
  //TODO: rebuild isLocked day const isLocked = lockedDays.find((lock) => lock === day) === day;
  const isLocked = false;
  //No events in a day fast exit

  const sortedEvents = bubblingAlgo(dayEvents);
  //const sortedEvents = dayEvents;

  useEffect(() => {
    if (dayEvents.length === 0 || isLocked) {
      return;
    }
    //console.log(`%c Effect: ${day} `, "background: #222; color: #bada55");
    //console.log(dayEvents, allEvents);
  });

  useLayoutEffect(() => {
    if (dayEvents.length === 0 || isLocked) {
      return;
    }
    //console.log(`%c Layout: ${day} `, "background: #222; color: #55dac8");
  });

  //TODO: style height has be passed from eventRef

  if (dayEvents.length === 0 || isLocked) {
    return <></>;
  }
  //console.log(`%c Renderer: ${day} `, "background: #222; color: #d86a49");
  //console.log("Rendering inside EventThro", dayEvents);

  //console.log(eventsOfWeek);
  //console.log("----------------------------------------------------");

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
        return (
          <Event key={`e-${keyValue}`} event={event} index={position}></Event>
        );
      })}
    </div>
  );
};
