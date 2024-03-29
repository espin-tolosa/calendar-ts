import { useEffect, useLayoutEffect, useState } from "react";
import { useCtxCurrentMonthRef } from "../../../context/currentMonthReference";
import { isToday } from "../../../utils/Date_v2";
import { useCtxTopNavRef } from "../../../context/topNavSize";

export function CurrentMonthScrollAnchor({year, month,} : jh.date.monthData)
{
    const topNavRef = useCtxTopNavRef();
    const [topNavHeight, setTopNavHeight] = useState({ top: "" });
    const monthRef = useCtxCurrentMonthRef();

    useLayoutEffect(() => {

        if (!isToday(year, month)) {return;}

        const height = topNavRef?.current?.clientHeight || 0;
        const border = 3; /*px*/
        const style = { top: `-${height + border}px` };
        setTopNavHeight(style);
        window.scrollTo(0, 0);
    }, []);

  //TODO:Give a name to this custom hook
  useEffect(() => {
    if (!isToday(year, month)) {return;}

    //dispatchDOMRef({ type: "update", payload: monthRef });

    setTimeout(() => {
        monthRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    setTimeout(() => {
        monthRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 350);
    setTimeout(() => {
        monthRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);

  }, [topNavHeight, year, month]); //TODO: use ref state context as it was created to access TopNav Ref after it is rendered

  return (
    <>
      {isToday(year, month) && (
        <div
          ref={monthRef}
          style={topNavHeight}
          id={"Current-Month"}
          className="absolute"
        ></div>
      )}
    </>
  );
}
