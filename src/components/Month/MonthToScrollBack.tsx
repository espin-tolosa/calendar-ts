import { useEffect, useLayoutEffect, useState } from "react";
import { useCtxCurrentMonthRef } from "@/context/currentMonthReference";
import { isToday, _renderDate } from "@/utils/Date_v2";
import { useCtxTopNavRef } from "@/context/topNavSize";
import { DOMRefs } from "@/context/DOMRefs";
import { CustomTypes } from "@/customTypes";
export const CurrentMonthScrollAnchor = ({
  year,
  month,
}: CustomTypes.Month) => {
  const topNavRef = useCtxTopNavRef();
  const [topNavHeight, setTopNavHeight] = useState({ top: "" });
  const dispatchDOMRef = DOMRefs.useDispatch();
  const monthRef = useCtxCurrentMonthRef();
  useLayoutEffect(() => {
    if (!isToday(year, month)) {
      return;
    }
    const height = topNavRef?.current?.clientHeight!;
    const border = 3; /*px*/
    const style = { top: `-${height + border}px` };
    setTopNavHeight(style);
    window.scrollTo(0, 0);
  }, []);

  //TODO:Give a name to this custom hook
  useEffect(() => {
    if (!isToday(year, month)) {
      return;
    }

    dispatchDOMRef({ type: "update", payload: monthRef });

    monthRef?.current?.scrollIntoView()!;
  }, [topNavHeight]); //TODO: use ref state context as it was created to access TopNav Ref after it is rendered

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
};
