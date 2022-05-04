import { DateService } from "@/utils/Date";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/context/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import { useDnDEventRef, useSetDnDEventRef } from "@/context/dndEventRef";
import { event } from "@/interfaces";

type date = string;

export const useOnDragEnter = () => {
  // const events = useEventState();
  const dndEventRef = useDnDEventRef();
  console.log("REading dnd event", dndEventRef);
  const setDnDEventRef = useSetDnDEventRef();
  if (dndEventRef === null) {
    return;
  }
  // const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  return (date: date, dndEvent: event) => {
    if (typeof dndEvent === "undefined") {
      return;
    }
    console.warn("closure", date, dndEvent);
    //TODO: pulling from red is working like this, but pulling from green it is more or less the opposite
    if (dndEvent.mutable?.bubble === 1) {
      console.warn("Right");
      dndEvent.end = date;
      const isRewind = DateService.DaysFrom(dndEvent.start, date) < 0;
      if (isRewind) {
        dndEvent.start = date;
      }
    } else if (dndEvent.mutable?.bubble === -1) {
      console.warn("Left");
      dndEvent.start = date;
      const isRewind = DateService.DaysFrom(dndEvent.end, date) > 0;
      if (isRewind) {
        dndEvent.end = date;
      }
    } else if (dndEvent.mutable?.bubble === 0) {
      console.warn("Center");
      dndEvent.start = date;
      dndEvent.end = date;
    }
    //temporaryEventDispatcher(newEvent);
    setDnDEventRef(dndEvent);
    //-------------------------------------------------------------------------------------------

    fetchEvent_Day("PUT", dndEvent);
    eventDispatcher({
      type: "update",
      payload: [{ ...dndEvent }],
      callback: pushDaysDispatcher,
    });
    console.log("Dispatching", dndEvent);
  };
};
