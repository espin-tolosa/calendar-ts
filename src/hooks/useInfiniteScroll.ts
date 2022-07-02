import { useState, useEffect } from "react";
import { GetDateNextMonth } from "../utils/Date";
import { useMonthsBoardState } from "../hooks/useMonthBoardState";
import { useListenWindowSize } from "../hooks/useResponsiveLayout";
import { ListPrevDates } from "../utils/Date";

//Infinite scrolling
export function useInfiniteScroll() {
  const isLargeWindow = useListenWindowSize();
  const [monthKeys, setMonthKeys] = useMonthsBoardState();
  console.log(monthKeys);
  const [isBottom, setIsBottom] = useState(false);
  useEffect(() => {
    const onChange = (entries: Array<IntersectionObserverEntry>) => {
      if (entries[0].isIntersecting) {
        setIsBottom((prev) => {
          return !prev;
        });
      }
    };

    const observer = new IntersectionObserver(onChange, {
      rootMargin: isLargeWindow ? "500px" : "200px",
    });

    observer.observe(document.getElementById("BottomEdge") as HTMLElement);
  }, []);
  useEffect(() => {
    console.log("Updating month list");
    if (isBottom) {
      const month_entry1 = GetDateNextMonth(
        monthKeys[monthKeys.length - 1].year,
        monthKeys[monthKeys.length - 1].month
      );
      const month_entry2 = GetDateNextMonth(
        month_entry1.year,
        month_entry1.month
      );

      setMonthKeys([...monthKeys, month_entry1, month_entry2]);

      setIsBottom((prev) => !prev);
    }
  }, [isBottom]);

  const prevDates = ListPrevDates(monthKeys[0], 2).reverse();
  return prevDates.concat(monthKeys);
}
//*--------------------------*/
