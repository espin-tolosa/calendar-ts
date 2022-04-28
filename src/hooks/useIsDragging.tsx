import { composition } from "@/interfaces";
import { createContext, useCallback, useContext, useState } from "react";
type IsDragginType = {
  isDragging: boolean;
  setIsDragging: (_value: boolean) => void;
};

const cIsDragging = createContext<IsDragginType>({
  isDragging: false,
  setIsDragging: (_value: boolean) => {},
});

export const useIsDragging = () => {
  return useContext(cIsDragging);
};

const useIsDraggingHook = () => {
  const [isDragging, setState] = useState(false);
  const setIsDragging = useCallback((value: boolean) => {
    setState(() => value);
  }, []);

  return { isDragging, setIsDragging };
};
export const IsDraggingEvent: composition = ({ children }) => {
  const { isDragging, setIsDragging } = useIsDraggingHook();

  return (
    <cIsDragging.Provider value={{ isDragging, setIsDragging }}>
      {children}
    </cIsDragging.Provider>
  );
};
/*
const cIsDragging = createContext(false);
cIsDragging.displayName = "Is Dragging";

type IsDraggingProvider = {
  children: React.ReactNode;
  isDragging: boolean;
};

export const IsDraggingProvider = ({
  children,
  isDragging,
}: IsDraggingProvider) => {
  return (
    <cIsDragging.Provider value={isDragging}>{children}</cIsDragging.Provider>
  );
};

export const useIsDragging = () => {
  const [isDragging, setState] = useState(false);
  const setIsDragging = useCallback(
    (value: boolean) => setState(() => value),
    []
  );

  return { isDragging, setIsDragging };
};
*/
