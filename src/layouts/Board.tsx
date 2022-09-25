import { TWboard, TWmain } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useGetMonths, useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { dispatchAllFetchEvents } from "../api/useGetAllEventsFrom";
import { useObserverController } from "@/context/observeEventSize";

//TODO: Move to class
const genKey = (value:jh.date.monthData)=>`${value.year}-${value.month}`;
const genMonth = (value: jh.date.monthData) => <MemoMonth key={genKey(value)} {...value} />

function MonthList({months, eol}:{months:jh.date.monthData[], eol: ()=>JSX.Element})
{
    return(
        <>
            {
                months.map(genMonth)
            }
            {
                eol()
            }
        </>
    );
}

export function Board()
{
    const {monthKeys, hMonthKeys} = useGetMonths();
    const EndOfList = useInfiniteScroll(hMonthKeys);
    useObserverController()

    dispatchAllFetchEvents();

    return (
    
        <TWmain>
        
            <TWboard id={"Board"}>
                <MonthList months={monthKeys} eol={EndOfList} />
            </TWboard>

        </TWmain>
    );
}
