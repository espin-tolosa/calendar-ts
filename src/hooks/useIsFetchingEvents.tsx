import { composition } from "@/interfaces";
import { createContext, useContext, useState } from "react";

type IsFetchingType = {
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

const cIsFetchingEvents = createContext<IsFetchingType>({
  isFetching: false,
  setIsFetching: () => {},
});

export const useIsFetchingEvents = () => {
  return useContext(cIsFetchingEvents);
};

export const IsFetchingEvents: composition = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);

  return (
    <cIsFetchingEvents.Provider value={{ isFetching, setIsFetching }}>
      {children}
    </cIsFetchingEvents.Provider>
  );
};
