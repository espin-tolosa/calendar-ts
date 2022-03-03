import { useUserSession } from "@/hooks/useUserSession";
import { DateService } from "@/utils/Date";
import { scrollToDay } from "@/utils/scrollToDay";
import { useToken } from "@/hooks/useToken";
import * as StyledTopnav from "./tw";
import { useSetEventSelected } from "../Controller/main";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useControllerDispatch } from "@/hooks/useController";

export const TOPNAV_ID = "Topnav";

export const Topnav = () => {
  const setSession = useUserSession();
  const { usr } = useToken();
  const setEventController = useSetEventSelected();

  /*  parallel change consume date context */
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();

  return (
    <StyledTopnav.TWcontainer id={TOPNAV_ID}>
      {/*left-header*/}
      <StyledTopnav.TWlogo>{`JH Diary | user: ${usr}`}</StyledTopnav.TWlogo>
      {/*center-header*/}{" "}
      <StyledTopnav.TWtitle
        onClick={() => {
          const dt = DateService.GetDate();
          const [year, month] = DateService.FormatDate(dt).split("-");
          const date = `${year}-${month}-01`;
          scrollToDay(date);
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
