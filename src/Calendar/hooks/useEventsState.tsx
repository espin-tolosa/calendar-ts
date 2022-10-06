import { composition } from "../interfaces";
import React, { createContext, useContext, useReducer } from "react";
import { eventSpreader } from "../algorithms/eventSpreader";
import { isWellDefined } from "../utils/ValidateEvent";
import { DateService } from "../utils/Date";
import { EventClass } from "../classes/event";
import { eventNames } from "process";

export type Action = {
  type: CustomTypes.DispatchLocalStateEvents;
  payload: CustomTypes.State;
};

const sortCriteriaFIFO = (prev: jh.event, next: jh.event) => prev.id - next.id;
//TODO: strategy pattern
export const sortCriteria = sortCriteriaFIFO;
//const sortCriteriaLonger = (prev: event, next: event) => {
//  const prevRange = DateService.DaysFrom(prev.start, prev.end);
//  const nextRange = DateService.DaysFrom(next.start, next.end);
//  return nextRange - prevRange;
//};
//const diff_byId = (
//  newState: CustomTypes.State,
//  state: CustomTypes.State
//): CustomTypes.State => {
//  const { bigger, lower } =
//    newState.length >= state.length
//      ? { bigger: newState, lower: state }
//      : { bigger: state, lower: newState };
//
//  return bigger.filter(
//    ({ id: id1 }) => !lower.some(({ id: id2 }) => id2 === id1)
//  );
//};
//
export function reducerEvents(
  state: CustomTypes.State,
  action: Action
): Array<jh.event> {
  switch (action.type) {
    // Add new event coming from database, it doesn't allow to add events with duplicated id's
    //Notice: use it only forfetch events from  the database, it clears the state

    case "syncDB": {
      //I will avoid spread operator [...state] until verify it won't throw RangeError for large arrays
      const newState: Array<jh.event> = [];
      action.payload.forEach((event) => {
        //Treat event from db to remove hours from data
        event.type = "roothead";
        event.start = event.start.split(" ")[0];
        event.end = event.end.split(" ")[0];
        event.done = event.done;

        //checks the case of end begins before the start
        //check if start and end day exists, and client is not empty or is default
        if (!isWellDefined(event)) {
          return;
        }

        //Recompute the new representation of that event
        const spread = eventSpreader(event).filter(
          (e) => !DateService.IsWeekend(e.start)
        );
        newState.push(event);
        newState.push(...spread);
      });

      newState.sort((prev, next) => sortCriteria(prev, next));
      return newState;
    }

    //I start with the complete state, to then filter by id and add changes
    case "update": {
      let newState = state.slice();

      action.payload.forEach((toReplace) => {
        //Avoid enter negative id, reserved for placeholders
        //TODO: add more safety conditions like start < end
        if (toReplace.id < 1) {
          //skip by not doing nothing for that event
          return;
        }
        const spread = eventSpreader(toReplace).filter(
          (e) => !DateService.IsWeekend(e.start)
        );
        //in each iteration in filtering some part of the original state and injecting something new
        toReplace.type = "roothead";
        newState = newState.filter((event) => event.id !== toReplace.id);
        newState.push(toReplace);
        newState = newState.concat(spread);
      });

      newState.sort((prev, next) => sortCriteria(prev, next));
      return newState;
    }

    case "delete": {
      let newState = state.slice();
      //Clean state is the state without all the events targeting the id to replace
      action.payload.forEach((toDelete) => {
        newState = newState.filter((event) => event.id !== toDelete.id);
      });
      return newState;
    }

    case "tonull": {
      const origin = action.payload[0];

      //Deep-cloning the array ref and the objects inside removing the origin
      const newState = state
        .filter((event) => event.id !== origin.id)
        .map((event) => {
          return { ...event };
        });

      //Scape if there is no temp event
      const target = newState.find((event) => event.id === origin.id);
      if (!target) {
        return state;
      }

      target.id = action.payload[0].id;

      return newState;
    }

    //Overrides whatever is in null with the payload
    case "fromnull": {
      const toReplace = action.payload[0];
      const cleanState = state.filter((event) => event.id !== 0);

      //State before and after cleaning is the same, event is not in state so won't add
      const affectedEvents = state.length - cleanState.length;
      if (affectedEvents === 0) {
        return [...state];
      }

      //Recompute the new representation of that event
      const spread = eventSpreader(toReplace);

      //Append to previous cleaned state
      const result = [...cleanState, toReplace, ...spread];

      //Sort again
      result.sort((prev, next) => sortCriteria(prev, next));
      return result;
    }

    case "unmount": {
      return [];
    }
  }
}

// Context
const cEventState = createContext<Array<jh.event>>([]);
const cEventBuffer = createContext<Array<jh.event>>([]);
const cBufferDispatch = createContext<React.Dispatch<Action>>(() => {
  return;
});
const cEventDispatch = createContext<React.Dispatch<Action>>(() => {
  return;
});

cEventState.displayName = "Event State: a interpretation of database events";
cEventBuffer.displayName = "Event Buffer: a temporal state";
cBufferDispatch.displayName = "Event Buffer dispatch";
cEventDispatch.displayName = "Event State Dispatch";

export function useEventState(day?: string | { from: string; to: string }) {
  const events = useContext(cEventState);
  if (typeof day === "object") {
    //TODO: Figure out the way to do this only once for the deps: [events, day.from]
    return events.filter((event) => {
      const leftRangeWidth = DateService.DaysFrom(day.from, event.start) >= 0;
      const rightRangeWidth = DateService.DaysFrom(event.start, day.to) >= 0;
      const isInRange = leftRangeWidth && rightRangeWidth;
      return isInRange;
    });
  }

  if (typeof day === "string") {
    return events.filter((event) => event.start.includes(day));
  }
  return events;
}
export function useEventDispatch() {
  return useContext(cEventDispatch);
}

//A children custom hook of useEventState
export function useGetEventFamily(event: jh.event) {
  const events = useEventState();
  //return all events that has the same parentId
  const family = events.filter((e) => e.id === event.id);

  const parent = EventClass.getParentEvent(family);
  const closestTail = EventClass.getClosestTail(family, event);
  return [parent, closestTail, family] as [jh.event, jh.event, Array<jh.event>];
}

// Context Dispatcher of Event Reducer

export const EventsDispatcher: composition = (propTypes) => {
  const [state, dispatch] = useReducer(reducerEvents, []);

  return (
    <cEventState.Provider value={state}>
      <cEventBuffer.Provider value={state}>
        <cEventDispatch.Provider value={dispatch}>
          <cBufferDispatch.Provider value={dispatch}>
            {propTypes.children}
          </cBufferDispatch.Provider>
        </cEventDispatch.Provider>
      </cEventBuffer.Provider>
    </cEventState.Provider>
  );
};
