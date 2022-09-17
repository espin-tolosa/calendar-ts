import { useCallback, useEffect, useRef } from "react";
import { GetDateNextMonth } from "../utils/Date";
import { useMonthsBoardState } from "./useMonthBoardState";

//Infinite scrolling
export function useInfiniteScroll(action: ()=>void )
{

    const endOfList = useRef<HTMLDivElement>(null);
    
    const onChange = useCallback((entries: Array<IntersectionObserverEntry>) => {
        entries[0].isIntersecting && action();
    }, []);

  const observer = useRef(
    new IntersectionObserver(onChange, {
      rootMargin: "500px",
    })
  );

  useEffect(() => {
    endOfList.current !== null && observer.current.observe(endOfList.current);

    return () => {
      endOfList.current !== null && observer.current.unobserve(endOfList.current);
    };
  }, []);

  const EndOfList = ()=> (<div ref={endOfList}></div>)

  return EndOfList
}


export function useGetMonths()
{
    const [monthKeys, setMonthKeys] = useMonthsBoardState();
    
    const hMonthKeys = ()=>setMonthKeys((prev) => {
        const { year, month } = prev[prev.length - 1];
        return [...prev, GetDateNextMonth(year, month)];
      });

  return {
    monthKeys,
    hMonthKeys
  };

}
//*--------------------------*/
