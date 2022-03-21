import { styles } from "@/components/Day/tw";
import { memo } from "react";
import { DateService } from "@/utils/Date";
import { Droppable } from "react-beautiful-dnd";
import { useDayLockDispatcher } from "@/hooks/useDayLock";
import { useSetEventSelected } from "../Controller/main";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useIsDragging } from "@/hooks/useIsDragging";

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
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const lockedDaysDispatcher = useDayLockDispatcher();

  const setEventController = useSetEventSelected();

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
    <Droppable droppableId={`${fullDate}:`}>
      {(provided, snapshot) => (
        <styles.contain
          {...provided.droppableProps}
          ref={provided.innerRef}
          id={`day-${fullDate}`}
          $isLock={isLocked}
          $isWeekend={isWeekend}
          $isSelected={isSelected(start, fullDate, end)}
          onClick={() => {
            if (isDragging.state || isLocked || isWeekend) {
              return;
            }
            dispatchControllerDates({
              type: "updateDates",
              payload: { start: fullDate, end: fullDate },
            });

            if (start === fullDate && end === fullDate) {
              setEventController(null);
            }
          }}
          onMouseUp={() => {
            //console.info("leaving action at day:", dayPadd);
          }}
          onMouseEnter={() => console.info("passing over:", dayPadd)}
        >
          <styles.header
            $isLock={isLocked}
            title={(() => {
              return (isLocked ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
            })()}
            $isWeekend={isWeekend}
            onClick={(e) => {
              e.stopPropagation();
              lockedDaysDispatcher({ type: "update", date: fullDate });
            }}
          >
            <styles.daySpot $isToday={isToday}>{dayPadd}</styles.daySpot>
          </styles.header>
          {!isWeekend && children}
          {provided.placeholder}
        </styles.contain>
      )}
    </Droppable>
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
