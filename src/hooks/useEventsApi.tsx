import { composition } from "@/interfaces";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { event } from "@interfaces/index";
import { month0, month1 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";
import { DateService } from "@/utils/Date";
import { isValidEvent } from "@/utils/ValidateEvent";

type State = Array<event>;
type Action =
  | {
      type: "appendarray" | "deletebyid" | "replacebyid";
      payload: State;
    }
  | { type: "default" };

function reducerEvents(state: State, action: Action) {
  switch (action.type) {
    //
    case "appendarray": {
      const eventWithDayHour = action.payload[0]; // by now I can only manage first item
      const event = {
        id: eventWithDayHour.id,
        client: eventWithDayHour.client,
        job: eventWithDayHour.job,
        start: eventWithDayHour.start.split(" ")[0],
        end: eventWithDayHour.end.split(" ")[0],
      };

      // Check if event already exists in the state by its id
      const isEventInState = state.findIndex((inner) => inner.id === event.id);
      if (isEventInState >= 0) {
        return state;
      }

      //checks the case of end begins before the start
      const daysSpread = DateService.DaysFromStartToEnd(event.start, event.end);
      if (daysSpread < 0) {
        return state;
      }

      //check if start and end day exists

      //TODO: extract to a function
      if (!isValidEvent) {
        return state;
      }

      const spread = eventSpreader(event);
      const newState = [...state, event, ...spread];
      //
      return newState;
    }
    //
    case "deletebyid": {
      let newState = [...state];
      action.payload.forEach((toReplace) => {
        newState = newState.filter(
          (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
        );
      });
      return newState;
    }
    //
    case "replacebyid": {
      const eventWithDayHour = action.payload[0]; // by now I can only manage first item
      const event = {
        id: eventWithDayHour.id,
        client: eventWithDayHour.client,
        job: eventWithDayHour.job,
        start: eventWithDayHour.start.split(" ")[0],
        end: eventWithDayHour.end.split(" ")[0],
      };
      const spread = eventSpreader(event);

      const newState = [...state, ...spread];
      action.payload.forEach((toReplace) => {
        newState.splice(
          newState.findIndex((event) => event.id === toReplace.id),
          1, //the update only affects to this one entry position
          toReplace
        );
      });
      //
      return newState;
    }
    default: {
      console.warn("reducer option not implemented");
      //
      return state;
    }
  }
}
// Context
const cEventState = createContext<Array<event>>(month1);
const cEventDispatch = createContext<React.Dispatch<Action>>(() => {});

export function useEventState(day?: string) {
  const events = useContext(cEventState);
  return day ? events.filter((event) => event.start === day) : events;
}
export function useEventDispatch() {
  return useContext(cEventDispatch);
}

// Context Dispatcher of Event Reducer

export const EventsDispatcher: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducerEvents, month0);

  /*
        onClick={() => {
          eventDispatcher({
        }}
*/

  return (
    <cEventState.Provider value={state}>
      <cEventDispatch.Provider value={dispatch}>
        {children}
      </cEventDispatch.Provider>
    </cEventState.Provider>
  );
};
