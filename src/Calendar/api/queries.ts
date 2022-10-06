import { Action } from "../hooks/useEventsState";
import { fetchEvent_Day } from "../utils/fetchEvent";
import React from "react";
import { useEventDispatch } from "../hooks/useEventsState";
import { DateService } from "../utils/Date";
import { FetchEvent } from "../classes/fetchEvent";

export const usePostQuery = (fullDate: jh.date.representation) => {
  const eventDispatcher = useEventDispatch();
  //const { isDragging } = Context.useIsDragging();
  const isWeekend = DateService.IsWeekend(fullDate);
  const isLocked = false;
  //Closure
  return () => {
    if (/*isDragging ||*/ isLocked || isWeekend) {
      return;
    }
    queryEvent(fullDate, eventDispatcher);
  };
};

const queryEvent = (date: jh.date.representation, eventDispatcher: React.Dispatch<Action>) =>
{
  const MaxId = Number.MAX_SAFE_INTEGER;
  const newEvent: jh.event = {
    id: MaxId,
    client: "Select Client",
    job: "description",
    start: date,
    end: date,
    type: "roothead",
    done: "false",
  };
  eventDispatcher({
    type: "update",
    payload: [newEvent],
  });

  type callFetch = Promise<{
    status: true;
    data: jh.event;
} | {
    status: false;
    data: never[];
}>

  const FetchClosure = () => {
    const Max_Attempts = 10;

    const callFetch = async () : callFetch => {
      try {
        const request = new FetchEvent();
        const data = await request.create(newEvent);
        //const data = [{client: "Test",job:"demo2",start:"2022-09-01",end:"2022-09-01"}];
        return { status: true, data };
      } catch {
        return { status: false, data: [] };
      }
    };

    //!continue reviewing drag and drop fetching
    const callManager = async (currentAttempt = 1) => {
      const REFETCHING_TIME = 200; //ms
      const result = await callFetch();
      setTimeout(async () => {
        if (!result.status && currentAttempt < Max_Attempts) {
          return callManager(++currentAttempt);
        }
        //Handle the result in case of succed or wasted time, first remove temporal event
        eventDispatcher({
          type: "delete",
          payload: [newEvent],
        });
        //then, commit database response if status is ok
        result.status &&
          eventDispatcher({
            type: "update",
            payload: [result.data],
          });

        return;
      }, REFETCHING_TIME);
    };

    return callManager;
  };

  const caller = FetchClosure();
  return caller();
};
