import { composition, event } from "@/interfaces";
import { DateService } from "@/utils/Date";
import React, { createContext, useContext, useReducer } from "react";
const init = { id: 0, client: "", job: "", start: "", end: "" };

const cControllerState = createContext(init);
const cControllerDispatch = createContext<React.Dispatch<Action>>(() => {});

/* to consume in controller and other  components that wants to dispatch to controller */
export const useControllerState = () => useContext(cControllerState);
export const useControllerDispatch = () => useContext(cControllerDispatch);

type Action =
  | {
      type:
        | "setDates"
        | "clearDates"
        | "backSlash"
        | "onChange"
        | "setClient"
        | "setJob"
        | "setId"
        | "setController";
      payload: event;
    }
  | { type: "default" };

function reducerController(state: event, action: Action) {
  switch (action.type) {
    case "setDates": {
      if (
        state.end === action.payload.end &&
        state.start === action.payload.start
      ) {
        return { ...state, start: "", end: "" };
      }
      if (DateService.DaysFromStartToEnd(state.end, action.payload.end) > 0) {
        return { ...state, end: action.payload.end };
      }
      return { ...state, start: action.payload.start, end: action.payload.end };
    }
    case "clearDates": {
      return { ...state, start: "", end: "" };
    }
    case "setId": {
      return { ...state, id: action.payload.id };
    }
    case "setClient": {
      return { ...state, client: action.payload.client };
    }
    case "setJob": {
      return { ...state, job: action.payload.job };
    }
    case "setController": {
      return { ...action.payload };
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
