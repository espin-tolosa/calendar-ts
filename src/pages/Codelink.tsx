import React, { useEffect, useState, useContext, useRef } from "react";
import tw from "tailwind-styled-components";
import { Event } from "@components/Event/main";
import * as tw_Event from "@components/Event/tw";
import * as tw_Day from "@components/Day/tw";
import * as tw_Month from "@components/Month/tw";
import * as tw_Topnav from "@components/Topnav/tw";
import * as tw_Layouts from "@/layouts/tw";
import * as tw_Controller from "@components/Controller/tw";
import { EventsCtx } from "@context/eventsarray";

interface EventProps {
  date: string;
}
const ThrowEventsArray: React.FC<EventProps> = ({ date }): JSX.Element => {
  const { events } = useContext(EventsCtx);

  return (
    <>
      {events
        .filter((e: string) => e.includes(date))
        .map((e: string) => (
          <Event key={e} job={e} />
        ))}
    </>
  );
};

interface eventType {
  id: number;
  client: string;
  start: number;
  job: string;
}

const events0 = [{ id: 0, start: 0, job: "" }];

const events1 = [
  { id: 1, client: "John", start: 1, job: "Starting 1 - 1" },
  { id: 2, client: "Cristine", start: 1, job: "Starting 1 - 1" },
  { id: 4, client: "Marcel", start: 2, job: "Starting 2 - 1" },
  { id: 3, client: "Bob", start: 11, job: "Starting 3 - 1" },
  { id: 4, client: "Cristine", start: 20, job: "Starting 4 - 1" },
];
const events2 = [
  { id: 3, client: "Xin", start: 7, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 7, job: "Starting 2 - 2" },
  { id: 5, client: "Cristine", start: 10, job: "Starting 3 - 2" },
  { id: 1, client: "Bob", start: 26, job: "Starting 4 - 2" },
];
const events_test = [
  { id: 1, client: "John", start: 6, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 6, job: "Starting 2 - 2" },
  { id: 3, client: "John", start: 6, job: "Starting 3 - 2" },
  { id: 4, client: "John", start: 6, job: "Starting 4 - 2" },
  { id: 5, client: "John", start: 6, job: "Starting 5 - 2" },
  { id: 6, client: "John", start: 6, job: "Starting 6 - 2" },
  { id: 7, client: "John", start: 6, job: "Starting 7 - 2" },

  { id: 7, client: "John", start: 6, job: "Starting 7 - 2" },
  { id: 6, client: "John", start: 6, job: "Starting 6 - 2" },
  { id: 5, client: "John", start: 6, job: "Starting 5 - 2" },
  { id: 4, client: "John", start: 6, job: "Starting 4 - 2" },
  { id: 3, client: "John", start: 6, job: "Starting 3 - 2" },
  { id: 2, client: "John", start: 6, job: "Starting 2 - 2" },
  { id: 1, client: "John", start: 6, job: "Starting 1 - 2" },

  { id: 1, client: "John", start: 22, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 22, job: "Starting 2 - 2" },
  { id: 3, client: "John", start: 22, job: "Starting 3 - 2" },
  { id: 4, client: "John", start: 22, job: "Starting 4 - 2" },
  { id: 5, client: "John", start: 22, job: "Starting 5 - 2" },
  { id: 6, client: "John", start: 22, job: "Starting 6 - 2" },
  { id: 7, client: "John", start: 22, job: "Starting 7 - 2" },

  { id: 7, client: "John", start: 22, job: "Starting 7 - 2" },
  { id: 6, client: "John", start: 22, job: "Starting 6 - 2" },
  { id: 5, client: "John", start: 22, job: "Starting 5 - 2" },
  { id: 4, client: "John", start: 22, job: "Starting 4 - 2" },
  { id: 3, client: "John", start: 22, job: "Starting 3 - 2" },
  { id: 2, client: "John", start: 22, job: "Starting 2 - 2" },
  { id: 1, client: "John", start: 22, job: "Starting 1 - 2" },
];

