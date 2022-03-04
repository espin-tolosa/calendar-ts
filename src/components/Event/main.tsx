import * as StyledEvent from "./tw";
import { ClientColorStyles, giveMeColor } from "@/utils/giveMeColor";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useSetEventSelected } from "../Controller/main";
import { Draggable } from "react-beautiful-dnd";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { useEventState } from "@/hooks/useEventsApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

export const Event = ({ event }: { event: event }) => {
  const setEventController = useSetEventSelected();
  const controllerState = useControllerState();
  const dispatchControllerDates = useControllerDispatchDates();
  const dispatchController = useControllerDispatch();
  const events = useEventState();
  const [hover, setHover] = useState(false);
  const [justThrown, setJustThrown] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setJustThrown(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (Math.abs(controllerState.id) === Math.abs(event.id)) {
      setHover(true);
    } else {
      setHover(false);
    }
  }, [controllerState.id]);

  const cells = Math.min(
    1 + DateService.DaysFromStartToEnd(event.start, event.end),
    8 //TODO
  );

  const hOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const eventRoot = events.find((e) => e.id === event.id);

    dispatchControllerDates({
      type: "setDates",
      payload: { start: eventRoot?.start!, end: eventRoot?.end! },
    });
    dispatchController({
      type: "setController",
      payload: { id: event.id, client: event.client, job: event.job },
    });

    setEventController(event);
  };
  const clientID = parseInt(event.client.split("_")[1]);
  let mapClientToColor = (360 * clientID) / 9;
  if (clientID === 6) {
    mapClientToColor -= 15;
  }
  if (clientID === 9) {
    mapClientToColor += 15;
  }
  const [r, g, b] = ClientColorStyles(mapClientToColor, 1, 0.6);
  const [r_h, g_h, b_h] = ClientColorStyles(mapClientToColor, 0.6, 0.5);
  const thrownStyle = justThrown
    ? { background: "gray" }
    : !hover
    ? {
        backgroundColor: `rgb(${r},${g},${b})`,
        color: "black",
      }
    : {
        backgroundColor: `rgb(${r_h},${g_h},${b_h})`,
        border: "1px solid black",
        color: "white",
      };

  return (
    <StyledEvent.TWflexContainer
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        if (controllerState.id !== event.id) {
          setHover(false);
        }
      }}
    >
      <Draggable draggableId={"event-" + String(event.id)} index={event.id}>
        {(provided, snapshot) => (
          <StyledEvent.TWtextContent
            className={"text-event"}
            $justThrown={justThrown}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={thrownStyle}
            key={event.id}
            $cells={cells}
            onClick={hOnClick}
            title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
          >
            {`${event.client}: ${event.job}`}
          </StyledEvent.TWtextContent>
        )}
      </Draggable>
      <Draggable
        draggableId={"extend-" + String(event.id)}
        index={event.id + 1}
      >
        {(provided, snapshot) => (
          <StyledEvent.TWextend
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={"extend-event"}
            ref={provided.innerRef}
            $cells={cells}
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
        )}
      </Draggable>
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
