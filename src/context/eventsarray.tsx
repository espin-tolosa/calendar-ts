import { useContext, createContext, useReducer } from "react";

//type SetValue = (value: string) => void;
const initValue = ["event1", "event2", "event3", "event4", "event5", "event10"];
type State = typeof initValue;
type SetValue = React.Dispatch<React.SetStateAction<string>>;
interface Action {
  type: string;
  name: string;
}
type AppContextInterface = any; //TODO fix

export const EventsCtx = createContext<AppContextInterface>([]);

function reducer(state: State, action: Action) {
  let newState;
  switch (action.type) {
    case "increase":
      newState = [...state, action.name];
      break;
    default:
      throw new Error();
  }
  return newState;
}

export const CtxEventProvider: React.FC = (props) => {
  const [events, dispatch] = useReducer(reducer, [
    "event1",
    "event2",
    "event3",
    "event4",
    "event5",
    "event10",
  ]);
  const Dispatch = typeof dispatch;
  return (
    <EventsCtx.Provider value={{ events, dispatch }}>
      {props.children}
    </EventsCtx.Provider>
  );
};
