import { DateService } from "@/utils/Date";
import * as StyledTopnav from "./tw";
import { useCtxCurrentMonthRef } from "@/context/currentMonthReference";
import { useCtxTopNavRef } from "@/context/topNavSize";
import { useEffect } from "react";
import { DOMRefs } from "@/context/DOMRefs";
import { useCleanSession } from "@/hooks/useCleanSession";
import { useUserSession } from "@/hooks/useUserSession";

export const TOPNAV_ID = "Topnav";

export const Topnav = () => {
  const token = useUserSession();
  const user = token.data().usr;
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();

  //Custom hook to clean session, gives a handler to set to true when session is to clean
  const cleanSession = useCleanSession();

  const monthRef = useCtxCurrentMonthRef();

  useEffect(() => {
    dispatchDOMRef({ type: "update", payload: topNavRef });
  }, []);

  return (
    <StyledTopnav.TWcontainer id={TOPNAV_ID} ref={topNavRef}>
      {/*left-header*/}
      <StyledTopnav.TWlogo>{`JH Diary | user: ${user}`}</StyledTopnav.TWlogo>
      {/*center-header*/}{" "}
      <StyledTopnav.TWtitle
        onClick={() => {
          if (monthRef?.current == undefined) {
            return;
          }
          monthRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {DateService.GetTodayDateFormat()}
      </StyledTopnav.TWtitle>
      {/*right-header*/}
      <StyledTopnav.TWlogout
        title={"Cleans up your session token | Ctrl+Alt+q"}
        onClick={(evt) => {
          evt.stopPropagation();
          //cleanSession();
          //!Developing
          const development = () => {
            window.document.documentElement.requestFullscreen();
          };

          import.meta.env.MODE === "development"
            ? development()
            : cleanSession();
        }}
      >
        {token.isValid() ? "Logout" : "Sign in"}
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
