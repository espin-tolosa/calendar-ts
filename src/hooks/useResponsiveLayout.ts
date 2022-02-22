import { useState, useRef, useEffect } from "react";

export default function useResponsiveBreakpoints(
  elRef: React.MutableRefObject<any>,
  breakpoints: Array<any>
) {
  const firstQuery = Object.keys(breakpoints[0])[0];
  const [breakSize, setBreakSize] = useState(firstQuery);

  const observer = useRef(
    new ResizeObserver((entries) => {
      // Only care about the first element, we expect one element ot be watched
      const { width } = entries[0].contentRect;

      //setBreakSize(findBreakPoint(breakpoints, width))
    })
  );

  useEffect(() => {
    if (elRef.current) {
      observer.current.observe(elRef.current);
    }

    return () => {
      observer.current.unobserve(elRef.current);
    };
  }, [elRef, observer]);

  return breakSize;
}
