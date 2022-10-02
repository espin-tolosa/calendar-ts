import { composition } from "../interfaces";
import React, { createContext, useContext, useRef } from "react";

type BufferDispatcher = (update: string) => void;

const cKeyBuffer = createContext<React.MutableRefObject<string> | null>(null);
const cKeyBufferDispatcher = createContext<BufferDispatcher>(() => {
  return;
});

export const useCtxKeyBuffer = () => {
  return useContext(cKeyBuffer);
};
export const useCtxKeyBufferDispatcher = () => {
  return useContext(cKeyBufferDispatcher);
};

export const KeyBuffer: composition = (propTypes) => {
  const keyBuffer = useRef<string>("");
  const keyBufferDispatcher = (update: string) => {
    keyBuffer.current = update;
  };
  return (
    <cKeyBuffer.Provider value={keyBuffer}>
      <cKeyBufferDispatcher.Provider value={keyBufferDispatcher}>
        {propTypes.children}
      </cKeyBufferDispatcher.Provider>
    </cKeyBuffer.Provider>
  );
};
