import { useVirtualList } from "@/hooks/useVirtualList";
import { MemoEventsThrower } from "../../components/EventsThrower/main";
import { DateService } from "../../utils/Date";
import { DayLayout } from "./components/Layout";

interface Day {
  day: number;
  fullDate: string;
}

function Day({day: daynumber, fullDate}: Day)
{
    const {observed, height, visible} = useVirtualList();

    const $isLock = false;
    const $isWeekend = DateService.IsWeekend(fullDate);
    const styledProps = { $isWeekend, $isLock };
    const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

    return (

        <DayLayout  fullDate={fullDate}
                    height={height}
                    visible={visible}
                    thisDay={observed}
                    styledProps={styledProps}
                    isToday={isToday}
                    daynumber={daynumber}
                >
        {
            visible ? (<MemoEventsThrower day={fullDate}/>) : (<></>)
        }
    
        </DayLayout>
  );
}

export const MemoDay = Day;