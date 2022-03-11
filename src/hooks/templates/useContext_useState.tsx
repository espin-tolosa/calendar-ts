import { composition } from "@/interfaces";
import { createContext, useContext, useState } from "react";

//Template param: StateName

//1. Choose your state
const defaultState = { hoverId: 0 };

const defaultDispaatcher: React.Dispatch<
  React.SetStateAction<typeof defaultState>
> = () => {};

const cStateName = createContext(defaultState);
const cStateNameDispatcher = createContext(defaultDispaatcher);

//2. State consumers
export const useStateName = () => {
  return useContext(cStateName);
};
export const useStateNameDispatcher = () => {
  return useContext(cStateNameDispatcher);
};

//3. State provider
export const StateName: composition = ({ children }) => {
  const [state, setState] = useState(defaultState);

  return (
    <cStateName.Provider value={state}>
      <cStateNameDispatcher.Provider value={setState}>
        {children}
      </cStateNameDispatcher.Provider>
    </cStateName.Provider>
  );
};
