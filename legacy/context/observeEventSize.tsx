import { EventClass } from "@/classes/event";
import { textAreaCtx } from "@/components/Month/components/CurrentDays";
import { useEventState } from "@/hooks/useEventsState";
import React, { createContext, useContext, useEffect, useRef } from "react";

const EventSize = createContext<React.MutableRefObject<ResizeObserver>|null>(null)

export function useObserverResize()
{
    return useContext(EventSize);
}

export function useObserverController()
{
    const observerRef = useObserverResize();
    const events = useEventState();
    const textArea = useContext(textAreaCtx) as jh.textArea;

    useEffect(() =>
    {
        if(observerRef == null)
        {
            return;
        }

        observerRef.current = new ResizeObserver((entries)=>
        {
            entries.forEach(entry =>
            {
                const {id,role} = EventClass.getIdParams(entry.target.id);
                const event = events.find(e=> role.includes("root") && e.id === id )

                if(!event || !EventClass.hasMutable(event))
                {
                    return;
                }

                textArea.setTextArea(event.mutable.eventRef.clientHeight)
                textArea.setTextEvent(id)
            })
        })

        return () =>
        {
            observerRef.current.disconnect();
        }

    },[events])
}

export function EventResizeObserver({children}:{children:JSX.Element})
{
    const observer = useRef(new ResizeObserver(()=>undefined));

    return(
        <EventSize.Provider value={observer}>
            {children}
        </EventSize.Provider>
    )
    
}