import { composition } from "@/interfaces";
import { createContext, useContext, useState } from "react";

const defaultState = { id: 0 };
//const defaultDispaatcher: React.Dispatch<
//  React.SetStateAction<typeof defaultState>
//> = () => {};
const defaultDispatcher = (newValue: number) => {};

const cEventsStatus = createContext(defaultState);
const cEventsStatusDispatcher = createContext(defaultDispatcher);

export const useEventsStatus = () => {
  return useContext(cEventsStatus);
};
export const useEventsStatusDispatcher = () => {
  return useContext(cEventsStatusDispatcher);
};

export const EventsStatus: composition = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const dispatchState = (newValue: number) => {
    setState({ id: newValue });
  };

  return (
    <cEventsStatus.Provider value={state}>
      <cEventsStatusDispatcher.Provider value={dispatchState}>
        {children}
      </cEventsStatusDispatcher.Provider>
    </cEventsStatus.Provider>
  );
};
