import { createContext, useContext, useReducer } from "react";
import { composition } from "@/interfaces";

// The reducer needs to recieve typed strings for limited actions, change: action.type : string by "action1" | "action2" | ...

import {
  UserPreferencesState,
  defaultUserState,
} from "@/static/defaultUserState";

const getInitDisplayState = () => {
  /*
	retrieve access level and localStorage userStage
	*/

  return getLocalUserState();
};

//window.localStorage.setItem("localUserState","{\"displayController\": false}")

const getLocalUserState = () => {
  /* actually default user object is within inside this function, but I will be defined in static*/
  const strLocalUserState = window.localStorage.getItem("localUserState");
  return (
    strLocalUserState ? JSON.parse(strLocalUserState) : defaultUserState
  ) as UserPreferencesState;
  //return {displayController: false}
};

function reducer(state: UserPreferencesState, action: { type: string }) {
  if (action.type === "toggleController") {
    const result: UserPreferencesState = {
      ...state,
      displayController: !state.displayController,
    };
    return result;
  } else if (action.type === "toggleShowWeekend") {
    const result: UserPreferencesState = {
      ...state,
      showWeekends: !state.showWeekends,
    };
    return result;
  } else {
    return state;
  }
}

export const useLocalUserPreferences = () => {
  return useReducer(reducer, getInitDisplayState());
};

// Context to give global access to useLocalUserPreferences

const dispatch: ({ type }: { type: string }) => void = () => {};

const cUseLocalUserPreferences = createContext({
  localState: defaultUserState,
  dispatchLocalState: dispatch,
});

cUseLocalUserPreferences.displayName = "Local User Preferences";

export const useLocalUserPreferencesContext = () => {
  return useContext(cUseLocalUserPreferences);
};

export const UserPreferences: composition = ({ children }) => {
  //const [state, setState] = useState(isCookie("PHPSESSID"));
  const [localState, dispatchLocalState] = useLocalUserPreferences();

  // closure that wraps the state and setState to add some functionallities

  return (
    <cUseLocalUserPreferences.Provider
      value={{ localState, dispatchLocalState }}
    >
      {children}
    </cUseLocalUserPreferences.Provider>
  );
};
