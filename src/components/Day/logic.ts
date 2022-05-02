import { DateService } from "@/utils/Date";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/context/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";

type date = string;

export const useOnDragEnter = (fullDate: date) => {
  const events = useEventState();
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  return (e: React.DragEvent<HTMLDivElement>) => {
    console.log("calendar-ts-cope");
    if (temporaryEvent.end === fullDate) {
      return;
    }
    //e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    const el = document.elementsFromPoint(x, y);
    const dayDiv = el.find((e) => e.id.includes("day"));
    //All of this is the same as Board callback
    const id = dayDiv?.id;

    if (!id) {
      return;
    }

    const date = id.split("day-")[1];
    const current = events.find((event) => event.id === 123456789);
    if (date === current?.start) {
      return;
    }
    const newEvent = { ...temporaryEvent };
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
    temporaryEventDispatcher(newEvent);
    //-------------------------------------------------------------------------------------------

    eventDispatcher({
      type: "update",
      payload: [{ ...newEvent, id: 123456789 }],
      callback: pushDaysDispatcher,
    });
    fetchEvent_Day("PUT", newEvent);
  };
};