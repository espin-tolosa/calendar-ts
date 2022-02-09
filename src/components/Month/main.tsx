import { memo } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { zeroPadd } from "@/utils/zeroPadd";
import { DateService } from "@/utils/Date";

type iMonth = {
  time: string;
  year: number;
  month: number;
};
const Month = ({ time, year, month }: iMonth) => {
  const date = useMonthDate(year, month);

  return (
    <StyledMonth.TWflexColLayout>
      <div id={time} className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={date.start} />
        {date.daysList.map((day) => (
          <MemoIDay
            key={DateService.ComposeDate(year, month, day)}
            daynumber={day}
          >
            <EventsThrower day={DateService.ComposeDate(year, month, day)} />
          </MemoIDay>
        ))}
      </StyledMonth.TWdaysBoard>
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
