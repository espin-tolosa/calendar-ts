import { composition } from "@/interfaces";
import React, { createContext, useContext, useReducer } from "react";
import { event } from "@interfaces/index";
export const month1 = [
  {
    id: 1,
    client: "John",
    job: "codelink",
    start: "2022/02/01",
    end: "2022/02/01",
  },
  {
    id: 2,
    client: "Cristine",
    job: "Starting 1 - 1",
    start: "2022/02/02",
    end: "2022/02/02",
  },
  {
    id: 4,
    client: "Marcel",
    job: "Starting 2 - 1",
    start: "2022/02/12",
    end: "2022/02/13",
  },
  {
    id: 3,
    client: "Bob",
    job: "Starting 3 - 1",
    start: "2022/02/21",
    end: "2022/02/22",
  },
  {
    id: 4,
    client: "Cristine",
    job: "Starting 4 - 1",
    start: "2022/02/30",
    end: "2022/03/31",
  },
  {
    id: 5,
    client: "Raphael",
    job: "Starting 5 - 1",
    start: "2022/03/14",
    end: "2022/03/17",
  },
] as Array<event>;

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
