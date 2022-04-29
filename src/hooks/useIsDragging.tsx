import { composition } from "@/interfaces";
import { createContext, useCallback, useContext, useState } from "react";

type IsDragginType = {
  isDragging: boolean;
  setIsDragging: (_value: boolean) => void;
};

const defaultValue = {
  isDragging: false,
  setIsDragging: (_value: boolean) => {},
};

const context = createContext<IsDragginType>(defaultValue);
context.displayName = "Is Dragging";

export namespace Context {
  export const useIsDragging = () => useContext(context);
}

const useIsDragging = () => {
  const [isDragging, setIsDragging] = useState(false);

  return { isDragging, setIsDragging };
};
export const IsDraggingEvent: composition = ({ children }) => {
  const { isDragging, setIsDragging } = useIsDragging();

  return (
    <context.Provider value={{ isDragging, setIsDragging }}>
      {children}
    </context.Provider>
  );
};
