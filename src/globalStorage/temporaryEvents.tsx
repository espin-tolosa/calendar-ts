import { composition } from "@/interfaces";
import { createContext, useContext, useState } from "react";
import { CustomValues } from "@/customTypes";

//Template param: StateName

//1. Choose your state
const defaultState = CustomValues.nullEvent();

const defaultDispaatcher: React.Dispatch<
  React.SetStateAction<typeof defaultState>
> = () => {};

const cTemporaryEvent = createContext(defaultState);
const cTemporaryEventDispatcher = createContext(defaultDispaatcher);

//2. State consumers
export const useTemporaryEvent = () => {
  return useContext(cTemporaryEvent);
};
export const useTemporaryEventDispatcher = () => {
  return useContext(cTemporaryEventDispatcher);
};

//3. State provider
export const TemporaryEvent: composition = ({ children }) => {
  const [state, setState] = useState(defaultState);

  return (
    <cTemporaryEvent.Provider value={state}>
      <cTemporaryEventDispatcher.Provider value={setState}>
        {children}
      </cTemporaryEventDispatcher.Provider>
    </cTemporaryEvent.Provider>
  );
};
