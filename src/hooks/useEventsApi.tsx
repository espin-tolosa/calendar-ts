import { composition } from "@/interfaces";
import React, { createContext, useContext, useReducer } from "react";
import { event } from "@interfaces/index";
import { month1 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";

type State = Array<event>;
type Action =
  | {
      type: "appendarray" | "deletebyid" | "replacebyid";
      payload: State;
    }
  | { type: "default" };

function reducerEvents(state: State, action: Action) {
  switch (action.type) {
    //
    case "appendarray": {
      eventSpreader();
      const newState = [...state, ...action.payload];
      //
      return newState;
    }
    //
    case "deletebyid": {
      const newState = [...state];
      action.payload.forEach((toReplace) => {
        newState.splice(
          newState.findIndex((event) => event.id === toReplace.id),
          1 //only delete the single one found event
        );
      });
      //
      return newState;
    }
    //
    case "replacebyid": {
      const newState = [...state];
      action.payload.forEach((toReplace) => {
        newState.splice(
          newState.findIndex((event) => event.id === toReplace.id),
          1, //the update only affects to this one entry position
          toReplace
        );
      });
      //
      return newState;
    }
    default: {
      console.warn("reducer option not implemented");
      //
      return state;
    }
  }
}
// Context
const cEventState = createContext<Array<event>>(month1);
const cEventDispatch = createContext<React.Dispatch<Action>>(() => {});

export function useEventState() {
  return useContext(cEventState);
}
export function useEventDispatch() {
  return useContext(cEventDispatch);
}

// Context Dispatcher of Event Reducer

export const EventsDispatcher: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducerEvents, month1);

  return (
    <cEventState.Provider value={state}>
      <cEventDispatch.Provider value={dispatch}>
        {children}
      </cEventDispatch.Provider>
    </cEventState.Provider>
  );
};
