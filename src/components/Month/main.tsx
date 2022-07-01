import { memo } from "react";
import { useMonthDate } from "../../hooks/useMonthDate";
import { MemoDay } from "../../components/Day/main";
import { MemoIDayHolder } from "../../components/DayHolder/main";
import * as StyledMonth from "./tw";
import { DateService } from "../../utils/Date";

import { zeroPadd } from "../../utils/zeroPadd";
//import { useLocalUserPreferencesContext } from "../../hooks/useLocalUserPreferences";
import { usePrint } from "../../hooks/usePrint";
import { usePushedDays } from "../../hooks/usePushDays";
import { CustomTypes } from "../../customTypes";
import { CurrentMonthScrollAnchor } from "./MonthToScrollBack";
import { totalCellsInLastRow } from "./totalCellsInLastRow";

const Month = ({ year, month }: CustomTypes.Month) => {
  const pushedDays = usePushedDays(); //!days affected by event dispatcher
  const date = useMonthDate(year, month); //memoized date stats needed to render a month grid

  //2. locked days

  //3. user preferences
  //const { showWeekends } = useLocalUserPreferencesContext().localState;

  //4. print config
  const [toPrint, hPrint] = usePrint();

  const [left, rest] = totalCellsInLastRow(date.start, date.daysList.length);

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
        onDoubleClick={hPrint}
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
              <MemoDay
                key={DateService.ComposeDate(year, month, day)}
                daynumber={day}
                fullDate={DateService.ComposeDate(year, month, day)}
                pushedDays={pushedDays}
              ></MemoDay>
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
      <CurrentMonthScrollAnchor {...{ year, month }} />
    </StyledMonth.TWflexColLayout>
  );
};

export const MemoMonth = memo(Month);
MemoMonth.displayName = "Memoized Month";
