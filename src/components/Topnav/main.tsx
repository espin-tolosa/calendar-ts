import { useUserSession } from "@/hooks/useUserSession";
import { DateService } from "@/utils/Date";
import { scrollToDay } from "@/utils/scrollToDay";
import { useToken } from "@/hooks/useToken";
import * as StyledTopnav from "./tw";
import { useSetEventSelected } from "../Controller/main";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useControllerDispatch } from "@/hooks/useController";
import { useCtxCurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { useCtxTopNavRef } from "@/globalStorage/topNavSize";
import { useEffect } from "react";
import { DOMRefs } from "@/globalStorage/DOMRefs";

export const TOPNAV_ID = "Topnav";

export const Topnav = () => {
  const setSession = useUserSession();
  const { usr } = useToken();
  const setEventController = useSetEventSelected();
  const topNavRef = useCtxTopNavRef();
  const dispatchDOMRef = DOMRefs.useDispatch();

  /*  parallel change consume date context */
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  const monthRef = useCtxCurrentMonthRef();

  useEffect(() => {
    dispatchDOMRef({ type: "update", payload: topNavRef });
  }, []);

  return (
    <StyledTopnav.TWcontainer id={TOPNAV_ID} ref={topNavRef}>
      {/*left-header*/}
      <StyledTopnav.TWlogo>{`JH Diary | user: ${usr}`}</StyledTopnav.TWlogo>
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
          setSession.clearLoginSession();
          setEventController(null);

          dispatchController({
            type: "setController",
            payload: { id: 0, client: "", job: "" },
          });
          dispatchControllerDates({
            type: "clearDates",
          });
        }}
      >
        Logout
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
