// Context:
//
// It's used to help the Controller knows what event is selected by the user
//

import { composition } from "../interfaces";
import { createContext, useContext, useRef } from "react";

const cCurrentMonthRef =
  createContext<CustomTypes.NullableRef<HTMLDivElement>>(null);

cCurrentMonthRef.displayName = "Current Month Forwardref";

export const useCtxCurrentMonthRef = () => {
  return useContext(cCurrentMonthRef);
};

export const CurrentMonthRef: composition = (propTypes) => {
  const monthRef = useRef<HTMLDivElement>(null);
  return (
    <cCurrentMonthRef.Provider value={monthRef}>
      {propTypes.children}
    </cCurrentMonthRef.Provider>
  );
};
