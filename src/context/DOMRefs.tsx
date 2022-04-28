import { CustomTypes } from "@/customTypes";
import { composition } from "@/interfaces";
import React, { createContext, useContext, useReducer } from "react";

type Payload = CustomTypes.NullableRef<HTMLDivElement>;
type State = Array<Payload>;
type Action = {
  type: "update";
  payload: Payload;
};
const defaultState: State = [];
const State = createContext<State>(defaultState);
const Dispatcher = createContext<React.Dispatch<Action>>(() => {});

State.displayName = "DOM Refs state";
Dispatcher.displayName = "DOM Refs dispatcher";

export namespace DOMRefs {
  //State Context
  export function useState() {
    return useContext(State);
  }
  //Dispatcher Context
  export function useDispatch() {
    return useContext(Dispatcher);
  }
  //Context Provider
}
export const DOMRefsContext: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <State.Provider value={state}>
      <Dispatcher.Provider value={dispatch}>{children}</Dispatcher.Provider>
    </State.Provider>
  );
};
//Reducer
/*
 * action: {type:"update",payload:"HTMLDiv ref"}
 */
function reducer(state: State, action: Action) {
  switch (action.type) {
    //
    case "update": {
      return [...state, action.payload];
    }
  }
}
