import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import { MemoIDayHolder } from "@components/DayHolder/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { DateService } from "@/utils/Date";
import { event } from "@/interfaces";
import { useEventDispatch } from "@/hooks/useEventsState";

import { zeroPadd } from "@/utils/zeroPadd";
import { useControllerStateDates } from "@/hooks/useControllerDate";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
import { useIsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { useCtxCurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { isToday, _renderDate } from "@/utils/Date_v2";
import { useCtxTopNavRef } from "@/globalStorage/topNavSize";
import { DOMRefs } from "@/globalStorage/DOMRefs";
import { usePrint } from "@/hooks/usePrint";
import { useGethCancel } from "@/api/handlers";

type iMonth = {
  year: number;
  month: number;
};
const Month = ({ year, month }: iMonth) => {
  const date = useMonthDate(year, month);
  const monthRef = useCtxCurrentMonthRef();
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();

  const [topNavHeight, setTopNavHeight] = useState({ top: "" });
  useLayoutEffect(() => {
    if (!isToday(year, month)) {
      return;
    }
    const height = topNavRef?.current?.clientHeight!;
    const border = 3; /*px*/
    const style = { top: `-${height + border}px` };
    setTopNavHeight(style);
    window.scrollTo(0, 0);
  }, []);

  const hCancelClose = useGethCancel();

  //TODO:Give a name to this custom hook
  useEffect(() => {
    if (!isToday(year, month)) {
      return;
    }
    //   //
    const isAnchorReady = topNavHeight.top !== "";

    if (isAnchorReady) {
      dispatchDOMRef({ type: "update", payload: monthRef });

      monthRef?.current?.scrollIntoView()!;
    }

    //   //
    //   //
    //   //monthRef?.current?.scrollIntoView()!;
  }, [topNavHeight]); //TODO: use ref state context as it was created to access TopNav Ref after it is rendered

  //Context processing to pass to Day component
  //1. start,end dates
  const controllerDates = useControllerStateDates();

  //2. locked days

  //3. user preferences
  const { showWeekends } = useLocalUserPreferencesContext().localState;

  //
  const { setIsFetching } = useIsFetchingEvents();

  const totalCellsInLastRow = (start: string, length: number) => {
    const DayStart = DateService.GetDayNumberOfDay(start);
    let startRows = 4; //it's the minimun ever when feb starts on monday 28days/7cols = 4rows
    let diff = startRows * 7 - DayStart - length + 1;
    while (diff <= 0 && diff !== -7) {
      diff = 7 * ++startRows - DayStart - length + 1;
    }
    const restOfDays = Array.from({ length: diff }, (_, i) => i + 1);

    const leftOfDays = Array.from({ length: DayStart - 1 }, (_, i) => i + 1);

    return [leftOfDays, restOfDays];
  };

  const [left, rest] = totalCellsInLastRow(date.start, date.daysList.length);

  const [toPrint, hPrint] = usePrint();

  return (
    <StyledMonth.TWflexColLayout
      className="relative"
      $toPrint={toPrint}
      title="Double click here to print this month"
    >
      <div className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader
        id={`month-${date.year}-${zeroPadd(date.month)}`}
        onDoubleClick={() => {
          //Print to PDF
          hCancelClose();
          setTimeout(() => {
            hPrint();
          }, 500);
        }}
      >
        {date.dateFormat}
      </StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={"mon"} />

        {left //previous days
          .map((day, index) => (
            <MemoIDayHolder
              key={"l" + day}
              fullDate={`${DateService.ComposeDate(year, month, 1)}:l${index}`}
            ></MemoIDayHolder>
          ))
          .concat(
            date.daysList.map((day) => (
              <MemoIDay
                key={DateService.ComposeDate(year, month, day)}
                daynumber={day}
                fullDate={DateService.ComposeDate(year, month, day)}
                start={controllerDates.start}
                end={controllerDates.end}
                isLocked={false} //TODO: A way to determine locked days
                isWeekend={
                  (!showWeekends &&
                    DateService.GetMonthDayKey(
                      new Date(DateService.ComposeDate(year, month, day))
                    ) === "Sunday") ||
                  (!showWeekends &&
                    DateService.GetMonthDayKey(
                      new Date(DateService.ComposeDate(year, month, day))
                    ) === "Saturday")
                }
              ></MemoIDay>
            ))
          )
          .concat(
            //rest days
            rest.map((day, index) => {
              const lastDay = date.daysList[date.daysList.length - 1];
              return (
                <MemoIDayHolder
                  key={"r" + day}
                  fullDate={`${DateService.ComposeDate(
                    year,
                    month,
                    lastDay
                  )}:r${index}`}
                ></MemoIDayHolder>
              );
            })
          )}
      </StyledMonth.TWdaysBoard>
      {isToday(year, month) && (
        <div
          id={"Current-Month"}
          ref={monthRef}
          style={topNavHeight}
          className="absolute"
        ></div>
      )}
    </StyledMonth.TWflexColLayout>
  );
};

export const MemoMonth = memo(Month);
