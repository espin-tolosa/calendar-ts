import { memo } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { zeroPadd } from "@/utils/zeroPadd";
import { DateService } from "@/utils/Date";
import { DateCalendar } from "@/entities/date";

type iMonth = {
  time: string;
  year: number;
  month: number;
};
const Month = ({ time, year, month }: iMonth) => {
  const date = useMonthDate(year, month);

  return (
    <StyledMonth.TWflexColLayout className="relative">
      <div className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={date.start} />
        {date.daysList.map((day) => (
          <MemoIDay
            key={DateService.ComposeDate(year, month, day)}
            daynumber={day}
            fullDate={DateService.ComposeDate(year, month, day)}
          >
            <EventsThrower day={DateService.ComposeDate(year, month, day)} />
          </MemoIDay>
        ))}
      </StyledMonth.TWdaysBoard>
      <div
        id={time}
        className="absolute w-0 h-0 bg-transparent bottom-8 customtp:bottom-6 custombp:bottom-6 z-TopLayer "
      ></div>
    </StyledMonth.TWflexColLayout>
    /* Month container: header | board */
  );
};

export const MemoMonth = memo(Month);
//console.warn("Memo month");
//console.log("prevProps", prevProps);
//console.log("nextProps", nextProps);
//return false;
//});
