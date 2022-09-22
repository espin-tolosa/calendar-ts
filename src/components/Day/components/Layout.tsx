import { DateService } from "@/utils/Date";
import * as DayStyles from "../tw";

interface DayContainer {
    fullDate: string,
    height: number,
    visible: boolean,
    thisDay: React.RefObject<HTMLDivElement>,
    children: JSX.Element,
    isToday: boolean,
    daynumber: number
}

export function DayLayout ( {fullDate, height, visible, thisDay, children, isToday, daynumber} : DayContainer  )
{
    const $isLock = false;
    const $isWeekend = DateService.IsWeekend(fullDate);
    const styledProps = { $isWeekend, $isLock };
    
    const style = !!height && !visible ? {height: `${height}px`,} : {}

    return (

        <DayStyles.GlobalStyle ref={thisDay} style={style} {...styledProps}>

            <DayStyles.header {...styledProps}>
                <DayStyles.daySpot $isToday={isToday}> {daynumber} </DayStyles.daySpot>
            </DayStyles.header>

            {children}

        </DayStyles.GlobalStyle>
    )
}