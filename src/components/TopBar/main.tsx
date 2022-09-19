import { Link, Route } from "wouter";
import { DateService } from "../../utils/Date";
import * as tw_Layouts from "../../layouts/tw"
import * as StyledTopnav from "./tw";
import { useCtxCurrentMonthRef } from "../../context/currentMonthReference";
import { useCtxTopNavRef } from "../../context/topNavSize";
import { useCleanSession } from "../../hooks/useCleanSession";

export const TOPNAV_ID = "Topnav";

export function TopBar({user}:{user:string})
{
  const topNavRef = useCtxTopNavRef();

  //Custom hook to clean session, gives a handler to set to true when session is to clean
  const cleanSession = useCleanSession();

  const monthRef = useCtxCurrentMonthRef();


  return (
  <tw_Layouts.TWheader>


    <StyledTopnav.TWcontainer id={TOPNAV_ID} ref={topNavRef}>
      {/*left-header*/}
      <StyledTopnav.TWlogo>{`JH Diary | user: ${user.toUpperCase()}`}</StyledTopnav.TWlogo>
      {/*center-header*/}{" "}
      <StyledTopnav.TWtitle
        onClick={() => {

            if (monthRef?.current == undefined) {return;}

            monthRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {DateService.GetTodayDateFormat()}
      </StyledTopnav.TWtitle>
      <div>
        {/*right-header*/}

        <BackofficeButton />
        <StyledTopnav.TWlogout
          title={"Cleans up your session token | Ctrl+Alt+q"}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href ="http://localhost:8000/logout";
          }}
        >
          Logout
        </StyledTopnav.TWlogout>
      </div>
    </StyledTopnav.TWcontainer>
  </tw_Layouts.TWheader>
  );
}

function BackofficeButton() {
  return (
    <>
      <Route path="/">
        <Link href="/settings">
          <StyledTopnav.TWlogout title={"Control panel to edit clients data"}>
            Settings
          </StyledTopnav.TWlogout>
        </Link>
      </Route>
      <Route path="/settings">
        <Link href="/">
          <StyledTopnav.TWlogout title={"Go back to calendar board"}>
            Calendar
          </StyledTopnav.TWlogout>
        </Link>
      </Route>
    </>
  );
}
