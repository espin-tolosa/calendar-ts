import { useEffect } from "react";
import { apifetch } from "@utils/Fetch";
import { event } from "@/interfaces";
//import { useEventsReducer } from "../context/DispatchEvents";

//const hostinger = "https://samuelengineer.com";

interface UseFetchEvents {
  isMount: any;
  click: any;
  action: any;
  event: event;
}

export function useFetchEvents({
  isMount,
  click,
  action,
  ...event
}: UseFetchEvents) {
  console.log("USE FETCH EVENTS", { click, action, ...event });
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
          }).then((res: any) => {
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