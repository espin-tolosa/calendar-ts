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

//! TODO: Compare placeholder debug component with non-debug version to get the next version
export function Placeholder_Debug({ index, event, eventRef }: PlaceHolder) {
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
        height: `${eventRef.current.clientHeight}`,
        eventRef: eventRef.current,
        index: index, //!Corrected bug: was using event.end wich is zero
      };
    }
  }, [eventRef.current]);

  useLayoutEffect(() => {
    const eventsRefsOfWeek = eventsOfWeek
      .filter((e) => {
        if (
          typeof e.mutable === "object" &&
          typeof event.mutable === "object"
        ) {
          return (
            e.mutable.index === event.mutable.index && e.type.includes("head")
          );
          //return true;
        } else {
          return false;
        }
      }) //!Bug solved: e.mutable is undefined

      .map((e) => {
        if (typeof e.mutable === "object") {
          return e.mutable.eventRef.clientHeight;
        } else {
          return 0;
        }
      });
    if (eventsRefsOfWeek.length !== 0) {
      const maxH = Math.max(...eventsRefsOfWeek);
      setState({ height: `${maxH}px` });
      if (typeof event.mutable === "object") {
        const maxH = Math.max(...eventsRefsOfWeek);
        event.mutable.height = `${maxH}`;
      }
    }
  }, [eventsOfWeek.length, event.mutable]);

  return (
    <StyledEvent.TWplaceholder style={state}>
      {"placeholder"}
    </StyledEvent.TWplaceholder>
  );
}

export function Placeholder({
  index,
  event,
  eventRef,
  textArea,
  setTextArea,
  textEvent,
  setTextEvent,
}: PlaceHolder) {
  const [state, setState] = useState<{ height: string }>({ height: "3.5rem" });
  const week = DateService.GetWeekRangeOf(event.start);
  const eventsOfWeek = useEventState(week);
  useLayoutEffect(() => {
    if (
      eventRef != null &&
      eventRef.current != null &&
      typeof eventRef.current !== "undefined"
    ) {
      const allH = eventsOfWeek
        .filter((e) => {
          if (
            typeof e.mutable === "object" &&
            typeof event.mutable === "object"
          ) {
            return (
              e.mutable.index === event.mutable.index && e.type.includes("head")
            );
          } else {
            return false;
          }
        }) //!Bug solved: e.mutable is undefined

        .map((e) => {
          if (typeof e.mutable === "object") {
            return e.mutable.eventRef.clientHeight;
          } else {
            return 0;
          }
        });
      if (event.client === "BDM") {
        //debugger;
      }
      event.mutable = {
        height: `${Math.max(...allH)}px`,
        eventRef: eventRef.current,
        index: index, //!Corrected bug: was using event.end wich is zero
      };
    }
  }, [eventRef.current, event, event.mutable]);

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

        .filter((e) => e.type.includes("head"));

      const nonDef = () => {
        console.log("NON DEF");
        return 500;
      };

      const allH = sameRow.map((r) => {
        return typeof r.mutable === "object"
          ? r.mutable.eventRef.clientHeight
          : nonDef(); //!Non used branch
      });

      const textAreaH = textEvent === event.id ? textArea : 0;

      const maxH = Math.max(...allH, textAreaH);
      const newState = { height: `${maxH}px` };

      if (typeof event.mutable === "object") {
        //event.mutable.height = newState.height;
      }

      if (!isChildren) {
        setState(newState);
      }
    }
  }, [eventRef.current, event.mutable?.height, event, textArea, textEvent]);

  const isChildren = event.type === "tailhead";
  const tailState = { height: "2.95rem" };

  const style = isChildren ? tailState : state;

  //console.log("Style:", style, event);

  return (
    <div className="border-4 border-green-500">
      <StyledEvent.TWplaceholder style={style}>
        {"placeholder"}
      </StyledEvent.TWplaceholder>
    </div>
  );
}
