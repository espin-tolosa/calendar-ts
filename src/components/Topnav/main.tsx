import { DateService } from "@/utils/Date";
import { useToken } from "@/hooks/useToken";
import * as StyledTopnav from "./tw";
import { useCtxCurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { useCtxTopNavRef } from "@/globalStorage/topNavSize";
import { useEffect } from "react";
import { DOMRefs } from "@/globalStorage/DOMRefs";
import { useCleanSession } from "@/hooks/useCleanSession";

export const TOPNAV_ID = "Topnav";

export const Topnav = () => {
  const token = useToken();
  const user = token.user();
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();

  //Custom hook to clean session, gives a handler to set to true when session is to clean
  const setSessionIsToClean = useCleanSession();

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
          monthRef?.current?.scrollIntoView({ behavior: "smooth" })!;
        }}
      >
        {DateService.GetTodayDateFormat()}
      </StyledTopnav.TWtitle>
      {/*right-header*/}
      <StyledTopnav.TWlogout
        title={"Cleans up your session token | Ctrl+Alt+q"}
        onClick={(evt: Event) => {
          evt.stopPropagation();
          setSessionIsToClean(true);
        }}
      >
        {token.isValid() ? "Logout" : "Sign in"}
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
