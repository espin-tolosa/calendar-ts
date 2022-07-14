import { composition } from "../interfaces";
import { createContext, Dispatch, useContext, useState } from "react";
import { CustomTypes } from "../customTypes";

export type Action = {
  type: CustomTypes.DispatchLocalStateEvents;
  payload: CustomTypes.State;
};

const defaultPushDates: Set<jh.date.representation> = new Set();
const defaultPushDatesDispatcher: Dispatch<Set<jh.date.representation>> =
  {} as Dispatch<Set<jh.date.representation>>;

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

export const PushedDays: composition = (Props) => {
  //const [state, dispatch] = useReducer(reducerEvents, defaultState);
  const [days, dispatchDays] = useState<Set<jh.date.representation>>(new Set());

  return (
    <cPushDates.Provider value={days}>
      <cPushDatesDispatcher.Provider value={dispatchDays}>
        {Props.children}
      </cPushDatesDispatcher.Provider>
    </cPushDates.Provider>
  );
};
