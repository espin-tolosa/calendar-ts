import * as StyledDay from "@/components/Day/tw";
import { memo, useState } from "react";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { DateService } from "@/utils/Date";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
import { Droppable } from "react-beautiful-dnd";
import { useDayLock, useDayLockDispatcher } from "@/hooks/useDayLock";
import { useEventSelected, useSetEventSelected } from "../Controller/main";
import {
  useControllerStateDates,
  useControllerDispatchDates,
} from "@/hooks/useControllerDate";
import { useIsDragging } from "@/hooks/useIsDragging";
import { event } from "@/interfaces";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  restDays: boolean;
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
  restDays,
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
    const left = DateService.DaysFromStartToEnd(start, today);
    const right = DateService.DaysFromStartToEnd(end, today);

    if (left >= 0 && right <= 0) {
      return true;
    }
    return false;
  };

  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  return (
    <Droppable droppableId={fullDate}>
      {(provided, snapshot) => (
        <StyledDay.TWsizedContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
          id={`day-${fullDate}`}
          $isLock={isLocked}
          $isWeekend={isWeekend}
          $isSelected={isSelected(start, fullDate, end)}
          $restDays={restDays}
          onClick={() => {
            if (isDragging.state) {
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
          <StyledDay.TWheader
            $isLock={isLocked}
            $restDays={restDays}
            title={(() => {
              return (isLocked ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
            })()}
            $isWeekend={isWeekend}
            onClick={(e) => {
              e.stopPropagation();
              lockedDaysDispatcher({ type: "update", date: fullDate });
            }}
          >
            <StyledDay.TWdaySpot $isToday={isToday}>
              {dayPadd}
            </StyledDay.TWdaySpot>
          </StyledDay.TWheader>
          {children}
          {provided.placeholder}
        </StyledDay.TWsizedContainer>
      )}
    </Droppable>
  );
}
//comparing props//TODO: improve criteria
function moviePropsAreEqual(prev: any, next: any) {
  console.info("prev", prev);
  const randomBool = Math.random() < 0.5;
  return false;
}
const isSelected = (start: string, today: string, end: string) => {
  const left = DateService.DaysFromStartToEnd(start, today);
  const right = DateService.DaysFromStartToEnd(end, today);

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
