import { composition, event } from "@/interfaces";
import { createContext, useContext, useState } from "react";
import { useEventState } from "./useEventsApi";

const defaultState = { id: 0 };
const defaultDispaatcher: React.Dispatch<
  React.SetStateAction<typeof defaultState>
> = () => {};

const cEventsStatus = createContext(defaultState);
const cEventsStatusDispatcher = createContext(defaultDispaatcher);

export const useEventsStatus = () => {
  return useContext(cEventsStatus);
};
export const useEventsStatusDispatcher = () => {
  return useContext(cEventsStatusDispatcher);
};

export const EventsStatus: composition = ({ children }) => {
  const [state, setState] = useState(defaultState);

  return (
    <cEventsStatus.Provider value={state}>
      <cEventsStatusDispatcher.Provider value={setState}>
        {children}
      </cEventsStatusDispatcher.Provider>
    </cEventsStatus.Provider>
  );
};
