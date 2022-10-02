import { composition } from "../interfaces";
import { createContext, useContext, useState } from "react";

type Status = { id: number };
type EventsStatusDispatcher = (newValue: number) => void;

const State = createContext<Status>({ id: 0 });
const Dispatch = createContext<EventsStatusDispatcher>(() => undefined);

State.displayName = "Event Status";
Dispatch.displayName = "Event Status Dispatcher";

export const useEventsStatus = () => useContext(State);
export const useEventsStatusDispatcher = () => useContext(Dispatch);

export const EventsStatus: composition = (propTypes) => {
  const [state, setState] = useState({ id: 0 });
  const dispatchState = (newValue: number) => {
    setState({ id: newValue });
  };

  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatchState}>
        {propTypes.children}
      </Dispatch.Provider>
    </State.Provider>
  );
};
