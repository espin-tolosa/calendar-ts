import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useEffect, useLayoutEffect } from "react";
import { month0 } from "@/static/initEvents";
import { useEventDispatch } from "@/hooks/useEventsApi";
import { useAutoScroll } from "@/hooks/useAutoScroll";

export const LayoutBoard = () => {
  const monthKeys = useBoardScroll({ initialLength: 1 });
  const dispatchEvents = useEventDispatch();

  //The events fetchedneeds to be send to dispatcher in order to spread it
  useEffect(() => {
    month0.forEach((m) => {
      dispatchEvents({
        type: "appendarray",
        payload: [m],
      });
    });
  }, []);

  /* Automatic scroll when refresh the page */
  const autoScrollTarget = useAutoScroll();
  //*--------------------------*/
  return (
    <TWboard>
      <MemoMonth id={"Past-1"} year={2021} month={12} />
      <MemoMonth id={autoScrollTarget} year={2022} month={1} />
      {monthKeys.map((month_entry, index) => {
        return (
          <MemoMonth
            id={`Present-${index}`}
            key={`${month_entry.year}-${month_entry.month}`}
            year={month_entry.year}
            month={month_entry.month}
          />
        );
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
