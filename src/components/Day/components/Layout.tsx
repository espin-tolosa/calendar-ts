import React from "react";
import * as DayStyles from "../tw";

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
    isToday: boolean,
    daynumber: number
}

export function DayLayout ( props : DayContainer  )
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