import { useState, useEffect } from "react";
import { DateService } from "@/utils/Date";
import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
import { useInitMonths } from "@/hooks/useInitMonths";
export const LayoutBoard = () => {
  const [monthKeys, setMonthKeys] = useInitMonths(4);
  //*--------------------------*/
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
      rootMargin: "100px",
    });

    observer.observe(document.getElementById("BottomEdge") as HTMLElement);
  }, []);
  useEffect(() => {
    if (isBottom) {
      const month_entry1 = DateService.GetDateNextMonth(
        monthKeys[monthKeys.length - 1].year,
        monthKeys[monthKeys.length - 1].month
      );
      const month_entry2 = DateService.GetDateNextMonth(
        month_entry1.year,
        month_entry1.month
      );

      setMonthKeys([...monthKeys, month_entry1, month_entry2]);

      setIsBottom((prev) => {
        return !prev;
      });
    }
  }, [isBottom]);

  //*--------------------------*/
  console.log(monthKeys);
  return (
    <TWboard>
      <EventsProvider.Provider value={month1}>
        {monthKeys.map((month_entry, index) => {
          return (
            <Month
              key={index}
              year={month_entry.year}
              month={month_entry.month}
            />
          );
        })}
        <div id="BottomEdge"></div>
      </EventsProvider.Provider>
    </TWboard>
  );
};
