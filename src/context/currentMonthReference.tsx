// Context:
//
// It's used to help the Controller knows what event is selected by the user
//

import { composition } from "@/interfaces";
import { CustomTypes } from "@/customTypes";
import { createContext, useContext, useRef } from "react";

const cCurrentMonthRef =
  createContext<CustomTypes.NullableRef<HTMLDivElement>>(null);

cCurrentMonthRef.displayName = "Current Month Forwardref";

export const useCtxCurrentMonthRef = () => {
  return useContext(cCurrentMonthRef);
};

export const CurrentMonthRef: composition = ({ children }) => {
  const monthRef = useRef<HTMLDivElement>(null);
  return (
    <cCurrentMonthRef.Provider value={monthRef}>
      {children}
    </cCurrentMonthRef.Provider>
  );
};