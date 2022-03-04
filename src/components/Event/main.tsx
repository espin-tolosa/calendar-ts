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
import { useEventState } from "@/hooks/useEventsState";
import { useEffect, useState } from "react";
import {
  useEventsStatus,
  useEventsStatusDispatcher,
} from "@/hooks/useEventsStatus";

export const Event = ({ event }: { event: event }) => {
  const setEventController = useSetEventSelected();
  const controllerState = useControllerState();
  const dispatchControllerDates = useControllerDispatchDates();
  const dispatchController = useControllerDispatch();
  const events = useEventState();

  const [justThrown, setJustThrown] = useState(true);
  useEffect(() => {
    const relaxTime = 200; /*ms*/
    const timeoutHandler = setTimeout(() => setJustThrown(false), relaxTime);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, []);

  //TODO: custom hook to mark as selected an event when is hover any of its items or it is selected in the controller
  const [hover, setHover] = useState(false);
  const onHover = useEventsStatus();
  const dispatchHoveringId = useEventsStatusDispatcher();
  useEffect(() => {
    const fromController = controllerState.id;
    const fromEventHover = onHover.id;
    const id = event.id;
    const idSelected = fromController === id || fromEventHover === event.id;
    setHover(idSelected);
  }, [controllerState.id, onHover.id]);

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

  //TODO: avoid magic numbers
  const spreadCells = Math.min(
    1 + DateService.DaysFromStartToEnd(event.start, event.end),
    8
  );
  return (
    <Draggable
      draggableId={String(Math.abs(event.id)) + "-" + event.start}
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
            $justThrown={justThrown}
            style={
              justThrown
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
                  }
            }
            key={event.id}
            $cells={spreadCells}
            onClick={hOnClick}
            title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
          >
            {`${event.client}: ${event.job}`}
          </StyledEvent.TWtextContent>

          <StyledEvent.TWextend
            style={{ cursor: "cursor-e-resize" }}
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
