import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { styles } from "../../components/Day/tw";
import { MemoEventsThrower } from "../../components/EventsThrower/main";
import { DateService } from "../../utils/Date";
import { usePostQuery } from "../../api/queries";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { useToken } from "@/hooks/useToken";

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

function Day({
  daynumber,
  fullDate,
  pushedDays,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: Day) {
  //Callbacks
  const dayRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  const height = useRef(0);

  const onChange = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
      } else {
        setVisible(false);
        if (dayRef.current !== null) {
          height.current = dayRef.current.clientHeight;
        }
      }
    },
    [visible]
  );

  const observer = useRef(new IntersectionObserver(onChange));

  useEffect(() => {
    dayRef.current !== null && observer.current.observe(dayRef.current);

    return () => {
      dayRef.current !== null && observer.current.unobserve(dayRef.current);
    };
  }, []);

  //Computed:
  //TODO: Locked days not impl
  const $isLock = false;
  const $isWeekend = DateService.IsWeekend(fullDate);
  const styledProps = { $isWeekend, $isLock };
  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  const token = useToken();
  const addEvent = usePostQuery(fullDate);

  const onClick = useDoubleClick(addEvent);

  const thisNode = useRef<HTMLDivElement>(null);

  return (
    <styles.contain
      id={`day:${fullDate}`}
      ref={dayRef}
      style={{ height: `${height.current}px` }}
      {...styledProps}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (thisNode.current !== null && target !== null) {
          const thisId = thisNode.current.id.split(":")[1];
          const pointerId = target.id.split(":")[1];
          if (thisId !== pointerId) {
            return;
          }
        }
        token.isAuth() && onClick();
      }}
    >
      <styles.header
        id={`day-header:${fullDate}`}
        {...styledProps}
        ref={thisNode}
      >
        <styles.daySpot
          id={`day-spot:${fullDate}`}
          $isToday={isToday}
        >{`${daynumber}`}</styles.daySpot>
      </styles.header>

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
    </styles.contain>
  );
}

//TODO: Profile the difference between memo and not memo, because in practice I don't see any extra renders jet
export const MemoDay = memo(Day);

//export const MemoDay = memo(Day, (prev, next) => {
//  const isDayToPush = next.pushedDays.has(next.fullDate);
//
//  return !isDayToPush;
//});
