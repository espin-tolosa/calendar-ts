import { composition } from "../interfaces";
import { createContext, useContext, useRef } from "react";

const cTopNavRef = createContext<CustomTypes.NullableRef<HTMLDivElement>>(null);

export const useCtxTopNavRef = () => {
  return useContext(cTopNavRef);
};

export const TopNavRef: composition = (propTypes) => {
  const topNavRef = useRef<HTMLDivElement>(null);
  return (
    <cTopNavRef.Provider value={topNavRef}>
      {propTypes.children}
    </cTopNavRef.Provider>
  );
};
