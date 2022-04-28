import React, { createContext, useCallback, useContext, useState } from "react";

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
