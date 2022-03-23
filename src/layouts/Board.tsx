import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { ListPrevDates } from "@/utils/Date";
import { useEffect } from "react";

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

  //Fetch event after login
  useEffect(() => {
    setIsFetching(true);
    const start = `${prevDates[0].year}-${prevDates[0].month}-01`;
    const result = fetchEvent("GET_FROM", { ...CustomValues.nullEvent, start });
    result
      .then((res) => res.json())
      .then((json: Array<event>) =>
        json.forEach((event: event) => {
          eventsDispatcher({
            type: "appendarray",
            payload: [
              {
                id: event.id,
                client: event.client,
                job: event.job,
                start: event.start,
                end: event.end,
              },
            ],
          });
          setIsFetching(false);
        })
      )
      .catch((e) => {
        console.error("Possible invalid token", e);

        let text = "Your credentials has expired, logout?";
        if (window.confirm(text) == true) {
          setSessionIsToClean(true);
        }
      });
  }, []);

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
