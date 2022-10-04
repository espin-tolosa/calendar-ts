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
    //const cleanSession = useCleanSession();

    const monthRef = useCtxCurrentMonthRef();

    return (

        <tw_Layouts.TWheader>
            <StyledTopnav.TWcontainer id={TOPNAV_ID} ref={topNavRef}>
                {/*left-header*/}
                <StyledTopnav.TWlogo>{`JH Diary | ${user.toLocaleUpperCase()}`}</StyledTopnav.TWlogo>
                {/*center-header*/}{" "}
                <StyledTopnav.TWtitle onClick={() => {
                    if (monthRef?.current == undefined) {return;}
                        monthRef?.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    {DateService.GetTodayDateFormat()}
                </StyledTopnav.TWtitle>
                <div>
                {/*right-header*/}
                    <StyledTopnav.TWlogout title={"Cleans up your session token | Ctrl+Alt+q"}
                        onClick={(e) => {e.stopPropagation(); window.location.href ="/logout";}}
                    >
                        Logout
                    </StyledTopnav.TWlogout>
                </div>
            </StyledTopnav.TWcontainer>
        </tw_Layouts.TWheader>
  );
}