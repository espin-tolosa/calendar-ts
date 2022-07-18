import { useEventState } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { useEffect, useLayoutEffect, useState } from "react";
import * as StyledEvent from "./tw";
export function Placeholder({
  index,
  event,
  eventRef,
}: {
  index: number;
  event: jh.event;
  eventRef: React.RefObject<HTMLDivElement | undefined>;
}) {
  const [state, setState] = useState<{ height: string }>({ height: "3.5rem" });
  const week = DateService.GetWeekRangeOf(event.start);
  const eventsOfWeek = useEventState(week);
  useLayoutEffect(() => {
    if (
      eventRef != null &&
      eventRef.current != null &&
      typeof eventRef.current !== "undefined"
    ) {
      event.mutable = {
        height: "0px",
        //`${eventRef.current.clientHeight}px`,
        eventRef: eventRef.current,
        index: index, //!Corrected bug: was using event.end wich is zero
      };
    }
  });

  useEffect(() => {
    if (typeof event.mutable === "object") {
      const sameRow = eventsOfWeek

        .filter((e) => {
          if (
            typeof e.mutable === "object" &&
            typeof event.mutable === "object"
          ) {
            return e.mutable.index === event.mutable.index;
          }
        }) //!Bug solved: e.mutable is undefined

        .filter((e) => e.id > 0);

      const nonDef = () => {
        console.log("NON DEF");
        return 500;
      };

      const allH = sameRow.map((r) => {
        return typeof r.mutable === "object"
          ? r.mutable.eventRef.clientHeight
          : nonDef(); //!Non used branch
      });

      const maxH = Math.max(...allH);
      const newState = { height: `${maxH}px` };

      if (typeof event.mutable === "object") {
        event.mutable.height = newState.height;
      }

      if (!isChildren) {
        setState(newState);
      }
    }
  }, [event.mutable?.height, event]);

  const isChildren = event.job.includes("#isChildren");
  const tailState = { height: "2.95rem" };

  return (
    <StyledEvent.TWplaceholder style={isChildren ? tailState : state}>
      {"placeholder"}
    </StyledEvent.TWplaceholder>
  );
}
