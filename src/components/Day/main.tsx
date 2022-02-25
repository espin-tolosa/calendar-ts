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

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  restDays: boolean;
}>;
export function IDay({ children, daynumber, fullDate, restDays }: IDayProps) {
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const lockedDays = useDayLock();
  const lockedDaysDispatcher = useDayLockDispatcher();
  const isLocked = lockedDays.find((lock) => lock === fullDate) === fullDate;
  const dispatchController = useControllerDispatch();
  const { localState } = useLocalUserPreferencesContext();

  const dayName = DateService.GetMonthDayKey(new Date(fullDate));
  const isWeekend = dayName === "Sunday" || dayName === "Saturday";

  const controllerState = useControllerState();

  const left = DateService.DaysFromStartToEnd(controllerState.start, fullDate);
  const right = DateService.DaysFromStartToEnd(controllerState.end, fullDate);
  let isSelected = false;

  if (left >= 0 && right <= 0) {
    isSelected = true;
  }

  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  return (
    <Droppable droppableId={fullDate}>
      {(provided, snapshot) => (
        <StyledDay.TWsizedContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
          $isLock={isLocked}
          $isWeekend={isWeekend}
          $showWeekend={localState.showWeekends}
          $isSelected={isSelected}
          $restDays={restDays}
          onClick={() => {
            dispatchController({
              type: "setDates",
              payload: { start: fullDate, end: fullDate },
            });
          }}
          onMouseUp={() => {
            console.log("leaving action at day:", dayPadd);
          }}
          onMouseEnter={() => console.log("passing over:", dayPadd)}
        >
          <StyledDay.TWheader
            $isLock={isLocked}
            $showWeekend={localState.showWeekends}
            $restDays={restDays}
            title={(() => {
              return (isLocked ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
            })()}
            $isWeekend={isWeekend}
            onClick={(e) => {
              e.stopPropagation();
              lockedDaysDispatcher({ type: "addlock", payload: fullDate });
            }}
          >
            <StyledDay.TWdaySpot $isToday={isToday}>
              {dayPadd}
            </StyledDay.TWdaySpot>
          </StyledDay.TWheader>
          {children}
        </StyledDay.TWsizedContainer>
      )}
    </Droppable>
  );
}

export const MemoIDay = memo(IDay);
