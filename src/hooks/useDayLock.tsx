import { createContext, Dispatch, useContext, useReducer } from "react";
import { composition, Date } from "@/interfaces";
import { DateService } from "@/utils/Date";

const cDayLock = createContext<Array<string>>([]);
const cDayLockDispatcher = createContext<Dispatch<Action>>(() => {});

export const useDayLock = () => {
  return useContext(cDayLock);
};
export const useDayLockDispatcher = () => {
  return useContext(cDayLockDispatcher);
};

type Action = {
  type: "update" | "deletelock";
  date: Date;
};

function reducerLockedDays(state: Array<string>, { type, date }: Action) {
  switch (type) {
    //
    case "update": {
      const newState = [...state];
      const day = state.findIndex((current) => current === date);
      if (day < 0) {
        newState.push(date);
      } else {
        newState.splice(day, 1);
      }
      newState.sort((first, second) => DateService.DaysFrom(second, first));
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
