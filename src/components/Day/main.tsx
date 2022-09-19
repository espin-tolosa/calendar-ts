import React, { memo, useLayoutEffect, useRef, useState } from "react";
import * as DayStyles from "../../components/Day/tw";
import { MemoEventsThrower } from "../../components/EventsThrower/main";
import { DateService } from "../../utils/Date";
import { usePostQuery } from "../../api/queries";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { useToken } from "../../hooks/useToken";
import { DayContainer } from "./components/Container";

interface Day {
  daynumber: number;
  fullDate: string;
  pushedDays: Set<string>;
  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  textEvent: number;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
}

// Used Context in Day Component:
//
// cDayLock
// cDayLockDispatcher
// cUseLocalUserPreferences
// cEventSelected
// cSetEventSelected
// cControllerState - start,end
// cControllerState - id,client,job

function Day({daynumber, fullDate, pushedDays, textArea, setTextArea, textEvent, setTextEvent}: Day) {
  //Callbacks

  const [visible, setVisible] = useState(true);
  const height = useRef(0);
  const thisDay = useRef<HTMLDivElement>(null);
  const [hasShowedUp, setHasShowedUp] = useState(false);

  const onChange = (entries: Array<IntersectionObserverEntry>) => {
    if (entries[0].isIntersecting) {
      setVisible(true);
      setHasShowedUp(true);
    } else {
      if (thisDay.current !== null) {
        height.current = thisDay.current.clientHeight;
      }

      hasShowedUp && setVisible(false);
    }
  };

  const observer = new IntersectionObserver(onChange, {
    rootMargin: "0px",
    threshold: 0,
  });

  useLayoutEffect(() => {
    thisDay.current !== null && observer.observe(thisDay.current);

    return () => {
      thisDay.current !== null && observer.unobserve(thisDay.current);
    };
  }, [visible, hasShowedUp]);

  //Computed:
  //TODO: Locked days not impl
  const $isLock = false;
  const $isWeekend = DateService.IsWeekend(fullDate);
  const styledProps = { $isWeekend, $isLock };
  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  const thisNode = useRef<HTMLDivElement>(null);

  return (
    <DayContainer fullDate={fullDate} height={height} visible={visible} thisDay={thisDay} styledProps={styledProps} thisNode={thisNode} isToday={isToday}  daynumber={daynumber}>
      {visible ? (
        <MemoEventsThrower
          day={fullDate}
          pushedDays={pushedDays}
          textArea={textArea}
          setTextArea={setTextArea}
          textEvent={textEvent}
          setTextEvent={setTextEvent}
        />
      ) : (
        <></>
      )}
    </DayContainer>
  );
}

//TODO: Profile the difference between memo and not memo, because in practice I don't see any extra renders jet
export const MemoDay = memo(Day);

//export const MemoDay = memo(Day, (prev, next) => {
//  const isDayToPush = next.pushedDays.has(next.fullDate);
//
//  return !isDayToPush;
//});
