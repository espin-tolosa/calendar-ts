import { createContext, useContext, useState } from "react";
import { composition, event } from "../interfaces";
import { nullEvent } from "../customTypes";

const cDnDEventRef = createContext<event>(nullEvent());
const cSetDnDEventRef = createContext((event: event) => {
  return;
});

cDnDEventRef.displayName = "Selected Event: value";

export const useDnDEventRef = () => {
  return useContext(cDnDEventRef);
};
export const useSetDnDEventRef = () => {
  return useContext(cSetDnDEventRef);
};

export const EventInDnD: composition = (propTypes) => {
  const [dndEvent, setDnDEvent] = useState(nullEvent());
  const setDnDEventRef = (event: event) => {
    if (typeof event.mutable === "object") {
      setDnDEvent({ ...event, mutable: { ...event.mutable } });
    } else {
      setDnDEvent({ ...event });
    }
  };

  return (
    <cDnDEventRef.Provider value={dndEvent}>
      <cSetDnDEventRef.Provider value={setDnDEventRef}>
        {propTypes.children}
      </cSetDnDEventRef.Provider>
    </cDnDEventRef.Provider>
  );
};
