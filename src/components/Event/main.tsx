import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { Draggable } from "react-beautiful-dnd";
import { useControllerState } from "@/hooks/useController";
import { useEventDispatch } from "@/hooks/useEventsState";
import { useEffect, useRef, useState } from "react";
import {
  useEventsStatus,
  useEventsStatusDispatcher,
} from "@/hooks/useEventsStatus";
import { fetchEvent } from "@/utils/fetchEvent";
import { useTransitionStyle } from "./logic";

export const Event = ({ event }: { event: event }) => {
  const controllerState = useControllerState();
  //const events = useEventState();
  const isChildren = event.job.includes("#isChildren");
  //edit mode
  const [isSelected, setIsSelected] = useState(false);
  const isFocus = useRef<HTMLInputElement>(null);
  const [jobInput, setJobInput] = useState(event.job);
  const eventDispatcher = useEventDispatch();

  //TODO: custom hook to mark as selected an event when is hover any of its items or it is selected in the controller
  const [hover, setHover] = useState(false);
  const onHover = useEventsStatus();
  const dispatchHoveringId = useEventsStatusDispatcher();
  const eventInlineStyle = useTransitionStyle(isChildren, hover, event);
  useEffect(() => {
    const fromController = controllerState.id;
    const fromEventHover = onHover.id;
    const id = Math.abs(event.id);
    const idSelected = fromController === id || fromEventHover === event.id;
    setHover(idSelected);
  }, [controllerState.id, onHover.id]);

  const hOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input target", e.target.value);
    const enter = e.target.value === "Enter";
    if (enter) {
      updateEvent({ ...event, job: jobInput });
      isFocus.current!.blur();
    } else {
      setJobInput(e.target.value);
    }
  };

  const updateEvent = (newEvent: event) => {
    // TODO: check if is valid event
    // Controller 106
    const result = fetchEvent("PUT", newEvent);

    result.then((res) => {
      if (res.status === 203) {
        eventDispatcher({
          type: "replacebyid",
          payload: [newEvent],
        });
      }
    });
  };

  const hOnBlur = () => {
    //console.log(e);
    console.log("On blur");
    updateEvent({ ...event, job: jobInput });
    setIsSelected(false);
  };

  const hOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsSelected(true);

    // const eventRoot = events.find((e) => e.id === event.id);

    // dispatchControllerDates({
    //   type: "setDates",
    //   payload: { start: eventRoot?.start!, end: eventRoot?.end! },
    // });

    // dispatchController({
    //   type: "setController",
    //   payload: {
    //     id: eventRoot?.id!,
    //     client: eventRoot?.client!,
    //     job: eventRoot?.job!,
    //   },
    // });

    // setEventController(event);
  };

  const eventUpdater = {
    onBlur: hOnBlur,
    onChange: hOnChange,
    onKeyDown: (e: any) => {
      const enter = e.key === "Enter";
      if (enter) {
        updateEvent({ ...event, job: jobInput });
        isFocus.current!.blur();
      }
    },
  };

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFrom(event.start, event.end),
    8
  );

  return (
    <Draggable
      draggableId={`${String(Math.abs(event.id))}:${event.start}`}
      index={Math.abs(event.id)}
    >
      {(provided, snapshot) => (
        <StyledEvent.TWflexContainer
          onMouseEnter={() =>
            !snapshot.isDragging && dispatchHoveringId(event.id)
          }
          onMouseLeave={() => {
            !snapshot.isDragging && dispatchHoveringId(0);
          }}
        >
          <StyledEvent.TWtextContent
            $isChildren={isChildren}
            $isHover={hover}
            style={eventInlineStyle}
            key={event.id}
            $cells={spreadCells}
            onClick={hOnClick}
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
                    className="bg-transparent text-slate-900 outline-none"
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
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            $cells={spreadCells}
            onClick={hOnClick}
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
      )}
    </Draggable>
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
