import * as StyledEvent from "./tw";
import { giveMeColor } from "@/utils/giveMeColor";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useSetEventSelected } from "../Controller/main";
import { Draggable } from "react-beautiful-dnd";

export const Event = ({ event }: { event: event }) => {
  const setEventController = useSetEventSelected();
  const cells = Math.min(
    1 + DateService.DaysFromStartToEnd(event.start, event.end),
    8 //TODO
  );

  const hOnClick = () => {
    console.log("setStartDate", event.start);
    console.log("setEndDate", event.end);
  };
  return (
    <StyledEvent.TWflexContainer>
      <StyledEvent.TWtextContent
        style={giveMeColor(event.client)}
        key={event.id}
        $cells={cells}
        onMouseDownCapture={() => {
          console.log("Event:", event.job);
          setEventController(event);
        }}
        onClick={hOnClick}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
      >
        {`${event.client}: ${event.job}`}
      </StyledEvent.TWtextContent>
      <Draggable draggableId={String(event.id)} index={event.id}>
        {(provided, snapshot) => (
          <StyledEvent.TWextend
            style={{ cursor: "cursor-e-resize" }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            $cells={cells}
            onMouseDownCapture={() => {
              console.log("extend event:", event.id);
            }}
            onMouseEnter={() => {
              console.log("enter extend event");
            }}
            onMouseOut={() => {
              console.log("leaving extend event");
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
