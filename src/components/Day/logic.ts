import { DateService } from "../../utils/Date";
import { useEventDispatch } from "../../hooks/useEventsState";
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

  return (date: jh.date.representation, dndEvent: jh.event) => {
    const dndEventRef = { ...dndEvent };
    //!const isWeekend = DateService.IsWeekend(date);
    //if (isWeekend) {
    //  return;
    //}
    if (typeof dndEventRef === "undefined") {
      return;
    }

    if (dndEventRef.mutable?.dragDirection === "forward") {
      dndEventRef.end = date;
      const isRewind = DateService.DaysFrom(dndEventRef.start, date) < 0;
      if (isRewind) {
        dndEventRef.start = date;
      }
    } else if (dndEventRef.mutable?.dragDirection === "backward") {
      dndEventRef.start = date;
      const isRewind = DateService.DaysFrom(dndEventRef.end, date) > 0;
      if (isRewind) {
        dndEventRef.end = date;
      }
    } else if (dndEventRef.mutable?.dragDirection === "none") {
      dndEventRef.start = date;
      dndEventRef.end = date;
    }
    //temporaryEventDispatcher(newEvent);
    //-------------------------------------------------------------------------------------------

    fetchEvent_Day("PUT", dndEventRef);
    //TODO: Disable this on mobile, to avoid update state while dragging
    eventDispatcher({
      type: "update",
      payload: [{ ...dndEventRef }],
    });
    setDnDEventRef(dndEventRef);
  };
};
