import { composition } from "@/interfaces";
import { CustomTypes } from "@/customTypes";
import { createContext, useContext, useRef } from "react";

const cTopNavRef = createContext<CustomTypes.NullableRef<HTMLDivElement>>(null);

export const useCtxTopNavRef = () => {
  return useContext(cTopNavRef);
};

export const TopNavRef: composition = ({ children }) => {
  const topNavRef = useRef<HTMLDivElement>(null);
  return (
    <cTopNavRef.Provider value={topNavRef}>{children}</cTopNavRef.Provider>
  );
};
