import { useState, useEffect } from "react";
import { GetDateNextMonth } from "@/utils/Date";
import { useInitMonths } from "@/hooks/useInitMonths";
import { useListenWindowSize } from "@/hooks/useResponsiveLayout";

export function useBoardScroll({ initialLength }: { initialLength: number }) {
  const isLargeWindow = useListenWindowSize();
  const [monthKeys, setMonthKeys] = useInitMonths(
    2 * Math.round(initialLength / 2)
  );
  const [isBottom, setIsBottom] = useState(false);
  useEffect(() => {
    const onChange = (entries: any) => {
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

      setIsBottom((prev) => {
        return !prev;
      });
    }
  }, [isBottom]);

  return monthKeys;
}
//*--------------------------*/
