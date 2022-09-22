import { useEffect, useRef, useState } from "react";

export function useVirtualList()
{
    const [visible, setVisible] = useState(false);
    const [hasShowedUp, setHasShowedUp] = useState(false);
    const height = useRef(0);
    const observed = useRef<HTMLDivElement>(null);
    const onChange = (entries: Array<IntersectionObserverEntry>) =>
    {
        if (entries[0].isIntersecting)
        {
            setTimeout(()=>{

                setVisible(true);
                setHasShowedUp(true);
            },0)
            return;
        }

        height.current = observed.current?.clientHeight ?? 0;
        hasShowedUp && setVisible(false);        
    };
  
    const observer = new IntersectionObserver(onChange, {rootMargin: "0px", threshold: 0});
  
    useEffect(() =>
    {
        observed.current !== null && observer.observe(observed.current);

        return () =>
        {
            observed.current !== null && observer.unobserve(observed.current);
        };
    
    }, [visible, hasShowedUp]);

    return {observed, height, visible}
}