import { Action } from "@/hooks/useEventsState";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import React, { Dispatch } from "react";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { useIsDragging } from "@/hooks/useIsDragging";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";

export const usePostQuery = (fullDate: string) => {
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const eventDispatcher = useEventDispatch();
  const isDragging = useIsDragging();
  const isWeekend = DateService.IsWeekend(fullDate);
  const isLocked = false;
  //Closure
  return async () => {
    if (isDragging.state || isLocked || isWeekend) {
      return;
    }
    queryEvent(fullDate, eventDispatcher, pushDaysDispatcher);
  };
};

const queryEvent = async (
  date: string,
  eventDispatcher: React.Dispatch<Action>,
  pushDaysDispatcher: Dispatch<Set<string>>
) => {
  const MaxId = Number.MAX_SAFE_INTEGER;
  const newEvent = {
    id: MaxId,
    client: `Client_${Math.ceil(10 * Math.random()) + 1}`,
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
      } catch (e: any) {
        return { status: false, data: [] };
      }
    };

    //!continue reviewing drag and drop fetching
    const callManager = async (currentAttempt = 1) => {
      const REFETCHING_TIME = 200; //ms
      let result = await callFetch();
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

  /*
  return async () => {
    const deleteResourceInAPI = async () => {
      const result = await fetchEvent("DELETE", eventSelected!);
      if (result.status === 204) {
        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
        SetEventSelected(null);
      }

      return result.status;
    };

    const MAX_ATTEMPTS = 10;
    const success = (code: number) => code === 204;

    eventDispatcher({
      type: "delete",
      payload: [eventSelected!],
    });

    //This try to fetch 10 times before refresh the web page

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      try {
        const status = await deleteResourceInAPI();
        if (success(status)) {
          break;
        }
      } catch (e) {}
      if (i === MAX_ATTEMPTS - 1) {
        // It migth happen
        alert("Something went wrong, unable to delete event");

        //First strategy, force to refresh the page

        window.location.reload();

        //Second strategy, clear the state and contine

        //        eventDispatcher({
        //          type: "appendarray",
        //          payload: [eventSelected!],
        //        });
        //        dispatchController({
        //          type: "setController",
        //          payload: { id: 0, client: "", job: "" },
        //        });
        //        dispatchControllerDates({
        //          type: "clearDates",
        //        });
        //        SetEventSelected(null);
      }
    }
  };

*/

  //    const dbState2: Array<event> = [];
  //    //const dbResponse: Array<event> = await result.text();

  //    //This is the way I have to replace the Id of an event, since the action "replacebyid" uses the id to change the other fields, I can't use it to replace the id itself
  //    eventDispatcher({
  //      type: "delete",
  //      payload: [newEvent],
  //    });
  //    eventDispatcher({
  //      type: "syncDB",
  //      payload: dbState2,
  //    });

  //

  //     if (start === fullDate && end === fullDate) {
  //       setEventController(null);
  //     }
};
