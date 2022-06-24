import { DateService } from "@/utils/Date";
import { useEventDispatch } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import { useDnDEventRef, useSetDnDEventRef } from "@/context/dndEventRef";
import { event } from "@/interfaces";

type date = string;

export const useOnDragEnter = () => {
  // const events = useEventState();
  const dndEventRef = useDnDEventRef();
  const setDnDEventRef = useSetDnDEventRef();
  if (dndEventRef === null) {
    return;
  }
  // const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  return (date: date, dndEvent: event) => {
    const isWeekend = DateService.IsWeekend(date);
    if (isWeekend) {
      return;
    }
    if (typeof dndEvent === "undefined") {
      return;
    }

    if (dndEvent.mutable?.bubble === 1) {
      dndEvent.end = date;
      const isRewind = DateService.DaysFrom(dndEvent.start, date) < 0;
      if (isRewind) {
        dndEvent.start = date;
      }
    } else if (dndEvent.mutable?.bubble === -1) {
      dndEvent.start = date;
      const isRewind = DateService.DaysFrom(dndEvent.end, date) > 0;
      if (isRewind) {
        dndEvent.end = date;
      }
    } else if (dndEvent.mutable?.bubble === 0) {
      dndEvent.start = date;
      dndEvent.end = date;
    }
    //temporaryEventDispatcher(newEvent);
    //-------------------------------------------------------------------------------------------

    fetchEvent_Day("PUT", dndEvent);
    eventDispatcher({
      type: "update",
      payload: [{ ...dndEvent }],
      callback: pushDaysDispatcher,
    });
    setDnDEventRef(dndEvent);
  };
};
