import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useEffect, useLayoutEffect } from "react";
import { month1 } from "@/static/initEvents";
import { useEventDispatch } from "@/hooks/useEventsApi";

export const LayoutBoard = () => {
  const monthKeys = useBoardScroll({ initialLength: 1 });
  const dispatchEvents = useEventDispatch();

  //The events fetchedneeds to be send to dispatcher in order to spread it
  useEffect(() => {
    month1.forEach((m) => {
      dispatchEvents({
        type: "appendarray",
        payload: [m],
      });
    });
  }, []);

  /* Automatic scroll when refresh the page */
  useLayoutEffect(() => {
    //setTimeout(() => {
    //window.scroll(0, 0);
    //}, 100);
    setTimeout(() => {
      const top = document.getElementById("Past-0");
      top &&
        top.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
    }, 500);
  }, []);
  //useLayoutEffect(() => {
  //  const top = document.getElementById("Present");
  //  setTimeout(() => {
  //    const coord = top?.getBoundingClientRect();
  //    console.log(coord?.y);
  //    window.scroll(0, coord?.y);
  //  }, 1000);
  //}, []);
  //*--------------------------*/
  return (
    <TWboard>
      <MemoMonth time={"Past-1"} year={2021} month={12} />
      <MemoMonth time={"Past-0"} year={2022} month={1} />
      {monthKeys.map((month_entry, index) => {
        return (
          <MemoMonth
            time={`Present-${index}`}
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
