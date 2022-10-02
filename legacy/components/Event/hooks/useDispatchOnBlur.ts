import { useContext, useEffect } from "react";
import { textAreaCtx } from "../../../components/Month/components/CurrentDays";
import { useEventDispatch } from "../../../hooks/useEventsState";
import { fetchEvent } from "../../../utils/fetchEvent";

export function useDispatchOnBlur(textRef: React.RefObject<HTMLSpanElement>, event: jh.event, isHoverActive: boolean)
{
    const eventDispatcher = useEventDispatch();
    const textArea = useContext(textAreaCtx) as jh.textArea;
    
        useEffect(() =>
        {
            return () =>
            {
                const job = (textRef.current?.textContent ?? "").trim();
    
                if (!isHoverActive || job === "" || job === event.job)
                {
                    return;
                }
    
                fetchEvent("PUT", { ...event, job });
                eventDispatcher({type: "update", payload: [{ ...event, job }]});
            };
    
        }, [isHoverActive]);
}
