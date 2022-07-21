import { nullEvent } from "../interfaces";
import { fetchEvent } from "../utils/fetchEvent";
import { zeroPadd } from "../utils/zeroPadd";
import { useEffect } from "react";
import { useEventDispatch } from "../hooks/useEventsState";
import { useCleanSession } from "../hooks/useCleanSession";

export const useGetAllEventsFrom = ({ year, month }: jh.date.monthData) => {
  const start = `${year}-${zeroPadd(month)}-01`;
  const cleanSession = useCleanSession();

  const eventsDispatcher = useEventDispatch();

  //TODO: study the possibility to stabilize this callback, check forward deps
  const hFetchAll = () => {
    //The response from database is not the same if I send a query with only year-month
    //my local version of MySQL responds in the same way, but the version of freehostia gives an empty array with success code 201
    (async () => {
      const eventDate = { ...nullEvent(), start, end: start };
      const response = await fetchEvent("GET_FROM", eventDate);
      try {
        const state = await response.json();
        eventsDispatcher({
          type: "syncDB",
          payload: state,
        });
      } catch {
        setTimeout(() => {
          window.alert("Session expired");

          cleanSession();
        }, 1000);
      }
    })();
  };

  //TODO: wrap fetch events into a time interval to refetch in case of failure of connection
  useEffect(() => {
    hFetchAll();
  }, []);

  return hFetchAll;
};
