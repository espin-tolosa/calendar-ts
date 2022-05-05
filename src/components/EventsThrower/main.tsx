import { Event, EventHolder } from "@/components/Event/main";
import { useEventState } from "@/hooks/useEventsState";
import { bubblingAlgo } from "@/components/EventsThrower/bubblingAlgoUtils";
import { sendEndReferencesToPlaceholders } from "@/components/EventsThrower/sendReferencesToPlaceholders";
import { isPlaceholder } from "@/utils/ValidateEvent";
import { memo } from "react";

interface EventProps {
  day: string;
  pushedDays: Set<string>;
}

export const EventsThrower: React.FC<EventProps> = (propTypes): JSX.Element => {
  const dayEvents = useEventState(propTypes.day);
  const allEvents = useEventState();

  //TODO: style height has be passed from eventRef

  //Day off

  const dayOff = dayEvents.find((event) => event.client === "Unavailable");
  //dayOff!.mutable!.index = 0;
  const isLocked =
    typeof dayOff !== "undefined" && dayOff.client.includes("Unavailable");

  const dayEventsFiltered = isLocked ? [dayOff] : dayEvents;

  if (dayEventsFiltered.length === 0) {
    return <></>;
  }

  const sortedEvents = bubblingAlgo(dayEventsFiltered);

  return (
    <div className="flex flex-col gap-1 my-5">
      {sortedEvents.map((event, position) => {
        const keyValue = Math.abs(event.id);
        if (isPlaceholder(event)) {
          return (
            <div className="border-2 border-dashed border-red-900 bg-red-200">
              <EventHolder key={`p-${keyValue}`} event={event}></EventHolder>
            </div>
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

export const MemoEventsThrower = memo(EventsThrower, (prev, next) => {
  //const datesSelectionEqual = prevSelection === nextSelection;

  //const isLockedEqual = prev.isLocked === next.isLocked;

  //const showWeekendEqual = prev.isWeekend === next.isWeekend;
  const isDayToPush = next.pushedDays.has(next.day);

  return !isDayToPush;
  //return datesSelectionEqual /* && isLockedEqual*/ /*&& showWeekendEqual*/;
});
