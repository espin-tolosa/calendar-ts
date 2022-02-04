import { useEffect, memo } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";

const zeroPadd = (number: number) => (number < 10 ? `0${number}` : `${number}`);
const keyDate = (year: number, month: number, day: number) =>
  `${year}/${zeroPadd(month)}/${zeroPadd(day)}`;

const Month = ({
  time,
  year,
  month,
}: {
  time: string;
  year: number;
  month: number;
}) => {
  const date = useMonthDate(year, month);

  useEffect(() => {
    console.log(date.daysList);
  }, []);

  return (
    <StyledMonth.TWflexColLayout>
      <div id={time} className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={date.start} />
        {date.daysList.map((day) => (
          <MemoIDay key={keyDate(year, month, day)} daynumber={day}>
            <EventsThrower day={keyDate(year, month, day)} />
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
