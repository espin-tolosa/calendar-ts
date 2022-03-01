import { composition } from "@/interfaces";
import React, { createContext, useContext, useState } from "react";
type IsDragginType = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const cIsDragging = createContext<IsDragginType>({
  state: false,
  setState: () => {},
});

export const useIsDragging = () => {
  return useContext(cIsDragging);
};

export const IsDraggingEvent: composition = ({ children }) => {
  const [state, setState] = useState(false);

  return (
    <cIsDragging.Provider value={{ state, setState }}>
      {children}
    </cIsDragging.Provider>
  );
};
