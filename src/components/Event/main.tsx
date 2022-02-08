import * as StyledEvent from "./tw";
import { giveMeColor } from "@/utils/giveMeColor";
import { event } from "@interfaces/index";
import { DateService } from "@/utils/Date";

export const Event = (event: event) => {
  const dtSstart = new Date(event.start);
  const dtEnd = new Date(event.end);
  const cells = Math.min(
    1 + DateService.DaysFromStartToEnd(dtSstart, dtEnd),
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
        }}
        onClick={hOnClick}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
      >
        {`${event.client}: ${event.job}`}
      </StyledEvent.TWtextContent>
      <StyledEvent.TWextend
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
      <StyledEvent.TWplaceholder key={"p" + event.id}>
        {"placeholder"}
      </StyledEvent.TWplaceholder>
    </StyledEvent.TWflexContainer>
  );
};
