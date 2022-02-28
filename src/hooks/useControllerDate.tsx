import { composition } from "@/interfaces";
import { DateService } from "@/utils/Date";
import React, { createContext, useContext, useReducer } from "react";
const init = { start: "", end: "" };

const cControllerState = createContext(init);
const cControllerDispatch = createContext<React.Dispatch<Action>>(() => {});

/* to consume in controller and other  components that wants to dispatch to controller */
export const useControllerStateDates = () => useContext(cControllerState);
export const useControllerDispatchDates = () => useContext(cControllerDispatch);
type dates = { start: string; end: string };

type Action =
  | { type: "updateDates" | "setDates"; payload: dates }
  | { type: "clearDates" };

function reducerController(state: dates, action: Action) {
  switch (action.type) {
    case "updateDates": {
      if (
        state.end === action.payload.end &&
        state.start === action.payload.start
      ) {
        return { start: "", end: "" };
      }
      if (DateService.DaysFromStartToEnd(state.end, action.payload.end) > 0) {
        return { ...state, end: action.payload.end };
      }
      return { start: action.payload.start, end: action.payload.end };
    }
    case "setDates": {
      return { start: action.payload.start, end: action.payload.end };
    }
    case "clearDates": {
      return { start: "", end: "" };
    }

    default: {
      console.warn("reducer option not implemented in reducerController");
      return state;
    }
  }
}

/* to provide access */
export const ControllerProviderDates: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducerController, init);

  return (
    <cControllerState.Provider value={state}>
      <cControllerDispatch.Provider value={dispatch}>
        {children}
      </cControllerDispatch.Provider>
    </cControllerState.Provider>
  );
};
