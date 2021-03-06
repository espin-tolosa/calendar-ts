import { composition } from "../interfaces";
import { DateService } from "../utils/Date";
import React, { createContext, useContext, useReducer } from "react";
const init = { start: "", end: "" };

const cControllerState = createContext(init);
const cControllerDispatch = createContext<React.Dispatch<Action>>(() => {
  return;
});

cControllerState.displayName = "controller state dates";
cControllerDispatch.displayName = "controller dispatch dates";

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
      if (DateService.DaysFrom(state.end, action.payload.end) > 0) {
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
  }
}

/* to provide access */
export const ControllerProviderDates: composition = (propTypes) => {
  const [state, dispatch] = useReducer(reducerController, init);

  return (
    <cControllerState.Provider value={state}>
      <cControllerDispatch.Provider value={dispatch}>
        {propTypes.children}
      </cControllerDispatch.Provider>
    </cControllerState.Provider>
  );
};
