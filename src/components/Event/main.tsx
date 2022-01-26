import * as StyledEvent from "./tw";
import { useContext } from "react";
import { SetDatesCtx } from "@context/formdata";
import { giveMeColor } from "@/utils/giveMeColor";
import { event } from "@interfaces/index";

export const Event = (event: event) => {
  const { setStart, setEnd } = useContext(SetDatesCtx);

  const hOnClick = () => {
    setStart("2021-08-25" + event.job);
    setEnd("2021-09-18" + event.job);
  };
  return (
    <StyledEvent.TWflexContainer>
      <StyledEvent.TWtextContent
        style={giveMeColor(event.client)}
        key={event.id}
        $cells={event.id}
        onMouseDownCapture={() => {
          console.log("Event:", event.job);
        }}
        onClick={hOnClick}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
      >
        {`${event.client}: ${event.job}`}
      </StyledEvent.TWtextContent>
      <StyledEvent.TWextend
        $cells={event.id}
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
