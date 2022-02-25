import { createContext, Dispatch, useContext, useReducer } from "react";
import { composition } from "@/interfaces";

const cDayLock = createContext<Array<string>>([]);
const cDayLockDispatcher = createContext<Dispatch<Action>>(() => {});

export const useDayLock = () => {
  return useContext(cDayLock);
};
export const useDayLockDispatcher = () => {
  return useContext(cDayLockDispatcher);
};

type Action =
  | {
      type: "addlock" | "deletelock";
      payload: string;
    }
  | { type: "default" };

function reducerLockedDays(state: Array<string>, action: Action) {
  switch (action.type) {
    //
    case "addlock": {
      const newState = [...state, action.payload];
      return newState;
    }
    //
    default: {
      console.warn("reducer option not implemented");
      //
      return [...state];
    }
  }
}

export const DayLock: composition = ({ children }) => {
  const [lockedDays, lockedDaysDispatch] = useReducer(reducerLockedDays, []);

  return (
    <cDayLock.Provider value={lockedDays}>
      <cDayLockDispatcher.Provider value={lockedDaysDispatch}>
        {children}
      </cDayLockDispatcher.Provider>
    </cDayLock.Provider>
  );
};
