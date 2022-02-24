import * as StyledDay from "@/components/Day/tw";
import { memo, useState } from "react";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { DateService } from "@/utils/Date";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
import { Droppable } from "react-beautiful-dnd";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  restDays: boolean;
}>;
export function IDay({ children, daynumber, fullDate, restDays }: IDayProps) {
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const [lock, setLock] = useState(false);
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

  //day-off

  /*
	        {(provided, snapshot) => (
          <StyledDay.Container
            ref={provided.innerRef}
            {...provided.droppableProps}
            onClick={handleClick}
            backGroundColor={background[styles]}
            isDraggingOver={snapshot.isDraggingOver}
          >
            <StyledDay.Header isDraggingOver={snapshot.isDraggingOver}>
              {day}
            </StyledDay.Header>
            <StyledDay.Body isDraggingOver={snapshot.isDraggingOver}>

	*/

  return (
    <Droppable droppableId={fullDate}>
      {(provided, snapshot) => (
        <StyledDay.TWsizedContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
          $top={lock}
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
            $showWeekend={localState.showWeekends}
            $restDays={restDays}
            title={(() => {
              return (lock ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
            })()}
            $isWeekend={isWeekend}
            onClick={(e) => {
              e.stopPropagation();
              setLock((prev) => !prev);
            }}
          >
            <StyledDay.TWdaySpot>{dayPadd}</StyledDay.TWdaySpot>
          </StyledDay.TWheader>
          {children}
        </StyledDay.TWsizedContainer>
      )}
    </Droppable>
  );
}

export const MemoIDay = memo(IDay);

//  console.warn("Memo day");
//console.log("prevProps", prevProps);
// console.log("nextProps", nextProps);
//return false;
//});
