import React, { useCallback, useEffect, useRef } from "react";
import { GetDateNextMonth } from "../utils/Date";
import { useMonthsBoardState } from "../hooks/useMonthBoardState";

//Infinite scrolling
export function useInfiniteScroll() {
  const [monthKeys, setMonthKeys] = useMonthsBoardState();

  const last = useRef<HTMLDivElement>(null);
  const onChange = useCallback((entries: Array<IntersectionObserverEntry>) => {
    entries[0].isIntersecting &&
      setMonthKeys((prev) => {
        const { year, month } = prev[prev.length - 1];
        return [...prev, GetDateNextMonth(year, month)];
      });
  }, []);

  const observer = useRef(
    new IntersectionObserver(onChange, {
      rootMargin: "500px",
    })
  );

  useEffect(() => {
    last.current !== null && observer.current.observe(last.current);

    return () => {
      last.current !== null && observer.current.unobserve(last.current);
    };
  }, []);

  return [monthKeys, last] as [
    Array<yearMonth>,
    React.RefObject<HTMLDivElement>
  ];
}
//*--------------------------*/
