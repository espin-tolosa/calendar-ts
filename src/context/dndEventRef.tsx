import { createContext, useContext, useState } from "react";
import { nullEvent } from "../customTypes";

const cDnDEventRef = createContext<jh.event>(nullEvent());

type SetDnDEventRef = (dragging: jh.event) => void;
const cSetDnDEventRef = createContext<SetDnDEventRef>(() => undefined);

cDnDEventRef.displayName = "Selected Event: value";

export const useDnDEventRef = () => {
  return useContext(cDnDEventRef);
};
export const useSetDnDEventRef = () => {
  return useContext(cSetDnDEventRef);
};

export function EventInDnD(propTypes: { children: JSX.Element }) {
  const [dndEvent, setDnDEvent] = useState(nullEvent());
  const setDnDEventRef = (event: jh.event) => {
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
}
