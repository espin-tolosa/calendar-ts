import React, { useState, useContext } from "react";
import { Day } from "@components/Day/main";
import { CreateEvent } from "@/components/Controller/main";
import * as tw_Day from "@components/Day/tw";
import * as tw_Month from "@components/Month/tw";
import * as tw_Topnav from "@components/Topnav/tw";
import * as tw_Layouts from "@/layouts/tw";
import * as tw_Controller from "@components/Controller/tw";
import { EventsCtx } from "@context/eventsarray";
import { giveMeColor } from "@/utils/giveMeColor";
import * as initEvent from "@/static/initEvents";
import { event } from "@interfaces/index";

interface EventProps {
  date: string;
}

/*
const ThrowEventsArray: React.FC<EventProps> = ({ date }): JSX.Element => {
  const { events } = useContext(EventsCtx);

  return (
    <>
      {events
        .filter((event) => event.start.includes(date))
        .map((event) => (
          <Event {...e}></Event>
        ))}
    </>
  );
};
*/
export default function App(): JSX.Element {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);

  const Month = ({ events }: { events: Array<event> }) => {
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
            <Month events={initEvent.month1} />
            <Month events={initEvent.month2} />
            <Month events={initEvent.month1} />
          </tw_Layouts.board>
        </tw_Layouts.main>
      </tw_Layouts.app>
    </>
  );
}
