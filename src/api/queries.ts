import { Action } from "@/hooks/useEventsState";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import React, { Dispatch } from "react";
import { useEventDispatch, } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { event } from "@/interfaces";

export const usePostQuery = (fullDate: event.date) => {
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const eventDispatcher = useEventDispatch();
  //const { isDragging } = Context.useIsDragging();
  const isWeekend = DateService.IsWeekend(fullDate);
  const isLocked = false;
  //Closure
  return () => {
    if (/*isDragging ||*/ isLocked || isWeekend) {
      return;
    }
    queryEvent(fullDate, eventDispatcher, pushDaysDispatcher);
  };
};

const queryEvent = (
  date: event.date,
  eventDispatcher: React.Dispatch<Action>,
  pushDaysDispatcher: Dispatch<Set<event.date>>
) => {
  const MaxId = Number.MAX_SAFE_INTEGER;
  const newEvent = {
    id: MaxId,
    client: "Select Client",
    job: "description",
    start: date,
    end: date,
  };
  eventDispatcher({
    type: "update",
    payload: [newEvent],
    callback: pushDaysDispatcher,
  });

  const FetchClosure = () => {
    const Max_Attempts = 10;

    const callFetch = async () => {
      try {
        const data = await fetchEvent_Day("POST", newEvent);
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
          callback: pushDaysDispatcher,
        });
        //then, commit database response if status is ok
        result.status &&
          eventDispatcher({
            type: "update",
            payload: result.data,
            callback: pushDaysDispatcher,
          });

        return;
      }, REFETCHING_TIME);
    };

    return callManager;
  };

  const caller = FetchClosure();
  return caller();
};
