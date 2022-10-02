// Context:
//
// It's used to help the Controller knows what event is selected by the user
//

import { createRef, createContext, useContext, useRef } from "react";

const cCurrentMonthRef = createContext<React.RefObject<HTMLDivElement>>(
  createRef() //this value won't be used as all consumers will be within context provider
);

cCurrentMonthRef.displayName = "Current Month Forwardref";

export const useCtxCurrentMonthRef = () => {
  return useContext(cCurrentMonthRef);
};

export const CurrentMonthRef = ({ children }: { children: JSX.Element }) => {
  const monthRef = useRef<HTMLDivElement>(null);
  return (
    <cCurrentMonthRef.Provider value={monthRef}>
      {children}
    </cCurrentMonthRef.Provider>
  );
};
