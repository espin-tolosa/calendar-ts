import React, { createContext, createRef, useContext, useRef } from "react";

const cTopNavRef = createContext<React.RefObject<HTMLDivElement>>(createRef());

export const useCtxTopNavRef = () => {
  return useContext(cTopNavRef);
};

export function TopNavRef({ children }: { children: JSX.Element }) {
  const topNavRef = useRef<HTMLDivElement>(null);
  return (
    <cTopNavRef.Provider value={topNavRef}>{children}</cTopNavRef.Provider>
  );
}
