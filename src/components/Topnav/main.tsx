import { useUserSession } from "@/hooks/useUserSession";
import { DateService } from "@/utils/Date";
import * as StyledTopnav from "./tw";

export const Topnav = () => {
  const setSession = useUserSession();
  const today = DateService.GetDate();
  return (
    <StyledTopnav.TWcontainer>
      {/*left-header*/}
      <StyledTopnav.TWlogo>JH Diary</StyledTopnav.TWlogo>
      {/*center-header*/}{" "}
      <StyledTopnav.TWtitle>{new Date().toDateString()} </StyledTopnav.TWtitle>
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
