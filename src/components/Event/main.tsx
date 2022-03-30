import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useHoverEvent, useStorage, useTransitionStyle } from "./logic";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { EventClass } from "@/classes/event";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { CustomValues } from "@/customTypes";
import { fetchEvent } from "@/utils/fetchEvent";
import { useCtxKeyBuffer } from "@/globalStorage/keyBuffer";
import { useControllerDispatch } from "@/hooks/useController";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { isValidChildren } from "@/utils/ValidateEvent";

const useGetEventFamily = (event: event) => {
  const events = useEventState();
  const parentId = EventClass.transformToParentId(event);
  //return all events that has the same parentId
  const family = events.filter(
    (e) => EventClass.transformToParentId(e) === parentId
  );

  const parent = EventClass.getParentEvent(family);
  return [parent, family] as [event, Array<event>];
};

export const Event = ({ event, index }: { event: event; index: number }) => {
  const today = event.start;
  const weekRange = DateService.GetWeekRangeOf(today);
  const eventsOfWeek = useEventState(weekRange);
  //const events = useEventState();
  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parent, family] = useGetEventFamily(event);
  const [state, setState] = useState<any>();

  //drag and drop
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  //keybuffer to detect when control keyword is pressed
  const keyBuffer = useCtxKeyBuffer();

  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();

  const hOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    dispatchControllerDates({
      type: "setDates",
      payload: { start: parentEvent.start, end: parentEvent.end },
    });

    dispatchController({
      type: "setController",
      payload: {
        id: parentEvent.id,
        client: parentEvent.client,
        job: parentEvent.job,
      },
    });

    setEventController(parentEvent);
  };

  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const { hover, ...mouseHover } = useHoverEvent(event);

  // Style hook for state transitions
  const eventInlineStyle = useTransitionStyle(isChildren, hover, event);

  // Database storage logic
  const { isSelected, isFocus, jobInput, ...eventUpdater } = useStorage(event);

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    8
  );
  const parentEvent = EventClass.getParentEvent(family);

  //determine hight of event
  const eventRef = useRef<HTMLDivElement>();

  const h = eventRef?.current?.clientHeight;

  useLayoutEffect(() => {
    if (typeof eventRef.current !== "undefined") {
      event.mutable = {
        height: `${eventRef.current!.clientHeight}px`,
        eventRef: eventRef.current,
        index: index,
      };
      setState({
        height: `${eventRef.current?.clientHeight}px`,
      });
    }
  }, [h]);
  //useLayoutEffect(() => {
  //}, []);

  return (
    <StyledEvent.TWflexContainer
      {...mouseHover}
      onClick={hOnClick}
      draggable={"true"}
      onDragStart={() => {
        temporaryEventDispatcher(parentEvent);
      }}
      onDragEnd={() => {
        temporaryEventDispatcher(CustomValues.nullEvent);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        temporaryEventDispatcher(parentEvent);
      }}
      onTouchEnd={() => {
        temporaryEventDispatcher(CustomValues.nullEvent);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY;

        const el = document.elementsFromPoint(x, y);
        const dayDiv = el.find((e) => e.id.includes("day"));

        //All of this is the same as Board callback
        const id = dayDiv?.id;
        if (!id) {
          return;
        }

        const entries = id.split("-");

        if (entries[0] !== "day") {
          return;
        }

        const fullDate = `${entries[1]}-${entries[2]}-${entries[3]}`;

        if (temporaryEvent.end === fullDate) {
          return;
        }

        const newEvent = { ...temporaryEvent, end: fullDate };

        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });
        fetchEvent("POST", newEvent);
        temporaryEventDispatcher(newEvent);
      }}
      onTouchMove={(e) => {
        e.preventDefault();

        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;

        const el = document.elementsFromPoint(x, y);
        const dayDiv = el.find((e) => e.id.includes("day"));

        //All of this is the same as Board callback
        const id = dayDiv?.id;
        if (!id) {
          return;
        }

        const entries = id.split("-");

        if (entries[0] !== "day") {
          return;
        }

        const fullDate = `${entries[1]}-${entries[2]}-${entries[3]}`;
        if (temporaryEvent.end === fullDate) {
          return;
        }

        const isRewind =
          DateService.DaysFrom(temporaryEvent.start, fullDate) < 0;
        const newEvent = { ...temporaryEvent };
        if (isRewind) {
          newEvent.start = fullDate;
        } else {
          newEvent.end = fullDate;
        }

        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });
        fetchEvent("PUT", newEvent);
        temporaryEventDispatcher(newEvent);
        return true;
      }}
      //split event when Ctrl is pressed
      onMouseDownCapture={(e) => {
        setEventController(parentEvent);
        if (keyBuffer?.current !== "Control") {
          return;
        }
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY;

        const el = document.elementsFromPoint(x, y);
        const dayDiv = el.find((e) => e.id.includes("day"));

        //All of this is the same as Board callback
        const id = dayDiv?.id;
        if (!id) {
          return;
        }

        const entries = id.split("-");

        if (entries[0] !== "day") {
          return;
        }

        const fullDate = `${entries[1]}-${entries[2]}-${entries[3]}`;
        if (parentEvent.end === fullDate) {
          return;
        }

        const today = new Date(fullDate);
        const dayWeek = DateService.GetMonthDayKey(today);
        const previous = new Date(today.getTime());
        const nextOrBack = dayWeek !== "Monday" ? +1 : -1;
        const prev = previous.setDate(today.getDate() + nextOrBack);

        const yesterdayDate = DateService.FormatDate(new Date(prev));

        const start = dayWeek !== "Monday" ? yesterdayDate : fullDate;
        const end = dayWeek !== "Monday" ? fullDate : yesterdayDate;
        const prevEvent = { ...parentEvent, end };
        const nextEvent = {
          ...parentEvent,
          start,
          id: EventClass.getUnusedId(),
        };
        //Optimistic push nextEvent to state, with
        eventDispatcher({
          type: "update",
          payload: [prevEvent, nextEvent],
        });

        //TODO: use promise all, to ensure prevEvent don't fail
        fetchEvent("PUT", prevEvent);

        const result = fetchEvent("POST", nextEvent);
        result
          .then((res) => res.json())
          .then((dbResponse: Array<event>) => {
            //This is the way I have to replace the Id of an event, since the action "replacebyid" uses the id to change the other fields, I can't use it to replace the id itself
            eventDispatcher({
              type: "delete",
              payload: [nextEvent],
            });
            eventDispatcher({
              type: "syncDB",
              payload: dbResponse,
            });
          });
      }}
    >
      <StyledEvent.TWtextContent
        $isChildren={isChildren}
        ref={eventRef}
        $isHover={hover}
        style={eventInlineStyle}
        key={event.id}
        $cells={spreadCells}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
        $client={event.client.toLowerCase()}
        {...eventUpdater}
      >
        {!isChildren ? (
          <div className="flex flex-col w-full">
            {!isSelected ? (
              <StyledEvent.TWjobContent $isHover={hover}>
                {event.job}
              </StyledEvent.TWjobContent>
            ) : (
              <input
                ref={isFocus}
                value={jobInput}
                className="bg-transparent text-slate-900 outline-none appearance-none
							
							whitespace-nowrap overflow-hidden overflow-ellipsis
								"
              ></input>
            )}
            <div className="bg-black text-center text-white text-xs rounded-b-[10px] border-1 ">
              {event.client}
            </div>
          </div>
        ) : (
          <>
            <div className="text-transparent">{event.client}</div>
          </>
        )}
      </StyledEvent.TWtextContent>

      <StyledEvent.TWextend
        $cells={spreadCells}
        onMouseDownCapture={(e) => {}}
        onMouseEnter={() => {}}
        onMouseOut={() => {}}
        title={`Drag here to extend ${event.client}\'s job`}
        style={{ height: event.mutable?.height }}
      >
        {"+"}
      </StyledEvent.TWextend>

      <StyledEvent.TWplaceholder
        key={"p" + event.id}
        style={{ height: event.mutable?.height }}
      >
        {"placeholder"}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};

