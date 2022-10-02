// Context:
//
// It's used to help the Controller knows what event is selected by the user
//

import { createContext, useContext, useState } from "react";

const cEventSelected = createContext<jh.event | null>(null);

type SetEventSelected = (event: jh.event | null) => void;
const cSetEventSelected = createContext<SetEventSelected>(() => {
  return;
});

cEventSelected.displayName = "Selected Event: value";
cSetEventSelected.displayName = "Selected Event: dispatch";

export const useEventSelected = () => {
  return useContext(cEventSelected);
};
export const useSetEventSelected = () => {
  return useContext(cSetEventSelected);
};

export function EventInController(propTypes: { children: JSX.Element }) {
  const [eventSelected, setEventSelected] = useState<jh.event | null>(null);
  const SetEventSelected = (event: jh.event | null) => {
    setEventSelected(event);
  };

  return (
    <cEventSelected.Provider value={eventSelected}>
      <cSetEventSelected.Provider value={SetEventSelected}>
        {propTypes.children}
      </cSetEventSelected.Provider>
    </cEventSelected.Provider>
  );
}
