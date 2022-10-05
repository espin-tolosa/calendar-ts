import { usePostQuery } from "@/Calendar/api/queries";
import { useDoubleClick } from "@/Calendar/hooks/useDoubleClick";
import { useAuthLevel } from "@/Spa/context/authLevel";
import { useRef } from "react";
import { DateService } from "../../../utils/Date";
import * as DayStyles from "../tw";

interface DayContainer {
    fullDate: string,
    height: number,
    visible: boolean,
    thisDay: React.RefObject<HTMLDivElement>,
    children: JSX.Element,
}

export function DayLayout ( {fullDate, height, visible, thisDay, children} : DayContainer  )
{
    const $isLock = false;
    const $isWeekend = DateService.IsWeekend(fullDate);
    const styledProps = { $isWeekend, $isLock };
    
    const isToday = fullDate === DateService.FormatDate(DateService.GetDate());
    const daynumber = fullDate.split("-")[2];

    const style = !!height && !visible ? {height: `${height}px`,} : {}
    
    const addEvent = usePostQuery(fullDate);
    const onClick = useDoubleClick(addEvent);
    const thisNode = useRef<HTMLDivElement>(null);
    const auth = useAuthLevel();

    return (

        <DayStyles.GlobalStyle id={`day:${fullDate}`} ref={thisDay} style={style} {...styledProps}
        
        onClick={(e) => {
            if(auth !== "master")
            {
                return;
            }
            const target = e.target as HTMLElement;
            if (thisNode.current !== null && target !== null) {
              const thisId = thisNode.current.id.split(":")[1];
              const pointerId = target.id.split(":")[1];
              if (thisId !== pointerId) {
                return;
              }
            }
            onClick();
        }}
        >

            <DayStyles.header {...styledProps} ref={thisNode}>
                <DayStyles.daySpot $isToday={isToday}> {daynumber} </DayStyles.daySpot>
            </DayStyles.header>

            {children}

        </DayStyles.GlobalStyle>
    )
}