import { useState, useContext } from "react";
import "@/App.css";
//import { Styles_Headers_Day } from "@styles/Styled_Day";
import { WeekDay } from "./styles/Styled_Day";
import { Styles_Bodies_Day } from "@styles/Styled_Day";
import { Styles_Bodies_DayEnd } from "@styles/Bodies/Day";
//import { Styles_Bodies_Day } from "@styles/Bodies/Day";
import { Styles_Headers_Month } from "@styles/Headers/Month";
import { Styles_Headers_Board_Row } from "@styles/Headers/Board";

import { Event } from "@components/Event";
import { Day } from "@components/Day";
import { DayMove } from "@components/Day-move";
import { Board } from "@components/Form";
import { Styles_Bodies_Event } from "@styles/Bodies/Events";

//import { FormDataContext } from "@context/formdata";
import { CtxProvider } from "@context/formdata";
import { CtxEventProvider } from "@context/eventsarray";
import { EventsCtx } from "@context/eventsarray";

const initState = {
  client: "",
  job: "",
  start: "",
  end: "",
  update: () => {
    console.log("update not set jet");
  },
};

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function App() {
  //const []

  //issue: App-daylist-1428
  const dayList = [
    -28, -29, -30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, -1, -2, -3, -4, -5, -6,
  ];
  const dayListRow0 = dayList.slice(0, 0 + 7);
  const dayListRow1 = dayList.slice(7, 7 + 7);
  const dayListRow2 = dayList.slice(7 + 7, 7 + 7 + 7);
  const dayListRow3 = dayList.slice(7 + 7 + 7, 7 + 7 + 7 + 7);
  const dayListRow4 = dayList.slice(7 + 7 + 7 + 7, 7 + 7 + 7 + 7 + 7);
  return (
    <>
      <CtxProvider>
        <CtxEventProvider>
          <div className="App">
            <Board />
            <div className="bg-lime-800 md:py-8 px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
              <Styles_Headers_Month>March 2021</Styles_Headers_Month>
              <div className="inline-flex flex-col space-y-1 items-start justify-start h-full w-full">
                <div className="flex pt-6 pb-6  bg-lime-100 space-x-28 items-start justify-center h-full w-full">
                  {dayNames.map((day) => (
                    <WeekDay day={day} />
                  ))}
                </div>
                <div className="flex flex-col items-start justify-start">
                  {/* row 0 */}
                  <Styles_Headers_Board_Row>
                    {dayListRow0.map((day) => {
                      return day < 0 ? (
                        <Styles_Bodies_DayEnd
                          key={day}
                          date={String(Math.abs(day))}
                        >
                          {""}
                        </Styles_Bodies_DayEnd>
                      ) : (
                        <Day key={day} date={String(day)}>
                          <ThrowEventsArray date={String(day)} />
                        </Day>
                      );
                    })}
                  </Styles_Headers_Board_Row>
                  {/* row 1 */}
                  <Styles_Headers_Board_Row>
                    {dayListRow1.map((day) => (
                      <DayMove key={day} date={String(day)}>
                        <ThrowEventsArray date={String(day)} />
                      </DayMove>
                    ))}
                  </Styles_Headers_Board_Row>
                  {/* row 2 */}
                  <Styles_Headers_Board_Row>
                    {dayListRow2.map((day) => (
                      <Day key={day} date={String(day)}>
                        <ThrowEventsArray date={String(day)} />
                      </Day>
                    ))}
                  </Styles_Headers_Board_Row>
                  {/* row 3 */}
                  <Styles_Headers_Board_Row>
                    {dayListRow3.map((day) => (
                      <Day key={day} date={String(day)}>
                        <ThrowEventsArray date={String(day)} />
                      </Day>
                    ))}
                  </Styles_Headers_Board_Row>
                  {/* row 4 */}
                  <Styles_Headers_Board_Row>
                    {dayListRow4.map((day) => {
                      return day < 0 ? (
                        <Styles_Bodies_DayEnd
                          key={day}
                          date={String(Math.abs(day))}
                        >
                          {""}
                        </Styles_Bodies_DayEnd>
                      ) : (
                        <Day key={day} date={String(day)}>
                          <ThrowEventsArray date={String(day)} />
                        </Day>
                      );
                    })}
                  </Styles_Headers_Board_Row>
                </div>
              </div>
            </div>
          </div>
        </CtxEventProvider>
      </CtxProvider>
    </>
  );
}

interface EventProps {
  date: string;
}
// Strategy: day looks for events
// The strategy to add events to a day is, each day is looking for events that contains its date as a part of the data
// This method is good if there is only a few months displayed, or in other words less than houndres of days filtering the Events array
const ThrowEventsArray: React.FC<EventProps> = ({ date }): JSX.Element => {
  const { events } = useContext(EventsCtx);

  console.log("Filtering for day:", date);

  return (
    <>
      {events
        .filter((e) => e.includes(date))
        .map((e) => (
          <Event key={e} job={e} />
        ))}
    </>
  );
};
const ThrowEventsArray_old: React.FC<EventProps> = ({ date }): JSX.Element => {
  const events = ["event1", "event2", "event3", "event4", "event5", "event10"];
  return (
    <>
      {events.map((e) => {
        return e.includes(date) ? <Event key={e} job={e} /> : <div />;
      })}
    </>
  );
};
export default App;
