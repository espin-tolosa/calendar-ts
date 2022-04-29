import { styles } from "@/components/Day/tw";
import { MemoEventsThrower } from "@/components/EventsThrower/main";
import { memo, useRef } from "react";
import { DateService } from "@/utils/Date";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/context/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import { usePostQuery } from "@/api/queries";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type Day = WithChildren<{
  daynumber: number;
  fullDate: string;
  pushedDays: Set<string>;
}>;

// Used Context in Day Component:
//
// cDayLock
// cDayLockDispatcher
// cUseLocalUserPreferences
// cEventSelected
// cSetEventSelected
// cControllerState - start,end
// cControllerState - id,client,job

function Day({ daynumber, fullDate, pushedDays }: Day) {
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const addEvent = usePostQuery(fullDate);
  //TODO: Locked days not impl
  const $isLock = false;

  const $isWeekend = DateService.IsWeekend(fullDate);
  const eventDispatcher = useEventDispatch();

  //dnd
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const dayDivRef = useRef<HTMLDivElement>(null);

  //Determine if this day is current local date of client
  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  const styledProps = { $isWeekend, $isLock };

  const hOnDragEnter = (e: any) => {
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
    const isRewind = DateService.DaysFrom(temporaryEvent.start, date) < 0;
    const newEvent = { ...temporaryEvent };
    //TODO: pulling from red is working like this, but pulling from green it is more or less the opposite
    if (temporaryEvent.mutable?.bubble === 1) {
      newEvent.end = date;
      //     if (isRewind) {
      //       newEvent.start = date;
      //     } else {
      //       newEvent.end = date;
      //     }
    } else if (temporaryEvent.mutable?.bubble === -1) {
      newEvent.start = date;
      //    if (!isRewind) {
      //      newEvent.start = date;
      //    } else {
      //      newEvent.end = date;
      //    }
    } else {
      newEvent.start = date;
      newEvent.end = date;
      temporaryEventDispatcher(newEvent);
    }
    //-------------------------------------------------------------------------------------------
    newEvent.id = 10000;
    eventDispatcher({
      type: "update",
      payload: [newEvent],
      callback: pushDaysDispatcher,
    });
    fetchEvent_Day("PUT", newEvent);
  };

  const dayEvents = useEventState(fullDate);

  //  const dayOff = dayEvents.find((event) => event.client === "Unavailable");
  //  const isLocked =
  //    typeof dayOff !== "undefined" && dayOff.client.includes("Unavailable");

  return (
    <styles.contain
      id={`day-${fullDate}`}
      {...styledProps}
      ref={dayDivRef}
      onMouseDown={addEvent}
      onDragEnter={hOnDragEnter}
    >
      <styles.header {...styledProps}>
        <styles.daySpot $isToday={isToday}>{`${daynumber}`}</styles.daySpot>
      </styles.header>

      <MemoEventsThrower day={fullDate} pushedDays={pushedDays} />
    </styles.contain>
  );
}

export const MemoDay = memo(Day, (prev, next) => {
  const isDayToPush = next.pushedDays.has(next.fullDate);

  return !isDayToPush;
});
