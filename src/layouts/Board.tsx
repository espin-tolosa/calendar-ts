import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
import { useInitMonths } from "@/hooks/useInitMonths";
export const LayoutBoard = () => {
  const [monthKeys, setMonthKeys] = useInitMonths(4);
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
      </EventsProvider.Provider>
    </TWboard>
  );
};
