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
import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePostQuery } from "@/api/queries";

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
  const eventRef = useRef<HTMLDivElement>();

  //Layout Hook
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: index,
    };
  }, [eventRef.current?.clientHeight]);

  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parent, family] = useGetEventFamily(event);

  //drag and drop
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  //keybuffer to detect when control keyword is pressed
  const keyBuffer = useCtxKeyBuffer();

  const setEventController = useSetEventSelected();

  const hOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
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
        // fetchEvent("POST", newEvent);
        // temporaryEventDispatcher(newEvent);
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
        style={eventInlineStyle.dinamic}
        key={event.id}
        $cells={spreadCells}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
        $client={event.client.toLowerCase()}
        {...eventUpdater}
      >
        {!isChildren ? (
          <div className="flex flex-col w-full">
            <div
              className="bg-black text-center text-white text-sm customtp:text-xxs custombp:text-xxs w-full"
              style={eventInlineStyle.static}
            >
              {event.client}
            </div>
            {!isSelected ? (
              <StyledEvent.TWjobContent $isHover={hover}>
                <div className="p-3 customtp:text-xxs customtp:p-1 custombp:text-xxs custombp:p-1  ">
                  {event.job}
                </div>
              </StyledEvent.TWjobContent>
            ) : (
              <input
                ref={isFocus}
                value={jobInput}
                className="bg-transparent text-slate-900 outline-none appearance-none	whitespace-nowrap overflow-hidden overflow-ellipsis"
              ></input>
            )}
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

export const EventHolder = ({ event }: { event: event }) => {
  const [parent, family] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  const week = DateService.GetWeekRangeOf(event.start);
  week.from = event.start;
  const eventsOfWeek = useEventState(week);
  //
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: parent.mutable?.index!, //!Corrected bug: was using event.end wich is zero
    };
    setState({ height: `${maxH}px` });
  }, []);
  //
  const allIndex1 = eventsOfWeek.filter(
    (all) => all.mutable?.index === parent.mutable?.index
  );
  const allH = allIndex1.map((a1) => a1.mutable?.eventRef.clientHeight || 0);
  const h = parent.mutable?.eventRef?.clientHeight || 0;
  const maxH = Math.max(...allH, h);

  const style = { height: `${maxH}px` };
  return (
    <StyledEvent.TWflexContainer ref={eventRef} style={style}>
      <StyledEvent.TWplaceholder>{""}</StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
