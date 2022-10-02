import { composition } from "../interfaces";
import { createContext, useContext, useState } from "react";

type IsFetchingType = {
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

const cIsFetchingEvents = createContext<IsFetchingType>({
  isFetching: true,
  setIsFetching: () => {
    return;
  },
});

cIsFetchingEvents.displayName = "Is Fetching Events";

export const useIsFetchingEvents = () => {
  return useContext(cIsFetchingEvents);
};

export const IsFetchingEvents: composition = (propTypes) => {
  const [isFetching, setIsFetching] = useState(true);

  return (
    <cIsFetchingEvents.Provider value={{ isFetching, setIsFetching }}>
      {propTypes.children}
    </cIsFetchingEvents.Provider>
  );
};