export const EventHolder = ({ event, style }: { event: event; style: {} }) => {
  const [parent, family] = useGetEventFamily(event);
  const pref = useRef<HTMLDivElement>();
  const [state, setState] = useState<any>();

  const h = parent.mutable?.eventRef?.clientHeight;

  //  const myState = useEventState();
  const today = event.start;
  //const today = "2022-03-30";
  const weekRange = DateService.GetWeekRangeOf(today);
  weekRange.from = event.start;
  const eventsOfWeek = useEventState(weekRange);

  useLayoutEffect(() => {
    if (typeof pref.current !== "undefined") {
      //const p = pref.current!.offsetTop;
      //const t = parent.mutable?.eventRef?.offsetTop;
      //const h = parent.mutable?.eventRef?.clientHeight;
      //const height = h!; //+ t! - p!;
      //pref.current!.style.backgroundColor = "yellow";
      const allIndex1 = eventsOfWeek.filter(
        (all) => all.mutable?.index === parseInt(event.end)
      );

      //

      const allH = allIndex1.map(
        (a1) =>
          a1.mutable!.eventRef.clientHeight + a1.mutable!.eventRef.offsetTop
      );

      const maxH = Math.max(...allH);

      const p = pref.current!.offsetTop;
      const t = parent.mutable?.eventRef?.offsetTop;
      const h = parent.mutable?.eventRef?.clientHeight;

      //In case of not found sibblings use the parent h //!bug solved
      const height = isFinite(maxH) ? maxH - p : h;
      pref.current!.style.border = "1px dashed red";

      console.info({ event, p, t, h, maxH, height, allH });
      //const height = h! + t! - p!;

      //
      event.mutable = {
        //height: `${height}px`,
        height: `${height}px` /*max of height for index   */,
        eventRef: pref.current,
        index: parseInt(event.end),
      };

      setState({
        height: event.mutable.height,
      });
    }
  }, [h]);
  //TODO
  //tengo que crear un consumidor de contexto para que esto se actualize
  //con el valor correcto de mutable.hegiht
  //cuando se lea arriba useEffectLayout

  return (
    <StyledEvent.TWflexContainer ref={pref} style={state}>
      <StyledEvent.TWplaceholder key={"p" + event.id}>
        {parent.job}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
