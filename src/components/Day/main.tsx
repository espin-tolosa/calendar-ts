import { styles } from "@/components/Day/tw";
import { memo, useRef } from "react";
import { DateService } from "@/utils/Date";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useIsDragging } from "@/hooks/useIsDragging";
import { useEventDispatch } from "@/hooks/useEventsState";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { fetchEvent } from "@/utils/fetchEvent";
import { CustomValues } from "@/customTypes";
import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { event } from "@/interfaces";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  start: string;
  end: string;
  isLocked: boolean;
  isWeekend: boolean;
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
  children,
  daynumber,
  fullDate,
  start,
  end,
  isLocked,
  isWeekend,
}: IDayProps) {
  const eventDispatcher = useEventDispatch();
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;

  const setEventController = useSetEventSelected();
  //dnd
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const isSet = useRef(CustomValues.nullEvent);
  const dayDivRef = useRef<HTMLDivElement>(null);

  //const { id } = useControllerState();

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
      onClick={async () => {
        if (isDragging.state || isLocked || isWeekend) {
          return;
        }

        //
        const newEvent = {
          id: 100000,
          client: "default",
          job: "default",
          start: fullDate,
          end: fullDate,
        };
        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });
        const result = await fetchEvent("POST", newEvent);

        const dbState2: Array<event> = [];
        //const dbResponse: Array<event> = await result.text();

        //This is the way I have to replace the Id of an event, since the action "replacebyid" uses the id to change the other fields, I can't use it to replace the id itself
        eventDispatcher({
          type: "delete",
          payload: [newEvent],
        });
        eventDispatcher({
          type: "syncDB",
          payload: dbState2,
        });

        //

        if (start === fullDate && end === fullDate) {
          setEventController(null);
        }
      }}
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
        fetchEvent("PUT", newEvent);
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
      {!isWeekend && children}
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

  const isLockedEqual = prev.isLocked === next.isLocked;

  const showWeekendEqual = prev.isWeekend === next.isWeekend;

  return datesSelectionEqual && isLockedEqual && showWeekendEqual;
});
