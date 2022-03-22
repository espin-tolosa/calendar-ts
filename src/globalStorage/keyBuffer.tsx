import { composition } from "@/interfaces";
import React, { createContext, useContext, useRef } from "react";

const cKeyBuffer = createContext<React.MutableRefObject<string> | null>(null);
const cKeyBufferDispatcher = createContext((update: string) => {});

export const useCtxKeyBuffer = () => {
  return useContext(cKeyBuffer);
};
export const useCtxKeyBufferDispatcher = () => {
  return useContext(cKeyBufferDispatcher);
};

export const KeyBuffer: composition = ({ children }) => {
  const keyBuffer = useRef<string>("");
  const keyBufferDispatcher = (update: string) => {
    keyBuffer.current = update;
  };
  return (
    <cKeyBuffer.Provider value={keyBuffer}>
      <cKeyBufferDispatcher.Provider value={keyBufferDispatcher}>
        {children}
      </cKeyBufferDispatcher.Provider>
    </cKeyBuffer.Provider>
  );
};
