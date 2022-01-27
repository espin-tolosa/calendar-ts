import { useState } from "react";
import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
import { DateService } from "@/utils/Date";
export const LayoutBoard = () => {
  const month_entry_0 = DateService.GetDateNextMonth();
  const month_entry_1 = DateService.GetDateNextMonth(
    month_entry_0.year,
    month_entry_0.month
  );
  const [monthKeys, setMonthKeys] = useState([month_entry_0, month_entry_1]);
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
    </TWboard>
  );
};
