import { useEventState } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { useLayoutEffect, useState } from "react";
import * as StyledEvent from "./tw";

interface PlaceHolder {
  index: number;
  event: jh.event;
  eventRef: React.RefObject<HTMLDivElement | undefined>;
  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  textEvent: number;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
}

function RootHolder({
  index,
  event,
  eventRef,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: PlaceHolder) {
  const [style, setStyle] = useState<{ height: string }>({ height: "0px" });
  const week = DateService.GetWeekRangeOf(event.start);
  const eventsOfWeek = useEventState(week);

  //setup the mutable object by first time
  useLayoutEffect(() => {
    if (eventRef.current == null) {
      return;
    }

    event.mutable = {
      dragDirection: "none",
      eventRef: eventRef.current,
      index: index,
    };
  }, [event]);

  useLayoutEffect(() => {
    if (!hasMutable(event)) {
      return;
    }
    const sameRow = eventsOfWeek

      .filter((e) => {
        return (
          hasMutable(e) &&
          hasMutable(event) &&
          DateService.DaysFrom(event.start, e.start) >= 0 &&
          e.mutable.index === event.mutable.index
        );
      })

      .filter((e) => e.type === "roothead");

    const allH = sameRow.map((r): number => {
      return hasMutable(r) ? r.mutable.eventRef?.clientHeight : 0;
    });
    const maxH = Math.max(...allH, event.mutable.eventRef.clientHeight);
    const newState = { height: `${maxH}px` };
    setStyle(newState);
  }, [eventRef.current, event, textArea, textEvent]);

  return (
    <StyledEvent.TWplaceholder style={style}>
      {"placeholder"}
    </StyledEvent.TWplaceholder>
  );
}

export const Placeholder = RootHolder;

const hasMutable = (e: jh.event): e is Required<jh.event> =>
  typeof e.mutable === "object";
