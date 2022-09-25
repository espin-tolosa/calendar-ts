import { EventClass } from "@/classes/event";
import { useEventState } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { useContext, useLayoutEffect, useState } from "react";
import { textAreaCtx } from "../Month/components/CurrentDays";
import { usePrintPDF } from "../Month/usePrintPDF";
import * as StyledEvent from "./tw";

interface PlaceHolder {
  index: number;
  event: jh.event;
  eventRef: React.RefObject<HTMLDivElement | undefined>;
}

function RootHolder({index, event, eventRef,}: PlaceHolder)
{
    const [style, setStyle] = useState<{ height: string }>({ height: "0px" });
    const week = DateService.GetWeekRangeOf(event.start);
    const eventsOfWeek = useEventState(week);
    const textArea = useContext(textAreaCtx) as jh.textArea;
    const {isVisible} = usePrintPDF();

    useLayoutEffect(() =>
    {
        if (eventRef.current == null)
        {
            return;
        }

        event.mutable =
        {
            dragDirection: "none",
            eventRef: eventRef.current,
            index: index,
        };

    }, [eventRef, eventRef.current, event, textArea, isVisible]);

  useLayoutEffect(() =>
  {
    if (!EventClass.hasMutable(event))
    {
      return;
    }

    const sameRow = eventsOfWeek.filter((e) =>
    {
        return (
            e.type === "roothead" &&
            EventClass.hasMutable(e) &&
            EventClass.hasMutable(event) &&
            //DateService.DaysFrom(event.start, e.start) >= 0 &&
            e.mutable.index === event.mutable.index
        );
    })

    const allH = sameRow.map((r): number => {
      return EventClass.hasMutable(r) ? r.mutable.eventRef?.clientHeight : 0;
    });
    const maxH = Math.max(...allH, event.mutable.eventRef.clientHeight);
    const newState = { height: `${maxH}px` };
    setStyle(newState);
  }, [eventRef, eventRef.current, event, textArea, isVisible]);

  return (
    <StyledEvent.TWplaceholder style={style}/>
  );
}

export const Placeholder = RootHolder;