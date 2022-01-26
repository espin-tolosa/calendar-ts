import { useState } from "react";
import { Month } from "@components/Month/main";
import { CreateEvent } from "@/components/Controller/main";
import * as tw_Topnav from "@components/Topnav/tw";
import * as tw_Layouts from "@/layouts/tw";
import { EventsCtx } from "@context/eventsarray";
import * as initEvent from "@/static/initEvents";

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
