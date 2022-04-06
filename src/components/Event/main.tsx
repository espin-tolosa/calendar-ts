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
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
//import { usePostQuery } from "@/api/queries";

const CLIENTS = [
  "Client_1",
  "Client_2",
  "Client_3",
  "Client_4",
  "Client_5",
  "Client_6",
  "Client_7",
  "Client_8",
  "Client_9",
];
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
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const eventRef = useRef<HTMLDivElement>();

  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  const week = DateService.GetWeekRangeOf(event.start);
  //week.from = event.start;
  const eventsOfWeek = useEventState(week);
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: index, //!Corrected bug: was using event.end wich is zero
    };
  }, [event]);

  useEffect(() => {
    const sameRow = eventsOfWeek
      .filter((e) => e.mutable!.index === event.mutable!.index)
      .filter((e) => e.id > 0);
    const allH = sameRow.map((r) => r.mutable!.eventRef.clientHeight);
    const maxH = Math.max(...allH);
    const newState = { height: `${maxH}px` };

    event.mutable!.height = newState.height;
    setState(newState);
  }, [event]);

  //--------------------------------------------

  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parent, family] = useGetEventFamily(event);
  const parentEvent = EventClass.getParentEvent(family);

  //drag and drop
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  //keybuffer to detect when control keyword is pressed
  const keyBuffer = useCtxKeyBuffer();

  const setEventController = useSetEventSelected();

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

  const dayRef = useRef<Element>();

  return (
    <>
      <StyledEvent.TWflexContainer
        draggable={"true"}
        {...mouseHover}
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          setEventController(parentEvent);
        }}
        onDragStart={(e) => {
          e.stopPropagation();
          console.log("On drag start from Center", parentEvent);
          const copyOfParent: event = { ...parentEvent };
          copyOfParent.mutable!.bubble = 0;
          temporaryEventDispatcher(parentEvent);
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
              {
                <StyledEvent.TWStyledSelect
                  value={event.client}
                  style={eventInlineStyle.static}
                  id={"select"}
                >
                  <option value="default" hidden>
                    Select Client
                  </option>
                  {CLIENTS.map((clientIterator, index) => {
                    return (
                      <option key={index} value={clientIterator}>
                        {clientIterator}
                      </option>
                    );
                  })}
                </StyledEvent.TWStyledSelect>
              }
              {
                <StyledEvent.TWjobContent $isHover={hover}>
                  <span
                    className="textarea rounded-[5px] w-full p-1 "
                    role="textbox"
                    contentEditable={true}
                    onClick={(e) => {
                      console.log("CLICK");
                      e.currentTarget.focus();
                      //console.log("Click", e.currentTarget);
                      eventDispatcher({
                        type: "update",
                        payload: [{ ...event, job: "" }],
                        callback: pushDaysDispatcher,
                      });
                    }}
                    onKeyDown={(e) => {
                      console.log("KEYDOWN");
                      //console.log(e.code);
                      if (e.code === "Enter") {
                        const job = e.currentTarget.textContent || "";
                        console.log("Dispatching", job);
                        fetchEvent("PUT", { ...event, job });
                        eventDispatcher({
                          type: "update",
                          payload: [{ ...event, job }],
                          callback: pushDaysDispatcher,
                        });
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.blur();
                      }
                    }}
                  >
                    {event.job}
                  </span>
                </StyledEvent.TWjobContent>
              }
            </div>
          ) : (
            <>
              <div className="text-transparent">{event.client}</div>
            </>
          )}
        </StyledEvent.TWtextContent>
        {!isSelected && (
          <StyledEvent.TWextend_Left
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}\'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              e.stopPropagation();
              console.log("On drag start from Left", parentEvent);
              const copyOfParent: event = { ...parentEvent };
              copyOfParent.mutable!.bubble = -1;
              temporaryEventDispatcher(parentEvent);
            }}
          >
            {"+"}
          </StyledEvent.TWextend_Left>
        )}
        {!isSelected && (
          <StyledEvent.TWextend
            $cells={spreadCells}
            style={state}
            title={`Drag here to extend ${event.client}\'s job`}
            draggable={"true"}
            onDragStart={(e) => {
              e.stopPropagation();
              console.log("On drag start from Right", parentEvent);
              const copyOfParent: event = { ...parentEvent };
              copyOfParent.mutable!.bubble = 1;
              temporaryEventDispatcher(parentEvent);
            }}
          >
            {"+"}
          </StyledEvent.TWextend>
        )}

        <StyledEvent.TWplaceholder key={"p" + event.id} style={state}>
          {"placeholder"}
        </StyledEvent.TWplaceholder>
      </StyledEvent.TWflexContainer>
    </>
  );
};

export const EventHolder = ({ event }: { event: event }) => {
  const [parent, family] = useGetEventFamily(event);
  const eventRef = useRef<HTMLDivElement>();
  const [state, setState] = useState<{ height: string }>({ height: "0px" });
  //
  useLayoutEffect(() => {
    event.mutable = {
      height: `${eventRef.current!.clientHeight}px`,
      eventRef: eventRef.current!,
      index: parent.mutable?.index!, //!Corrected bug: was using event.end wich is zero
    };
    const h0 = parent.mutable?.height || "0px";
    const h1 = parseInt(h0.split("px")[0]);
    const newState = { height: `${h1}px` };
    setState(newState);
  }, []);

  const h0 = parent.mutable?.height || state.height;
  const h1 = parseInt(h0.split("px")[0]);
  const newState = { height: `${h1}px` };

  //
  return (
    <StyledEvent.TWflexContainer ref={eventRef}>
      <StyledEvent.TWplaceholder style={newState}>
        {event.id + " : " + event.mutable?.index}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
