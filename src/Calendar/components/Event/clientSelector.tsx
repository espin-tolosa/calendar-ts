import * as StyledEvent from "./tw";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { EventClass } from "@/Calendar/classes/event";
import { FetchEvent } from "@/Calendar/classes/fetchEvent";

export type ClientSelector = {
  style: object;
  event: jh.event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {
  const clientStyles = useClientsStyles();
  const eventDispatcher = useEventDispatch();
  const controllerStateDispatch = useControllerDispatch();
  const updateClient = (client: string) => {
    const request = new FetchEvent();
    const updateEvent = {...props.event, client};
    request.update(updateEvent)
    eventDispatcher({type: "update", payload: [updateEvent]});

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


    return (
        <StyledEvent.TWStyledSelect
        value={props.event.client}
        style={props.style}
        id={EventClass.eventID(props.event.id, "master", "clientSelector")}
        onChange={(e) => {
            if (e.currentTarget.value === "Unavailable")
            {
                window.alert("delete");
            }
            
            updateClient(e.currentTarget.value);
            e.currentTarget.blur();
            }
        }
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
