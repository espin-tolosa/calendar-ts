import * as StyledEvent from "./tw";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { EventClass } from "@/Calendar/classes/event";
import { FetchEvent } from "@/Calendar/classes/fetchEvent";
import { useAuthLevel } from "@/Spa/context/authLevel";

export type ClientSelector = {
  style: {background: string, borderTop?: string, borderBottom?: string}
  event: jh.event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {
    const auth = useAuthLevel();
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

  const styleFilterBorder = !props.event.done ? props.style : {background: props.style.background, borderTop: "2px solid transparent", borderBottom: "2px solid transparent"  }

  /**
   * Client
   */
  if(auth === "client")
  {
    return (
        <StyledEvent.TWStyledNonSelect style={styleFilterBorder}>
            {props.event.client}
        </StyledEvent.TWStyledNonSelect>
    )
  }

  /**
   * Partner //TODO: add checkbox
   */
  if(auth === "partner")
  {
    return (
        <StyledEvent.TWStyledCheckboxSelect style={styleFilterBorder}
        title={"Mark this event as done"}
        onClick={(e)=>{eventDispatcher({type: "update", payload: [{...props.event, done: !props.event.done}]});}}
        >
            <div>{props.event.client}</div>
        </StyledEvent.TWStyledCheckboxSelect>
    )
  }


    return (
        <StyledEvent.TWStyledSelect
        value={props.event.client}
        style={styleFilterBorder}
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
