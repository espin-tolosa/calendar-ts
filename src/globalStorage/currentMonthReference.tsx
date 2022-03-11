import { composition } from "@/interfaces";
import { CustomTypes } from "@/customTypes";
import { createContext, useContext, useRef } from "react";

const cCurrentMonthRef =
  createContext<CustomTypes.NullableRef<HTMLDivElement>>(null);

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

/*
export const useCurrentMonthRef = () => {
  const monthRefInitValue = useRef<HTMLDivElement>(null);
  const cCurrentMonthRef = createContext(monthRefInitValue);
  const monthRef = useContext(cCurrentMonthRef);
  const CurrentMonthRef: composition = ({ children }) => {
    return (
      <cCurrentMonthRef.Provider value={monthRefInitValue}>
        {children}
      </cCurrentMonthRef.Provider>
    );
  };

  return { CurrentMonthRef, monthRef };
};
*/
