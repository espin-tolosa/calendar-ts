import { composition } from "@/interfaces";
import { DateService } from "@/utils/Date";
import React, { createContext, useContext, useReducer } from "react";
const init = { start: "", end: "" };
type State = { start: string; end: string };

const cControllerState = createContext(init);
const cControllerDispatch = createContext<React.Dispatch<Action>>(() => {});

/* to consume in controller and other  components that wants to dispatch to controller */
export const useControllerState = () => useContext(cControllerState);
export const useControllerDispatch = () => useContext(cControllerDispatch);

type Action =
  | {
      type: "setDates" | "setEnd" | "backSlash" | "onChange";
      payload: State;
    }
  | { type: "default" };

function reducerController(state: State, action: Action) {
  switch (action.type) {
    case "setDates": {
      if (DateService.DaysFromStartToEnd(state.end, action.payload.end) > 0) {
        return { ...state, end: action.payload.end };
      }
      return { start: action.payload.start, end: action.payload.end };
    }

    default: {
      console.warn("reducer option not implemented in reducerController");
      return state;
    }
  }
}

/* to provide access */
export const ControllerProvider: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducerController, init);

  return (
    <cControllerState.Provider value={state}>
      <cControllerDispatch.Provider value={dispatch}>
        {children}
      </cControllerDispatch.Provider>
    </cControllerState.Provider>
  );
};
