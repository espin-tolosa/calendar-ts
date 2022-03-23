import { createContext, useContext, useState } from "react";

import { composition, event } from "@/interfaces";

const cEventSelected = createContext<event | null>(null);
const cSetEventSelected = createContext((event: event | null) => {});

cEventSelected.displayName = "Selected Event: value";
cSetEventSelected.displayName = "Selected Event: dispatch";

export const useEventSelected = () => {
  return useContext(cEventSelected);
};
export const useSetEventSelected = () => {
  return useContext(cSetEventSelected);
};

export const EventInController: composition = ({ children }) => {
  const [eventSelected, setEventSelected] = useState<event | null>(null);
  const SetEventSelected = (event: event | null) => {
    setEventSelected(event);
  };

  return (
    <cEventSelected.Provider value={eventSelected}>
      <cSetEventSelected.Provider value={SetEventSelected}>
        {children}
      </cSetEventSelected.Provider>
    </cEventSelected.Provider>
  );
};
