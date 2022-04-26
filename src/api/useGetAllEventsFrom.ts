import { CustomTypes, nullEvent } from "@/customTypes";
import { fetchEvent } from "@/utils/fetchEvent";
import { zeroPadd } from "@/utils/zeroPadd";
import { useEffect } from "react";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { useEventDispatch } from "../hooks/useEventsState";
import { useCleanSession } from "@/hooks/useCleanSession";

export const useGetAllEventsFrom = ({ year, month }: CustomTypes.Month) => {
  const fromYear = year;
  const fromMonth = zeroPadd(month);
  const pushDatesDispatcher = usePushedDaysDispatcher();
  const setSessionIsToClean = useCleanSession();

  const eventsDispatcher = useEventDispatch();

  useEffect(() => {
    //The response from database is not the same if I send a query with only year-month
    //my local version of MySQL responds in the same way, but the version of freehostia gives an empty array with success code 201
    const start = `${fromYear}-${fromMonth}-01`;
    (async () => {
      const eventDate = { ...nullEvent(), start, end: start };
      const response = await fetchEvent("GET_FROM", eventDate);
      try {
        const state = await response.json();
        eventsDispatcher({
          type: "syncDB",
          payload: state,
          callback: pushDatesDispatcher,
        });
      } catch {
        setTimeout(() => {
          window.alert("Session is expired");

          setSessionIsToClean(true);
        }, 1000);
      }
    })();
  }, []);
};
