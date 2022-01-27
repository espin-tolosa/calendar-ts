import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useLayoutEffect } from "react";

export const LayoutBoard = () => {
  const monthKeys = useBoardScroll({ initialLength: 1 });
  useLayoutEffect(() => {
    document.getElementById("Present").scrollIntoView();
  }, []);
  //*--------------------------*/
  return (
    <TWboard>
      <EventsProvider.Provider value={month1}>
        <Month time={"Past"} year={2021} month={11} />
        <Month time={"Past"} year={2021} month={12} />
        {monthKeys.map((month_entry, index) => {
          return (
            <Month
              time={"Present"}
              key={index}
              year={month_entry.year}
              month={month_entry.month}
            />
          );
        })}
      </EventsProvider.Provider>
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
