import { useVirtualList } from "@/hooks/useVirtualList";
import { MemoEventsThrower } from "../../components/EventsThrower/main";
import { DayLayout } from "./components/Layout";

interface Day {
  fullDate: string;
}

function Day({fullDate}: Day)
{
    const {observed, height, visible} = useVirtualList();
    
    return (

        <DayLayout fullDate={fullDate} height={height} visible={visible} thisDay={observed}>
        {
            visible ? (<MemoEventsThrower day={fullDate}/>) : (<></>)
        }
        </DayLayout>
  );
}

export const MemoDay = Day;