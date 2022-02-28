import { useUserSession } from "@/hooks/useUserSession";
import { DateService } from "@/utils/Date";
import { scrollToDay } from "@/utils/scrollToDay";
import * as StyledTopnav from "./tw";

export const TOPNAV_ID = "Topnav";

export const Topnav = () => {
  const setSession = useUserSession();

  return (
    <StyledTopnav.TWcontainer id={TOPNAV_ID}>
      {/*left-header*/}
      <StyledTopnav.TWlogo>JH Diary</StyledTopnav.TWlogo>
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
        }}
      >
        Logout
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
