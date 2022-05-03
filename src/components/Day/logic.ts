import { DateService } from "@/utils/Date";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/context/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";

type date = string;

export const useOnDragEnter = () => {
  // const events = useEventState();
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  return (date: date) => {
    const newEvent = { ...temporaryEvent };
    console.log("NEW EVENT", newEvent);
    //TODO: pulling from red is working like this, but pulling from green it is more or less the opposite
    if (temporaryEvent.mutable?.bubble === 1) {
      newEvent.end = date;
      const isRewind = DateService.DaysFrom(temporaryEvent.start, date) < 0;
      if (isRewind) {
        newEvent.start = date;
      }
    } else if (temporaryEvent.mutable?.bubble === -1) {
      newEvent.start = date;
      const isRewind = DateService.DaysFrom(temporaryEvent.end, date) > 0;
      if (isRewind) {
        newEvent.end = date;
      }
    } else {
      newEvent.start = date;
      newEvent.end = date;
    }
    //temporaryEventDispatcher(newEvent);
    //-------------------------------------------------------------------------------------------

    eventDispatcher({
      type: "update",
      payload: [{ ...newEvent, start: "2022-05-03", id: 123456789 }],
      callback: pushDaysDispatcher,
    });
    console.log("Dispatching", newEvent);
    fetchEvent_Day("PUT", newEvent);
  };
};
