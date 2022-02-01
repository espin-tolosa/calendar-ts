import { useEffect, memo } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { IDay } from "@components/Day/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";

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
          <IDay key={day.toString()} daynumber={day}>
            <EventsThrower day={day.toString()} />
          </IDay>
        ))}
      </StyledMonth.TWdaysBoard>
    </StyledMonth.TWflexColLayout>
    /* Month container: header | board */
  );
};

export const MemoMonth = memo(Month);
