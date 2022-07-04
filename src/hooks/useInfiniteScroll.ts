import React, { FC, useEffect, useRef } from "react";
import { GetDateNextMonth } from "../utils/Date";
import { useMonthsBoardState } from "../hooks/useMonthBoardState";

//Infinite scrolling
export function useInfiniteScroll() {
  const [monthKeys, setMonthKeys] = useMonthsBoardState();

  const last = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onChange = (entries: Array<IntersectionObserverEntry>) => {
      if (entries[0].isIntersecting) {
        const { year, month } = monthKeys[monthKeys.length - 1];
        setMonthKeys(() => [...monthKeys, GetDateNextMonth(year, month)]);
      }
    };

    const observer = new IntersectionObserver(onChange, {
      rootMargin: "500px",
    });

    if (last.current === null) {
      return;
    }

    observer.observe(last.current);

    return () => {
      if (last.current === null) {
        return;
      }
      observer.unobserve(last.current);
    };
  }, [monthKeys]);

  return [monthKeys, last] as [
    Array<yearMonth>,
    React.RefObject<HTMLDivElement>
  ];
}
//*--------------------------*/
