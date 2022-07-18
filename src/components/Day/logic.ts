import { DateService } from "../../utils/Date";
import { useEventDispatch } from "../../hooks/useEventsState";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { fetchEvent_Day } from "../../utils/fetchEvent";
import { useDnDEventRef, useSetDnDEventRef } from "../../context/dndEventRef";

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

  return (date: jh.date.representation, dndEvent: jh.event) => {
    const dndEventRef = { ...dndEvent };
    //!const isWeekend = DateService.IsWeekend(date);
    console.log("Enter dnd event", dndEventRef);
    //if (isWeekend) {
    //  return;
    //}
    if (typeof dndEventRef === "undefined") {
      return;
    }

    if (dndEventRef.mutable?.bubble === 1) {
      dndEventRef.end = date;
      const isRewind = DateService.DaysFrom(dndEventRef.start, date) < 0;
      if (isRewind) {
        dndEventRef.start = date;
      }
    } else if (dndEventRef.mutable?.bubble === -1) {
      dndEventRef.start = date;
      const isRewind = DateService.DaysFrom(dndEventRef.end, date) > 0;
      if (isRewind) {
        dndEventRef.end = date;
      }
    } else if (dndEventRef.mutable?.bubble === 0) {
      dndEventRef.start = date;
      dndEventRef.end = date;
    }
    //temporaryEventDispatcher(newEvent);
    //-------------------------------------------------------------------------------------------

    console.log("Fetching to", dndEventRef);
    fetchEvent_Day("PUT", dndEventRef);
    eventDispatcher({
      type: "update",
      payload: [{ ...dndEventRef }],
      callback: pushDaysDispatcher,
    });
    setDnDEventRef(dndEventRef);
  };
};