const Day = ({ day, events }: { day: number; events: Array<eventType> }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;
  /*
  const styles = {
    backgroundColor: "white"
  } as const;
style={styles} */

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //day-off
  let top = false;
  if (day <= 5 && day >= 3) {
    top = true;
  } else {
    top = false;
  }

  //TODO: Create a Context
  const giveMeColor = (client: string) => {
    const linearGradientTemplate = (color: number) => {
      return `linear-gradient(0.25turn, hsl(${color}, 40%, 40%), hsl(${color},50%,50%),  hsl(${color}, 60%, 60%))`;
    };

    const highContrastText = (bgColor: number) => {
      // hsl system colors are in range [0º, 360º]
      return "white";
    };

    if (client === "John") {
      return {
        background: linearGradientTemplate(10),
        color: highContrastText(10),
      };
    } else if (client === "Cristine") {
      return {
        background: linearGradientTemplate(20),
        color: highContrastText(20),
      };
    } else if (client === "Xin") {
      return {
        background: linearGradientTemplate(30),
        color: highContrastText(30),
      };
    } else {
      return {
        background: linearGradientTemplate(350),
        color: highContrastText(350),
      };
    }
  };

  return (
    <tw_Day.sizedContainer
      $top={top}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <tw_Day.header>
        <tw_Day.daySpot>{dayPadd}</tw_Day.daySpot>
      </tw_Day.header>

      {events
        .filter((evt) => evt.start === day)
        .map((evt) => {
          return (
            <>
              <tw_Event.flexContainer>
                <tw_Event.textContent
                  style={giveMeColor(evt.client)}
                  key={evt.id}
                  $cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("Event:", evt.job);
                  }}
                  title={`${evt.client}: ${evt.job} from: ${evt.start} to ${evt.start}`}
                >
                  {`${evt.client}: ${evt.job}`}
                </tw_Event.textContent>
                <tw_Event.extend
                  $cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("extend event:", evt.id);
                  }}
                  onMouseEnter={() => {
                    console.log("enter extend event");
                  }}
                  onMouseOut={() => {
                    console.log("leaving extend event");
                  }}
                  title={`Drag here to extend ${evt.client}\'s job`}
                >
                  {">"}
                </tw_Event.extend>
                <tw_Event.placeholder key={"p" + evt.id}>
                  {"-"}
                </tw_Event.placeholder>
              </tw_Event.flexContainer>
            </>
          );
        })}
    </tw_Day.sizedContainer>
  );
};

export default function App(): JSX.Element {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);
  const CreateEvent = () => {
    return (
      <tw_Controller.form
        action="post"
        onSubmit={(event) => {
          event.preventDefault();
          console.log("Hello");
        }}
      >
        <tw_Controller.button
          type="submit"
          value="Create"
          onClick={() => {
            document.documentElement.style.setProperty(
              "--calendar_width",
              "900px"
            );
          }}
        />
        <tw_Controller.button
          type="submit"
          value="Reduce"
          title="Testing to reduce calendar"
          onClick={() => {
            document.documentElement.style.setProperty(
              "--calendar_width",
              "740px"
            );
          }}
        />
        <tw_Controller.startEnd>
          <tw_Controller.date
            type="text"
            name="start"
            id="start"
            value="2021/01/01"
            placeholder="init date"
            title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
          />
          <tw_Controller.date
            type="text"
            name="end"
            id="end"
            value=""
            placeholder="end date"
            title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
          />
        </tw_Controller.startEnd>

        <tw_Controller.job
          type="text"
          name="job"
          id="job"
          value=""
          placeholder="Job"
        />
        <tw_Controller.description_wrap>
          <tw_Controller.description
            name="text"
            id="text"
            value=""
            placeholder="Extra notes..."
          ></tw_Controller.description>
        </tw_Controller.description_wrap>
      </tw_Controller.form>
    );
  };

  const Month = ({ events }: { events: Array<eventType> }) => {
    return (
      /* Month container: header | board */
      <tw_Month.flexColLayout>
        {/*month-header*/}
        <tw_Month.header>February 2022</tw_Month.header>
        {/*board container*/}
        <tw_Month.daysBoard>
          <tw_Month.dayShift $weekday={"sun"} />
          {days.map((day) => (
            <Day key={day.toString()} day={day} events={events} />
          ))}
        </tw_Month.daysBoard>
      </tw_Month.flexColLayout>
    );
  };

  const [toogleCreate, setToogleCreate] = useState(false);

  return (
    <>
      {/*App*/}
      <tw_Layouts.app>
        {/*header-layout*/}
        <tw_Layouts.header onClick={() => setToogleCreate((prev) => !prev)}>
          {/*header*/}
          <tw_Topnav.container>
            {/*left-header*/}
            <tw_Topnav.logo>JH Diary</tw_Topnav.logo>
            {/*center-header*/}{" "}
            <tw_Topnav.title>Friday, 21 January 2022</tw_Topnav.title>
            {/*right-header*/}
            <tw_Topnav.logout
              title={"Cleans up your session token | Ctrl+Alt+q"}
              onClick={(evt) => {
                evt.stopPropagation();
              }}
            >
              Logout
            </tw_Topnav.logout>
          </tw_Topnav.container>
        </tw_Layouts.header>

        {/*main-layout: layout-grid*/}
        <tw_Layouts.main $display={toogleCreate}>
          {/*controller-layout*/}
          <tw_Layouts.controller $display={toogleCreate}>
            {/* this sticky could be removed */}
            <CreateEvent />
          </tw_Layouts.controller>

          {/*calendar-layout*/}
          {/*calendar*/}
          <tw_Layouts.board>
            <Month events={events1} />
            <Month events={events2} />
            <Month events={events2} />
          </tw_Layouts.board>
        </tw_Layouts.main>
      </tw_Layouts.app>
    </>
  );
}
