import { Day } from "@components/Day/main";
import { useMonthDate } from "@/utils/MonthDate";
import { event } from "@/interfaces";
import * as StyledMonth from "./tw";
import { useEffect } from "react";

export const Month = ({ year, month }: { year: number; month: number }) => {
  const [date, setDate] = useMonthDate(year, month);
  useEffect(() => {
    console.log(date.daysList);
  }, []);
  return (
    /* Month container: header | board */
    <StyledMonth.TWflexColLayout>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>
      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={date.start} />
        {date.daysList.map((day) => (
          <Day key={day.toString()} day={day} />
        ))}
      </StyledMonth.TWdaysBoard>
    </StyledMonth.TWflexColLayout>
  );
};
