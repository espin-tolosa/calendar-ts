import { styles } from "@/components/Day/tw";
import {
  EventsThrower,
  MemoEventsThrower,
} from "@/components/EventsThrower/main";
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
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  start: string;
  end: string;
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

export function IDay({
  daynumber,
  fullDate,
  start,
  end,
  pushedDays,
}: IDayProps) {
  const pushDaysDispatcher = usePushedDaysDispatcher();

  //TODO: Locked days not impl
  const isLocked = false;
  //Query Hook
  const click = usePostQuery(fullDate);
  //
  const isWeekend = DateService.IsWeekend(fullDate);
  const eventDispatcher = useEventDispatch();
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;

  //dnd
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const dayDivRef = useRef<HTMLDivElement>(null);

  const isSelected = (start: string, today: string, end: string) => {
    const left = DateService.DaysFrom(start, today);
    const right = DateService.DaysFrom(end, today);

    if (left >= 0 && right <= 0) {
      return true;
    }
    return false;
  };

  //Determine if this day is current local date of client
  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  return (
    <styles.contain
      id={`day-${fullDate}`}
      $isLock={isLocked}
      $isWeekend={isWeekend}
      $isSelected={isSelected(start, fullDate, end)}
      ref={dayDivRef}
      onClick={click}
      onDragEnter={(e) => {
        if (temporaryEvent.end === fullDate) {
          return;
        }
        const isRewind =
          DateService.DaysFrom(temporaryEvent.start, fullDate) < 0;
        const newEvent = { ...temporaryEvent };
        console.log("Temporary event", newEvent);
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
      }}
      onMouseUp={() => {}}
    >
      <styles.header
        $isLock={isLocked}
        title={(() => {
          return (isLocked ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
        })()}
        $isWeekend={isWeekend}
      >
        <styles.daySpot $isToday={isToday}>{dayPadd}</styles.daySpot>
      </styles.header>

      {true ? (
        <MemoEventsThrower day={fullDate} pushedDays={pushedDays} />
      ) : (
        <></>
      )}
    </styles.contain>
  );
}
const isSelected = (start: string, today: string, end: string) => {
  const left = DateService.DaysFrom(start, today);
  const right = DateService.DaysFrom(end, today);

  if (left >= 0 && right <= 0) {
    return true;
  }
  return false;
};

export const MemoIDay = memo(IDay, (prev, next) => {
  const prevSelection = isSelected(prev.start, prev.fullDate, prev.end);
  const nextSelection = isSelected(next.start, next.fullDate, next.end);

  //const datesSelectionEqual = prevSelection === nextSelection;

  //const isLockedEqual = prev.isLocked === next.isLocked;

  //const showWeekendEqual = prev.isWeekend === next.isWeekend;
  const isDayToPush = next.pushedDays.has(next.fullDate);
  //const isDayToPush = next.fullDate === "2022-04-05";

  return !isDayToPush;
  //return false;
  //return false;
  //return datesSelectionEqual /* && isLockedEqual*/ /*&& showWeekendEqual*/;
});
