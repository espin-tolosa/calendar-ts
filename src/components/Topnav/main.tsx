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
  const user = token.data.usr || "not logged";
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();

  //Custom hook to clean session, gives a handler to set to true when session is to clean
  const setSessionIsToClean = useCleanSession();
  /*  parallel change consume date context */

  const monthRef = useCtxCurrentMonthRef();

  useEffect(() => {
    dispatchDOMRef({ type: "update", payload: topNavRef });
  }, []);

  //If useToken returns a nullToken user the component clears session in the same way of the logout button
  useEffect(() => {
    if (!token.exp || !token.data.usr) {
      window.alert("Expired Credentials");
      //TODO: clean session should clean eventSelected in controller an other temporary values
      setSessionIsToClean(true);
    }
  }, [token]);

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
        onClick={(evt) => {
          evt.stopPropagation();
          setSessionIsToClean(true);
        }}
      >
        Logout
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
