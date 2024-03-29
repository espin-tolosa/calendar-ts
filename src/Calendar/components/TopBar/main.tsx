import { Link, Route, useLocation } from "wouter";
import { DateService } from "../../utils/Date";
import * as tw_Layouts from "../../layouts/tw"
import * as StyledTopnav from "./tw";
import { useCtxCurrentMonthRef } from "../../context/currentMonthReference";
import { useCtxTopNavRef } from "../../context/topNavSize";
import { useCleanSession } from "../../hooks/useCleanSession";
import { useAuthLevel } from "@/Spa/context/authLevel";

export const TOPNAV_ID = "Topnav";

function RouteNavigator(location:string)
{
    const [_empty, route, name] = location.split("/");

    const routerMap : {[key:string]: [string, string, string]} = {
        "settings": ["Settings", "Board", `/board/${name}`],
        "board": ["Board", "Settings", `/settings/${name}`]
    }

    return routerMap[route];
}


export function TopBar({user}:{user:string})
{
    const [location, setLocation] = useLocation();
    const topNavRef = useCtxTopNavRef();
    const [CurrentLocation, NextLocation, RouteURI] = RouteNavigator(location);

    //Custom hook to clean session, gives a handler to set to true when session is to clean
    //const cleanSession = useCleanSession();

    const monthRef = useCtxCurrentMonthRef();
    const auth = useAuthLevel();

    return (

        <tw_Layouts.TWheader>
            <StyledTopnav.TWcontainer id={TOPNAV_ID} ref={topNavRef}
            
                onClick={() => {
                    if (monthRef?.current == undefined) {return;}
                    monthRef?.current?.scrollIntoView({ behavior: "smooth" });
                }}
            >
                {/*left-header*/}
                <StyledTopnav.TWlogo>{`JHDiary v1.2 | ${user.toLocaleUpperCase()} | `}
                
                {/*center-header*/}{" "}
                <StyledTopnav.TWtitle
                
                >
                    {DateService.GetTodayDateFormat()}
                </StyledTopnav.TWtitle>
                    </StyledTopnav.TWlogo>
                <div className="flex flex-row gap-1" >
                {/*right-header*/}
                {
                   auth === "master" ? <StyledTopnav.TWlogout title={`You are currently in ${CurrentLocation}, click to navigate to ${NextLocation}`}
                        onClick={(e) => {e.stopPropagation(); window.location.href = RouteURI;}}
                    >
                        {
                            NextLocation
                        }
                    </StyledTopnav.TWlogout> : <></>
                }
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
