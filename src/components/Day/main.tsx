import { styles } from "@/components/Day/tw";
import { MemoEventsThrower } from "@/components/EventsThrower/main";
import { memo, useRef } from "react";
import { DateService } from "@/utils/Date";
import { useEventDispatch } from "@/hooks/useEventsState";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
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

  const hOnDragEnter = () => {
    if (temporaryEvent.end === fullDate) {
      return;
    }
    const isRewind = DateService.DaysFrom(temporaryEvent.start, fullDate) < 0;
    const newEvent = { ...temporaryEvent };
    if (isRewind) {
      newEvent.start = fullDate;
    } else {
      newEvent.end = fullDate;
    }
    eventDispatcher({
      type: "update",
      payload: [newEvent],
      callback: pushDaysDispatcher,
    });
    fetchEvent_Day("PUT", newEvent);
    temporaryEventDispatcher(newEvent);
  };

  return (
    <styles.contain
      id={`day-${fullDate}`}
      {...styledProps}
      ref={dayDivRef}
      onClick={addEvent}
      onDragEnter={hOnDragEnter}
    >
      <styles.header {...styledProps}>
        <styles.daySpot $isToday={isToday}>{`${daynumber}`}</styles.daySpot>
      </styles.header>

      {true ? (
        <MemoEventsThrower day={fullDate} pushedDays={pushedDays} />
      ) : (
        <></>
      )}
    </styles.contain>
  );
}

export const MemoDay = memo(Day, (prev, next) => {
  const isDayToPush = next.pushedDays.has(next.fullDate);

  return !isDayToPush;
});
