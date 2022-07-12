import React, { useEffect } from "react";
import { apifetch } from "../utils/Fetch";
import { event } from "../interfaces";
//import { useEventsReducer } from "../context/DispatchEvents";

//const hostinger = "https://samuelengineer.com";

//!TODO: This hook isn't used, it is dead code

interface UseFetchEvents {
  isMount: React.MutableRefObject<boolean>;
  click: number;
  action: string;
  event: event;
  debug: string;
}

export function useFetchEvents({
  isMount,
  click,
  action,
  debug,
  ...event
}: UseFetchEvents) {
  //  const { dispatch } = useEventsReducer();

  //save a reference of unmounted component
  useEffect(() => {
    return () => {
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isMount.current) {
      if (click === 1) {
        (async () => {
          await apifetch({
            action: action,
            ...event,
            debug: `useFetchEvents ${debug}`,
          }).then((res) => {
            if (!res) {
              return;
            }

            //dispatch({
            //  type: action,
            //  payload: res,
            //});
          });
        })();
      }
    } else {
      isMount.current = true;
    }
    // eslint-disable-next-line
  }, [isMount, click]);
}
