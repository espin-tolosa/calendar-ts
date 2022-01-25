import { Day } from "@components/Day/main";
import { event } from "@/interfaces";
import * as tw_Month from "./tw";

export const Month = ({ events }: { events: Array<event> }) => {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);
  return (
    /* Month container: header | board */
    <tw_Month.flexColLayout>
      {/*month-header*/}
      <tw_Month.header>February 2022</tw_Month.header>
      {/*board container*/}
      <tw_Month.daysBoard>
        <tw_Month.dayShift $weekday={"sun"} />
        {days.map((day) => (
          <Day key={day.toString()} day={day} events={events} />
        ))}
      </tw_Month.daysBoard>
    </tw_Month.flexColLayout>
  );
};
