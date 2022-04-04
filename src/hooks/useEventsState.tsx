import { composition } from "@/interfaces";
import React, {
  createContext,
  Dispatch,
  DispatchWithoutAction,
  ReducerWithoutAction,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { event } from "@/interfaces/index";
import { month0 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";
import { isWellDefined } from "@/utils/ValidateEvent";
import { CustomTypes } from "@/customTypes";
import { DateService } from "@/utils/Date";

export type Action = {
  type: CustomTypes.DispatchLocalStateEvents;
  payload: CustomTypes.State;
  callback: Dispatch<Set<string>>;
};

function rangeOfDates(start: string, end: string) {
  const numberOfDays = DateService.DaysFrom(start, end);
  const DaysToPush: Set<string> = new Set([start]);

  for (let i = 1; i < numberOfDays; i++) {
    DaysToPush.add(DateService.GetDateFrom(start, i));
  }

  DaysToPush.add(end);

  return DaysToPush;
}

// Return a range of dates affecting the difference between prev and next state of events
export function diffStates(state: Array<event>, newState: Array<event>) {
  const prevState = state.filter((event) => event.id > 0);
  const nextState = newState.filter((event) => event.id > 0);

  //sort by start day from earlier first
  prevState.sort((prev, next) => -DateService.DaysFrom(prev.start, next.start));
  nextState.sort((prev, next) => -DateService.DaysFrom(prev.start, next.start));

  //  return nextState;
  const DaysToPush: Set<string> = new Set();

  //For each new Event compare if it exists or it is modified respect to prev state and store the range of dates in a Set
  nextState.forEach((nextEvent) => {
    let start = nextEvent.start;
    let end = nextEvent.end;

    const prev = prevState.find((event) => event.id === nextEvent.id);

    //case where an event with new id is found
    if (!prev) {
      rangeOfDates(start, end).forEach((date) => DaysToPush.add(date));
      //case where event exists but differs on one of the key: start, end, client or job
    } else {
      if (
        prev.start !== nextEvent.start ||
        prev.end !== nextEvent.end ||
        prev.client !== nextEvent.client ||
        prev.job !== nextEvent.job
      ) {
        //take the earlier start date
        const startDates = [prev.start, nextEvent.start];
        startDates.sort((prev, next) => -DateService.DaysFrom(prev, next));
        start = startDates[0];
        //take the later end date
        const endDates = [prev.end, nextEvent.end];
        endDates.sort((prev, next) => -DateService.DaysFrom(prev, next));
        end = endDates[0];

        //always return the max value
        rangeOfDates(start, end).forEach((date) => DaysToPush.add(date));
      }
    }
  });

  //console.log("Days to push", DaysToPush);
  return DaysToPush;
}

const sortCriteriaFIFO = (prev: event, next: event) =>
  Math.abs(prev.id) - Math.abs(next.id);
const sortCriteriaLonger = (prev: event, next: event) => {
  const prevRange = DateService.DaysFrom(prev.start, prev.end);
  const nextRange = DateService.DaysFrom(next.start, next.end);
  return nextRange - prevRange;
};
export const sortCriteria = sortCriteriaLonger;
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

export function reducerEvents(
  state: CustomTypes.State,
  action: Action
): Array<event> {
  switch (action.type) {
    // Add new event coming from database, it doesn't allow to add events with duplicated id's
    //Notice: use it only forfetch events from  the database, it clears the state

    case "syncDB": {
      //I will avoid spread operator [...state] until verify it won't throw RangeError for large arrays
      let newState: Array<event> = [];
      action.payload.forEach((event) => {
        //Treat event from db to remove hours from data
        event.start = event.start.split(" ")[0];
        event.end = event.end.split(" ")[0];

        //checks the case of end begins before the start
        //check if start and end day exists, and client is not empty or is default
        if (!isWellDefined(event)) {
          return;
        }

        //Recompute the new representation of that event
        const spread = eventSpreader(event);
        newState.push(event);
        newState.push(...spread);
        //newState = newState.concat(spread);
      });

      newState.sort((prev, next) => sortCriteria(prev, next));
      const daysToPush = diffStates(state, newState);
      action.callback(daysToPush);
      return newState;
    }
    //
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
        const spread = eventSpreader(toReplace);
        //in each iteration in filtering some part of the original state and injecting something new
        newState = newState.filter(
          (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
        );
        newState.push(toReplace);
        newState = newState.concat(spread);
      });

      newState.sort((prev, next) => sortCriteria(prev, next));
      diffStates(state, newState);
      const daysToPush = diffStates(state, newState);
      console.log("Events dispatchcer of days", daysToPush);
      action.callback(daysToPush);
      return newState;
    }
    //
    case "delete": {
      let newState = state.slice();
      //Clean state is the state without all the events targeting the id to replace
      action.payload.forEach((toDelete) => {
        newState = newState.filter(
          (event) => Math.abs(event.id) !== Math.abs(toDelete.id)
        );
      });
      diffStates(state, newState);
      const daysToPush = diffStates(state, newState);
      action.callback(daysToPush);
      return newState;
    }
    //

    //Strict replace by id: update the complete event state only if such event is found
    case "override": {
      const toReplace = action.payload[0];
      const cleanState = state.filter(
        (event) => Math.abs(event.id) !== Math.abs(toReplace.id)
      );

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
  }
}

// Context
const defaultState = month0;
const cEventState = createContext<Array<event>>(defaultState);
const cEventBuffer = createContext<Array<event>>(defaultState);
const cBufferDispatch = createContext<React.Dispatch<Action>>(() => {});
const cEventDispatch = createContext<React.Dispatch<Action>>(() => {});

cEventState.displayName = "Event State: a interpretation of database events";
cEventBuffer.displayName = "Event Buffer: a temporal state";
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

// Context Dispatcher of Event Reducer

export const EventsDispatcher: composition = ({ children }) => {
  const [state, dispatch] = useReducer(reducerEvents, defaultState);

  return (
    <cEventState.Provider value={state}>
      <cEventBuffer.Provider value={state}>
        <cEventDispatch.Provider value={dispatch}>
          <cBufferDispatch.Provider value={dispatch}>
            {children}
          </cBufferDispatch.Provider>
        </cEventDispatch.Provider>
      </cEventBuffer.Provider>
    </cEventState.Provider>
  );
};

const useFetchEvents = () => {};
//export function fetchEvent_v2(
//  action: CustomTypes.OptionsEventsAPI,
//  event: event = CustomValues.nullEvent
//): Promise<Array<event>> {
//  const method = "POST"; //https method, nothing to do with action
//  const body = new FormData();
//  const dataJSON = JSON.stringify({ action, ...event });
//  body.append("json", dataJSON);
//
//  const handleFetchErrors = async (response: Response) => {
//    if (response.status === 401) {
//      throw Error("No JWT");
//    }
//
//    if (response.status === 404) {
//      throw Error("No credentials"); //!
//    }
//
//    const dbResponse: Array<event> = await response.json();
//    return new Promise((resolve, reject) => {
//      resolve(dbResponse);
//    });
//  };
//
//  fetch(api.routes.events, { method, body })
//    .then((response) => {
//      //  if (response.status === 401) {
//      //    throw Error("No JWT");
//      //  }
//
//      //  if (response.status === 404) {
//      //    throw Error("No credentials"); //!
//      //  }
//      return response.json();
//    })
//    .then((response) => {
//      return response as Array<event>;
//    })
//  	.catch(error =>{
//
//  		    return new Promise((resolve, reject) => {
//  		      setTimeout(() => {
//  		        resolve([
//  		          {
//  		            id: 10,
//  		            client: "Client_1",
//  		            job: "local",
//  		            start: "2022-03-01",
//  		            end: "2022-03-02",
//  		          },
//
//  		        ]);
//  		      }, 1000)})}
//
//  	)
//
//}
