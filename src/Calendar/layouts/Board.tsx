import { TWboard, TWmain } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useGetMonths, useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { dispatchAllFetchEvents } from "../api/useGetAllEventsFrom";
import { useObserverController } from "../context/observeEventSize";
import { useOnDragEnter } from "../components/Day/logic";
import { useLayoutEffect, useRef } from "react";
import { useKeyboardShortcuts } from "../hooks/useKeyListeners";
import { useDnDEventRef } from "../context/dndEventRef";

//TODO: Move to class
const genKey = (value:jh.date.monthData)=>`${value.year}-${value.month}`;
const genMonth = ({year, month}: jh.date.monthData) => <MemoMonth key={genKey({year, month})} year={year} month={month} onDoubleClick={()=>{}}  />

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
    useObserverController();
    useKeyboardShortcuts();
    dispatchAllFetchEvents();
    useDetectDragEnter();

    return (
    
        <TWmain>
        
            <TWboard id={"Board"}>
                <MonthList months={monthKeys} eol={EndOfList} />
            </TWboard>

        </TWmain>
    );
}


function useDetectDragEnter()
{
    const dndEvent = useDnDEventRef();
    
    const onDragEnter = useOnDragEnter();
    const onDate = useRef("");
    
    const hOnDragEnter = (e: DragEvent) => {
        const componentsQuery = window.document.elementsFromPoint(e.clientX, e.clientY);
            
        //Recover the first day component encountered
        const dayDiv = componentsQuery.find((e) => e.id.includes("day"));
            
        //Check whether or not the cursor is over a Day subcomponent
        if (typeof dayDiv === "undefined" || typeof onDragEnter === "undefined") {
          return;
        }
    
        //Extract fullDate info from Day subcomponent's id
        const date = dayDiv.id.split(":")[1];
    
        //Check whether or not the cursor is over the current date being already registered
        if (onDate.current === "" || date === onDate.current) {
          onDate.current = date;
          return;
        }
    
        onDate.current = date;
        onDragEnter(date, dndEvent);
      };

      useLayoutEffect(() => {
        if (typeof dndEvent === "undefined") {
          return;
        }
    
        window.document.addEventListener("dragover", hOnDragEnter);
        return () => {
          window.document.removeEventListener("dragover", hOnDragEnter);
        };
      }, [onDate, onDragEnter, dndEvent]);
}