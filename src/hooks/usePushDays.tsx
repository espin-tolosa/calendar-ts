import { composition } from "@/interfaces";
import { createContext, Dispatch, useContext, useState } from "react";
import { CustomTypes } from "@/customTypes";

export type Action = {
  type: CustomTypes.DispatchLocalStateEvents;
  payload: CustomTypes.State;
};

const defaultPushDates: Set<string> = new Set();
const defaultPushDatesDispatcher: Dispatch<Set<string>> = () => {};

const cPushDates = createContext(defaultPushDates);
const cPushDatesDispatcher = createContext(defaultPushDatesDispatcher);

cPushDates.displayName = "Dates to re-render";
cPushDatesDispatcher.displayName = "Dispatch Dates to re-render";

export const usePushedDays = () => {
  return useContext(cPushDates);
};
export const usePushedDaysDispatcher = () => {
  return useContext(cPushDatesDispatcher);
};

export const PushedDays: composition = ({ children }) => {
  //const [state, dispatch] = useReducer(reducerEvents, defaultState);
  const [days, dispatchDays] = useState<Set<string>>(new Set());

  return (
    <cPushDates.Provider value={days}>
      <cPushDatesDispatcher.Provider value={dispatchDays}>
        {children}
      </cPushDatesDispatcher.Provider>
    </cPushDates.Provider>
  );
};
