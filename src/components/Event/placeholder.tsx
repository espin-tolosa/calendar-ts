import { useEventState } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { useEffect, useLayoutEffect, useState } from "react";
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
      eventRef: eventRef.current,
      index: index,
    };
  }, []);

  useEffect(() => {
    if (typeof event.mutable === "object") {
      const sameRow = eventsOfWeek

        .filter((e) => {
          return hasMutable(e) && hasMutable(event)
            ? e.mutable.index === event.mutable.index
            : false;
        }) //!Bug solved: e.mutable is undefined

        .filter((e) => e.type.includes("head"));

      if (event.type === "roothead") {
        const allH = sameRow.map((r): number => {
          return hasMutable(r) ? r.mutable.eventRef.clientHeight : 0;
        });
        const textAreaH = textEvent === event.id ? textArea : 0;
        const maxH = Math.max(...allH, textAreaH);
        const newState = { height: `${maxH}px` };
        setStyle(newState);
      } else {
        console.log(event.id);
        console.log(sameRow.filter((e) => e.id !== event.id));
        const allH = sameRow
          .filter((e) => e.id !== event.id)
          .map((r): number => {
            return hasMutable(r) ? r.mutable.eventRef.clientHeight : 0;
          });
        const maxH = Math.max(...allH);
        const newState = { height: `${maxH}px` };
        setStyle(newState);
      }
    }
  }, [eventRef.current, event, textArea, textEvent]);

  return (
    <StyledEvent.TWplaceholder style={style} className="outline-red-900">
      {"placeholder"}
    </StyledEvent.TWplaceholder>
  );
}

export const Placeholder = RootHolder;

const hasMutable = (e: jh.event): e is Required<jh.event> =>
  typeof e.mutable === "object";
