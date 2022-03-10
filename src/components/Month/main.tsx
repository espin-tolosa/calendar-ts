import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import { MemoIDayHolder } from "@components/DayHolder/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { DateService } from "@/utils/Date";
import { event } from "@/interfaces";
import { useEventDispatch } from "@/hooks/useEventsState";

import { api } from "@/static/apiRoutes";
import { zeroPadd } from "@/utils/zeroPadd";
import { useControllerStateDates } from "@/hooks/useControllerDate";
import { useDayLock } from "@/hooks/useDayLock";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
import { useIsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { useCtxCurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { isToday } from "@/utils/Date_v2";
import { TopNavRef, useCtxTopNavRef } from "@/globalStorage/topNavSize";
import { start } from "repl";
import { DOMRefs } from "@/globalStorage/DOMRefs";
import { useOnce } from "@/hooks/useOnce";

type iMonth = {
  year: number;
  month: number;
};
const Month = ({ year, month }: iMonth) => {
  const date = useMonthDate(year, month);
  const eventsDispatcher = useEventDispatch();
  const monthRef = useCtxCurrentMonthRef();
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();
  const { isFetching } = useIsFetchingEvents();

  const [topNavHeight, setTopNavHeight] = useState({ top: "" });
  useLayoutEffect(() => {
    if (!isToday(year, month)) {
      return;
    }
    const height = topNavRef?.current?.clientHeight!;
    const border = 3; /*px*/
    const style = { top: `-${height + border}px` };
    setTopNavHeight(style);
    window.scrollTo(0, 0);
  }, []);

  //TODO:Give a name to this custom hook
  useEffect(() => {
    if (!isToday(year, month)) {
      return;
    }
    //   //
    const isAnchorReady = topNavHeight.top !== "";

    if (isAnchorReady) {
      dispatchDOMRef({ type: "update", payload: monthRef });

      monthRef?.current?.scrollIntoView()!;
    }

    //   //
    //   //
    //   //monthRef?.current?.scrollIntoView()!;
  }, [topNavHeight]); //TODO: use ref state context as it was created to access TopNav Ref after it is rendered

  //Context processing to pass to Day component
  //1. start,end dates
  const controllerDates = useControllerStateDates();

  //2. locked days
  const lockedDays = useDayLock();

  //3. user preferences
  const { showWeekends } = useLocalUserPreferencesContext().localState;

  //
  const { setIsFetching } = useIsFetchingEvents();

  useEffect(() => {
    setIsFetching(true);
    const result = fetchEvent("GET_FROM", {
      id: 0,
      client: "",
      job: "",
      start: `${year}-${month}-01`,
      end: "",
    });
    result
      .then((res: any) => res.json())
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
          console.log("is fetching to false from:", isFetching);
          setIsFetching(false);
        })
      );
  }, []);
  const totalCellsInLastRow = (start: string, length: number) => {
    const DayStart = DateService.GetDayNumberOfDay(start);
    let startRows = 4; //it's the minimun ever when feb starts on monday 28days/7cols = 4rows
    let diff = startRows * 7 - DayStart - length + 1;
    while (diff <= 0 && diff !== -7) {
      diff = 7 * ++startRows - DayStart - length + 1;
    }
    const restOfDays = Array.from({ length: diff }, (_, i) => i + 1);

    const leftOfDays = Array.from({ length: DayStart - 1 }, (_, i) => i + 1);

    return [leftOfDays, restOfDays];
  };

  const [left, rest] = totalCellsInLastRow(date.start, date.daysList.length);

  console.log(`Month ${year}-${month}`, isToday(year, month));

  return (
    <StyledMonth.TWflexColLayout className="relative">
      <div className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader id={`month-${date.year}-${zeroPadd(date.month)}`}>
        {date.dateFormat}
      </StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={"mon"} />

        {left //previous days
          .map((day) => <MemoIDayHolder key={"l" + day}></MemoIDayHolder>)
          .concat(
            date.daysList.map((day) => (
              <MemoIDay
                key={DateService.ComposeDate(year, month, day)}
                daynumber={day}
                fullDate={DateService.ComposeDate(year, month, day)}
                restDays={false}
                start={controllerDates.start}
                end={controllerDates.end}
                isLocked={
                  lockedDays.find(
                    (lock) => lock === DateService.ComposeDate(year, month, day)
                  ) === DateService.ComposeDate(year, month, day)
                }
                isWeekend={
                  (!showWeekends &&
                    DateService.GetMonthDayKey(
                      new Date(DateService.ComposeDate(year, month, day))
                    ) === "Sunday") ||
                  (!showWeekends &&
                    DateService.GetMonthDayKey(
                      new Date(DateService.ComposeDate(year, month, day))
                    ) === "Saturday")
                }
              >
                {true ? (
                  <EventsThrower
                    day={DateService.ComposeDate(year, month, day)}
                  />
                ) : (
                  <></>
                )}
              </MemoIDay>
            ))
          )
          .concat(
            //rest days
            rest.map((day) => <MemoIDayHolder key={"r" + day}></MemoIDayHolder>)
          )}
      </StyledMonth.TWdaysBoard>
      {isToday(year, month) && (
        <div
          id={"Current-Month"}
          ref={monthRef}
          style={topNavHeight}
          className="absolute"
        ></div>
      )}
    </StyledMonth.TWflexColLayout>
    /* Month container: header | board */
  );
};

export const MemoMonth = memo(Month);

async function fetchEvent(
  action: string,
  event: event = { id: 0, client: "", job: "", start: "", end: "" }
) {
  const data = new FormData();
  const dataJSON = JSON.stringify({ action, ...event }); //! event should be passed as plain object to the api
  data.append("json", dataJSON);
  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  });
}
