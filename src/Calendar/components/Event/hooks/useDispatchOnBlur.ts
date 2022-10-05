import { FetchEvent } from "@/Calendar/classes/fetchEvent";
import { useLayoutEffect } from "react";
import { useEventDispatch } from "../../../hooks/useEventsState";

export function useDispatchOnBlur(textRef: React.RefObject<HTMLSpanElement>, event: jh.event)
{
    const eventDispatcher = useEventDispatch();

    /**
     * useLayoutEffect is required to have access synchronously to textRef before disapears.
     * useEffect is async, so it won't work here
     */
        useLayoutEffect(() =>
        {
            return () =>
            {
                const job = (textRef.current?.textContent ?? "").trim();
                
                /**
                 * We won't fetch in cases where, field left empty, because It could be unexpected by the user
                 * or, if 
                 */
                if (job === "" || job === event.job)
                {
                    return;
                }
                
                const Event = new FetchEvent();
                const putEvent = {...event, job};
                Event.update(putEvent)
                eventDispatcher({type: "update", payload: [putEvent]}); 
            };
        }, []);
}