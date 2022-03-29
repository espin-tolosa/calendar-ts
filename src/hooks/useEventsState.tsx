import { composition } from "@/interfaces";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { event } from "@/interfaces/index";
import { month0 } from "@/static/initEvents";
import { eventSpreader } from "@/algorithms/eventSpreader";
import { DateService } from "@/utils/Date";
import { isReadyToSubmit } from "@/utils/ValidateEvent";
import { CustomTypes } from "@/customTypes";

export type Action = {
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

export function reducerEvents(state: CustomTypes.State, action: Action) {
  switch (action.type) {
    // Add new event coming from database, it doesn't allow to add events with duplicated id's
    //Notice: use it only forfetch events from  the database, it clears the state
    case "appendarray": {
      //I will avoid spread operator [...state] until verify it won't throw RangeError for large arrays
      let newState = state.slice();
      action.payload.forEach((event) => {
        //Treat event from db to remove hours from data
        event.start = event.start.split(" ")[0];
        event.end = event.end.split(" ")[0];
        // Check if event already exists in the state by its id
        const isEventInState =
          newState.findIndex(
            (inner) => Math.abs(inner.id) === Math.abs(event.id)
          ) >= 0;
        if (isEventInState) {
          return newState;
        }

        //checks the case of end begins before the start
        const daysSpread = DateService.DaysFrom(event.start, event.end);
        if (daysSpread < 0) {
          return newState;
        }

        //check if start and end day exists, and client is not empty or is default
        if (!isReadyToSubmit) {
          return newState;
        }

        //Recompute the new representation of that event
        const spread = eventSpreader(event);
        newState.push(event);
        newState.push(...spread);
        //newState = newState.concat(spread);
      });

      newState.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
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

      newState.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
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
      return newState;
    }
    //

    //Strict replace by id: update the complete event state only if such event is found
    case "replacebyid": {
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
      result.sort((prev, next) => sortCriteriaFIFO(prev.id, next.id));
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
