import * as StyledEvent from "./tw";
import { useToken } from "../../hooks/useToken";
import { EventClass } from "../../classes/event";

export type ClientSelector = {
  style: object;
  event: jh.event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {

  const user = useToken();
  if (user.isValid() && !user.isAuth()) {
    const toRender =
      user.user() === props.event.client ? props.event.client : "";
    props.style =
      user.user() === props.event.client
        ? props.style
        : {
            background: "lightgray",
            color: "transparent",
            height: "1rem",
          }; //1rem = h-4 (tw)

    return (
      <StyledEvent.TWStyledNonSelect
        style={props.style}
        id={EventClass.eventID(props.event.id, "master", "clientSelector")}
      >
        {toRender}
      </StyledEvent.TWStyledNonSelect>
    );
  }

  return (
    <StyledEvent.TWStyledSelect
      style={props.style}
      id={EventClass.eventID(props.event.id, "master", "clientSelector")}
    >
        {
            props.event.client
        }
    </StyledEvent.TWStyledSelect>
  );
}

