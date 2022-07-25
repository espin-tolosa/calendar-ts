import { MemoEvent, MemoEventHolder } from "../../components/Event/main";
import { useEventState } from "../../hooks/useEventsState";
import { bubblingAlgo } from "../../components/EventsThrower/bubblingAlgoUtils";
import { sendEndReferencesToPlaceholders } from "../../components/EventsThrower/sendReferencesToPlaceholders";
import { isPlaceholder } from "../../utils/ValidateEvent";

interface EventProps {
  day: string;
  pushedDays: Set<string>;
  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  textEvent: number;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
  //textArea: number;
  //setTextArea: React.Dispatch<React.SetStateAction<number>>;
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
    <div className="flex flex-col my-10">
      {sortedEvents.map((event, position) => {
        const keyValue = `${event.id}-${event.type}`;
        if (isPlaceholder(event)) {
          //! incharged of spaned spacing
          return (
            <MemoEventHolder
              key={`p-${keyValue}`}
              id={`p-${keyValue}`}
              event={event}
              textArea={propTypes.textArea}
              setTextArea={propTypes.setTextArea}
              textEvent={propTypes.textEvent}
              setTextEvent={propTypes.setTextEvent}
            ></MemoEventHolder>
          );
        }
        //Mutable instruction for global state of events
        sendEndReferencesToPlaceholders(allEvents, event, position);
        return (
          <MemoEvent
            key={`e-${keyValue}`}
            event={event}
            index={position}
            textArea={propTypes.textArea}
            setTextArea={propTypes.setTextArea}
            textEvent={propTypes.textEvent}
            setTextEvent={propTypes.setTextEvent}
          ></MemoEvent>
        );
      })}
    </div>
  );
};

export const MemoEventsThrower = EventsThrower;

//export const MemoEventsThrower = memo(EventsThrower, (prev, next) => {
//  //const datesSelectionEqual = prevSelection === nextSelection;
//
//  //const isLockedEqual = prev.isLocked === next.isLocked;
//
//  //const showWeekendEqual = prev.isWeekend === next.isWeekend;
//  const isDayToPush = next.pushedDays.has(next.day);
//
//  return !isDayToPush || prev.textArea !== prev.textArea || prev.textEvent !== next.textEvent
//  //return datesSelectionEqual /* && isLockedEqual*/ /*&& showWeekendEqual*/;
//});
