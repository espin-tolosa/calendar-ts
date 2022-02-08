import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useLayoutEffect } from "react";

export const LayoutBoard = () => {
  const monthKeys = useBoardScroll({ initialLength: 1 });

  useLayoutEffect(() => {
    window.scroll(0, 0);
    setTimeout(() => {
      const top = document.getElementById("Present");
      top &&
        top.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
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
      <MemoMonth time={"Past"} year={2021} month={12} />
      <MemoMonth time={"Past"} year={2022} month={1} />
      {monthKeys.map((month_entry, index) => {
        return (
          <MemoMonth
            time={"Present"}
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
