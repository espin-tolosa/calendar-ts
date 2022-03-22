import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useHoverEvent, useStorage, useTransitionStyle } from "./logic";
import { Draggable } from "react-beautiful-dnd";
import { DnD } from "@/DnDLogic";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import { EventClass } from "@/classes/event";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { CustomValues } from "@/customTypes";
import { fetchEvent } from "@/utils/fetchEvent";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useCtxKeyBuffer } from "@/globalStorage/keyBuffer";

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

export const Event = ({ event }: { event: event }) => {
  //const events = useEventState();
  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [parent, family] = useGetEventFamily(event);
  //drag and drop
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  //keybuffer to detect when control keyword is pressed
  const keyBuffer = useCtxKeyBuffer();

  //console.log("parent", parent);
  //console.log("family", family);

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
  //console.log("Parent Event", parentEvent);

  return (
    <StyledEvent.TWflexContainer
      className="touch-none"
      {...mouseHover}
      draggable={"true"}
      onTouchStartCapture={(e) => {
        console.log("Touch Start Capture", event);
        e.preventDefault();
        //document.body.style.touchAction = "none";
        //const board = document.getElementById("Board");
        //if (board) {
        //board.style.touchAction = "none";
        //}
        //draggableBackup.current = parentEvent;
        //dispatchHoveringId(parentEvent.id);
        //isDragging.setState(true);
      }}
      onTouchStart={(e) => {
        console.log("Touch start");
        temporaryEventDispatcher(parentEvent);
        e.preventDefault();
      }}
      //
      // TODO: this feature is inactive by now, it split an event by clicking on it
      //				It requires aditional work, as a key like Ctrl to be pressed in order to allow this feature to work
      //				Also when Ctrl key is pressed a cursor with a scissors will appear

      onMouseDownCapture={(e) => {
        if (keyBuffer?.current !== "Control") {
          return;
        }
        e.stopPropagation();
        console.log("Click event");
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
        const nextEvent = { ...parentEvent, start };
        eventDispatcher({
          type: "replacebyid",
          payload: [prevEvent],
        });
        fetchEvent("PUT", prevEvent);

        const result = fetchEvent("POST", {
          ...nextEvent,
          id: Math.floor(Math.random() * 1000),
        });
        result
          .then((res: any) => res.json())
          .then((json) => {
            eventDispatcher({
              type: "appendarray",
              payload: [
                {
                  id: json[0].id,
                  client: json[0].client,
                  job: json[0].job,
                  start: json[0].start,
                  end: json[0].end,
                },
              ],
            });
          });
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
        const newEvent = { ...temporaryEvent, end: fullDate };
        eventDispatcher({
          type: "replacebyid",
          payload: [newEvent],
        });
        fetchEvent("PUT", newEvent);
        temporaryEventDispatcher(newEvent);
        return true;
      }}
      onDragStartCapture={(e) => {
        //e.preventDefault();
        temporaryEventDispatcher(parentEvent);

        //          var img = new Image();
        //          img.src =
        //            "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        //          e.dataTransfer.setDragImage(img, 0, 0);
        //draggableBackup.current = parentEvent;
        //dispatchHoveringId(parentEvent.id);
        //isDragging.setState(true);
      }}
      onTouchEndCapture={(e) => {
        console.log("Drag End", event);
        temporaryEventDispatcher(CustomValues.nullEvent);
        //document.body.style.touchAction = "auto";
        //const board = document.getElementById("Board");
        //if (board) {
        //  board.style.touchAction = "auto";
        //}
      }}
      onDragEndCapture={(e) => {
        console.log("Drag End", event);
        temporaryEventDispatcher(CustomValues.nullEvent);
      }}
      onDragOverCapture={(e) => {
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
          type: "replacebyid",
          payload: [newEvent],
        });
        fetchEvent("PUT", newEvent);
        temporaryEventDispatcher(newEvent);
      }}
    >
      <StyledEvent.TWtextContent
        $isChildren={isChildren}
        $isHover={hover}
        style={eventInlineStyle}
        key={event.id}
        $cells={spreadCells}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
        $client={event.client.toLowerCase()}
        {...eventUpdater}
      >
        {!isChildren ? (
          <>
            <div className="text-md">{event.client}</div>
            <div className="text-slate-800">{" | "}</div>
            {!isSelected ? (
              <div className="">{event.job}</div>
            ) : (
              <input
                ref={isFocus}
                value={jobInput}
                className="bg-transparent text-slate-900 outline-none appearance-none"
              ></input>
            )}
          </>
        ) : (
          <>
            <div className="text-transparent">{event.client}</div>
          </>
        )}
      </StyledEvent.TWtextContent>

      <StyledEvent.TWextend
        $cells={spreadCells}
        onMouseDownCapture={(e) => {
          //console.log("extend event:", event.id);
        }}
        onMouseEnter={() => {
          //console.log("enter extend event");
        }}
        onMouseOut={() => {
          //console.log("leaving extend event");
        }}
        title={`Drag here to extend ${event.client}\'s job`}
      >
        {"+"}
      </StyledEvent.TWextend>

      <StyledEvent.TWplaceholder key={"p" + event.id}>
        {"placeholder"}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};

export const EventHolder = ({ event }: { event: event }) => {
  return (
    <StyledEvent.TWflexContainer>
      <StyledEvent.TWplaceholder key={"p" + event.id}>
        {-event.id}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
