import { useEffect, useRef, useState } from "react";

export function useVirtualList()
{
    const [visible, setVisible] = useState(false);
    const [hasShowedUp, setHasShowedUp] = useState(false);
    const observedHeight = useRef(0);
    const observed = useRef<HTMLDivElement>(null);
    const onChange = (entries: Array<IntersectionObserverEntry>) =>
    {
        if (entries[0].isIntersecting)
        {
            setVisible(true);
            setHasShowedUp(true);
            return;
        }

        observedHeight.current = observed.current?.clientHeight ?? observedHeight.current;
        hasShowedUp && setVisible(false);        
    };
  
    const observer = new IntersectionObserver(onChange, {rootMargin: "300px", threshold: 0});
  
    useEffect(() =>
    {
        observed.current !== null && observer.observe(observed.current);

        return () =>
        {
            observed.current !== null && observer.unobserve(observed.current);
        };
    
    }, [visible, hasShowedUp]);

    return {observed, height: observedHeight.current, visible}
}