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
  const { localState } = useLocalUserPreferencesContext();
  const eventSelected = useEventSelected();
  const setEventController = useSetEventSelected();
  const { start, end } = useControllerStateDates();
  const dispatchControllerDates = useControllerDispatchDates();

  const dayName = DateService.GetMonthDayKey(new Date(fullDate));
  const isWeekend = dayName === "Sunday" || dayName === "Saturday";

  const left = DateService.DaysFromStartToEnd(start, fullDate);
  const right = DateService.DaysFromStartToEnd(end, fullDate);
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
          id={`day-${fullDate}`}
          $isLock={isLocked}
          $isWeekend={isWeekend}
          $showWeekend={localState.showWeekends}
          $isSelected={isSelected}
          $restDays={restDays}
          onClick={() => {
            console.log("Day: event id;", eventSelected?.id || 0);
            if (eventSelected !== null) {
              setTimeout(() => {
                //setEventController(null);
                //dispatchController({
                //  type: "setDates",
                //  payload: { start: "", end: "" },
                //});
              }, 100);
            }
            dispatchControllerDates({
              type: "updateDates",
              payload: { start: fullDate, end: fullDate },
            });

            setTimeout(() => {
              if (start === fullDate && end === fullDate) {
                setEventController(null);
              }
            }, 100);
          }}
          onMouseUp={() => {
            //console.log("leaving action at day:", dayPadd);
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
              lockedDaysDispatcher({ type: "update", date: fullDate });
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

function moviePropsAreEqual(prev: any, next: any) {
  console.log("prev", prev);
  return prev === next;
}
export const MemoIDay = memo(IDay, moviePropsAreEqual);
