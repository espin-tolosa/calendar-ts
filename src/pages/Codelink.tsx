import { useState } from "react";
import * as tw_Layouts from "@/layouts/tw";
import { Container, Logo, Title, Logout } from "@components/Topnav/tw";
//import { CreateEvent } from "@components/Controller/main";
//import { EventsCtx } from "@context/eventsarray";
//import { BoardLayout } from "@layouts/Board";
//import { ControllerLayout } from "@layouts/Controller";
import { MainLayout } from "@/layouts/LayoutMain";
import { HeaderLayout } from "@/layouts/LayoutHeader";

export default function App(): JSX.Element {
  const [displayController, setDisplayController] = useState(false);

  return (
    <>
      {/*App*/}
      <tw_Layouts.app>
        {/*header-layout*/}

        <tw_Layouts.header
          onClick={() => setDisplayController((prev) => !prev)}
        >
          {/*header*/}
          <Container>
            {/*left-header*/}
            <Logo>JH Diary</Logo>
            {/*center-header*/} <Title>Friday, 21 January 2022</Title>
            {/*right-header*/}
            <Logout
              title={"Cleans up your session token | Ctrl+Alt+q"}
              onClick={(evt) => {
                evt.stopPropagation();
              }}
            >
              Logout
            </Logout>
          </Container>
        </tw_Layouts.header>

        {/*main-layout: layout-grid*/}
        <MainLayout display={displayController} />
      </tw_Layouts.app>
    </>
  );
}
