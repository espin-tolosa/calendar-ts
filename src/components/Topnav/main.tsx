import { useSetLogged } from "@/hooks/useToken";
import * as StyledTopnav from "./tw";

export const Topnav = () => {
  const setSession = useSetLogged();
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
          setSession(false);
        }}
      >
        Logout
      </StyledTopnav.TWlogout>
    </StyledTopnav.TWcontainer>
  );
};
