import * as StyledEvent from "./tw";
import { event } from "../../interfaces";
import { fetchEvent } from "../../utils/fetchEvent";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { eventID } from "./main";

export type ClientSelector = {
  style: object;
  event: event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {
  const clientStyles = useClientsStyles();
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const controllerStateDispatch = useControllerDispatch();
  const updateClient = (clientIterator: string) => {
    fetchEvent("PUT", { ...props.event, client: clientIterator });

    eventDispatcher({
      type: "update",
      payload: [{ ...props.event, client: clientIterator }],
      callback: pushDaysDispatcher,
    });

    controllerStateDispatch({
      type: "setId",
      payload: { id: Math.abs(props.event.id) },
    });
  };

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
  list: Maybe<ResponseFromAPI>;
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
