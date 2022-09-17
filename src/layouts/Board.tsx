import { TWboard, TWmain } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useGetMonths, useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { dispatchAllFetchEvents } from "../api/useGetAllEventsFrom";

export function Board()
{
    const {monthKeys, hMonthKeys} = useGetMonths();
    const EndOfList = useInfiniteScroll(hMonthKeys);

    dispatchAllFetchEvents();

    return (
    
        <TWmain>
        
            <TWboard id={"Board"}>
        
            {monthKeys.map((value) => { return (
                <MemoMonth key={`${value.year}-${value.month}`} {...value} />
            )})}

            {EndOfList()}

            </TWboard>

        </TWmain>
    );
}
