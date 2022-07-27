import * as StyledEvent from "./tw";
import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { eventID } from "./main";
import { useToken } from "@/hooks/useToken";

export type ClientSelector = {
  style: object;
  event: jh.event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {
  const clientStyles = useClientsStyles();
  const eventDispatcher = useEventDispatch();
  const controllerStateDispatch = useControllerDispatch();
  const updateClient = (clientIterator: string) => {
    fetchEvent("PUT", { ...props.event, client: clientIterator });

    eventDispatcher({
      type: "update",
      payload: [{ ...props.event, client: clientIterator }],
    });

    controllerStateDispatch({
      type: "setId",
      payload: { id: props.event.id },
    });

    setTimeout(() => {
      //console.log("Reset id", props.event);

      controllerStateDispatch({
        type: "setId",
        payload: { id: 0 },
      });
    }, 2000);
  };

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
        id={eventID(props.event.id, "master", "clientSelector")}
      >
        {toRender}
      </StyledEvent.TWStyledNonSelect>
    );
  }

  return (
    <StyledEvent.TWStyledSelect
      value={props.event.client}
      style={props.style}
      id={eventID(props.event.id, "master", "clientSelector")}
      onChange={(e) => {
        if (e.currentTarget.value === "Unavailable") {
          window.alert("delete");
        }
        updateClient(e.currentTarget.value);
        e.currentTarget.blur();
      }}
    >
      <DefaultOption client={props.event.client} />

      <ClientOptionList list={clientStyles} />
    </StyledEvent.TWStyledSelect>
  );
}

const DefaultOption = (props: { client: string }) => (
  <option value="default" hidden disabled={props.client !== "Select Client"}>
    Select Client
  </option>
);

const ClientOptionList = ({
  list,
}: {
  list: jh.response.maybe<jh.response.styles>;
}): JSX.Element => {
  if (!list.success) {
    return <option>{"loading client list..."}</option>;
  }
  return (
    <>
      {list.response.clients.map((clientIterator, index) => {
        return (
          <option key={index} value={clientIterator}>
            {clientIterator}
          </option>
        );
      })}
    </>
  );
};
