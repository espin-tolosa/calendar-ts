import { useUserSession } from "@/hooks/useUserSession";
import * as StyledTopnav from "./tw";

export const Topnav = () => {
  const setSession = useUserSession();
  return (
    <StyledTopnav.TWcontainer>
      {/*left-header*/}
      <StyledTopnav.TWlogo>JH Diary</StyledTopnav.TWlogo>
      {/*center-header*/}{" "}
      <StyledTopnav.TWtitle>Friday, 21 January 2022</StyledTopnav.TWtitle>
      {/*right-header*/}
      <StyledTopnav.TWlogout
        title={"Cleans up your session token | Ctrl+Alt+q"}
        onClick={(evt) => {
          evt.stopPropagation();
          setSession.dispatch(false);
        }}
      >
        Logout
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
