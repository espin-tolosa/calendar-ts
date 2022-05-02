import { composition } from "@/interfaces";
import { createContext, useContext, useState } from "react";

type IsDragginType = {
  isDragging: boolean;
  setIsDragging: (_value: boolean) => void;
};

const defaultValue = {
  isDragging: false,
  setIsDragging: (value: boolean) => {
    return value;
  },
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
export const IsDraggingEvent: composition = (Props) => {
  const { isDragging, setIsDragging } = useIsDragging();

  return (
    <context.Provider value={{ isDragging, setIsDragging }}>
      {Props.children}
    </context.Provider>
  );
};
