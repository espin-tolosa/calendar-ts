import { Day } from "@components/Day/main";
import { event } from "@/interfaces";
import * as StyledMonth from "./tw";

export const Month = () => {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);
  return (
    /* Month container: header | board */
    <StyledMonth.TWflexColLayout>
      {/*month-header*/}
      <StyledMonth.TWheader>February 2022</StyledMonth.TWheader>
      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={"sun"} />
        {days.map((day) => (
          <Day key={day.toString()} day={day} />
        ))}
      </StyledMonth.TWdaysBoard>
    </StyledMonth.TWflexColLayout>
  );
};
