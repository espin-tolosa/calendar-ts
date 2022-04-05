import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ListPrevDates } from "@/utils/Date";

import { _renderDate } from "@/utils/Date_v2";
import { useGetAllEventsFrom } from "@/api/useGetAllEventsFrom";

export const LayoutBoard = () => {
  const nextDates = useInfiniteScroll(1);
  const prevDates = ListPrevDates(nextDates[0], 2);
  //Query All Events
  useGetAllEventsFrom(nextDates[0]);

  //Fetch event after login

  return (
    <TWboard id={"Board"}>
      <MemoMonth {...prevDates[1]} />
      <MemoMonth {...prevDates[0]} />
      {nextDates.map((value) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
