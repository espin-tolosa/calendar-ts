import { composition } from "@/interfaces";
import React, {
  createContext,
  Dispatch,
  DispatchWithoutAction,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { event } from "@/interfaces/index";
import { month0 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";
import { isWellDefined } from "@/utils/ValidateEvent";
import { CustomTypes } from "@/customTypes";
import { DateService } from "@/utils/Date";

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
