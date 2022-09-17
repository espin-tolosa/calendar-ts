import { composition } from "../interfaces";
import React, { createContext, useContext, useReducer } from "react";

type Payload = React.RefObject<HTMLDivElement>;
type State = Array<Payload>;
type Action = {
  type: "update";
  payload: Payload;
};

const State = createContext<State>([]);

const Dispatcher = createContext<React.Dispatch<Action>>(() => {
  return;
});

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
export const DOMRefsContext: composition = (propTypes) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <State.Provider value={state}>
      <Dispatcher.Provider value={dispatch}>
        {propTypes.children}
      </Dispatcher.Provider>
    </State.Provider>
  );
};
//Reducer
/*
 * action: {type:"update",payload:"HTMLDiv ref"}
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    //
    case "update": {
      return [...state, action.payload];
    }
  }
}
