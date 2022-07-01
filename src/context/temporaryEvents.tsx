import { nullEvent } from "../customTypes";
import { composition } from "../interfaces";
import { createContext, useContext, useState } from "react";

//Template param: StateName

//1. Choose your state
const defaultState = nullEvent();

const defaultDispaatcher: React.Dispatch<
  React.SetStateAction<typeof defaultState>
> = () => {
  return;
};

const cTemporaryEvent = createContext(defaultState);
const cTemporaryEventDispatcher = createContext(defaultDispaatcher);

cTemporaryEvent.displayName = "Temporary Event State";
cTemporaryEventDispatcher.displayName = "Temporary Event Dispatcher";

//2. State consumers
export const useTemporaryEvent = () => {
  return useContext(cTemporaryEvent);
};
export const useTemporaryEventDispatcher = () => {
  return useContext(cTemporaryEventDispatcher);
};

//3. State provider
export const TemporaryEvent: composition = (propTypes) => {
  const [state, setState] = useState(defaultState);

  return (
    <cTemporaryEvent.Provider value={state}>
      <cTemporaryEventDispatcher.Provider value={setState}>
        {propTypes.children}
      </cTemporaryEventDispatcher.Provider>
    </cTemporaryEvent.Provider>
  );
};
