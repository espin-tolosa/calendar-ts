import React from "react";
import * as DayStyles from "../../../components/Day/tw";

interface DayContainer {
    fullDate: string,
    height: React.MutableRefObject<number>,
    visible: boolean,
    thisDay: React.RefObject<HTMLDivElement>,
    children: JSX.Element,
    styledProps:
    {
        $isWeekend: boolean,
        $isLock: boolean,
    }
    thisNode: React.RefObject<HTMLDivElement>,
    isToday: boolean,
    daynumber: number
}

export function DayContainer ( props : DayContainer  )
{
    return (

    <DayStyles.GlobalStyle
      id={`day:${props.fullDate}`}
      ref={props.thisDay}
      style={props.height.current && !props.visible? {height: `${props.height.current}px`,}: {}}
      {...props.styledProps}
    >
      <DayStyles.header
        id={`day-header:${props.fullDate}`}
        {...props.styledProps}
        ref={props.thisNode}
      >
        <DayStyles.daySpot
          id={`day-spot:${props.fullDate}`}
          $isToday={props.isToday}
        >{`${props.daynumber}`}</DayStyles.daySpot>
      </DayStyles.header>
        {props.children}
    </DayStyles.GlobalStyle>
    )
}