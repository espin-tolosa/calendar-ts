import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import { month1 } from "@/static/initEvents";
import { EventsProvider } from "@/context/eventState";
export const LayoutBoard = () => {
  return (
    <TWboard>
      <EventsProvider.Provider value={month1}>
        <Month />
        <Month />
        <Month />
      </EventsProvider.Provider>
    </TWboard>
  );
};
