import { useState, useEffect } from "react";
import { DateService } from "@/utils/Date";
import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
import { useInitMonths } from "@/hooks/useInitMonths";
import { useBoardScroll } from "@/hooks/useBoardScroll";
export const LayoutBoard = () => {
  const monthKeys = useBoardScroll({ initialLength: 1 });
  //*--------------------------*/
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
      </EventsProvider.Provider>
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
