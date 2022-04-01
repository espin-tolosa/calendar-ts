import { styles } from "@/components/Day/tw";
import { EventsThrower } from "@/components/EventsThrower/main";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { DateService } from "@/utils/Date";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useIsDragging } from "@/hooks/useIsDragging";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import { CustomValues } from "@/customTypes";
import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { event } from "@/interfaces";
import { usePostQuery } from "@/api/queries";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  start: string;
  end: string;
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

export function IDay({ children, daynumber, fullDate, start, end }: IDayProps) {
  //TODO: Locked days not impl
  const isLocked = false;
  //Query Hook
  const click = usePostQuery(fullDate);
  //
  const isWeekend = DateService.IsWeekend(fullDate);
  const eventDispatcher = useEventDispatch();
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const componentName = "Day";
  //console.info("Renderer " + componentName + " : " + fullDate);
  useEffect(() => {
    //console.info("Use Effect " + componentName + " : " + fullDate);
  }, []);
  useLayoutEffect(() => {
    //console.info("Use Layout of " + componentName + " : " + fullDate);
  }, []);

  const setEventController = useSetEventSelected();
  //dnd
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const isSet = useRef(CustomValues.nullEvent);
  const dayDivRef = useRef<HTMLDivElement>(null);

  //const { id } = useControllerState();
  const events = useEventState(fullDate);

  if (fullDate === "2022-03-24") {
    //console.log("events for day", fullDate);
    //console.log(events);
  }

  const dispatchControllerDates = useControllerDispatchDates();
  const isDragging = useIsDragging();

  const isSelected = (start: string, today: string, end: string) => {
    const left = DateService.DaysFrom(start, today);
    const right = DateService.DaysFrom(end, today);

    if (left >= 0 && right <= 0) {
      return true;
    }
    return false;
  };

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
        if (isRewind) {
          newEvent.start = fullDate;
        } else {
          newEvent.end = fullDate;
        }
        eventDispatcher({
          type: "update",
          payload: [newEvent],
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

      {true ? <EventsThrower day={fullDate} /> : <></>}
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

  const datesSelectionEqual = prevSelection === nextSelection;

  //const isLockedEqual = prev.isLocked === next.isLocked;

  //const showWeekendEqual = prev.isWeekend === next.isWeekend;

  return datesSelectionEqual /* && isLockedEqual*/ /*&& showWeekendEqual*/;
});
