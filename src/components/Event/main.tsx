import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";
import { useHoverEvent, useStorage, useTransitionStyle } from "./logic";
import { Draggable } from "react-beautiful-dnd";

export const Event = ({ event }: { event: event }) => {
  //const events = useEventState();
  const isChildren = event.job.includes("#isChildren");
  //edit mode

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

  return (
    <Draggable
      draggableId={`${String(Math.abs(event.id))}:${event.start}`}
      index={Math.abs(event.id)}
    >
      {(provided, snapshot) => (
        <StyledEvent.TWflexContainer {...mouseHover}>
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
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
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
