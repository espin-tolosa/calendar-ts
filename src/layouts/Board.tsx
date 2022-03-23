import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { ListPrevDates } from "@/utils/Date";
import { useEffect, useState } from "react";

import { event } from "@/interfaces";
import { isToday, _renderDate } from "@/utils/Date_v2";
import { fetchEvent } from "@/utils/fetchEvent";
import { useIsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { useEventDispatch } from "@/hooks/useEventsState";
import { useCleanSession } from "@/hooks/useCleanSession";
import { CustomValues } from "@/customTypes";

export const LayoutBoard = () => {
  const nextDates = useBoardScroll({ initialLength: 1 });
  const prevDates = ListPrevDates(nextDates[0], 2);

  const { setIsFetching } = useIsFetchingEvents();
  const eventsDispatcher = useEventDispatch();
  const setSessionIsToClean = useCleanSession();

  useEffect(() => {
    setIsFetching(true);
    const start = `${prevDates[0].year}-${prevDates[0].month}-01`;

    (async () => {
      console.log("board");
      const fromEvent = { ...CustomValues.nullEvent, start };
      const result = await fetchEvent("GET_FROM", fromEvent);
      const dbState: Array<event> = await result.json();
      eventsDispatcher({
        type: "appendarray",
        payload: [...dbState],
      });
      setIsFetching(false);

      //      result
      //        .then((json: Array<event>) =>
      //          json.forEach((event: event) => {
      //            eventsDispatcher({
      //              type: "appendarray",
      //              payload: [
      //                {
      //                  ...event,
      //                },
      //              ],
      //            });
      //            setIsFetching(false);
      //          })
      //        )
      //        .catch((e) => {
      //          console.error("Possible invalid token", e);
      //
      //          let text = "Your credentials has expired, logout?";
      //          if (window.confirm(text) == true) {
      //            setSessionIsToClean(true);
      //          }
      //        });
    })();
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
      type: "deletebyid",
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
  }, []);

  //Fetch event after login

  return (
    <TWboard id={"Board"}>
      <MemoMonth {...prevDates[1]} />
      <MemoMonth {...prevDates[0]} />
      {nextDates.map((value) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
