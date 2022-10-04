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

    return (

        <DayStyles.GlobalStyle ref={thisDay} style={style} {...styledProps}>

            <DayStyles.header {...styledProps}>
                <DayStyles.daySpot $isToday={isToday}> {daynumber} </DayStyles.daySpot>
            </DayStyles.header>

            {children}

        </DayStyles.GlobalStyle>
    )
}