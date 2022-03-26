import { composition } from "@/interfaces";
import React, { createContext, useContext, useReducer } from "react";
const init = { id: 0, client: "", job: "" };
type Action =
  | { type: "setClient"; payload: { client: string } }
  | { type: "setJob"; payload: { job: string } }
  | { type: "setId"; payload: { id: number } }
  | {
      type: "setController";
      payload: { id: number; client: string; job: string };
    }
  | { type: "resetController" };

const cControllerState = createContext(init);
const cControllerDispatch = createContext<React.Dispatch<Action>>(() => {});

cControllerState.displayName = "Controller State";
cControllerDispatch.displayName = "Controller State Dispatcher";

/* to consume in controller and other  components that wants to dispatch to controller */
export const useControllerState = () => useContext(cControllerState);
export const useControllerDispatch = () => useContext(cControllerDispatch);

function reducerController(state: typeof init, action: Action) {
  switch (action.type) {
    case "setClient": {
      return { ...state, client: action.payload.client };
    }
    case "setJob": {
      return { ...state, job: action.payload.job };
    }
    case "setId": {
      return { ...state, id: action.payload.id };
    }
    case "setController": {
      return { ...action.payload };
    }
    case "resetController": {
      return { id: 0, client: "default", job: "" };
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
