import { memo, useEffect } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { zeroPadd } from "@/utils/zeroPadd";
import { DateService } from "@/utils/Date";
import { DateCalendar } from "@/entities/date";
import { composition, event } from "@/interfaces";
import { EventsDispatcher, useEventDispatch } from "@/hooks/useEventsApi";
import { api } from "@/static/apiRoutes";

type iMonth = {
  id: string;
  year: number;
  month: number;
};
const Month = ({ id, year, month }: iMonth) => {
  const date = useMonthDate(year, month);
  const eventsDispatcher = useEventDispatch();

  useEffect(() => {
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
          console.log("dispatch", {
            id: event.id,
            client: event.client,
            job: event.job,
            start: event.start.split(" ")[0],
            end: event.end.split(" ")[0],
          });
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
        })
      );
  }, []);

  console.info(date.daysList);
  console.log("Start month", date.start);
  const DayStart = DateService.GetDayNumberOfDay(date.start);
  console.log("Day list length", DayStart + date.daysList.length);
  const diff = 5 * 7 - DayStart - date.daysList.length + 1;
  console.log("Diff", diff);
  const restOfDays = Array.from({ length: diff }, (_, i) => -i - 1);
  restOfDays.forEach((r) => date.daysList.push(r));

  console.log("daylist", date.daysList);

  //date.daysList.push(1);
  //date.daysList.push(2);
  //date.daysList.push(3);
  //date.daysList.push(4);
  //date.daysList.push(5);
  //date.daysList.push(6);
  //date.daysList.push(7);

  return (
    <StyledMonth.TWflexColLayout className="relative">
      <div className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={date.start} />

        {date.daysList.map((day) => {
          if (day > 0) {
            return (
              <MemoIDay
                key={DateService.ComposeDate(year, month, day)}
                daynumber={day}
                fullDate={DateService.ComposeDate(year, month, day)}
                restDays={false}
              >
                <EventsThrower
                  day={DateService.ComposeDate(year, month, day)}
                />
              </MemoIDay>
            );
          } else {
            return (
              <MemoIDay
                key={"r" + DateService.ComposeDate(year, month + 1, -day)}
                daynumber={-day}
                fullDate={DateService.ComposeDate(year, (month + 1) % 12, -day)}
                restDays={true}
              ></MemoIDay>
            );
          }
        })}
      </StyledMonth.TWdaysBoard>
      <div
        id={id}
        className="absolute w-0 h-0 bg-transparent bottom-8 customtp:bottom-6 custombp:bottom-6 z-TopLayer "
      ></div>
    </StyledMonth.TWflexColLayout>
    /* Month container: header | board */
  );
};

export const MemoMonth = memo(Month);
//console.warn("Memo month");
//console.log("prevProps", prevProps);
//console.log("nextProps", nextProps);
//return false;
//});

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
