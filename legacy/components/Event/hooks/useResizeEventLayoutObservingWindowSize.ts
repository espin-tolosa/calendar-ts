import { textAreaCtx } from "@/components/Month/components/CurrentDays";
import { useContext, useEffect, useRef } from "react";

export function useResizeEventLayoutObservingWindowSize(refNode: React.RefObject<HTMLDivElement>, event: jh.event)
{
    const textArea = useContext(textAreaCtx) as jh.textArea;
    const timer = useRef<NodeJS.Timeout|null>(null)
    useEffect(() =>
    {
        const setEventHeight = ()=>{
            if (refNode.current == null) {return;}
            textArea.setTextEvent(event.id);
            textArea.setTextArea(refNode.current.clientHeight);
        }

        function debounceCallback (callback:()=>void){
            if(timer.current !== null)
            {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(()=>
            {
                timer.current = null;
                callback();
            },1000)
        }
        window.addEventListener('resize', ()=>debounceCallback(setEventHeight));
        return () =>
        {
            window.removeEventListener('resize', ()=>debounceCallback(setEventHeight) );
        };
    }, []);
}
