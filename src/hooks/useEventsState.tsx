import { composition } from "@/interfaces";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { event } from "@interfaces/index";
import { month0 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";
import { DateService } from "@/utils/Date";
import { isReadyToSubmit } from "@/utils/ValidateEvent";
import { CustomTypes } from "@/customTypes";

type Action = {
  type: CustomTypes.DispatchLocalStateEvents;
  payload: CustomTypes.State;
};

const sortCriteriaFIFO = (a: number, b: number) => Math.abs(a) - Math.abs(b);
const diff_byId = (
  newState: CustomTypes.State,
  state: CustomTypes.State
): CustomTypes.State => {
  const { bigger, lower } =
    newState.length >= state.length
      ? { bigger: newState, lower: state }
      : { bigger: state, lower: newState };

  return bigger.filter(
    ({ id: id1 }) => !lower.some(({ id: id2 }) => id2 === id1)
  );
};

function reducerEvents(state: CustomTypes.State, action: Action) {
  switch (action.type) {
    // Add new event coming from database, it doesn't allow to add events with duplicated id's
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
      const daysSpread = DateService.DaysFrom(event.start, event.end);
      if (daysSpread < 0) {
        return state;
      }

      //check if start and end day exists

      //TODO: extract to a function
      if (!isReadyToSubmit) {
        return state;
      }

      const spread = eventSpreader(event);
      const newState = [...state, event, ...spread];
      newState.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
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
      newState.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
      return newState;
    }
    //
    case "replacebyid": {
      const toReplace = action.payload[0];
      const target = state.findIndex((event) => event.id === toReplace.id);
      if (target < 0) return state;
      const spread = eventSpreader(toReplace);
      const newState = state.filter(
        (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
      );

      const result = [...newState, toReplace, ...spread];

      result.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
      return result;
    }
    case "updateDnD": {
      const toReplace = action.payload[0];
      const newState = state.filter(
        (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
      );
      const spread = eventSpreader(toReplace);
      const result = [...newState, toReplace, ...spread];
      return result;
    }
    case "update": {
      const event = action.payload[0];

      const isEvent = state.findIndex((e) => e.id === event.id) >= 0;

      if (isEvent) {
        const event = action.payload[0];
        const spread = eventSpreader(event);
        let newState = [...state];
        action.payload.forEach((toReplace) => {
          newState = newState.filter(
            (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
          );
        });

        const result = [...newState, event, ...spread];

        result.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
        return result;
      } else {
        const isEventInState = state.findIndex(
          (inner) => inner.id === event.id
        );
        if (isEventInState >= 0) {
          return state;
        }

        //checks the case of end begins before the start
        const daysSpread = DateService.DaysFrom(event.start, event.end);
        if (daysSpread < 0) {
          return state;
        }

        //check if start and end day exists

        //TODO: extract to a function
        if (!isReadyToSubmit) {
          return state;
        }

        const spread = eventSpreader(event);
        const newState = [...state, event, ...spread];
        newState.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
        //
        return newState;
      }
    }
  }
}
// Context
const defaultState = month0;
const cEventState = createContext<Array<event>>(defaultState);
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
  const [state, dispatch] = useReducer(reducerEvents, defaultState);

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
