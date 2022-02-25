import { memo, useEffect } from "react";
import { useMonthDate } from "@/hooks/useMonthDate";
import { MemoIDay } from "@components/Day/main";
import { IDayHolder } from "@components/DayHolder/main";
import * as StyledMonth from "./tw";
import { EventsThrower } from "../EventsThrower/main";
import { DateService } from "@/utils/Date";
import { event } from "@/interfaces";
import { useEventDispatch } from "@/hooks/useEventsApi";

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
  const totalCellsInLastRow = (start: string, length: number) => {
    const DayStart = DateService.GetDayNumberOfDay(start);
    let startRows = 4; //it's the minimun ever when feb starts on monday 28days/7cols = 4rows
    let diff = startRows * 7 - DayStart - length + 1;
    console.info(`Diff for: ${year}-${month}`, diff);
    while (diff <= 0 && diff !== -7) {
      diff = 7 * ++startRows - DayStart - length + 1;
    }
    const restOfDays = Array.from({ length: diff }, (_, i) => i + 1);

    const leftOfDays = Array.from({ length: DayStart - 1 }, (_, i) => i + 1);

    return [leftOfDays, restOfDays];
  };

  const [left, rest] = totalCellsInLastRow(date.start, date.daysList.length);

  return (
    <StyledMonth.TWflexColLayout className="relative">
      <div className="text-transparent h-0"></div>
      {/*month-header*/}
      <StyledMonth.TWheader>{date.dateFormat}</StyledMonth.TWheader>

      {/*board container*/}
      <StyledMonth.TWdaysBoard>
        <StyledMonth.TWdayShift $weekday={"mon"} />

        {left //previous days
          .map((day) => <IDayHolder key={"l" + day}></IDayHolder>)
          .concat(
            date.daysList.map((day) => (
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
            ))
          )
          .concat(
            //rest days
            rest.map((day) => <IDayHolder key={"r" + day}></IDayHolder>)
          )}
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
